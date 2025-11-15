import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, IconButton, Typography, Chip, CircularProgress, Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { ArrowBack, Info } from '@mui/icons-material';
import { getGameById } from '../../config/gameRegistry';

/**
 * GameFrame - Wrapper component for all games
 * Provides consistent UI and gameplay experience
 */
export default function GameFrame() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [GameComponent, setGameComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultModal, setResultModal] = useState({
    open: false,
    score: 0,
    playTime: 0,
  });
  
  // Dynamic social network URL
  const socialOrigin = document.referrer ? new URL(document.referrer).origin : window.location.origin.replace(':4000', ':3004');

  useEffect(() => {
    loadGame();
  }, [gameId]);

  const loadGame = async () => {
    const gameConfig = getGameById(gameId);
    if (!gameConfig) {
      console.error('Game not found:', gameId);
      navigate('/games');
      return;
    }

    setGame(gameConfig);
    setGameComponent(() => gameConfig.component);
    setLoading(false);
  };

  const handleGameOver = async (score, playTime, gameplayData) => {
    // Just show result modal, no API call
    setResultModal({
      open: true,
      score,
      playTime,
      gameplayData,
    });
  };

  const handleCloseResultModal = () => {
    setResultModal({ ...resultModal, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#fff' }} />
      </Box>
    );
  }

  if (!game || !GameComponent) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">Game not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/games')} sx={{ color: '#fff' }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
            {game.icon} {game.name}
          </Typography>
          <Chip
            label={game.difficulty}
            size="small"
            sx={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              textTransform: 'capitalize',
            }}
          />
        </Box>
        
        {/* Chaotok Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img 
            src={`${socialOrigin}/logo.webp`}
            alt="Chaotok" 
            style={{ 
              width: '32px', 
              height: '32px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} 
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#fff', 
              fontWeight: 'bold',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Chaotok
          </Typography>
        </Box>
      </Box>

      {/* Game Container */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          p: { xs: 1, sm: 2, md: 3 },
          overflow: 'auto'
        }}
      >
        <GameComponent onGameOver={handleGameOver} />
      </Box>

      {/* Result Modal */}
      <Dialog
        open={resultModal.open}
        onClose={handleCloseResultModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
            color: '#fff',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          },
        }}
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            🎮 Game Over!
          </Typography>
          
          <Box sx={{ mb: 3, p: 3, background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
            <Typography variant="h3" sx={{ mb: 2, color: '#ffd700', fontWeight: 'bold' }}>
              {resultModal.score}
            </Typography>
            <Typography variant="h6" sx={{ color: '#fff', opacity: 0.9 }}>
              Your Score
            </Typography>
            {resultModal.playTime && (
              <Typography variant="body1" sx={{ mt: 2, color: '#fff', opacity: 0.7 }}>
                Time: {Math.floor(resultModal.playTime / 60)}:{(resultModal.playTime % 60).toString().padStart(2, '0')}
              </Typography>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleCloseResultModal}
            variant="contained"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '25px',
              background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '16px',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #ffed4e, #ffd700)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
