const { Game, GameScore, GameSession } = require('../models/game.model');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

class GameService {
  /**
   * Get user info from social network API
   */
  async getUserInfo(userId, token) {
    try {
      const response = await axios.get(`${process.env.SOCIAL_API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error.message);
      return { username: 'Player', avatar: '' };
    }
  }

  /**
   * Start a new game session
   */
  async startGame(userId, gameId) {
    const game = await Game.findOne({ gameId, isActive: true });
    if (!game) {
      throw new Error('Game not found or inactive');
    }

    game.playCount += 1;
    await game.save();

    const sessionId = uuidv4();
    const session = await GameSession.create({
      userId,
      gameId,
      sessionId,
      status: 'active',
    });

    return {
      sessionId: session.sessionId,
      gameId: game.gameId,
      gameName: game.name,
      coinMultiplier: game.coinMultiplier,
    };
  }

  /**
   * Submit game score
   */
  async submitScore(userId, userInfo, { gameId, score, playTime, gameplayData, sessionId }) {
    const game = await Game.findOne({ gameId });
    if (!game) {
      throw new Error('Game not found');
    }

    // Anti-cheat: Basic validation
    if (score < 0 || score > 10000) {
      throw new Error('Invalid score');
    }

    const coinsEarned = Math.floor((score / 10) * game.coinMultiplier);

    const previousHighScore = await GameScore.findOne({
      userId,
      gameId,
      isHighScore: true,
    });

    const isNewHighScore = !previousHighScore || score > previousHighScore.score;

    if (isNewHighScore && previousHighScore) {
      previousHighScore.isHighScore = false;
      await previousHighScore.save();
    }

    const gameScore = await GameScore.create({
      userId,
      username: userInfo.username || 'Player',
      avatar: userInfo.avatar || '',
      gameId,
      score,
      playTime,
      coinsEarned,
      gameplayData,
      isHighScore: isNewHighScore,
      sessionId,
    });

    if (sessionId) {
      await GameSession.findOneAndUpdate(
        { sessionId },
        { endTime: new Date(), status: 'completed' }
      );
    }

    // ✅ Call Social Network API to add coins (Server-to-Server)
    if (coinsEarned > 0) {
      try {
        await axios.post(
          `${process.env.SOCIAL_API_URL}/user/coins/add`,
          {
            userId,
            amount: coinsEarned,
            source: 'game',
            gameId,
            gameScore: score,
            description: `Earned ${coinsEarned} coins from ${game.name}`
          },
          {
            headers: {
              'X-Service-Secret': process.env.SERVICE_SECRET
            },
            timeout: 5000
          }
        );
        console.log(`✅ Added ${coinsEarned} coins to user ${userId}`);
      } catch (error) {
        console.error('❌ Failed to add coins to social network:', error.message);
        // Don't throw error - game score still saved
      }
    }

    const rank = await this.getUserRank(userId, gameId);

    return {
      success: true,
      score,
      coinsEarned,
      rank,
      isHighScore: isNewHighScore,
      scoreId: gameScore._id,
    };
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(gameId, period = 'alltime', limit = 50) {
    let dateFilter = {};

    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: today } };
    } else if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { createdAt: { $gte: monthAgo } };
    }

    const rankings = await GameScore.aggregate([
      {
        $match: {
          gameId,
          ...dateFilter,
        },
      },
      {
        $sort: { score: -1, createdAt: 1 },
      },
      {
        $group: {
          _id: '$userId',
          username: { $first: '$username' },
          avatar: { $first: '$avatar' },
          score: { $first: '$score' },
          playedAt: { $first: '$createdAt' },
          playTime: { $first: '$playTime' },
        },
      },
      {
        $sort: { score: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          userId: '$_id',
          username: 1,
          avatar: 1,
          score: 1,
          playedAt: 1,
          playTime: 1,
        },
      },
    ]);

    const rankedList = rankings.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));

    return {
      gameId,
      period,
      rankings: rankedList,
      total: rankedList.length,
    };
  }

  /**
   * Get user's rank
   */
  async getUserRank(userId, gameId) {
    const userScore = await GameScore.findOne({
      userId,
      gameId,
      isHighScore: true,
    });

    if (!userScore) {
      return null;
    }

    const higherScoresCount = await GameScore.countDocuments({
      gameId,
      isHighScore: true,
      score: { $gt: userScore.score },
    });

    return higherScoresCount + 1;
  }

  /**
   * Get user's high score
   */
  async getMyHighScore(userId, gameId) {
    const highScore = await GameScore.findOne({
      userId,
      gameId,
      isHighScore: true,
    });

    if (!highScore) {
      return null;
    }

    const rank = await this.getUserRank(userId, gameId);

    return {
      score: highScore.score,
      rank,
      playedAt: highScore.createdAt,
      playTime: highScore.playTime,
    };
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId, gameId) {
    const scores = await GameScore.find({ userId, gameId }).sort({ createdAt: -1 });

    if (scores.length === 0) {
      return {
        gamesPlayed: 0,
        highScore: 0,
        totalCoinsEarned: 0,
        averageScore: 0,
      };
    }

    const totalCoinsEarned = scores.reduce((sum, s) => sum + s.coinsEarned, 0);
    const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    const highScore = Math.max(...scores.map((s) => s.score));

    return {
      gamesPlayed: scores.length,
      highScore,
      totalCoinsEarned,
      averageScore: Math.round(averageScore),
      recentScores: scores.slice(0, 10).map((s) => ({
        score: s.score,
        coinsEarned: s.coinsEarned,
        playedAt: s.createdAt,
      })),
    };
  }

  /**
   * Initialize default games
   */
  async initializeGames() {
    const games = [
      {
        gameId: 'egg-catch',
        name: 'Egg Catch',
        description: 'Catch falling eggs and avoid bombs!',
        category: 'arcade',
        difficulty: 'easy',
        coinMultiplier: 1,
        isActive: true,
      },
    ];

    for (const gameData of games) {
      await Game.findOneAndUpdate(
        { gameId: gameData.gameId },
        gameData,
        { upsert: true, new: true }
      );
    }

    console.log('✅ Default games initialized');
  }
}

module.exports = new GameService();
