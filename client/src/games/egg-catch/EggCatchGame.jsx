import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import StartScene from './scenes/StartScene';
import GameScene from './scenes/GameScene';
import { soundGenerator } from './utils/SoundGenerator';

export default function EggCatchGame({ onGameOver }) {
  const gameRef = useRef(null);
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    if (gameInstanceRef.current) return; // Prevent duplicate initialization

    // Resume audio context on user interaction
    const resumeAudio = () => {
      soundGenerator.resume();

    };
    
    document.addEventListener('click', resumeAudio, { once: true });
    document.addEventListener('touchstart', resumeAudio, { once: true });

    // Responsive game size - calculate based on viewport
    const getGameSize = () => {
      const maxWidth = Math.min(window.innerWidth - 40, 900);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      const aspectRatio = 7 / 5; // 700:500 original ratio
      
      let width = maxWidth;
      let height = width / aspectRatio;
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
      
      return { width: Math.floor(width), height: Math.floor(height) };
    };

    const { width, height } = getGameSize();

    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width,
      height,
      backgroundColor: '#87CEEB', // Sky blue background
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width,
        height,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: [StartScene, GameScene], // Removed GameOverScene - using modal instead
    };

    const game = new Phaser.Game(config);
    gameInstanceRef.current = game;

    // Listen for game over event
    game.events.on('gameover', (score, playTime) => {
      if (onGameOver) {
        onGameOver(score, playTime, {
          timestamp: Date.now(),
          // Anti-cheat data would go here
        });
      }
    });

    // Handle window resize
    const handleResize = () => {
      const newSize = getGameSize();
      if (game && game.scale) {
        game.scale.resize(newSize.width, newSize.height);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [onGameOver]);

  return (
    <div
      ref={gameRef}
      style={{
        width: '100%',
        maxWidth: '900px',
        height: 'auto',
        aspectRatio: '7 / 5',
        maxHeight: '600px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    />
  );
}
