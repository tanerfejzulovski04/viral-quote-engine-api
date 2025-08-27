# viral-quote-engine-api

A REST API for managing generated assets from a viral quote engine, with support for asset storage, listing, and deletion.

## Features

- **Asset Management**: Store and manage generated assets with metadata
- **Pagination**: Efficient pagination for asset listings  
- **Latest First Ordering**: Assets are returned in reverse chronological order
- **File Deletion**: Automatically removes physical files when assets are deleted
- **Database Migrations**: Automated database schema management
- **Comprehensive Testing**: Full test coverage for all endpoints

## API Endpoints

### GET /api/assets

Retrieve a paginated list of assets, ordered by creation date (latest first).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `userId` (optional): Filter by user ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "template_id": 2,
      "url": "/uploads/asset.jpg",
      "width": 800,
      "height": 600,
      "created_at": "2023-12-31 12:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### DELETE /api/assets/:id

Delete an asset by ID. This removes both the database record and the associated file.

**Response:**
```json
{
  "success": true,
  "message": "Asset deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Asset not found"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2023-12-31T12:00:00.000Z"
}
```

## Database Schema

### Assets Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| user_id | INTEGER | User who created the asset (required) |
| template_id | INTEGER | Template used (nullable) |
| url | TEXT | File URL/path (required) |
| width | INTEGER | Asset width in pixels (required) |
| height | INTEGER | Asset height in pixels (required) |
| created_at | DATETIME | Creation timestamp (auto-generated) |

## Installation & Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## Testing

Run the test suite:
```bash
npm test
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `DB_PATH`: SQLite database file path (default: ./database.sqlite)

## Project Structure

```
├── controllers/           # Request handlers
│   └── assetsController.js
├── migrations/           # Database migrations
│   └── 001_create_assets_table.js
├── models/              # Data models
│   ├── Asset.js
│   └── database.js
├── routes/              # API routes
│   └── api.js
├── tests/               # Test files
│   └── assets.test.js
├── index.js            # Application entry point
├── server.js           # Express server setup
└── package.json        # Dependencies and scripts
```

## Development Notes

- Uses SQLite for database storage (easily configurable for other databases)
- Automated migration system ensures database schema is up to date
- File deletion is handled gracefully - database deletion succeeds even if file removal fails
- Comprehensive error handling with appropriate HTTP status codes
- Input validation for all parameters