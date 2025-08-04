<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DateTime; // Import DateTime class for date formatting

class DtrApiController extends Controller
{
    private $conn;

    public function __construct()
    {
        // --- MSSQL Database Configuration ---
        $serverName = "YOUR_MSSQL_SERVER_NAME"; // e.g., "localhost\SQLEXPRESS", "192.168.1.100"
        $connectionOptions = array(
            "Database" => "YOUR_DATABASE_NAME", // e.g., "DTR_DB"
            "Uid" => "YOUR_DB_USERNAME",       // e.g., "sa"
            "PWD" => "YOUR_DB_PASSWORD"        // e.g., "YourStrongPassword"
        );

        // Establish the connection
        $this->conn = sqlsrv_connect($serverName, $connectionOptions);

        if ($this->conn === false) {
            // Log the error for debugging
            error_log("MSSQL Connection Error: " . print_r(sqlsrv_errors(), true));
            // In a real application, you might throw an exception or return an error response
            // For now, we'll let the calling methods handle the null connection
        }
    }

    // Handle fetching all users for login
    public function getUsers()
    {
        if ($this->conn === false) {
            return response()->json(["error" => "Database connection failed."], 500);
        }

        $sql = "SELECT USERID, BADGENUMBER, NAME, DEFAULTDEPTID, PHOTO FROM USERINFO";
        $stmt = sqlsrv_query($this->conn, $sql);

        if ($stmt === false) {
            return response()->json(["error" => "Query failed: " . print_r(sqlsrv_errors(), true)], 500);
        }

        $users = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $users[] = $row;
        }

        sqlsrv_free_stmt($stmt);
        return response()->json($users);
    }

    // Handle fetching check-in/out logs for a specific user within a date range
    public function getCheckinout(Request $request, $userId)
    {
        if ($this->conn === false) {
            return response()->json(["error" => "Database connection failed."], 500);
        }

        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');

        $sql = "SELECT USERID, CHECKTIME, CHECKTYPE, VERIFYCODE, Memoinfo FROM CHECKINOUT WHERE USERID = ?";
        $params = [$userId];

        if ($startDate && $endDate) {
            // Ensure dates are in YYYY-MM-DD format for SQL comparison
            $sql .= " AND CHECKTIME >= ? AND CHECKTIME <= ?";
            $params[] = $startDate . ' 00:00:00'; // Start of day
            $params[] = $endDate . ' 23:59:59';   // End of day
        }

        $sql .= " ORDER BY CHECKTIME ASC"; // Order by time for correct processing in frontend

        $stmt = sqlsrv_query($this->conn, $sql, $params);

        if ($stmt === false) {
            return response()->json(["error" => "Query failed: " . print_r(sqlsrv_errors(), true)], 500);
        }

        $checkinoutLogs = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            // Format CHECKTIME to ISO 8601 string for JavaScript Date parsing
            if ($row['CHECKTIME'] instanceof DateTime) {
                $row['CHECKTIME'] = $row['CHECKTIME']->format(DateTime::ISO8601);
            }
            $checkinoutLogs[] = $row;
        }

        sqlsrv_free_stmt($stmt);
        return response()->json($checkinoutLogs);
    }

    // Close the connection when the controller instance is destroyed
    public function __destruct()
    {
        if ($this->conn) {
            sqlsrv_close($this->conn);
        }
    }
}
