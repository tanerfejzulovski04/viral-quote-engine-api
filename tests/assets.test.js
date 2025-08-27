const request = require('supertest');
const app = require('../server');
const database = require('../models/database');
const Asset = require('../models/Asset');

describe('Assets API', () => {
  beforeAll(async () => {
    await database.connect();
    await database.runMigrations();
  });

  afterAll(async () => {
    await database.close();
  });

  beforeEach(async () => {
    // Clear the assets table before each test
    await database.run('DELETE FROM assets');
  });

  describe('GET /api/assets', () => {
    test('should return empty array when no assets', async () => {
      const response = await request(app)
        .get('/api/assets')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      });
    });

    test('should return assets in latest-first order', async () => {
      // Create test assets with different timestamps
      await database.run(
        'INSERT INTO assets (user_id, template_id, url, width, height, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [1, 1, '/uploads/old.jpg', 800, 600, '2023-01-01 12:00:00']
      );
      await database.run(
        'INSERT INTO assets (user_id, template_id, url, width, height, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [1, 2, '/uploads/new.jpg', 800, 600, '2023-12-31 12:00:00']
      );

      const response = await request(app)
        .get('/api/assets')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].url).toBe('/uploads/new.jpg'); // Latest first
      expect(response.body.data[1].url).toBe('/uploads/old.jpg');
    });

    test('should handle pagination correctly', async () => {
      // Create 3 assets
      for (let i = 1; i <= 3; i++) {
        await Asset.create({
          userId: 1,
          templateId: i,
          url: `/uploads/asset${i}.jpg`,
          width: 800,
          height: 600
        });
      }

      const response = await request(app)
        .get('/api/assets?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
        hasNext: true,
        hasPrev: false
      });
    });

    test('should filter by userId when provided', async () => {
      await Asset.create({ userId: 1, templateId: 1, url: '/uploads/user1.jpg', width: 800, height: 600 });
      await Asset.create({ userId: 2, templateId: 1, url: '/uploads/user2.jpg', width: 800, height: 600 });

      const response = await request(app)
        .get('/api/assets?userId=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].user_id).toBe(1);
    });
  });

  describe('DELETE /api/assets/:id', () => {
    test('should delete an existing asset', async () => {
      const assetId = await Asset.create({
        userId: 1,
        templateId: 1,
        url: '/uploads/test.jpg',
        width: 800,
        height: 600
      });

      const response = await request(app)
        .delete(`/api/assets/${assetId}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Asset deleted successfully'
      });

      // Verify asset is deleted
      const asset = await Asset.getById(assetId);
      expect(asset).toBeUndefined();
    });

    test('should return 404 for non-existent asset', async () => {
      const response = await request(app)
        .delete('/api/assets/999')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Asset not found'
      });
    });

    test('should return 400 for invalid asset ID', async () => {
      const response = await request(app)
        .delete('/api/assets/invalid')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid asset ID'
      });
    });
  });

  describe('Health check', () => {
    test('should return OK status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });
});