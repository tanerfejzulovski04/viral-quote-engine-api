const express = require('express');
const { dbQuery } = require('../database/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// PUT /api/me - Update user profile (name and timezone)
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, timezone } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!name && !timezone) {
      return res.status(400).json({ error: 'At least one field (name or timezone) is required' });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    
    if (timezone) {
      updates.push('timezone = ?');
      values.push(timezone);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    
    await dbQuery.run(query, values);

    // Get updated user data
    const updatedUser = await dbQuery.get(
      'SELECT id, name, email, timezone, plan, trial_ends_at FROM users WHERE id = ?', 
      [userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;