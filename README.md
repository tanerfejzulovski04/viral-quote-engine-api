# Viral Quote Engine API

A Node.js/Express API for managing user profiles with authentication.

## Features

- User registration and authentication
- JWT-based authorization
- User profile management
- SQLite database with users table

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your configuration:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get current user profile (requires authentication)

### Profile Management

- **PUT** `/api/me` - Update user profile (name and timezone) (requires authentication)

### Health Check

- **GET** `/health` - Health check endpoint

## Database Schema

### Users Table

- `id` - Primary key
- `name` - User's full name
- `email` - User's email (unique)
- `password` - Hashed password
- `timezone` - User's timezone (default: 'Europe/Skopje')
- `plan` - User's subscription plan ('free' or 'pro', default: 'free')
- `trial_ends_at` - Trial end date (nullable)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp