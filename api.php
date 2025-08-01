<?php
// api.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin (for development)
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include your database configuration
require_once 'dbConfig.php';

// Function to connect to MSSQL
function connectToMssql($config) {
    try {
        $serverName = $config['server'];
        $connectionOptions = array(
            "Database" => $config['database'],
            "Uid" => $config['user'],
            "PWD" => $config['password'],
            "Encrypt" => $config['options']['encrypt'],
            "TrustServerCertificate" => $config['options']['trustServerCertificate']
        );

        $conn = sqlsrv_connect($serverName, $connectionOptions);

        if ($conn === false) {
            throw new Exception(sqlsrv_errors()[0]['message']);
        }
        return $conn;
    } catch (Exception $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

// Attempt to connect to the database
$conn = connectToMssql($mssqlConfig);

// If connection failed, return an error. The frontend will fall back to mock data.
if ($conn === null) {
    echo json_encode(['message' => 'Backend database connection is not available.']);
    http_response_code(500);
    exit();
}

// Get the requested path
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Route handling
if ($requestMethod === 'GET') {
    if (preg_match('/^\/dtrchecker\/api\.php$/', $requestUri)) { // Match the full path to api.php
        $apiPath = $_GET['path'] ?? '/'; // Get the 'path' parameter from the query string
        if ($apiPath === '/api/users') {
            // API to get all users (for login validation)
            try {
                // IMPORTANT: Adjust table and column names (T_USER, USERID, BADGENUMBER, NAME, PASSWORD, DEFAULTDEPTID, PHOTO)
                // to match your actual MSSQL schema.
                $sql = "SELECT USERID, BADGENUMBER, NAME, PASSWORD, DEFAULTDEPTID, PHOTO FROM T_USER";
                $stmt = sqlsrv_query($conn, $sql);

                if ($stmt === false) {
                    throw new Exception(sqlsrv_errors()[0]['message']);
                }

                $users = [];
                while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                    $users[] = $row;
                }
                echo json_encode($users);
            } catch (Exception $e) {
                error_log("Error fetching users: " . $e->getMessage());
                echo json_encode(['message' => 'Error fetching users from database.', 'error' => $e->getMessage()]);
                http_response_code(500);
            }
        } elseif (preg_match('/^\/api\/checkinout\/(\d+)$/', $apiPath, $matches)) { // Match the path parameter
            // API to get check-in/out logs for a specific user and date range
            $userId = $matches[1];
            $startDate = $_GET['startDate'] ?? null;
            $endDate = $_GET['endDate'] ?? null;

            if (!$startDate || !$endDate) {
                echo json_encode(['message' => 'startDate and endDate are required.']);
                http_response_code(400);
                exit();
            }

            try {
                // IMPORTANT: Adjust table and column names (CHECKINOUT, USERID, CHECKTIME, CHECKTYPE, VERIFYCODE, Memoinfo)
                // to match your actual MSSQL schema.
                $sql = "SELECT USERID, CHECKTIME, CHECKTYPE, VERIFYCODE, Memoinfo FROM CHECKINOUT WHERE USERID = ? AND CHECKTIME >= ? AND CHECKTIME <= ? ORDER BY CHECKTIME ASC";
                $params = array($userId, $startDate, $endDate);
                $stmt = sqlsrv_query($conn, $sql, $params);

                if ($stmt === false) {
                    throw new Exception(sqlsrv_errors()[0]['message']);
                }

                $logs = [];
                while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                    // Format CHECKTIME to ISO 8601 string for consistency with frontend expectations
                    if ($row['CHECKTIME'] instanceof DateTime) {
                        $row['CHECKTIME'] = $row['CHECKTIME']->format(DateTime::ISO8601);
                    }
                    $logs[] = $row;
                }
                echo json_encode($logs);
            } catch (Exception $e) {
                error_log("Error fetching checkinout logs for user {$userId}: " . $e->getMessage());
                echo json_encode(['message' => 'Error fetching check-in/out logs from database.', 'error' => $e->getMessage()]);
                http_response_code(500);
            }
        } else {
            // Fallback for unhandled API routes
            echo json_encode(['message' => 'API endpoint not found.']);
            http_response_code(404);
        }
    } else {
        echo json_encode(['message' => 'Invalid API entry point.']);
        http_response_code(404);
    }
} else {
    // For methods other than GET (e.g., POST, PUT, DELETE - not implemented in this example)
    echo json_encode(['message' => 'Method not allowed.']);
    http_response_code(405);
}

// Close the connection when done
if ($conn !== null) {
    sqlsrv_close($conn);
}
?>
