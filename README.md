# Viral Quote Engine API

A Laravel API for managing user profiles with authentication and the users table implementation.

## Features

- User registration and authentication using Laravel Sanctum
- User profile management with timezone and plan support
- PostgreSQL database with comprehensive users table
- RESTful API endpoints with proper validation

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   composer install
   ```
3. Copy environment file and configure:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Configure your database in `.env`:
   ```
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=viral_quote_engine
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```
5. Run migrations:
   ```bash
   php artisan migrate
   ```
6. Start the development server:
   ```bash
   php artisan serve
   ```

## API Endpoints

### Authentication (Testing)

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user

### Profile Management

- **GET** `/api/auth/me` - Get current authenticated user profile (requires authentication)
- **PUT** `/api/me` - Update user profile (name and timezone) (requires authentication)

### Health Check

- **GET** `/api/health` - Health check endpoint

## Database Schema

### Users Table

- `id` - Primary key (auto-increment)
- `name` - User's full name (TEXT, NOT NULL)
- `email` - User's email (TEXT, UNIQUE, NOT NULL)
- `password` - Hashed password (TEXT, NOT NULL)
- `timezone` - User's timezone (TEXT, default: 'Europe/Skopje')
- `plan` - User's subscription plan (ENUM: 'free'|'pro', default: 'free')
- `trial_ends_at` - Trial end date (TIMESTAMP, nullable)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Usage Examples

### Register a User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "timezone": "America/New_York",
    "plan": "free"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Profile
```bash
curl -X PUT http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "timezone": "Europe/London"
  }'
```

## Technical Details

- Built with Laravel 11
- Uses Laravel Sanctum for API authentication
- PostgreSQL database (configurable via .env)
- Follows Laravel best practices for API development
- Input validation and error handling
- Secure password hashing