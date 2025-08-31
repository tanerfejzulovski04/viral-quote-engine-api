# Viral Quote Engine API

A Laravel API with Sanctum authentication for token-based authentication, designed for SPA (Single Page Application) usage with extended user profile management.

## Features

- Laravel Sanctum token authentication
- User registration and login
- Extended user profile management (timezone, plan, trial support)
- JWT-like token authentication for SPAs
- RESTful API endpoints
- Input validation with proper 422 error responses
- Password hashing
- CORS support
- PostgreSQL database support

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Bearer Token |
| GET | `/api/auth/me` | Get current user | Bearer Token |

### Profile Management

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|---------------|
| PUT | `/api/me` | Update user profile (name and timezone) | Bearer Token |

### Registration

**POST** `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "timezone": "America/New_York",
  "plan": "free"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "timezone": "America/New_York",
    "plan": "free",
    "trial_ends_at": null
  },
  "token": "your-bearer-token-here"
}
```

### Login

**POST** `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "timezone": "America/New_York",
    "plan": "free",
    "trial_ends_at": null
  },
  "token": "your-bearer-token-here"
}
```

### Get Current User

**GET** `/api/auth/me`

Headers: `Authorization: Bearer your-bearer-token-here`

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "timezone": "America/New_York",
    "plan": "free",
    "trial_ends_at": null
  }
}
```

### Update Profile

**PUT** `/api/me`

Headers: `Authorization: Bearer your-bearer-token-here`

```json
{
  "name": "John Smith",
  "timezone": "Europe/London"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "timezone": "Europe/London",
    "plan": "free",
    "trial_ends_at": null
  }
}
```

### Logout

**POST** `/api/auth/logout`

Headers: `Authorization: Bearer your-bearer-token-here`

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

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

## Error Responses

### Validation Errors (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### Authentication Errors (401)
```json
{
  "message": "Unauthenticated"
}
```

### Invalid Credentials (401)
```json
{
  "message": "Invalid credentials"
}
```

## Setup

1. Install dependencies:
   ```bash
   composer install
   ```

2. Copy environment file and configure:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Configure your database in `.env`:
   ```
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=viral_quote_engine
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```

4. Run migrations:
   ```bash
   php artisan migrate
   ```

5. Start the development server:
   ```bash
   php artisan serve
   ```

## Testing

Run the test suite:
```bash
./vendor/bin/phpunit
```

## Implementation Notes

- Uses Laravel Sanctum for token-based authentication
- PostgreSQL database (configurable via .env)
- Tokens are bearer tokens suitable for SPA usage
- Passwords are hashed using Laravel's built-in hashing
- Full CORS support for frontend integration
- Extended user model with timezone, plan, and trial support
- Proper HTTP status codes and error messages
