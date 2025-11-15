/**
 * Game Registry - Central configuration for all games
 * 
 * Add new games here to automatically integrate into the platform
 */

import EggCatchGame from '../games/egg-catch/EggCatchGame';

export const GAME_REGISTRY = [
  {
    id: 'egg-catch',
    name: 'Egg Catch',
    description: 'Catch falling eggs and earn coins!',
    icon: '🥚',
    thumbnail: '/assets/games/egg-catch/thumbnail.png',
    difficulty: 'easy',
    enabled: true,
    component: EggCatchGame, // Direct import instead of lazy
  },
  // Thêm game mới ở đây trong tương lai:
  // {
  //   id: 'flappy-bird',
  //   name: 'Flappy Bird',
  //   description: 'Fly through obstacles!',
  //   icon: '🐦',
  //   thumbnail: '/assets/games/flappy-bird/thumbnail.png',
  //   difficulty: 'medium',
  //   enabled: true,
  //   component: () => import('../games/flappy-bird/FlappyBirdGame'),
  // },
];

/**
 * Get game by ID
 */
export function getGameById(gameId) {
  return GAME_REGISTRY.find(game => game.id === gameId);
}

/**
 * Get all enabled games
 */
export function getEnabledGames() {
  return GAME_REGISTRY.filter(game => game.enabled);
}
