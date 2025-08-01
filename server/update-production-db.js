const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('Updating production database...');

// This script will run the migration to ensure the production database has all the latest shortcuts
const { migrateDatabase } = require('./database-migration');

// Run the migration
migrateDatabase();

console.log('Production database update initiated. Check server logs for completion.'); 