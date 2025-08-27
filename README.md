# viral-quote-engine-api

A Laravel API for managing viral quote templates with global and user-specific templates.

## Features

### Templates CRUD
- **Global Templates**: Read-only templates available to all users
- **User Templates**: Personal templates that users can create, update, and delete
- **Template Configuration**: JSON-based styling configuration for quotes

## API Endpoints

### Templates

#### GET `/api/templates`
Retrieve templates based on scope parameter.

**Query Parameters:**
- `scope` (string, optional): `global` (default) or `mine`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": null,
      "name": "Classic Quote",
      "config": {
        "background": "#ffffff",
        "text_color": "#000000",
        "font_family": "Arial",
        "font_size": "24px",
        "text_align": "center"
      },
      "created_at": "2025-08-27T17:00:00.000000Z",
      "updated_at": "2025-08-27T17:00:00.000000Z"
    }
  ]
}
```

#### POST `/api/templates`
Create a new user template.

**Request Body:**
```json
{
  "name": "My Custom Template",
  "config": {
    "background": "#f0f0f0",
    "text_color": "#333333",
    "font_family": "Roboto"
  }
}
```

#### PUT `/api/templates/{id}`
Update an existing user template. Global templates cannot be updated by normal users.

#### DELETE `/api/templates/{id}`
Delete a user template. Global templates cannot be deleted by normal users.

## Database Schema

### Templates Table
- `id` - Primary key
- `user_id` - Foreign key to users table (nullable for global templates)
- `name` - Template name
- `config` - JSON configuration for styling
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Setup

1. Copy `.env.example` to `.env` and configure your database
2. Run migrations: `php artisan migrate`
3. Seed global templates: `php artisan db:seed --class=TemplateSeeder`

## Global Templates

The system includes 3 pre-seeded global templates:
1. **Classic Quote** - Clean white background with black text
2. **Modern Gradient** - Purple gradient background with white text
3. **Minimalist Dark** - Dark theme with red accent border