const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const { verifyToken } = require('../middleware/auth');

/**
 * Game Routes
 * Base: /game
 */

// Start game
router.post('/start', verifyToken, gameController.startGame);

// Submit score
router.post('/submit-score', verifyToken, gameController.submitScore);

// Get leaderboard (public)
router.get('/:gameId/leaderboard', gameController.getLeaderboard);

// Get my high score
router.get('/:gameId/my-score', verifyToken, gameController.getMyHighScore);

// Get my stats
router.get('/:gameId/stats', verifyToken, gameController.getUserStats);

module.exports = router;
