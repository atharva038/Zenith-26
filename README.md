# 🏆 ZENITH 2026 - Sports Festival Platform

![Zenith 2026](https://img.shields.io/badge/Zenith-2026-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)

**SGGSIE&T Annual Sports Festival** - A full-stack web platform for managing sports event registrations, admin operations, and showcasing tournament information with stunning 3D visuals.

## ✨ Key Features

### 🎬 Immersive Experience
- **3D Cinematic Intro** - Three.js powered intro with cricket player animation and stadium environment
- **GSAP Animation Timeline** - Smooth, sequenced animations (player swing → ball flight → impact → logo reveal)
- **Particle Effects** - Dynamic particle bursts and visual effects
- **Smart Fallback** - 2D version for mobile/low-end devices

### 🎮 Event Management
- **Multi-Sport Support** - Cricket, Volleyball, Chess, E-Games, Athletics, Badminton, and more
- **Women's Tournament** - Dedicated registration system with 3 categories
- **Event Registration** - Universal registration system for all sports events
- **Payment Integration** - Screenshot-based payment verification with Cloudinary
- **Gallery Management** - Admin-controlled event photo gallery

### 👨‍💻 Admin Panel
- **Dashboard** - Real-time statistics and overview
- **Registration Management** - Approve/reject registrations with status tracking
- **Admin Management** - Multi-admin system with role-based access
- **Analytics** - Comprehensive analytics for registrations and events
- **Media Management** - Upload and manage images via Cloudinary

### 🎨 Design & UX
- **Neon Aesthetic** - Futuristic neon blue/orange color scheme
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Smooth Animations** - Framer Motion page transitions
- **Custom Fonts** - Orbitron & Rajdhani (sporty, futuristic)

## 📁 Project Structure

```
Zenith-26/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── config/          # Configuration files
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js + Express backend
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── services/           # Business logic
│   ├── config/             # Server configuration
│   ├── scripts/            # Utility scripts
│   └── package.json
├── scripts/                # Deployment & maintenance scripts
├── docs/                   # Documentation files
└── README.md              # This file
```

## 🚀 Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion, GSAP, Lottie
- **3D Graphics:** Three.js + React Three Fiber
- **Routing:** React Router DOM v6
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Notifications:** React Toastify

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer
- **Security:** bcrypt, helmet, cors

## 📦 Installation

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Clone Repository
```bash
git clone https://github.com/atharva038/Zenith-26.git
cd Zenith-26
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure MongoDB URI, JWT secret, Cloudinary credentials
npm run dev
```

Backend runs at: `http://localhost:5000`

## 🔧 Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000  # Development
# Production will auto-detect
```

### Backend (`backend/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/zenith26
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

NODE_ENV=development
PORT=5000
```

## 🛠️ Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Start with nodemon
npm start            # Start production server
```

### Utility Scripts
```bash
# Create admin account
cd backend && node scripts/createAdmin.js

# Reset admin password
cd backend && node scripts/resetAdminPassword.js

# Upload images to Cloudinary
cd backend && node scripts/upload1stCategoryImages.js

# Deploy to production
./scripts/deploy.sh
```

See [`backend/scripts/README.md`](backend/scripts/README.md) and [`scripts/README.md`](scripts/README.md) for more details.

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/admins` - List all admins
- `DELETE /api/admin/admins/:id` - Delete admin

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create event (admin)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event (admin)

### Registrations
- `POST /api/registrations` - Create registration
- `GET /api/registrations` - List registrations (admin)
- `PATCH /api/registrations/:id/status` - Update status (admin)

### Women's Tournament
- `POST /api/women-tournament/register` - Register for tournament
- `GET /api/women-tournament/admin/registrations` - Get all registrations (admin)
- `PATCH /api/women-tournament/:id/status` - Update registration status (admin)

### Media
- `POST /api/media/upload` - Upload image to Cloudinary
- `GET /api/media` - List all media (admin)

See API documentation for complete endpoint list.

## 📱 Pages & Routes

### Public Routes
- `/` - Cinematic intro animation
- `/home` - Homepage with events overview
- `/gameverse` - Sports categories showcase
- `/events` - All events listing
- `/events/:id` - Event registration
- `/women-tournament` - Women's tournament registration
- `/gallery` - Photo gallery

### Admin Routes (Protected)
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Overview & statistics
- `/admin/events` - Event management
- `/admin/women-tournament` - Women's tournament admin
- `/admin/admins` - Admin management
- `/admin/gallery` - Gallery management
- `/admin/settings` - Configuration settings

## 🎨 Design System

### Colors
- **Primary:** `#00d4ff` (Neon Blue)
- **Secondary:** `#ff6b35` (Neon Orange)
- **Accent:** `#00ffff` (Electric Cyan)
- **Background:** `#0a0a0a` (Dark)
- **Text:** `#ffffff` (White)

### Typography
- **Headings:** Orbitron (Geometric, Futuristic)
- **Body:** Rajdhani (Clean, Modern, Sporty)

## 🧪 Testing

### Reset Intro Animation
```javascript
// In browser console
localStorage.removeItem('introPlayed');
// Refresh page
```

### Test Women's Tournament
```bash
./scripts/test-women-tournament.sh
```

## 📝 Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Backend Scripts](./backend/scripts/README.md)
- [Deployment Scripts](./scripts/README.md)
- [Payment Integration](./docs/PAYMENT_SCREENSHOT_CLOUDINARY.md)
- [Tab Position Fix](./docs/TAB_POSITION_FUNNEL_FIX.md)

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build
# Deploy dist/ folder

# Backend
cd backend
npm start
# Or use PM2: pm2 start ecosystem.config.json
```

### Using Deploy Script
```bash
./scripts/deploy.sh
```

### Environment Detection
The app automatically detects environment:
- **Development:** Uses `http://localhost:5000`
- **Production:** Uses `https://zenithapp-5onhx.ondigitalocean.app`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- SGGSIE&T for organizing Zenith 2026
- All contributors and participants
- Open source community

## 📞 Contact

- **Email:** zenith@sggs.ac.in
- **GitHub:** [@atharva038](https://github.com/atharva038)

---

**Made with ❤️ for Zenith 2026**

*Where Champions Rise* 🏆
