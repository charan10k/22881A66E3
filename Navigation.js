// src/components/Navigation.js
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Log } from '../utils/logger';

const Navigation = () => {
  const location = useLocation();

  const handleNavClick = (path) => {
    Log('frontend', 'info', 'component', `Navigated to: ${path}`);
  };

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            onClick={() => handleNavClick('/')}
            sx={{
              backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Shorten URLs
          </Button>
          
          <Button
            color="inherit"
            component={RouterLink}
            to="/statistics"
            onClick={() => handleNavClick('/statistics')}
            sx={{
              backgroundColor: location.pathname === '/statistics' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 