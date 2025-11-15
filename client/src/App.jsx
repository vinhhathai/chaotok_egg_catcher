import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import GameList from './pages/GameList/GameList';
import GameFrame from './components/GameFrame/GameFrame';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4ECDC4',
    },
    secondary: {
      main: '#3AB0A8',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/games" replace />} />
          <Route path="/games" element={<GameList />} />
          <Route path="/game/:gameId" element={<GameFrame />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
