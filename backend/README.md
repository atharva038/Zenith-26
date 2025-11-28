# Zenith 2026 - Backend

Backend server for the Zenith 2026 Sports Festival Platform with Admin Panel for managing media content.

## ✨ Features Implemented

- 🔐 **Authentication System**

  - Admin user registration and login
  - JWT-based authentication with secure token management
  - Password hashing with bcrypt
  - Role-based access control (Admin only)
  - Protected routes and authorization

- � **Media Management (Glimpses)**

  - Upload images and videos to Cloudinary
  - Store Cloudinary URLs in MongoDB for optimized frontend loading
  - Support for multiple file formats (JPEG, PNG, GIF, WebP, MP4, etc.)
  - Automatic thumbnail generation for videos
  - Image optimization and transformation
  - Categorization and tagging system
  - Search and filter functionality
  - Media statistics and analytics

- 🛡️ **Security Features**

  - Helmet.js for security headers
  - CORS configuration
  - Rate limiting to prevent abuse
  - Input validation and sanitization
  - File type and size validation
  - Secure cookie handling

- � **API Features**
  - RESTful API design
  - Comprehensive error handling
  - Request validation
  - Pagination support
  - File upload with Multer
  - Cloudinary integration for media storage

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary
- **File Upload:** Multer
- **Validation:** Express-validator
- **Security:** Helmet, CORS, bcryptjs
- **Utilities:** Morgan (logging), Compression, Cookie-parser

## 📁 Planned Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── app.js           # Express app setup
├── tests/               # Test files
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier available)

### Installation

1. **Clone the repository and navigate to backend folder**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/zenith2026
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/zenith2026

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Configuration (Default credentials)
ADMIN_EMAIL=admin@zenith2026.com
ADMIN_PASSWORD=Admin@2026

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

4. **Start the server**

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

5. **Test the API**

Open browser or Postman and visit:

```
http://localhost:5000/api/health
```

### Default Admin Credentials

After starting the server for the first time, a default admin account will be created:

- **Email:** admin@zenith2026.com
- **Password:** Admin@2026

⚠️ **Important:** Change these credentials immediately after first login!

## 📝 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register Admin

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

#### 2. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin@123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt-token-here"
  }
}
```

#### 3. Get Current User

```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### 4. Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

#### 5. Change Password

```http
PUT /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

#### 6. Logout

```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### Media Endpoints

#### 1. Upload Media (Admin Only)

```http
POST /api/media/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: [image/video file]
- title: "Event Photo"
- description: "Description here"
- category: "event" | "sports" | "ceremony" | "participants" | "other"
- tags: "tag1,tag2,tag3"

Response:
{
  "success": true,
  "message": "Media uploaded successfully",
  "data": {
    "media": {
      "_id": "...",
      "title": "Event Photo",
      "url": "cloudinary-url",
      "secureUrl": "secure-cloudinary-url",
      ...
    }
  }
}
```

#### 2. Get All Media (Public)

```http
GET /api/media?type=image&category=event&page=1&limit=20&search=keyword

Query Parameters:
- type: "image" | "video"
- category: "event" | "sports" | "ceremony" | "participants" | "other"
- isActive: true | false
- tags: "tag1,tag2"
- search: "search term"
- page: page number (default: 1)
- limit: items per page (default: 20, max: 100)
- sortBy: "createdAt" | "title" (default: "createdAt")
- sortOrder: "asc" | "desc" (default: "desc")

Response:
{
  "success": true,
  "data": {
    "media": [ ... ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pages": 5,
      "limit": 20
    }
  }
}
```

#### 3. Get Media by ID (Public)

```http
GET /api/media/:id
```

#### 4. Update Media (Admin Only)

```http
PUT /api/media/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "sports",
  "tags": "tag1,tag2",
  "isActive": true
}
```

#### 5. Delete Media (Admin Only)

```http
DELETE /api/media/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Media deleted successfully"
}
```

#### 6. Get Media Statistics (Admin Only)

```http
GET /api/media/admin/stats
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "stats": {
      "totalImages": 50,
      "totalVideos": 20,
      "totalMedia": 70,
      "totalSize": 524288000,
      "recentMedia": [ ... ]
    }
  }
}
```

### Health Check

```http
GET /api/health

Response:
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-11-22T..."
}
```

## 🔒 Environment Variables

