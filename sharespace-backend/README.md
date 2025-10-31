## ShareSpace Backend (Auth Service)

Node.js + Express + MongoDB backend for authentication. This service currently supports user signup and login with JWT.

### Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express
- **Database**: MongoDB via Mongoose
- **Auth**: JWT (HS256), bcrypt password hashing
- **Misc**: CORS, dotenv, morgan

### Project Structure
```
sharespace-backend/
  server.js                 # App entrypoint
  src/
    config/db.js            # Mongo connection
    models/User.js          # User model
    controllers/authController.js
    routes/authRoutes.js    # /api/auth routes
```

### Getting Started
1) Create `.env` in `sharespace-backend/`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sharespace
JWT_SECRET=four-zero-four-found
```

2) Install and run:
```
cd sharespace-backend
npm install
npm run dev
```

3) Health checks:
```
GET http://localhost:5000/
GET http://localhost:5000/health
```

### Authentication Routes
Base URL: `http://localhost:5000/api/auth`

#### POST /signup
Create a new user and receive a JWT.

Alias: `POST /register` (same body and response)

Request
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

Success Response (201)
```
{
  "message": "Signup successful",
  "token": "<JWT>",
  "user": {
    "id": "<mongoId>",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-10-30T12:34:56.000Z"
  }
}
```

Errors
- 400: `{ "message": "Name, email, and password are required" }`
- 400: `{ "message": "Password must be at least 6 characters" }`
- 409: `{ "message": "Email already registered" }`

Notes
- Password is hashed with bcrypt before storage (never returned).
- Email is normalized to lowercase and trimmed.

#### POST /login
Authenticate an existing user and receive a JWT.

Request
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

Success Response (200)
```
{
  "message": "Login successful",
  "token": "<JWT>",
  "user": {
    "id": "<mongoId>",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-10-30T12:34:56.000Z"
  }
}
```

Errors
- 400: `{ "message": "Email and password are required" }`
- 401: `{ "message": "Invalid credentials" }`

### JWT Details
- Signed with `JWT_SECRET`
- Payload: `{ id: <userId> }`
- Expires in 7 days
- Send token in `Authorization: Bearer <token>` when protected routes are added later

### Curl Examples
```
# Health
curl -i http://localhost:5000/health

# Signup
curl -i -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"secret123"}'

# Or using the /register alias
curl -i -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"secret123"}'

# Login
curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'
```

### Conventions & Next Steps
- Consistent error shape: `{ message: string }`
- CORS is enabled globally for frontend integration.
- Validation errors return HTTP 400 with human-readable messages.
- Duplicate email returns HTTP 409.
- Add auth middleware to protect future routes (profiles, posts, etc.).
- Expand `User` model and create additional route modules under `src/routes/`.

### Operational Notes
- The server validates required envs (`MONGO_URI`, `JWT_SECRET`) at startup and exits with a clear message if missing.
- Default port is `PORT=5000` (override via `.env`). Ensure the frontend points to the correct base URL.


