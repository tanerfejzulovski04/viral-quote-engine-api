const database = require('./models/database');

async function initializeApp() {
  try {
    console.log('Initializing application...');
    
    // Connect to database
    await database.connect();
    
    // Run migrations
    await database.runMigrations();
    
    console.log('Application initialized successfully!');
    
    // Start the server
    require('./server');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

initializeApp();