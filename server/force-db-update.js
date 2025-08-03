const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🔄 Force updating production database...');

// This script will completely reset and recreate the database with all shortcuts
const { migrateDatabase } = require('./database-migration');

function forceUpdateDatabase() {
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite');
  const db = new sqlite3.Database(dbPath);

  console.log('🗑️  Clearing existing packages...');
  
  // Delete all existing packages
  db.run('DELETE FROM shortcut_packages', (err) => {
    if (err) {
      console.error('Error clearing packages:', err.message);
      return;
    }
    
    console.log('✅ Packages cleared successfully');
    console.log('🔄 Running migration to recreate packages...');
    
    // Run the migration to recreate all packages with correct shortcuts
    migrateDatabase();
    
    console.log('✅ Force update completed!');
    console.log('🔄 Please restart your server to see the changes.');
  });
}

// Run the force update
forceUpdateDatabase(); 