# Saraha App

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2+-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A robust, scalable REST API built with Express.js for secure user authentication, profile management, messaging, and file uploads. Designed for modern web applications with comprehensive security features and clean architecture.

## 🚀 Overview

Saraha App provides a complete backend solution for applications requiring user authentication, profile management, secure messaging, and media uploads. It supports multiple authentication methods, JWT-based security, and efficient file handling with validation.

## ✨ Key Features

- **Multi-Authentication**: Email/password and Google OAuth2 signup/login
- **JWT Security**: Access and refresh token rotation with configurable expiration
- **User Management**: Profile retrieval, updates, and public sharing
- **Messaging System**: Send and receive messages with file attachments
- **File Uploads**: Secure image uploads for profiles and messages
- **Input Validation**: Comprehensive Joi-based request validation
- **Security Hardening**: Helmet, CORS, and encryption utilities
- **Error Handling**: Centralized error management with detailed responses
- **Database Integration**: MongoDB with Mongoose ODM
- **Environment Config**: Flexible configuration for development/production

## 🛠 Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.2+
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **OAuth**: Google Auth Library
- **File Upload**: Multer
- **Validation**: Joi
- **Security**: Helmet, CORS
- **Environment**: dotenv
- **Caching**: Redis (optional)

## 📁 Project Structure

```
src/
├── app.bootstrap.js          # Express app initialization
├── main.js                   # Application entry point
├── common/
│   ├── enums/                # Application constants
│   ├── services/             # Shared services (Redis)
│   ├── utils/
│   │   ├── response/         # HTTP response helpers
│   │   ├── validation.js     # General validation utilities
│   │   ├── multer/           # File upload configuration
│   │   ├── email/            # Email utilities
│   │   ├── otp.js            # OTP generation
│   │   └── security/         # Encryption & hashing
├── DB/
│   ├── db.connection.js      # MongoDB connection
│   ├── redis.connection.js   # Redis connection
│   ├── database.repository.js # DB utilities
│   └── models/               # Mongoose schemas
├── middleware/
│   ├── authentication.middleware.js
│   └── validation.middleware.js
├── modules/
│   ├── auth/                 # Authentication module
│   ├── user/                 # User profile module
│   └── message/              # Messaging module
config/                       # Environment configuration
uploads/                      # Static file storage
```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saraha-app/Code
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create environment files in `config/`:
   - `.env.development`
   - `.env.production`

   **Required Environment Variables:**
   ```env
   NODE_ENV=development
   PORT=3000
   DB_URI=mongodb://localhost:27017/saraha
   REDIS_URL=redis://localhost:6379
   SALT_ROUND=10
   IV_LENGTH=16
   ENC_SECRET_KEY=your-32-byte-base64-or-buffer-key
   TOKEN_ACCESS_SECRET_KEY=your-access-token-secret
   TOKEN_REFRESH_SECRET_KEY=your-refresh-token-secret
   SYSTEM_TOKEN_ACCESS_SECRET_KEY=your-system-access-secret
   SYSTEM_TOKEN_REFRESH_SECRET_KEY=your-system-refresh-secret
   ACCESS_TOKEN_EXPIRES_IN=900
   REFRESH_TOKEN_EXPIRES_IN=604800
   WEB_CLIENT_ID=your-google-web-client-id
   ```

   > **Security Note**: Use strong, unique keys for encryption and JWT secrets. Never commit sensitive data to version control.

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```
- Uses `nodemon` for auto-restart on file changes
- Loads `.env.development` configuration

### Production Mode
```bash
npm run start:prod
```
- Optimized for production deployment
- Loads `.env.production` configuration

The server will start on the configured `PORT` (default: 3000) and serve static files from `/uploads`.

## 📡 API Endpoints

### Authentication Module (`/auth`)
- `POST /auth/signup` - User registration with email/password
- `POST /auth/login` - User login with email/password
- `POST /auth/signup/gmail` - Google OAuth registration
- `POST /auth/login/gmail` - Google OAuth login

### User Profile Module (`/user`)
- `GET /user/` - Get authenticated user profile *(Requires Auth)*
- `POST /user/token-rotate` - Refresh access tokens *(Requires Refresh Token)*
- `PATCH /user/profile-image` - Upload profile picture *(Requires Auth)*
- `PATCH /user/profile-cover-image` - Upload cover images *(Requires Auth)*
- `GET /user/:userId/shared-profile` - Get public user profile

### Messaging Module (`/message`)
- `POST /message/:receiverId` - Send message with attachments *(Requires Auth)*
- `GET /message/` - Get received messages *(Requires Auth)*

## 🔒 Security Features

- **JWT Authentication**: Bearer token validation for protected routes
- **Role-Based Access**: Configurable user roles and permissions
- **File Validation**: Strict MIME type and size limits for uploads
- **Input Sanitization**: Joi schema validation for all requests
- **Encryption**: AES encryption for sensitive data
- **CORS Protection**: Configured cross-origin policies
- **Helmet Security**: HTTP security headers
- **Rate Limiting**: Built-in request throttling capabilities

## 📤 File Uploads

- **Supported Formats**: JPEG, PNG, JPG images
- **Storage**: Local filesystem under `uploads/` directory
- **Serving**: Static files accessible via `/uploads` endpoint
- **Validation**: File type and size restrictions enforced
- **Folders**:
  - `profile picture` - Single image uploads
  - `profile cover picture` - Multiple image uploads
  - `Message` - Message attachments

## 🧪 Testing

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ using Express.js and MongoDB**
