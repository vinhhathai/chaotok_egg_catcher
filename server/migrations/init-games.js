require('dotenv').config();
const DBConnection = require('../src/config/database');
const gameService = require('../src/services/game.service');

async function initGames() {
  try {
    console.log('🎮 Initializing games...');

    const dbConnection = new DBConnection();
    await dbConnection.connect();

    await gameService.initializeGames();

    console.log('✅ Games initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

initGames();
