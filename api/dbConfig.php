<?php
// dbConfig.php
// This file contains the configuration for connecting to an MSSQL Server using PHP's SQLSRV extension.

// Load environment variables if .env file exists
if (file_exists(__DIR__ . '/../.env')) {
    $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

// Helper function to get environment variables
function env($key, $default = null) {
    $value = getenv($key);
    if ($value === false) {
        return $default;
    }

    // Convert string booleans to actual booleans
    if (strtolower($value) === 'true') return true;
    if (strtolower($value) === 'false') return false;

    return $value;
}

$mssqlConfig = [
    'server' => env('DB_HOST', '192.168.11.16'),
    'database' => env('DB_DATABASE', 'ZKBio5'),
    'user' => env('DB_USERNAME', 'sa'),
    'password' => env('DB_PASSWORD', '1t@information'),
    'options' => [
        'encrypt' => env('DB_ENCRYPT', false),
        'TrustServerCertificate' => env('DB_TRUST_SERVER_CERTIFICATE', true)
    ],
];