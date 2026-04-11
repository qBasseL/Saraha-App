# Saraha App

## Overview
Saraha App is a professional Express.js REST API for user authentication, profile management, and secure file uploads. It supports email/password registration, Google sign-in, token rotation, user profile sharing, and upload of profile pictures and cover images.

## Key Features
- Email/password signup and login
- Google authentication for signup and login
- Access token and refresh token support
- User profile retrieval and token refresh endpoint
- Profile image upload (`profile picture`)
- Profile cover image upload (`profile cover picture`)
- Public user profile sharing by user ID
- Centralized error handling and 404 route fallback

## Technology Stack
- Node.js / Express 5
- MongoDB with Mongoose
- JWT authentication
- Google OAuth2 verification
- File upload with Multer
- Input validation with Joi
- Security hardening with Helmet
- CORS configuration
- Environment configurations with dotenv

## Folder Structure
- `src/` - application source files
  - `app.bootstrap.js` - Express app initialization and routing
  - `main.js` - application entry point
  - `common/` - shared utilities, enums, response helpers, validation, file uploads
  - `DB/` - database connection, repository helpers, Mongoose models
  - `middleware/` - authentication and validation middleware
  - `modules/` - route controllers, services, and validation
    - `auth/` - authentication endpoints and logic
    - `user/` - user profile endpoints and logic
- `config/` - environment configuration loader
- `uploads/` - stored uploaded files

## Installation
1. Clone the repository.
2. Open the project root at `Code/`.
3. Install dependencies:

```bash
npm install
```

## Environment Configuration
Create environment files under `Code/config/`:
- `.env.development`
- `.env.production`

Required variables:

```env
NODE_ENV=development
PORT=3000
DB_URI=mongodb://localhost:27017/saraha
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

> Note: `ENC_SECRET_KEY` should be a secure key used for encryption operations.

## Running the App
Start in development mode:

```bash
npm run start:dev
```

Start in production mode:

```bash
npm run start:prod
```

The application listens on the port defined by `PORT` and exposes uploads at `/uploads`.

## API Endpoints

### Authentication
- `POST /auth/signup`
  - Body: `{ username, email, password, confirmPassword, phone }`
  - Registers a new user using email and password.

- `POST /auth/login`
  - Body: `{ email, password }`
  - Logs in an existing user and returns authentication credentials.

- `POST /auth/signup/gmail`
  - Body: `{ idToken }`
  - Registers a user with Google and returns credentials.

- `POST /auth/login/gmail`
  - Body: `{ idToken }`
  - Logs in a Google-authenticated user and returns credentials.

### User Profile
- `GET /user/`
  - Requires Authorization header: `Bearer <accessToken>`
  - Returns the authenticated user's profile.

- `POST /user/token-rotate`
  - Requires Authorization header: `Bearer <refreshToken>`
  - Generates a new set of login credentials using refresh token validation.

- `PATCH /user/profile-image`
  - Requires Authorization header: `Bearer <accessToken>`
  - Uploads a single profile image file as `attachment`
  - Uses the `profile picture` upload folder.

- `PATCH /user/profile-cover-image`
  - Requires Authorization header: `Bearer <accessToken>`
  - Uploads up to 3 cover images as `attachments`
  - Uses the `profile cover picture` upload folder.

- `GET /user/:userId/shared-profile`
  - Public endpoint to retrieve another user's shared profile by user ID.

## File Uploads
- Uploaded images are saved under the `uploads/` directory.
- Static files are served from `/uploads`.
- The upload destination is configured for:
  - `profile picture`
  - `profile cover picture`

## Security & Validation
- Request validation is implemented with Joi.
- Authentication uses JWT validation from request headers.
- Role-based access control is supported for authenticated user routes.
- Global error handling is enabled.
- `helmet` and `cors` are enabled for HTTP security and cross-origin requests.

## Notes
- CORS is configured to allow requests from `http://localhost:4200`.
- If a route is not matched, the app returns a `404 Invalid Routing` JSON response.
- Ensure MongoDB is running and reachable through `DB_URI` before starting the server.

## Contact
For support or improvements, update the project documentation or contact the maintainer responsible for this repository.
