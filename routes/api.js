const express = require('express');
const router = express.Router();
const assetsController = require('../controllers/assetsController');

// Assets routes
router.get('/assets', assetsController.getAssets);
router.delete('/assets/:id', assetsController.deleteAsset);

module.exports = router;