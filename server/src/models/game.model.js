const mongoose = require('mongoose');

/**
 * Game Schema - Store game metadata
 */
const gameSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    category: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    coinMultiplier: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    playCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Game Score Schema - Store player scores
 */
const gameScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Store as string since user data is in different DB
      required: true,
      index: true,
    },
    username: String, // Cache username for leaderboard
    avatar: String, // Cache avatar for leaderboard
    gameId: {
      type: String,
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    playTime: {
      type: Number, // in seconds
      required: true,
    },
    coinsEarned: {
      type: Number,
      default: 0,
    },
    gameplayData: {
      type: mongoose.Schema.Types.Mixed, // Flexible data for anti-cheat
    },
    isHighScore: {
      type: Boolean,
      default: false,
    },
    sessionId: String,
  },
  {
    timestamps: true,
  }
);

// Compound index for leaderboard queries
gameScoreSchema.index({ gameId: 1, score: -1 });
gameScoreSchema.index({ userId: 1, gameId: 1, score: -1 });

/**
 * Game Session Schema - Track active game sessions
 */
const gameSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    gameId: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model('Game', gameSchema);
const GameScore = mongoose.model('GameScore', gameScoreSchema);
const GameSession = mongoose.model('GameSession', gameSessionSchema);

module.exports = {
  Game,
  GameScore,
  GameSession,
};
