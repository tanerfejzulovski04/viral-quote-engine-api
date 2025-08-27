<?php

// Simple test script to verify the API works without full Laravel bootstrap
require_once __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Simple routing for API endpoints
if ($uri === '/api/' || $uri === '/api') {
    echo json_encode([
        'message' => 'Viral Quote Engine API',
        'version' => '1.0.0',
        'endpoints' => [
            'POST /api/auth/register' => 'Register a new user',
            'POST /api/auth/login' => 'Login user',
            'POST /api/auth/logout' => 'Logout user (requires authentication)',
            'GET /api/auth/me' => 'Get current user (requires authentication)'
        ]
    ]);
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint not found. This is a test script. Use Laravel serve for full functionality.']);
}