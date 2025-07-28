// src/components/Statistics.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Grid
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { Log } from '../utils/logger';
import { getStoredUrls, cleanupExpiredUrls } from '../utils/urlService';

const Statistics = () => {
  const [urls, setUrls] = useState([]);
  const [expandedUrl, setExpandedUrl] = useState(null);

  useEffect(() => {
    // Clean up expired URLs and load current data
    cleanupExpiredUrls();
    const storedUrls = getStoredUrls();
    setUrls(storedUrls);
    
    Log('frontend', 'info', 'component', 'Statistics component mounted');
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Log('frontend', 'info', 'component', 'URL copied to clipboard from statistics');
  };

  const getShortenedUrl = (shortcode) => {
    return `${window.location.origin}/${shortcode}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const getStatusColor = (expiresAt) => {
    if (isExpired(expiresAt)) return 'error';
    const timeLeft = new Date(expiresAt) - new Date();
    if (timeLeft < 300000) return 'warning'; // Less than 5 minutes
    return 'success';
  };

  const getStatusText = (expiresAt) => {
    if (isExpired(expiresAt)) return 'Expired';
    const timeLeft = new Date(expiresAt) - new Date();
    const minutes = Math.floor(timeLeft / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Expires in ${days} day(s)`;
    if (hours > 0) return `Expires in ${hours} hour(s)`;
    return `Expires in ${minutes} minute(s)`;
  };

  const handleAccordionChange = (urlId) => (event, isExpanded) => {
    setExpandedUrl(isExpanded ? urlId : null);
    if (isExpanded) {
      Log('frontend', 'info', 'state', `Expanded details for URL: ${urlId}`);
    }
  };

  if (urls.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          URL Statistics
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          No shortened URLs found. Create some URLs first to see statistics.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        URL Statistics
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          All Shortened URLs ({urls.length})
        </Typography>
        
        {urls.map((url) => (
          <Accordion
            key={url.id}
            expanded={expandedUrl === url.id}
            onChange={handleAccordionChange(url.id)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" component="div">
                    {getShortenedUrl(url.shortcode)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {url.originalUrl}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={`${url.clicks.length} clicks`}
                    size="small"
                    color="info"
                    icon={<VisibilityIcon />}
                  />
                  <Chip
                    label={getStatusText(url.expiresAt)}
                    size="small"
                    color={getStatusColor(url.expiresAt)}
                    icon={<TimeIcon />}
                  />
                  <Tooltip title="Copy URL">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(getShortenedUrl(url.shortcode));
                      }}
                    >
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <Card variant="outlined">
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        URL Details
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell><strong>Original URL:</strong></TableCell>
                              <TableCell>{url.originalUrl}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Shortcode:</strong></TableCell>
                              <TableCell>{url.shortcode}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Created:</strong></TableCell>
                              <TableCell>{formatDate(url.createdAt)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Expires:</strong></TableCell>
                              <TableCell>{formatDate(url.expiresAt)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Total Clicks:</strong></TableCell>
                              <TableCell>{url.clicks.length}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Click Analytics
                      </Typography>
                      
                      {url.clicks.length === 0 ? (
                        <Alert severity="info">
                          No clicks recorded yet for this URL.
                        </Alert>
                      ) : (
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Location</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {url.clicks.map((click, index) => (
                                <TableRow key={index}>
                                  <TableCell>{formatDate(click.timestamp)}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={click.source}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <LocationIcon fontSize="small" />
                                      {click.location}
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Container>
  );
};

export default Statistics; 