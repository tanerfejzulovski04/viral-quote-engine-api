# Viral Quote Engine API

A Laravel 11 API for managing and serving viral quotes.

## Requirements

- PHP 8.3+
- Composer

## Installation

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Install dependencies: `composer install`
4. Generate application key: `php artisan key:generate`
5. Create database file: `touch database/database.sqlite`
6. Run migrations: `php artisan migrate`

## Development

Start the development server:

```bash
php artisan serve
```

The application will be available at http://127.0.0.1:8000

## Testing

Run tests with Pest:

```bash
php artisan test
```

## Code Style

Format code with Laravel Pint:

```bash
composer run pint
```