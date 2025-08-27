# Viral Quote Engine API

A Laravel-based API for managing brand kits with logo upload functionality, designed for viral quote image generation.

## Features

- **Brand Kit CRUD**: Create, read, and update brand kits per user
- **Logo Upload**: Secure file upload with validation (≤ 2MB, image files only)
- **Color Validation**: Hex color code validation for brand colors
- **Database**: SQLite database with user and brand kit relationships
- **API**: RESTful JSON API endpoints

## API Endpoints

### Brand Kit Management

#### Get Brand Kit
```
GET /api/brand-kit?user_id={user_id}
```
Returns the brand kit for the specified user.

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "primary_color": "#FF5733",
  "secondary_color": "#33FF57",
  "accent_color": "#3357FF",
  "font_family": "Arial",
  "logo_url": "/storage/logos/filename.png",
  "watermark_text": "My Brand",
  "created_at": "2025-08-27T17:33:55.000000Z",
  "updated_at": "2025-08-27T17:33:55.000000Z"
}
```

#### Create/Update Brand Kit
```
POST /api/brand-kit
Content-Type: application/json

{
  "user_id": 1,
  "primary_color": "#FF5733",
  "secondary_color": "#33FF57",
  "accent_color": "#3357FF",
  "font_family": "Arial",
  "logo_url": "/storage/logos/filename.png",
  "watermark_text": "My Brand"
}
```

**Validation Rules:**
- `primary_color`, `secondary_color`, `accent_color`: Required hex color codes (#RGB or #RRGGBB)
- `font_family`: Required string, max 255 characters
- `logo_url`: Optional string, max 2048 characters
- `watermark_text`: Optional string, max 255 characters
- `user_id`: Optional integer (defaults to 1 for testing)

### Logo Upload

#### Upload Logo
```
POST /api/uploads/logo
Content-Type: multipart/form-data

logo: <image_file>
```

**Validation:**
- File must be an image
- Maximum file size: 2MB
- Supported formats: PNG, JPG, JPEG, GIF, SVG, etc.

**Response:**
```json
{
  "url": "/storage/logos/1756316067_cFZCtbsvkd.png",
  "filename": "1756316067_cFZCtbsvkd.png",
  "size": 70,
  "mime_type": "image/png"
}
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (String)
- `email` (String, unique)
- `email_verified_at` (Timestamp, nullable)
- `password` (String)
- `remember_token` (String, nullable)
- `created_at`, `updated_at` (Timestamps)

### Brand Kits Table
- `id` (Primary Key)
- `user_id` (Foreign Key, unique - one brand kit per user)
- `primary_color` (String)
- `secondary_color` (String)
- `accent_color` (String)
- `font_family` (String)
- `logo_url` (String, nullable)
- `watermark_text` (String, nullable)
- `created_at`, `updated_at` (Timestamps)

## Installation & Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   composer install
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup:**
   ```bash
   php artisan migrate
   php artisan storage:link
   ```

5. **Start development server:**
   ```bash
   php artisan serve
   ```

## File Storage

- Logo files are stored in `storage/app/public/logos/`
- Public access via `/storage/logos/` URL path
- Filenames are generated with timestamp and random string for uniqueness
- Storage link configured via `php artisan storage:link`

## Usage Examples

### Create a Brand Kit with Logo
```bash
# 1. Upload logo
curl -X POST http://localhost:8000/api/uploads/logo \
  -F "logo=@/path/to/logo.png"

# Response: {"url": "/storage/logos/filename.png", ...}

# 2. Create brand kit with logo URL
curl -X POST http://localhost:8000/api/brand-kit \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "primary_color": "#FF5733",
    "secondary_color": "#33FF57", 
    "accent_color": "#3357FF",
    "font_family": "Helvetica",
    "logo_url": "/storage/logos/filename.png",
    "watermark_text": "My Brand"
  }'
```

### Update Existing Brand Kit
The same POST endpoint handles updates - if a brand kit exists for the user, it will be updated (upsert functionality).

### Retrieve Brand Kit
```bash
curl http://localhost:8000/api/brand-kit?user_id=1
```

## Technical Notes

- Built with Laravel 11
- Uses SQLite for simplicity (can be changed via .env)
- File cache for session/view storage
- No authentication middleware (for testing - add in production)
- Unique constraint ensures one brand kit per user
- Logo files are validated for type and size before storage

## Development

The API is designed to be minimal and focused on the specific requirements:
- Brand kit CRUD operations
- Logo file upload with validation
- Proper storage management
- JSON API responses
- Database relationships

For production use, consider adding:
- User authentication/authorization
- Rate limiting
- More comprehensive error handling
- API documentation (OpenAPI/Swagger)
- Unit/integration tests