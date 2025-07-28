// src/components/UrlShortener.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Log } from '../utils/logger';
import {
  generateShortcode,
  isValidUrl,
  isValidShortcode,
  addShortenedUrl,
  getStoredUrls,
  cleanupExpiredUrls
} from '../utils/urlService';

const UrlShortener = () => {
  const [urls, setUrls] = useState([
    { originalUrl: '', validityMinutes: 30, customShortcode: '' }
  ]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing shortened URLs
    const storedUrls = getStoredUrls();
    setShortenedUrls(storedUrls);
    
    // Clean up expired URLs
    cleanupExpiredUrls();
    
    Log('frontend', 'info', 'component', 'UrlShortener component mounted');
  }, []);

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { originalUrl: '', validityMinutes: 30, customShortcode: '' }]);
      Log('frontend', 'info', 'state', 'Added new URL input field');
    }
  };

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      Log('frontend', 'info', 'state', 'Removed URL input field');
    }
  };

  const updateUrl = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const validateInputs = () => {
    const newErrors = [];
    
    urls.forEach((url, index) => {
      if (url.originalUrl && !isValidUrl(url.originalUrl)) {
        newErrors[index] = { ...newErrors[index], originalUrl: 'Please enter a valid URL' };
      }
      
      if (url.customShortcode && !isValidShortcode(url.customShortcode)) {
        newErrors[index] = { ...newErrors[index], customShortcode: 'Shortcode must be 3-10 alphanumeric characters' };
      }
      
      if (url.validityMinutes && (isNaN(url.validityMinutes) || url.validityMinutes < 1)) {
        newErrors[index] = { ...newErrors[index], validityMinutes: 'Validity must be a positive number' };
      }
    });
    
    setErrors(newErrors);
    return newErrors.every(error => !error || Object.keys(error).length === 0);
  };

  const shortenUrls = async () => {
    if (!validateInputs()) {
      Log('frontend', 'error', 'api', 'URL shortening failed due to validation errors');
      return;
    }

    setLoading(true);
    const newShortenedUrls = [];
    const newErrors = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      if (!url.originalUrl.trim()) continue;

      try {
        const shortcode = url.customShortcode || generateShortcode();
        const validityMinutes = parseInt(url.validityMinutes) || 30;
        
        const shortenedUrl = addShortenedUrl(url.originalUrl, shortcode, validityMinutes);
        newShortenedUrls.push(shortenedUrl);
        
        Log('frontend', 'info', 'api', `Successfully shortened URL ${i + 1}`);
      } catch (error) {
        newErrors[i] = { general: error.message };
        Log('frontend', 'error', 'api', `Failed to shorten URL ${i + 1}: ${error.message}`);
      }
    }

    setShortenedUrls([...shortenedUrls, ...newShortenedUrls]);
    setErrors(newErrors);
    setLoading(false);

    // Reset form
    setUrls([{ originalUrl: '', validityMinutes: 30, customShortcode: '' }]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Log('frontend', 'info', 'component', 'URL copied to clipboard');
  };

  const getShortenedUrl = (shortcode) => {
    return `${window.location.origin}/${shortcode}`;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        URL Shortener
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Shorten URLs (Up to 5 concurrently)
        </Typography>
        
        {urls.map((url, index) => (
          <Card key={index} sx={{ mb: 2, p: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Original URL"
                    value={url.originalUrl}
                    onChange={(e) => updateUrl(index, 'originalUrl', e.target.value)}
                    placeholder="https://example.com"
                    error={!!errors[index]?.originalUrl}
                    helperText={errors[index]?.originalUrl}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    type="number"
                    value={url.validityMinutes}
                    onChange={(e) => updateUrl(index, 'validityMinutes', e.target.value)}
                    placeholder="30"
                    error={!!errors[index]?.validityMinutes}
                    helperText={errors[index]?.validityMinutes}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Custom Shortcode (optional)"
                    value={url.customShortcode}
                    onChange={(e) => updateUrl(index, 'customShortcode', e.target.value)}
                    placeholder="mycode"
                    error={!!errors[index]?.customShortcode}
                    helperText={errors[index]?.customShortcode}
                  />
                </Grid>
              </Grid>
              
              {errors[index]?.general && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors[index].general}
                </Alert>
              )}
            </CardContent>
            
            <CardActions>
              {urls.length > 1 && (
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => removeUrlField(index)}
                  color="error"
                  size="small"
                >
                  Remove
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {urls.length < 5 && (
            <Button
              startIcon={<AddIcon />}
              onClick={addUrlField}
              variant="outlined"
            >
              Add Another URL
            </Button>
          )}
          
          <Button
            onClick={shortenUrls}
            disabled={loading || !urls.some(url => url.originalUrl.trim())}
            variant="contained"
            size="large"
          >
            {loading ? 'Shortening...' : 'Shorten URLs'}
          </Button>
        </Box>
      </Paper>

      {shortenedUrls.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recently Shortened URLs
          </Typography>
          
          {shortenedUrls.slice(-5).reverse().map((url) => (
            <Card key={url.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Original: {url.originalUrl}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6" component="span">
                    {getShortenedUrl(url.shortcode)}
                  </Typography>
                  <Tooltip title="Copy URL">
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(getShortenedUrl(url.shortcode))}
                    >
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Expires: ${new Date(url.expiresAt).toLocaleString()}`}
                    size="small"
                    color="warning"
                  />
                  <Chip
                    label={`Clicks: ${url.clicks.length}`}
                    size="small"
                    color="info"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default UrlShortener; 