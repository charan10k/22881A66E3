// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Log } from './utils/logger';
import Navigation from './components/Navigation';
import UrlShortener from './components/UrlShortener';
import Statistics from './components/Statistics';
import UrlRedirect from './components/UrlRedirect';

// Create Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  useEffect(() => {
    Log('frontend', 'info', 'page', 'React URL Shortener application started');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<UrlShortener />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/:shortcode" element={<UrlRedirect />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 