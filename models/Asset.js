const database = require('./database');
const fs = require('fs').promises;
const path = require('path');

class Asset {
  static async getAll(options = {}) {
    const { page = 1, limit = 10, userId = null } = options;
    const offset = (page - 1) * limit;
    
    let sql = 'SELECT * FROM assets';
    let countSql = 'SELECT COUNT(*) as total FROM assets';
    const params = [];
    const countParams = [];
    
    if (userId) {
      sql += ' WHERE user_id = ?';
      countSql += ' WHERE user_id = ?';
      params.push(userId);
      countParams.push(userId);
    }
    
    // Order by created_at DESC (latest first) as required
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [assets, countResult] = await Promise.all([
      database.all(sql, params),
      database.get(countSql, countParams)
    ]);
    
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);
    
    return {
      assets,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
  
  static async getById(id) {
    const sql = 'SELECT * FROM assets WHERE id = ?';
    return await database.get(sql, [id]);
  }
  
  static async create(data) {
    const { userId, templateId, url, width, height } = data;
    const sql = `
      INSERT INTO assets (user_id, template_id, url, width, height)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await database.run(sql, [userId, templateId, url, width, height]);
    return result.id;
  }
  
  static async delete(id) {
    // First get the asset to get the file path
    const asset = await this.getById(id);
    if (!asset) {
      return null;
    }
    
    // Delete from database
    const sql = 'DELETE FROM assets WHERE id = ?';
    const result = await database.run(sql, [id]);
    
    // Delete the physical file
    if (asset.url && result.changes > 0) {
      try {
        // Extract file path from URL (assuming URLs are relative paths)
        const filePath = path.resolve(asset.url);
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Failed to delete file: ${asset.url}`, error);
        // Don't throw error - database deletion succeeded
      }
    }
    
    return result.changes > 0;
  }
}

module.exports = Asset;