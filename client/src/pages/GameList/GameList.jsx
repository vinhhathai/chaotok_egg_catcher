import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  Button,
  Container,
  IconButton,
} from '@mui/material';
import { PlayArrow, Home } from '@mui/icons-material';
import { getEnabledGames } from '../../config/gameRegistry';

export default function GameList() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  
  // Dynamic social network URL (from where iframe is embedded)
  const socialOrigin = document.referrer ? new URL(document.referrer).origin : window.location.origin.replace(':4000', ':3004');

  useEffect(() => {
    setGames(getEnabledGames());
  }, []);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#4caf50',
      medium: '#ff9800',
      hard: '#f44336',
    };
    return colors[difficulty] || '#999';
  };

  const handleBackToSocial = () => {
    // Navigate back to social network home
    window.parent.postMessage({ type: 'NAVIGATE_HOME' }, '*');
    // Fallback for direct access
    if (window.parent === window) {
      window.location.href = `${socialOrigin}/home`;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
          <IconButton
            onClick={handleBackToSocial}
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <Home />
          </IconButton>
          
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: 1 }}>
            <img 
              src={`${socialOrigin}/logo.webp`}
              alt="Chaotok Logo" 
              style={{ 
                width: window.innerWidth < 600 ? '40px' : '60px',
                height: window.innerWidth < 600 ? '40px' : '60px',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
              }} 
            />
            <Typography
              variant="h3"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              Chaotok Games
            </Typography>
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontStyle: 'italic',
            }}
          >
            🎮 Play & Have Fun!
          </Typography>
        </Box>

        {/* Game Grid */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} lg={4} key={game.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
                  },
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '80px',
                  }}
                >
                  {game.icon}
                </CardMedia>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {game.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {game.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={game.difficulty}
                      size="small"
                      sx={{
                        background: getDifficultyColor(game.difficulty),
                        color: '#fff',
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    fullWidth
                    onClick={() => navigate(`/game/${game.id}`)}
                    sx={{
                      background: 'linear-gradient(45deg, #4ECDC4 0%, #3AB0A8 100%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #3AB0A8 0%, #2E9B94 100%)',
                      }
                    }}
                  >
                    Play
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Coming Soon Message */}
        {games.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: '#fff', opacity: 0.8 }}>
              More games coming soon! 🎮
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
