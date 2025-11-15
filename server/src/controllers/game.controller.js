const gameService = require('../services/game.service');
const { sendSuccess, sendError } = require('../utils/response');

class GameController {
  /**
   * Start game session
   */
  async startGame(req, res) {
    try {
      const userId = req.userId;
      const { gameId } = req.body;

      if (!gameId) {
        return sendError(res, 'Game ID is required', 400);
      }

      const result = await gameService.startGame(userId, gameId);
      return sendSuccess(res, 'Game session started', result);
    } catch (error) {
      console.error('Error starting game:', error);
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Submit score
   */
  async submitScore(req, res) {
    try {
      const userId = req.userId;
      const { gameId, score, playTime, gameplayData, sessionId } = req.body;

      if (!gameId || score === undefined || !playTime) {
        return sendError(res, 'Missing required fields', 400);
      }

      if (score < 0 || playTime < 0) {
        return sendError(res, 'Invalid score or play time', 400);
      }

      // Get user info from token
      const userInfo = {
        username: req.user.username || 'Player',
        avatar: req.user.avatar || '',
      };

      const result = await gameService.submitScore(userId, userInfo, {
        gameId,
        score,
        playTime,
        gameplayData,
        sessionId,
      });

      return sendSuccess(res, 'Score submitted successfully', {
        ...result,
        totalCoins: 0, // Will be updated by social network API
      });
    } catch (error) {
      console.error('Error submitting score:', error);
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(req, res) {
    try {
      const { gameId } = req.params;
      const { period = 'alltime', limit = 50 } = req.query;

      const result = await gameService.getLeaderboard(gameId, period, parseInt(limit));
      return sendSuccess(res, 'Leaderboard retrieved', result);
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Get my high score
   */
  async getMyHighScore(req, res) {
    try {
      const userId = req.userId;
      const { gameId } = req.params;

      const result = await gameService.getMyHighScore(userId, gameId);

      if (!result) {
        return sendSuccess(res, 'No scores found', { score: 0, rank: null });
      }

      return sendSuccess(res, 'High score retrieved', result);
    } catch (error) {
      console.error('Error getting high score:', error);
      return sendError(res, error.message, 500);
    }
  }

  /**
   * Get user stats
   */
  async getUserStats(req, res) {
    try {
      const userId = req.userId;
      const { gameId } = req.params;

      const result = await gameService.getUserStats(userId, gameId);
      return sendSuccess(res, 'Statistics retrieved', result);
    } catch (error) {
      console.error('Error getting user stats:', error);
      return sendError(res, error.message, 500);
    }
  }
}

module.exports = new GameController();
