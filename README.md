# URL Shortener - React Application

A comprehensive URL shortening application built with React and Material UI, featuring client-side data persistence, analytics, and user-friendly interface.

## Features

- **Multiple URL Shortening**: Shorten up to 5 URLs concurrently
- **Custom Shortcodes**: Optional custom shortcodes with validation
- **Validity Period**: Configurable expiration time (default: 30 minutes)
- **Click Analytics**: Track clicks with timestamps, sources, and locations
- **Client-side Routing**: Handle shortened URL redirections
- **Statistics Dashboard**: Comprehensive analytics view
- **Material UI Design**: Modern, responsive interface
- **Logging Integration**: Mandatory logging middleware integration

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Access Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/
│   ├── Navigation.js      # App navigation bar
│   ├── UrlShortener.js    # Main URL shortening interface
│   ├── Statistics.js      # Analytics dashboard
│   └── UrlRedirect.js     # URL redirection handler
├── utils/
│   ├── logger.js          # Logging middleware integration
│   └── urlService.js      # URL management and storage
├── App.js                 # Main application component
└── index.js              # Application entry point
```

## Key Features Implementation

### URL Shortening
- Support for up to 5 concurrent URLs
- Client-side validation for URLs and shortcodes
- Optional custom shortcodes (3-10 alphanumeric characters)
- Configurable validity period (default: 30 minutes)

### Data Persistence
- Client-side storage using localStorage
- Automatic cleanup of expired URLs
- Persistent data across browser sessions

### Analytics
- Click tracking with timestamps
- Source tracking (referrer information)
- Geographical location tracking (simulated)
- Detailed statistics dashboard

### Routing
- Client-side routing with React Router
- Dynamic shortcode handling (`/:shortcode`)
- Proper error handling for invalid/expired URLs

### Logging
- Integration with required logging middleware
- Comprehensive logging for all user actions
- Error tracking and debugging support

## Technical Stack

- **React 18**: Modern React with hooks
- **Material UI 5**: Component library and theming
- **React Router 6**: Client-side routing
- **localStorage**: Client-side data persistence
- **Custom Logging**: Integration with evaluation service

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development Notes

- Application runs on `http://localhost:3000` as required
- All data is stored client-side in localStorage
- No backend API required - fully client-side implementation
- Responsive design for mobile and desktop
- Comprehensive error handling and user feedback 