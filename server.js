// server.js
const express = require('express');
const sql = require('mssql');
const cors = require('cors'); // Required for cross-origin requests if frontend is on a different port/domain
const path = require('path');

// Import your database configuration
const mssqlConfig = require('./dbConfig').default; // Use .default for ES module export

const app = express();
const PORT = 3001; // Choose a port for your backend server

// --- Middleware ---
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // Enable CORS for all routes (adjust as needed for production)

// Serve static files from the 'public' directory
// This means your index.html, mockData.js, etc., should be in a 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// --- Database Connection Pool ---
let pool;

async function connectToDatabase() {
    try {
        console.log('Attempting to connect to MSSQL database...');
        pool = new sql.ConnectionPool(mssqlConfig);
        await pool.connect();
        console.log('Successfully connected to MSSQL database!');
        return true;
    } catch (err) {
        console.error('Database connection failed:', err.message);
        console.error('Please ensure your MSSQL server is running and dbConfig.js settings are correct.');
        pool = null; // Ensure pool is null on failure
        return false;
    }
}

// --- API Endpoints ---

// Middleware to check database connection status
app.use(async (req, res, next) => {
    if (!pool || !pool.connected) {
        const connected = await connectToDatabase();
        if (!connected) {
            // If connection fails, return an error to the frontend.
            // The frontend is designed to fall back to mock data in this scenario.
            return res.status(500).json({ message: 'Backend database connection is not available.' });
        }
    }
    next();
});


// API to get all users (for login validation)
app.get('/api/users', async (req, res) => {
    try {
        if (!pool || !pool.connected) {
            return res.status(500).json({ message: 'Database connection not established.' });
        }
        // IMPORTANT: Adjust table and column names (T_USER, USERID, BADGENUMBER, NAME, PASSWORD, DEFAULTDEPTID, PHOTO)
        // to match your actual MSSQL schema.
        const request = pool.request();
        const result = await request.query('SELECT USERID, BADGENUMBER, NAME, PASSWORD, DEFAULTDEPTID, PHOTO FROM T_USER');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: 'Error fetching users from database.', error: err.message });
    }
});

// API to get check-in/out logs for a specific user and date range
app.get('/api/checkinout/:userId', async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.query; // Expecting YYYY-MM-DD format

    if (!userId || !startDate || !endDate) {
        return res.status(400).json({ message: 'User ID, startDate, and endDate are required.' });
    }

    try {
        if (!pool || !pool.connected) {
            return res.status(500).json({ message: 'Database connection not established.' });
        }

        const request = pool.request();
        request.input('userId', sql.Int, userId);
        request.input('startDate', sql.Date, new Date(startDate));
        request.input('endDate', sql.Date, new Date(endDate));

        // IMPORTANT: Adjust table and column names (CHECKINOUT, USERID, CHECKTIME, CHECKTYPE, VERIFYCODE, Memoinfo)
        // to match your actual MSSQL schema.
        const query = `
            SELECT
                USERID,
                CHECKTIME,
                CHECKTYPE,
                VERIFYCODE,
                Memoinfo
            FROM
                CHECKINOUT
            WHERE
                USERID = @userId
                AND CHECKTIME >= @startDate
                AND CHECKTIME <= @endDate
            ORDER BY
                CHECKTIME ASC;
        `;
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error(`Error fetching checkinout logs for user ${userId}:`, err.message);
        res.status(500).json({ message: 'Error fetching check-in/out logs from database.', error: err.message });
    }
});

// Fallback for any other routes (e.g., direct access to index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start Server ---
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Frontend will be served from /public directory.');
    await connectToDatabase(); // Attempt to connect to DB on server start
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing MSSQL connection pool...');
    if (pool && pool.connected) {
        await pool.close();
    }
    console.log('Server shutting down.');
    process.exit(0);
});
