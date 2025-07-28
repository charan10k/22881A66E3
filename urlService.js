// src/utils/urlService.js
import { Log } from './logger';

// Generate a random shortcode
export const generateShortcode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Validate URL format
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate shortcode format
export const isValidShortcode = (shortcode) => {
  return /^[a-zA-Z0-9]{3,10}$/.test(shortcode);
};

// Get stored URLs from localStorage
export const getStoredUrls = () => {
  try {
    const stored = localStorage.getItem('shortenedUrls');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    Log('frontend', 'error', 'utils', 'Failed to retrieve stored URLs');
    return [];
  }
};

// Save URLs to localStorage
export const saveUrls = (urls) => {
  try {
    localStorage.setItem('shortenedUrls', JSON.stringify(urls));
    Log('frontend', 'info', 'state', 'URLs saved to localStorage');
  } catch (error) {
    Log('frontend', 'error', 'state', 'Failed to save URLs to localStorage');
  }
};

// Add a new shortened URL
export const addShortenedUrl = (originalUrl, shortcode, validityMinutes = 30) => {
  const urls = getStoredUrls();
  
  // Check if shortcode already exists
  if (urls.some(url => url.shortcode === shortcode)) {
    throw new Error('Shortcode already exists');
  }

  const newUrl = {
    id: Date.now().toString(),
    originalUrl,
    shortcode,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + validityMinutes * 60000).toISOString(),
    clicks: [],
    isValid: true
  };

  urls.push(newUrl);
  saveUrls(urls);
  Log('frontend', 'info', 'api', `New URL shortened: ${shortcode}`);
  
  return newUrl;
};

// Record a click on a shortened URL
export const recordClick = (shortcode, source = 'direct') => {
  const urls = getStoredUrls();
  const urlIndex = urls.findIndex(url => url.shortcode === shortcode);
  
  if (urlIndex === -1) {
    Log('frontend', 'error', 'api', `Click recorded for non-existent shortcode: ${shortcode}`);
    return null;
  }

  const click = {
    timestamp: new Date().toISOString(),
    source,
    location: 'Unknown' // In a real app, this would be determined by IP geolocation
  };

  urls[urlIndex].clicks.push(click);
  saveUrls(urls);
  Log('frontend', 'info', 'api', `Click recorded for shortcode: ${shortcode}`);
  
  return urls[urlIndex];
};

// Get URL by shortcode
export const getUrlByShortcode = (shortcode) => {
  const urls = getStoredUrls();
  return urls.find(url => url.shortcode === shortcode);
};

// Clean up expired URLs
export const cleanupExpiredUrls = () => {
  const urls = getStoredUrls();
  const now = new Date();
  const validUrls = urls.filter(url => new Date(url.expiresAt) > now);
  
  if (validUrls.length !== urls.length) {
    saveUrls(validUrls);
    Log('frontend', 'info', 'utils', 'Expired URLs cleaned up');
  }
  
  return validUrls;
}; 