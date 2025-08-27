/**
 * Create assets table
 * Migration: 001_create_assets_table.js
 */

const up = async (database) => {
  const sql = `
    CREATE TABLE assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      template_id INTEGER,
      url TEXT NOT NULL,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  await database.run(sql);
  
  // Create index for faster queries
  await database.run('CREATE INDEX idx_assets_created_at ON assets(created_at DESC)');
  await database.run('CREATE INDEX idx_assets_user_id ON assets(user_id)');
};

const down = async (database) => {
  await database.run('DROP INDEX IF EXISTS idx_assets_user_id');
  await database.run('DROP INDEX IF EXISTS idx_assets_created_at');
  await database.run('DROP TABLE IF EXISTS assets');
};

module.exports = { up, down };