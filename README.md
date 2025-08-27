# Viral Quote Engine API

A Laravel API with Sanctum authentication for token-based authentication, designed for SPA (Single Page Application) usage.

## Features

- Laravel Sanctum token authentication
- User registration and login
- JWT-like token authentication for SPAs
- RESTful API endpoints
- Input validation with proper 422 error responses
- Password hashing
- CORS support

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Bearer Token |
| GET | `/api/auth/me` | Get current user | Bearer Token |

### Registration

**POST** `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
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
    "created_at": "2025-08-27T17:00:00.000000Z",
    "updated_at": "2025-08-27T17:00:00.000000Z"
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
    "created_at": "2025-08-27T17:00:00.000000Z",
    "updated_at": "2025-08-27T17:00:00.000000Z"
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
    "created_at": "2025-08-27T17:00:00.000000Z",
    "updated_at": "2025-08-27T17:00:00.000000Z"
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

2. Setup database:
   ```bash
   php setup-db.php
   ```

3. Start the server:
   ```bash
   php -S localhost:8000 api-server.php
   ```

## Testing

Run the test suite:
```bash
./vendor/bin/phpunit
```

## Implementation Notes

- Uses Laravel Sanctum for token-based authentication
- SQLite database for simplicity
- Tokens are bearer tokens suitable for SPA usage
- Passwords are hashed using PHP's `password_hash()`
- Full CORS support for frontend integration
- Proper HTTP status codes and error messages