<?php

/**
 * Simple Token-based Authentication API 
 * Implementing Sanctum-like functionality manually
 */

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Eloquent\Model;

// Database setup
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'sqlite',
    'database' => __DIR__ . '/database/database.sqlite',
    'prefix' => '',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

// User Model
class User extends Model
{
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password'];
    
    public function tokens()
    {
        return $this->hasMany(PersonalAccessToken::class, 'tokenable_id')->where('tokenable_type', User::class);
    }
    
    public function createToken($name = 'api-token')
    {
        $token = bin2hex(random_bytes(32)); // 64 char token
        
        $personalAccessToken = PersonalAccessToken::create([
            'tokenable_type' => User::class,
            'tokenable_id' => $this->id,
            'name' => $name,
            'token' => hash('sha256', $token),
            'abilities' => json_encode(['*']),
        ]);
        
        return (object)[
            'accessToken' => $personalAccessToken,
            'plainTextToken' => $token
        ];
    }
}

// Personal Access Token Model
class PersonalAccessToken extends Model
{
    protected $fillable = [
        'tokenable_type',
        'tokenable_id',
        'name',
        'token',
        'abilities',
        'last_used_at',
        'expires_at',
    ];
    
    protected $casts = [
        'abilities' => 'json',
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];
    
    public function tokenable()
    {
        return $this->morphTo();
    }
    
    public static function findToken($token)
    {
        return static::where('token', hash('sha256', $token))->first();
    }
}

// CORS Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$input = json_decode(file_get_contents('php://input'), true) ?: [];

// Helper functions
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function sendError($message, $status = 400, $errors = null) {
    $response = ['message' => $message];
    if ($errors) {
        $response['errors'] = $errors;
    }
    sendResponse($response, $status);
}

function validateRequired($fields, $data) {
    $errors = [];
    foreach ($fields as $field) {
        if (empty($data[$field])) {
            $errors[$field] = ["The {$field} field is required."];
        }
    }
    return $errors;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function getAuthUser() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        return null;
    }
    
    $token = substr($authHeader, 7);
    $personalAccessToken = PersonalAccessToken::findToken($token);
    
    if (!$personalAccessToken) {
        return null;
    }
    
    return $personalAccessToken->tokenable;
}

// Routes
switch ($uri) {
    case '/':
    case '/api':
    case '/api/':
        sendResponse([
            'message' => 'Viral Quote Engine API',
            'version' => '1.0.0',
            'endpoints' => [
                'POST /api/auth/register' => 'Register a new user',
                'POST /api/auth/login' => 'Login user',
                'POST /api/auth/logout' => 'Logout user (requires authentication)',
                'GET /api/auth/me' => 'Get current user (requires authentication)'
            ]
        ]);
        break;

    case '/api/auth/register':
        if ($method !== 'POST') {
            sendError('Method not allowed', 405);
        }
        
        // Validate input
        $errors = validateRequired(['name', 'email', 'password'], $input);
        
        if (!empty($input['email']) && !validateEmail($input['email'])) {
            $errors['email'] = ['The email must be a valid email address.'];
        }
        
        if (!empty($input['password']) && strlen($input['password']) < 8) {
            $errors['password'] = ['The password must be at least 8 characters.'];
        }
        
        if (isset($input['password_confirmation']) && $input['password'] !== $input['password_confirmation']) {
            $errors['password'] = ['The password confirmation does not match.'];
        }
        
        // Check if email exists
        if (!empty($input['email']) && User::where('email', $input['email'])->exists()) {
            $errors['email'] = ['The email has already been taken.'];
        }
        
        if (!empty($errors)) {
            sendError('The given data was invalid.', 422, $errors);
        }
        
        // Create user
        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => password_hash($input['password'], PASSWORD_DEFAULT),
        ]);
        
        // Create token
        $token = $user->createToken('api-token');
        
        sendResponse([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'token' => $token->plainTextToken
        ], 201);
        break;

    case '/api/auth/login':
        if ($method !== 'POST') {
            sendError('Method not allowed', 405);
        }
        
        // Validate input
        $errors = validateRequired(['email', 'password'], $input);
        
        if (!empty($input['email']) && !validateEmail($input['email'])) {
            $errors['email'] = ['The email must be a valid email address.'];
        }
        
        if (!empty($errors)) {
            sendError('The given data was invalid.', 422, $errors);
        }
        
        // Find user and verify password
        $user = User::where('email', $input['email'])->first();
        
        if (!$user || !password_verify($input['password'], $user->password)) {
            sendError('Invalid credentials', 401);
        }
        
        // Create token
        $token = $user->createToken('api-token');
        
        sendResponse([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'token' => $token->plainTextToken
        ]);
        break;

    case '/api/auth/logout':
        if ($method !== 'POST') {
            sendError('Method not allowed', 405);
        }
        
        $user = getAuthUser();
        if (!$user) {
            sendError('Unauthenticated', 401);
        }
        
        // Delete current token
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = substr($authHeader, 7);
        $personalAccessToken = PersonalAccessToken::findToken($token);
        if ($personalAccessToken) {
            $personalAccessToken->delete();
        }
        
        sendResponse(['message' => 'Logged out successfully']);
        break;

    case '/api/auth/me':
        if ($method !== 'GET') {
            sendError('Method not allowed', 405);
        }
        
        $user = getAuthUser();
        if (!$user) {
            sendError('Unauthenticated', 401);
        }
        
        sendResponse([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
        break;

    default:
        sendError('Endpoint not found', 404);
}