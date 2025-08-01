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
require_once(__DIR__ . '/../dbConfig.php');

// Function to connect to MSSQL Server 2014 using SQLSRV
function connectToMssql($config) {
    try {
        $serverName = $config['server'];
        $connectionOptions = array(
            "Database" => $config['database'],
            "Uid" => $config['user'],
            "PWD" => $config['password'],
            "Encrypt" => $config['options']['encrypt'],
            "TrustServerCertificate" => $config['options']['trustServerCertificate'],
            "CharacterSet" => "UTF-8" // Recommended for proper character encoding
        );

        $conn = sqlsrv_connect($serverName, $connectionOptions);

        if ($conn === false) {
            $errors = sqlsrv_errors();
            throw new Exception($errors[0]['message']);
        }

        return $conn;
    } catch (Exception $e) {
        error_log("❌ Database connection failed: " . $e->getMessage());
        return null;
    }
}

// Attempt to connect to the database
$conn = connectToMssql($mssqlConfig);

// If connection failed, return an error
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
    if (preg_match('/^\/dtrchecker\/api\.php$/', $requestUri)) {
        $apiPath = $_GET['path'] ?? '/';

        if ($apiPath === '/api/users') {
            try {
                $sql = "SELECT USERID, BADGENUMBER, NAME, PASSWORD, DEFAULTDEPTID, PHOTO FROM USERINFO";
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
        } elseif (preg_match('/^\/api\/checkinout\/(\d+)$/', $apiPath, $matches)) {
            $userId = $matches[1];
            $startDate = $_GET['startDate'] ?? null;
            $endDate = $_GET['endDate'] ?? null;

            if (!$startDate || !$endDate) {
                echo json_encode(['message' => 'startDate and endDate are required.']);
                http_response_code(400);
                exit();
            }

            try {
                $sql = "SELECT USERID, CHECKTIME, CHECKTYPE, VERIFYCODE, Memoinfo FROM CHECKINOUT 
                        WHERE USERID = ? AND CHECKTIME >= ? AND CHECKTIME <= ? 
                        ORDER BY CHECKTIME ASC";
                $params = array($userId, $startDate, $endDate);
                $stmt = sqlsrv_query($conn, $sql, $params);

                if ($stmt === false) {
                    throw new Exception(sqlsrv_errors()[0]['message']);
                }

                $logs = [];
                while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
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
            echo json_encode(['message' => 'API endpoint not found.']);
            http_response_code(404);
        }
    } else {
        echo json_encode(['message' => 'Invalid API entry point.']);
        http_response_code(404);
    }
} else {
    echo json_encode(['message' => 'Method not allowed.']);
    http_response_code(405);
}

// Close the connection
if ($conn !== null) {
    sqlsrv_close($conn);
}
?>
