// dbConfig.js
// This file would contain the configuration for connecting to an MSSQL Server.
// In a real application, these values would likely come from environment variables
// and this file would be part of a backend service, not directly exposed to the frontend.

const mssqlConfig = {
    server: '192.168.11.16', // e.g., 'localhost', '192.168.1.100', or a cloud SQL instance address
    database: 'ZKBio5',     // The name of your database
    user: 'sa',              // Your database username
    password: '1t@information',      // Your database password
    options: {
        encrypt: false,                  // Set to true for Azure SQL Database, false for local SQL Server
        trustServerCertificate: true     // Change to false for production environments with valid SSL certs
    },
    pool: {
        max: 10,                         // Maximum number of connections in the pool
        min: 0,                          // Minimum number of connections in the pool
        idleTimeoutMillis: 30000         // How long a connection can be idle before being released
    }
};

export default mssqlConfig;
