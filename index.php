<?php

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

// Set up basic routing
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Enable CORS for API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS requests
if ($requestMethod === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Route handling
if ($requestMethod === 'POST' && $requestUri === '/api/render') {
    require_once __DIR__ . '/src/RenderController.php';
    
    $controller = new \App\RenderController();
    $controller->render();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}