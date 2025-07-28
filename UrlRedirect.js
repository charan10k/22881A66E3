// src/components/UrlRedirect.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Log } from '../utils/logger';
import { getUrlByShortcode, recordClick } from '../utils/urlService';

const UrlRedirect = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [urlData, setUrlData] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        Log('frontend', 'info', 'api', `Attempting redirect for shortcode: ${shortcode}`);
        
        // Get URL data from storage
        const url = getUrlByShortcode(shortcode);
        
        if (!url) {
          setError('URL not found');
          Log('frontend', 'error', 'api', `Shortcode not found: ${shortcode}`);
          setLoading(false);
          return;
        }

        // Check if URL is expired
        if (new Date(url.expiresAt) < new Date()) {
          setError('This URL has expired');
          Log('frontend', 'error', 'api', `Expired URL accessed: ${shortcode}`);
          setLoading(false);
          return;
        }

        setUrlData(url);

        // Record the click
        const source = document.referrer || 'direct';
        recordClick(shortcode, source);
        
        Log('frontend', 'info', 'api', `Redirecting to: ${url.originalUrl}`);
        
        // Redirect after a short delay to show the loading state
        setTimeout(() => {
          window.location.href = url.originalUrl;
        }, 1500);
        
      } catch (error) {
        setError('An error occurred while processing the redirect');
        Log('frontend', 'error', 'api', `Redirect error: ${error.message}`);
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortcode, navigate]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Redirecting...
          </Typography>
          {urlData && (
            <Typography variant="body1" color="text.secondary">
              You are being redirected to: {urlData.originalUrl}
            </Typography>
          )}
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/statistics')}
            >
              View Statistics
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return null;
};

export default UrlRedirect; 