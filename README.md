
# DTR Checker Application

A web-based Daily Time Record (DTR) checker application with PHP backend and React frontend.

## Features

- Employee time tracking and monitoring
- MSSQL database integration
- Real-time data visualization
- Print-friendly reports
- User authentication system

## Project Structure

```
├── api/                    # Backend API endpoints
│   ├── api.php            # Main API router
│   ├── dbConfig.php       # Database configuration
│   └── .htaccess          # API routing rules
├── public/                # Frontend assets
│   ├── js/                # JavaScript modules
│   ├── css/               # Stylesheets
│   └── index.html         # Main HTML file
├── config/                # Configuration files
│   └── database.php       # Database configuration
├── .htaccess              # Main routing rules
├── index.php              # Application entry point
├── composer.json          # PHP dependencies
└── .env.example           # Environment variables template
```

## Installation

### Requirements

- PHP 7.4 or higher
- SQLSRV extension for PHP
- MSSQL Server 2014 or higher
- Web server (Apache/Nginx)

### Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your database settings
3. Install PHP dependencies (if using Composer):
   ```bash
   composer install
   ```
4. Configure your web server to point to the project root
5. Ensure the SQLSRV PHP extension is installed and enabled

### Configuration

Update the `.env` file with your database credentials:

```env
DB_HOST=your_database_host
DB_PORT=1433
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## API Endpoints

- `GET /api/users` - Retrieve all users
- `GET /api/checkinout/{userId}?startDate={date}&endDate={date}` - Get check-in/out logs for a user

## Development

### Local Development

For local development, you can use PHP's built-in server:

```bash
php -S 0.0.0.0:5000 index.php
```

### Production Deployment

1. Upload files to your web server
2. Configure your web server to use `index.php` as the entry point
3. Ensure `.htaccess` files are processed (for Apache)
4. Set appropriate file permissions
5. Configure SSL certificate for HTTPS

## Security Considerations

- Always use HTTPS in production
- Keep database credentials secure
- Regularly update PHP and extensions
- Configure proper CORS settings
- Use environment variables for sensitive data

## License

This project is licensed under the MIT License.
