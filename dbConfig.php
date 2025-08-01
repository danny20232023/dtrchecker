
<?php
// dbConfig.php
// This file contains the configuration for connecting to an MSSQL Server using PHP's SQLSRV extension.

$mssqlConfig = [
    'server' => 'YOUR_MSSQL_SERVER_ADDRESS', // e.g., 'localhost', '192.168.1.100', or a cloud SQL instance address
    'database' => 'YourDTRDatabaseName',     // The name of your database
    'user' => 'YourDbUsername',              // Your database username
    'password' => 'YourStrongPassword',      // Your database password
    'options' => [
        'encrypt' => false,                  // Set to true for Azure SQL Database, false for local SQL Server
        'TrustServerCertificate' => true     // Change to false for production environments with valid SSL certs
    ],
    // PHP's SQLSRV driver doesn't use a 'pool' parameter in the same way Node.js 'mssql' does.
    // Connection pooling is often managed by the web server (e.g., IIS) or PHP-FPM.
];

// No explicit export needed for PHP, as it's included using require_once
?>
