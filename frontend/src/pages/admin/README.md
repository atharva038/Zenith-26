# Admin Pages

This folder contains all administrative pages for the Zenith-26 event management system.

## 📁 Pages

### Authentication
- **AdminLogin.jsx** - Admin authentication page

### Dashboard & Overview
- **AdminDashboard.jsx** - Main admin dashboard with navigation and overview

### Event Management
- **AdminMarathon.jsx** - Marathon event management (registrations, participants, T-shirt distribution)
- **AdminWomenTournament.jsx** - Women's tournament management
- **AdminOnSpotRegistration.jsx** - On-spot event registration system

### Content Management
- **AdminGallery.jsx** - Photo gallery management
- **AdminMediaUpload.jsx** - Media upload interface (standalone)

### System Administration
- **AdminAdmins.jsx** - Admin user management
- **AdminSettings.jsx** - System settings and configuration

## 🚀 Usage

Import admin pages in your routing configuration:

```jsx
// Individual imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Or use centralized exports
import {
  AdminLogin,
  AdminDashboard,
  AdminMarathon,
  AdminWomenTournament,
  AdminOnSpotRegistration,
  AdminAdmins,
  AdminGallery,
  AdminSettings
} from './pages/admin';
```

## 🔐 Protected Routes

All admin pages (except AdminLogin) should be wrapped with `ProtectedRoute` component:

```jsx
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

## 📝 Notes

- All pages require admin authentication
- Session management handled by `AuthContext`
- API calls use the `/api/admin/*` endpoints
- Real-time updates where applicable
