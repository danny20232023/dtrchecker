
<?php
// config/database.php
// Database configuration for different environments

return [
    'default' => env('DB_CONNECTION', 'mssql'),
    
    'connections' => [
        'mssql' => [
            'driver' => 'sqlsrv',
            'host' => env('DB_HOST', '192.168.11.16'),
            'port' => env('DB_PORT', '1433'),
            'database' => env('DB_DATABASE', 'ZKBio5'),
            'username' => env('DB_USERNAME', 'sa'),
            'password' => env('DB_PASSWORD', '1t@information'),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'options' => [
                'encrypt' => env('DB_ENCRYPT', false),
                'trustServerCertificate' => env('DB_TRUST_SERVER_CERTIFICATE', true),
            ],
        ],
    ],
];

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
?>
