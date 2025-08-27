const Asset = require('../models/Asset');

const assetsController = {
  async getAssets(req, res) {
    try {
      const { page = 1, limit = 10, userId } = req.query;
      
      // Validate pagination parameters
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page
      
      const options = {
        page: pageNum,
        limit: limitNum
      };
      
      if (userId) {
        options.userId = parseInt(userId);
      }
      
      const result = await Asset.getAll(options);
      
      res.json({
        success: true,
        data: result.assets,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching assets:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch assets'
      });
    }
  },
  
  async deleteAsset(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: 'Invalid asset ID'
        });
      }
      
      const deleted = await Asset.delete(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Asset not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Asset deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete asset'
      });
    }
  }
};

module.exports = assetsController;