
<?php
// Main entry point for the application
// This file serves as the router for the DTR Checker application

// Set error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type based on request
$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'];

// Remove query string and leading slash
$path = ltrim($path, '/');

// Handle API routes
if (strpos($path, 'api/') === 0) {
    // Include the API handler
    require_once __DIR__ . '/api/api.php';
    exit;
}

// Handle static file requests
if (preg_match('/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/', $path)) {
    $filePath = __DIR__ . '/public/' . $path;
    if (file_exists($filePath)) {
        // Set appropriate content type
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $contentTypes = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'ico' => 'image/x-icon',
            'svg' => 'image/svg+xml'
        ];
        
        if (isset($contentTypes[$extension])) {
            header('Content-Type: ' . $contentTypes[$extension]);
        }
        
        readfile($filePath);
        exit;
    }
}

// For all other routes, serve the main application
require_once __DIR__ . '/public/index.html';
?>
