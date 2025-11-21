# Development Guide - Zenith 2026

This guide will help you set up and run the Zenith 2026 project on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Zenith-26.git
cd Zenith-26
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

#### Frontend Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### 3. Backend Setup (Coming Soon)

```bash
# Navigate to backend directory
cd backend

# Backend setup instructions will be added here
```

## 🏗️ Project Structure

```
Zenith-26/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   └── StadiumIntro.jsx
│   │   ├── pages/             # Page components
│   │   │   └── Homepage.jsx
│   │   ├── context/           # React context providers
│   │   │   └── ThemeContext.jsx
│   │   ├── assets/            # Static assets
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── public/                # Public static files
│   ├── index.html             # HTML template
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite configuration
│   └── tailwind.config.js     # Tailwind CSS config
│
├── backend/                   # Backend server (coming soon)
│   └── README.md
│
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

## 🎨 Frontend Features

### Current Features
- ✅ **4-Stage Intro Animation**
  - Zenith Logo (5 seconds)
  - Football Goal (4 seconds)
  - Trophy (2 seconds)
  - Big Zenith Logo (3 seconds)
  
- ✅ **Dark/Light Theme**
  - Seamless theme switching
  - Persistent theme preference
  - System preference detection

- ✅ **Interactive Homepage**
  - Custom cursor (desktop)
  - Animated background
  - Sports categories grid
  - Smooth scroll animations
  - Responsive design

### Technologies Used
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- Lottie Animations
- React Router DOM

## 🔧 Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR. Any changes you make will reflect immediately in the browser without losing component state.

### ESLint Configuration
The project uses ESLint for code quality. Run `npm run lint` to check for issues.

### Theme Development
The theme system is managed through `ThemeContext.jsx`. You can customize colors in:
- `tailwind.config.js` - Define theme colors
- `index.css` - Custom CSS variables

### Adding New Lottie Animations
1. Upload your animation to [Lottie Files](https://lottiefiles.com/)
2. Get the hosted URL
3. Use `<DotLottieReact src="your-url" />` component

## 📱 Responsive Breakpoints

```css
sm: 640px      /* Small devices */
md: 768px      /* Medium devices */
lg: 1024px     /* Large devices */
xl: 1280px     /* Extra large devices */
2xl: 1536px    /* 2X large devices */
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
cd frontend
npm run build
```

The `dist` folder will contain production-ready files.

### Environment Variables
Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:3000/api
```

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [GSAP](https://greensock.com/gsap/)

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -m 'Add some feature'`
4. Push: `git push origin feature/your-feature`
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**Happy Coding! 🚀**

*For Zenith 2026 - Where Champions Rise* 🏆
