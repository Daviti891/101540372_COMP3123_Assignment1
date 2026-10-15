# 101540372_COMP3123_Assignment1

## Project

A secure REST API for managing employees, built for COMP 3123 Assignment 1.
Users can sign up, log in and manage only the employees they created.

**Technologies:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Helmet,
express-rate-limit, express-validator, Winston, dotenv.

**Structure:**
```
src/
  config/       db.js, logger.js
  models/       User.js, Employee.js
  controllers/  userController.js, empController.js
  routes/       userRoutes.js, empRoutes.js
  middleware/   auth.js, validate.js, rateLimiters.js, requestLogger.js, errorHandler.js
  validators/   userValidators.js, empValidators.js
  app.js, server.js
logs/           sample.log
postman/        COMP3123_A1.postman_collection.json
```

## Installation

1. Clone the repo: `git clone https://github.com/Daviti891/101540372_COMP3123_Assignment1.git`
2. Go into the folder: `cd 101540372_COMP3123_Assignment1`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and fill in the values.
5. Start MongoDB (macOS: `brew services start mongodb-community`).
6. Start the app: `npm run dev` (or `npm start`).
7. Test the API with the Postman collection in `postman/COMP3123_A1.postman_collection.json`.
   Log in as a user first, then send the token as `Authorization: Bearer <jwt>`.

## Configuration

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (3000) |
| `MONGODB_URI` | MongoDB connection string, database `comp3123_assignment1` |
| `JWT_SECRET` | Secret used to sign tokens (never commit the real one) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1h` |

## API Endpoints

| Method | Endpoint | Success | Purpose |
|---|---|---|---|
| POST | `/api/v1/user/signup` | 201 | Register a user |
| POST | `/api/v1/user/login` | 200 | Log in (username or email) and get a JWT |
| GET | `/api/v1/emp/employees` | 200 | List my employees |
| POST | `/api/v1/emp/employees` | 201 | Create an employee |
| GET | `/api/v1/emp/employees/{eid}` | 200 | Get one of my employees |
| PUT | `/api/v1/emp/employees/{eid}` | 200 | Update one of my employees |
| DELETE | `/api/v1/emp/employees?eid=xxx` | 204 | Delete one of my employees |
| GET | `/health` | 200 | Health check |

## Authentication

1. **Signup** creates a user. The password is hashed with bcrypt (12 salt rounds)
   before it is saved.
2. **Login** checks the credentials and returns a JWT that expires after 1 hour.
3. The client sends the token on every employee request:
   `Authorization: Bearer <jwt>`
4. The `auth` middleware verifies the token and sets `req.user` from it.
   Missing, invalid or expired tokens return 401.

## Authorization

Each employee has a `user` field that stores the `_id` of the user who created it.
This is how the app knows who owns each employee.

- The owner comes from the verified JWT, never from the request body.
- The list endpoint only returns employees where `user` matches the logged-in user.
- Get, update and delete look up the employee and compare its `user` with the
  logged-in user. If the employee does not exist the API returns 404, and if it
  belongs to someone else it returns 403.
- Changing `eid` in the URL or query string to another user's employee ID does not
  work, because the ownership check runs every time.

## Security

- **Password hashing:** passwords are hashed with bcrypt (12 rounds) before saving and
  are never returned in responses.
- **JWT:** the token is signed with `JWT_SECRET` and expires after 1 hour.
- **Helmet:** adds security headers to every response, for example
  `X-Content-Type-Options: nosniff` (stops the browser guessing file types).
- **Rate limiting:** limits how many requests one IP can make in a time window, to
  slow down brute-force attacks. Signup and login allow 10 requests per 15 minutes,
  and all `/api/v1` routes allow 100 per 15 minutes. When the limit is exceeded the
  API returns 429 with "Too many requests, try again later".
  **Test result:** the 11th login attempt within 15 minutes returned 429 Too Many Requests.
- **Input validation:** express-validator checks required fields, email format,
  positive salary, valid dates and valid MongoDB ObjectIds. Failures return 400.
- **Environment variables:** secrets live in `.env`, which is not committed.

## Error Handling & Status Codes

All errors return JSON from a central error handler. Stack traces are never exposed.

| Code | Used when |
|---|---|
| 200 / 201 / 204 | Success / created / deleted (no body) |
| 400 | Validation failure, invalid ObjectId, malformed JSON |
| 401 | Missing, invalid or expired JWT; wrong login credentials |
| 403 | Employee belongs to another user |
| 404 | Employee not found, or unsupported route |
| 409 | Duplicate username or email |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |

## Logging

Logs are written by Winston to `logs/app.log` (everything) and `logs/error.log`
(errors only). Each entry is JSON with a timestamp. Logged events: server startup,
every request (method, path, status), login success/failure, validation failures,
authorization failures and errors. Passwords, tokens, secrets and request bodies are
never logged. The real log files are ignored by git, so a sample is in `logs/sample.log`.

## Health Check

`GET http://localhost:3000/health` returns:

```json
{ "status": "ok", "uptime": 35.9, "timestamp": "2026-10-08T04:43:02.356Z", "database": "connected" }
```
## Deployed API

Hosted on Vercel: https://101540372-comp-3123-assignment1.vercel.app
Health check: https://101540372-comp-3123-assignment1.vercel.app/health

The deployed version uses MongoDB Atlas. Environment variables (`MONGODB_URI`, `JWT_SECRET`,
`JWT_EXPIRES_IN`) are set in Vercel and not committed. Vercel's filesystem is read-only, so
logs go to the console (Vercel logs) there. Local runs also write `logs/app.log`.

## Test Credentials

Create these through `POST /api/v1/user/signup` (non-sensitive test accounts):
`userA` / `Test@1234` and `userB` / `Test@1234`.