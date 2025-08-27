# viral-quote-engine-api

A server-side PNG rendering API using spatie/browsershot for generating images from HTML content.

## Features

- Server-side HTML to PNG rendering
- Customizable width and height
- Optional watermark with bottom-right positioning and opacity
- RESTful API endpoint

## Installation

1. Clone the repository
2. Install dependencies: `composer install`
3. Ensure the `public/renders/` directory is writable
4. Install Puppeteer/Chrome for browsershot (see [spatie/browsershot requirements](https://github.com/spatie/browsershot#requirements))

## API Endpoint

### POST /api/render

Renders HTML content to a PNG image.

**Request Body:**
```json
{
    "html": "<html><body><h1>Hello World</h1></body></html>",
    "width": 800,
    "height": 600,
    "watermark": "Optional watermark text"
}
```

**Response:**
```json
{
    "image_url": "http://yourdomain.com/public/renders/render_xyz_123456.png"
}
```

**Error Response:**
```json
{
    "error": "Error message"
}
```

## Usage Example

```bash
curl -X POST http://localhost/api/render \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<!DOCTYPE html><html><body><h1>Test</h1></body></html>",
    "width": 800,
    "height": 600,
    "watermark": "My Watermark"
  }'
```

## Testing

Run the test script to validate functionality:
```bash
php test_render.php
```

## Requirements

- PHP 8.1+
- Composer
- Node.js and Puppeteer (for browsershot)