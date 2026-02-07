# 📊 API Monitor - Developer Portal Tool

## Overview

The **API Monitor** is a real-time monitoring dashboard that tracks all API requests and responses in your application. It provides insights into request performance, success rates, and helps debug API issues.

## Access

**URL**: `/dev/api-monitor`  
**Navigation**: Developer Portal → API Monitor  
**Authentication**: Admin authentication required

## Features

### 📈 Real-Time Statistics Dashboard

Four key metric cards display:

1. **Total Requests**
   - Count of all API calls
   - Updates in real-time

2. **Successful Requests**
   - 2xx status codes
   - Success rate percentage

3. **Error Requests**
   - 4xx and 5xx status codes
   - Error rate percentage

4. **Average Response Time**
   - Mean response time in milliseconds
   - Performance indicator

### 🔍 Request Filtering

Filter logs by status:
- **All**: View all API requests
- **Success**: Only successful requests (200-299)
- **Errors**: Only failed requests (400-599)

### 🔄 Auto-Refresh Mode

- **Toggle**: Enable/disable automatic refresh
- **Interval**: Updates every 5 seconds
- **Visual Indicator**: Spinning icon when active
- **Use Case**: Monitor live API activity

### 📋 Request Log Table

Displays detailed information for each request:

| Column | Description |
|--------|-------------|
| **Method** | HTTP method (GET, POST, PUT, DELETE) |
| **Endpoint** | API endpoint path |
| **Status** | HTTP status code with color coding |
| **Response Time** | Request duration in milliseconds |
| **Timestamp** | When the request was made |
| **Actions** | View detailed information |

### 🎨 Color-Coded Status Indicators

**HTTP Methods:**
- GET: Blue
- POST: Green
- PUT: Yellow
- DELETE: Red

**Status Codes:**
- 200-299: Green (Success)
- 400-499: Yellow (Client Error)
- 500-599: Red (Server Error)

**Response Times:**
- < 500ms: Green (Fast)
- 500-1000ms: Yellow (Moderate)
- > 1000ms: Red (Slow)

### 🔎 Detailed Log Viewer

Click "View Details" on any request to see:
- Complete request URL
- HTTP method and status code
- Response time
- Full timestamp
- Request body (if any)
- Response body
- User agent information

### 💾 Export & Management

**Export Logs:**
- Download logs as JSON file
- Includes filtered results
- Timestamped filename

**Clear Logs:**
- Remove all logged requests
- Confirmation prompt
- Resets statistics

## Usage Examples

### Monitor API Performance
1. Enable auto-refresh
2. Filter by "All"
3. Watch response times
4. Identify slow endpoints (>1000ms in red)

### Debug Failed Requests
1. Filter by "Errors"
2. Click "View Details" on failed request
3. Examine request/response bodies
4. Check status code and error message

### Track Success Rate
1. View "Successful" stat card
2. Check percentage next to count
3. Compare against "Errors" card
4. Monitor trends over time

### Export for Analysis
1. Set desired filter (all/success/error)
2. Click "Export" button
3. Download JSON file
4. Analyze in external tools

## Visual Guide

```
┌─────────────────────────────────────────────────────┐
│  API Monitor                      [Auto-refresh ON] │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Total   │ │ Success  │ │  Errors  │ │  Avg   │ │
│  │   250    │ │   230    │ │    20    │ │ 125ms  │ │
│  │          │ │   92%    │ │    8%    │ │        │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
├─────────────────────────────────────────────────────┤
│  Filter: [All] [Success] [Errors]  [Export] [Clear]│
├─────────────────────────────────────────────────────┤
│  Method  Endpoint           Status  Time  Timestamp │
│  [GET]   /api/settings/... [200]   45ms  2m ago    │
│  [POST]  /api/auth/login   [200]   234ms 5m ago    │
│  [GET]   /api/registr...   [500]   1203ms 10m ago  │
└─────────────────────────────────────────────────────┘
```

## Demo Data

The current implementation uses **mock data** for demonstration. In production, this would be connected to:

- Backend logging service
- Real-time API request tracking
- Database for log persistence
- WebSocket for live updates

### Sample Log Structure

```json
{
  "id": 1,
  "method": "GET",
  "endpoint": "/api/settings/status",
  "status": 200,
  "responseTime": 45,
  "timestamp": "2026-02-07T23:30:00.000Z",
  "requestBody": null,
  "responseBody": {
    "success": true,
    "isOpen": true
  },
  "userAgent": "Mozilla/5.0..."
}
```

## Integration Guide

### Backend Implementation (Future)

To connect to real API monitoring:

1. **Create Logging Middleware**
```javascript
// backend/middleware/apiLogger.js
const logApiRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log to database or service
    ApiLog.create({
      method: req.method,
      endpoint: req.path,
      status: res.statusCode,
      responseTime: duration,
      requestBody: req.body,
      responseBody: res.locals.data,
      userAgent: req.get('user-agent'),
      timestamp: new Date()
    });
  });
  
  next();
};
```

2. **Create API Endpoint**
```javascript
// backend/routes/dev.routes.js
router.get('/api/dev/logs', verifyToken, isAdmin, async (req, res) => {
  const { filter, limit = 100 } = req.query;
  
  let query = {};
  if (filter === 'success') query.status = { $gte: 200, $lt: 300 };
  if (filter === 'error') query.status = { $gte: 400 };
  
  const logs = await ApiLog.find(query)
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));
    
  const stats = await calculateStats();
  
  res.json({ success: true, logs, stats });
});
```

3. **Frontend Integration**
```javascript
// Replace fetchLogs() in DevApiMonitor.jsx
const fetchLogs = async () => {
  try {
    setLoading(true);
    const response = await api.get('/dev/logs', {
      params: { filter },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
    
    if (response.data.success) {
      setLogs(response.data.logs);
      setStats(response.data.stats);
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    toast.error('Failed to fetch API logs');
  } finally {
    setLoading(false);
  }
};
```

## Security Considerations

✅ **Admin-only access**: Protected by authentication middleware  
✅ **Sensitive data**: Consider redacting passwords, tokens in logs  
✅ **Data retention**: Implement automatic log cleanup (e.g., 7 days)  
✅ **Performance**: Use pagination for large datasets  
✅ **Privacy**: Comply with data protection regulations

## Benefits

1. **Real-time Monitoring**: See API activity as it happens
2. **Performance Insights**: Identify slow endpoints quickly
3. **Error Detection**: Spot and debug failed requests
4. **Data Export**: Analyze logs in external tools
5. **User-Friendly**: Clean UI with color-coded indicators

## Future Enhancements

Potential features to add:

- 📊 **Charts & Graphs**: Visualize request trends over time
- 🔔 **Alerts**: Notifications for high error rates or slow responses
- 🔍 **Advanced Filtering**: By endpoint, date range, user
- 📝 **Request Replay**: Resend requests for testing
- 🌐 **WebSocket Integration**: Real-time log streaming
- 💾 **Persistent Storage**: Database-backed log retention
- 📈 **Performance Metrics**: P95, P99 latency tracking
- 🔗 **Request Tracing**: Track request flow through microservices

## Status

✅ **Current**: Fully functional UI with mock data  
🔄 **Next Step**: Backend integration for real logging  
🎯 **Goal**: Complete API monitoring solution

---

**Related Documentation:**
- `DEV_PORTAL_IMPLEMENTATION.md` - Developer Portal setup
- `DEV_PORTAL_QUICK_REFERENCE.md` - Quick access guide
