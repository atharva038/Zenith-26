# Media Team Pages

This folder contains pages for the Media Team dashboard and authentication.

## 📁 Pages

- **MediaTeamLogin.jsx** - Media team authentication
- **MediaTeamDashboard.jsx** - Media team dashboard for uploading and managing event photos

## 🚀 Usage

```jsx
import MediaTeamLogin from './pages/media-team/MediaTeamLogin';
import MediaTeamDashboard from './pages/media-team/MediaTeamDashboard';

// Or use centralized exports
import { MediaTeamLogin, MediaTeamDashboard } from './pages/media-team';
```

## 🔐 Access

Media team members have limited access compared to admins:
- Can upload photos to gallery
- Can manage their uploaded content
- Cannot access admin dashboard or user data