| Variable                  | Description                 | Required | Default                 |
| ------------------------- | --------------------------- | -------- | ----------------------- |
| `NODE_ENV`                | Environment mode            | No       | `development`           |
| `PORT`                    | Server port                 | No       | `5000`                  |
| `MONGODB_URI`             | MongoDB connection string   | Yes      | -                       |
| `JWT_SECRET`              | Secret key for JWT          | Yes      | -                       |
| `JWT_EXPIRE`              | JWT expiration time         | No       | `7d`                    |
| `JWT_COOKIE_EXPIRE`       | Cookie expiration in days   | No       | `7`                     |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name       | Yes      | -                       |
| `CLOUDINARY_API_KEY`      | Cloudinary API key          | Yes      | -                       |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret       | Yes      | -                       |
| `ADMIN_EMAIL`             | Default admin email         | No       | `admin@zenith2026.com`  |
| `ADMIN_PASSWORD`          | Default admin password      | No       | `Admin@2026`            |
| `FRONTEND_URL`            | Frontend URL for CORS       | No       | `http://localhost:5173` |
| `MAX_FILE_SIZE`           | Max upload size in bytes    | No       | `10485760` (10MB)       |
| `RATE_LIMIT_WINDOW`       | Rate limit window (minutes) | No       | `15`                    |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window     | No       | `100`                   |

## 🔗 Getting Cloudinary Credentials

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Navigate to Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret
5. Paste them in your `.env` file

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

```bash
# Install MongoDB locally
# Then use:
MONGODB_URI=mongodb://localhost:27017/zenith2026
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/zenith2026
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:ci
```

## 📂 Project Structure Explained

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── cloudinary.js    # Cloudinary setup
│   │   ├── jwt.js           # JWT configuration
│   │   └── upload.js        # File upload settings
│   ├── controllers/         # Route controllers (request handlers)
│   │   ├── auth.controller.js
│   │   └── media.controller.js
│   ├── models/              # Database schemas
│   │   ├── User.js          # Admin user model
│   │   └── Media.js         # Media model
│   ├── routes/              # API routes
│   │   ├── auth.routes.js   # Authentication routes
│   │   ├── media.routes.js  # Media routes
│   │   └── index.js         # Route aggregator
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── errorHandler.js  # Global error handler
│   │   ├── upload.js        # File upload middleware
│   │   └── validate.js      # Input validation
│   ├── services/            # Business logic
│   │   ├── auth.service.js      # Auth operations
│   │   ├── cloudinary.service.js # Cloudinary operations
│   │   └── media.service.js     # Media operations
│   ├── utils/               # Utility functions
│   │   ├── responseHandler.js   # Standard API responses
│   │   ├── createAdmin.js       # Default admin creation
│   │   └── asyncHandler.js      # Async error wrapper
│   └── app.js               # Express app setup & entry point
├── tests/                   # Test files
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies & scripts
└── README.md              # This file
```

## 🚦 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message here"
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Prevent brute force attacks
- **CORS**: Configured for specific frontend origin
- **Helmet**: Security headers
- **File Validation**: Type and size checking
- **Secure Cookies**: HTTP-only cookies for tokens

## 🐛 Common Issues & Solutions

### 1. MongoDB Connection Error

```bash
# Make sure MongoDB is running
# For local MongoDB:
mongod

# Or check your MongoDB Atlas connection string
```

### 2. Cloudinary Upload Error

```bash
# Verify your Cloudinary credentials in .env
# Check if files are within size limit (10MB default)
```

### 3. JWT Token Error

```bash
# Make sure JWT_SECRET is set in .env
# Token might be expired (default: 7 days)
```

## � Frontend Integration

### Example: Fetching Media for Glimpses Page

```javascript
// Fetch all images for glimpses
const response = await fetch(
  "http://localhost:5000/api/media?type=image&isActive=true"
);
const data = await response.json();

// data.data.media contains array of media objects with Cloudinary URLs
data.data.media.forEach((item) => {
  console.log(item.secureUrl); // Use this URL in your frontend
});
```

### Example: Admin Login

```javascript
const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "admin@zenith2026.com",
    password: "Admin@2026",
  }),
});

const data = await response.json();
const token = data.data.token; // Store this token for authenticated requests
```

### Example: Upload Media (Admin)

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("title", "Event Photo");
formData.append("description", "Description");
formData.append("category", "event");
formData.append("tags", "sports,2026,event");

const response = await fetch("http://localhost:5000/api/media/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, // Token from login
  },
  body: formData,
});

const data = await response.json();
console.log(data.data.media.secureUrl); // Cloudinary URL
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Status:** ✅ Production Ready
**Version:** 1.0.0
**Last Updated:** November 2025
