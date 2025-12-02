# Zenith 2026 - Admin Authentication System

## 🚀 Features

### Backend
- ✅ Express.js REST API
- ✅ MongoDB with Mongoose
- ✅ JWT Authentication
- ✅ Password hashing with bcrypt
- ✅ Admin signup/login endpoints
- ✅ Protected routes with middleware
- ✅ Dashboard statistics API

### Frontend
- ✅ Admin Login Page
- ✅ Admin Dashboard with sidebar navigation
- ✅ Protected routes
- ✅ Authentication context
- ✅ Theme-consistent design (dark with neon accents)
- ✅ Animated UI components

## 📦 Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

4. Create an admin account:
```bash
npm run create-admin
```

This will create a default admin with:
- Email: `admin@zenith2026.com`
- Password: `admin123`
- ⚠️ **Change the password after first login!**

5. Start the server:
```bash
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎯 API Endpoints

### Auth Routes (`/api/auth`)
- `POST /api/auth/login` - Login admin
- `GET /api/auth/profile` - Get admin profile (protected)
- `PUT /api/auth/profile` - Update admin profile (protected)

### Admin Routes (`/api/admin`)
- `GET /api/admin/dashboard/stats` - Get dashboard statistics (protected)
- `GET /api/admin/admins` - Get all admins (protected)
- `DELETE /api/admin/admins/:id` - Delete admin (protected)

## 🌐 Frontend Routes

- `/` - Cinematic Intro
- `/home` - Homepage
- `/gameverse` - GameVerse (Sports Universe)
- `/admin/login` - Admin Login
- `/admin/dashboard` - Admin Dashboard (protected)

## 🎨 Theme

The admin portal maintains the Zenith 2026 theme:
- **Colors**: Neon Blue (#00d4ff), Neon Orange (#ff6b35), Electric Cyan (#00ffff)
- **Fonts**: Orbitron (headings), Rajdhani (body)
- **Style**: Dark futuristic with glowing accents and animated elements

## 🔐 Authentication Flow

1. Admin is created using `npm run create-admin` script
2. Admin visits `/admin/login` to sign in
3. JWT token is stored in localStorage
4. Protected routes check for valid token
5. Admin can logout from dashboard

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

### Frontend
- React
- React Router
- Framer Motion
- Tailwind CSS
- Axios

## 📝 Default Admin Credentials

After running `npm run create-admin`, use:
- **Email**: `admin@zenith2026.com`
- **Password**: `admin123`

⚠️ **Change the password after first login!**

You can also create additional admins through the dashboard.

## 🔄 Development

Both servers support hot-reload:
- Backend: Uses nodemon (run with `npm run dev`)
- Frontend: Uses Vite HMR

## 📱 Responsive Design

The admin portal is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## ⚡ Performance

- Lazy loading of components
- Optimized animations with Framer Motion
- Efficient state management with Context API
- Indexed MongoDB queries

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Protected API routes
- Input validation with express-validator
- CORS configuration
- Environment variable protection

## 🚧 Coming Soon

- Events Management
- Gallery Management
- Settings Panel
- Multi-factor Authentication
- Email Notifications
- Activity Logs

---

Made with ❤️ for Zenith 2026
