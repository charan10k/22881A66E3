# URL Shortener - Design Document

## Architectural and Code Design Choices

### 1. Application Architecture

**React Component-Based Architecture**
- **Rationale**: Chose React for its component reusability, state management capabilities, and extensive ecosystem
- **Structure**: Modular component architecture with clear separation of concerns
- **State Management**: React hooks (useState, useEffect) for local state management
- **Routing**: React Router for client-side navigation and URL handling

**Component Hierarchy**:
```
App
├── Navigation
├── UrlShortener (Home page)
├── Statistics
└── UrlRedirect (Dynamic routing)
```

### 2. Data Modeling (Client-Side Persistence)

**localStorage-Based Storage Strategy**
- **Rationale**: Requirements specify client-side persistence without backend dependencies
- **Data Structure**:
```javascript
{
  id: string,
  originalUrl: string,
  shortcode: string,
  createdAt: ISO string,
  expiresAt: ISO string,
  clicks: [
    {
      timestamp: ISO string,
      source: string,
      location: string
    }
  ],
  isValid: boolean
}
```

**Key Design Decisions**:
- **Unique IDs**: Timestamp-based IDs for reliable identification
- **Expiration Handling**: ISO date strings for precise time management
- **Click Tracking**: Array of click objects with comprehensive metadata
- **Validation**: Built-in validation flags for data integrity

### 3. Technology Selections and Justifications

**Material UI (MUI)**
- **Rationale**: Mandatory requirement - no ShadCN or other CSS libraries allowed
- **Benefits**: 
  - Comprehensive component library
  - Built-in theming system
  - Responsive design out-of-the-box
  - Accessibility features
  - Consistent design language

**React Router DOM**
- **Rationale**: Required for client-side routing and URL redirection handling
- **Implementation**: Dynamic routing with `/:shortcode` pattern
- **Benefits**: SEO-friendly URLs, browser history support, programmatic navigation

**localStorage API**
- **Rationale**: Client-side persistence requirement without external dependencies
- **Benefits**: No network latency, works offline, simple implementation
- **Limitations**: Storage limits, same-origin policy, no server-side backup

### 4. Routing Strategy for URL Handling/Redirection

**Client-Side Routing Architecture**:
```
/                    → UrlShortener component (home page)
/statistics          → Statistics component (analytics)
/:shortcode          → UrlRedirect component (dynamic routing)
```

**URL Redirection Flow**:
1. User accesses `http://localhost:3000/abc123`
2. React Router matches `/:shortcode` pattern
3. UrlRedirect component extracts shortcode parameter
4. Component queries localStorage for URL data
5. Validates expiration and records click
6. Redirects to original URL or shows error

**Error Handling**:
- Invalid shortcodes → "URL not found" message
- Expired URLs → "URL has expired" message
- Network errors → Graceful fallback with user feedback

### 5. Key Design Decisions

**URL Shortening Logic**:
- **Auto-generation**: 6-character alphanumeric shortcodes when custom not provided
- **Uniqueness**: Client-side validation prevents duplicate shortcodes
- **Validation**: Regex-based validation for custom shortcodes (3-10 alphanumeric chars)

**Concurrent URL Processing**:
- **Maximum 5 URLs**: Array-based state management with dynamic form fields
- **Batch Processing**: Sequential processing with individual error handling
- **User Experience**: Real-time validation and immediate feedback

**Analytics Implementation**:
- **Click Tracking**: Comprehensive metadata collection
- **Source Detection**: Document referrer analysis
- **Geographic Data**: Simulated location data (extensible for real implementation)
- **Time-based Analysis**: Precise timestamp recording

**Expiration Management**:
- **Automatic Cleanup**: Background cleanup of expired URLs
- **Visual Indicators**: Color-coded status chips
- **Graceful Degradation**: Clear messaging for expired URLs

### 6. Assumptions Made

**Technical Assumptions**:
- Modern browser support (ES6+, localStorage, fetch API)
- JavaScript enabled in user's browser
- No cross-origin restrictions for logging service
- Single-user application (no multi-tenancy)

**User Experience Assumptions**:
- Users prefer immediate feedback over batch processing
- Copy-to-clipboard functionality is expected
- Mobile-responsive design is essential
- Clear error messages improve user satisfaction

**Data Assumptions**:
- localStorage capacity is sufficient for typical usage
- URL data doesn't require encryption
- Click analytics don't need real-time synchronization
- Geographic location can be simulated initially

### 7. Scalability Considerations

**Current Limitations**:
- localStorage storage limits (~5-10MB)
- Single-user application
- No data backup or synchronization
- Limited geographic accuracy

**Future Enhancement Possibilities**:
- IndexedDB for larger storage capacity
- Service Workers for offline functionality
- Real geolocation API integration
- Backend integration for data persistence
- Multi-user support with authentication

### 8. Security Considerations

**Client-Side Security**:
- Input validation and sanitization
- XSS prevention through React's built-in protection
- No sensitive data storage
- Secure URL validation

**Data Privacy**:
- All data stored locally on user's device
- No external data transmission except logging
- User controls all data retention

### 9. Performance Optimizations

**Implemented Optimizations**:
- Lazy loading of components
- Efficient state management with React hooks
- Minimal re-renders through proper dependency arrays
- Optimized localStorage operations

**Monitoring and Logging**:
- Comprehensive logging integration as required
- Error tracking and debugging support
- User action analytics
- Performance monitoring capabilities

This design document outlines the complete architectural approach for the URL Shortener application, ensuring compliance with all specified requirements while maintaining code quality, user experience, and future extensibility. 