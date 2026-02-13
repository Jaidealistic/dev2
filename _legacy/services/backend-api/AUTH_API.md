# LinguaAccess Authentication API

Complete documentation for the authentication REST API endpoints.

---

## Base URL

```
http://localhost:5000/api/auth
```

---

## Endpoints

### 1. Sign Up (Create New Account)

**Endpoint:** `POST /api/auth/signup`

Register a new user account.

#### Request

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "learner@example.com",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!",
    "firstName": "Alex",
    "lastName": "Johnson",
    "role": "LEARNER"
  }'
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ | Valid email address (unique) |
| `password` | string | ✅ | Min 8 characters |
| `confirmPassword` | string | ✅ | Must match password |
| `firstName` | string | ✅ | User's first name |
| `lastName` | string | ✅ | User's last name |
| `role` | enum | ✅ | One of: `LEARNER`, `PARENT`, `EDUCATOR` |

#### Success Response (201)

```json
{
  "message": "Signup successful! Check your email to verify your account.",
  "user": {
    "id": "clh1a2b3c4d5e6f7g8h9i0j1k",
    "email": "learner@example.com",
    "firstName": "Alex",
    "lastName": "Johnson",
    "role": "LEARNER"
  }
}
```

#### Error Responses

**Validation Error (400):**
```json
{
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

**User Already Exists (409):**
```json
{
  "error": "User with this email already exists"
}
```

#### Next Steps

1. User receives verification email with 6-digit code
2. Call [Verify Email](#3-verify-email) endpoint to confirm account
3. Then user can [Login](#2-login)

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

Authenticate user and receive JWT token.

#### Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "learner@example.com",
    "password": "SecurePassword123!"
  }'
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ | Registered email address |
| `password` | string | ✅ | Account password |

#### Success Response (200)

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clh1a2b3c4d5e6f7g8h9i0j1k",
    "email": "learner@example.com",
    "firstName": "Alex",
    "lastName": "Johnson",
    "role": "LEARNER",
    "isEmailVerified": true
  }
}
```

#### Error Responses

**Invalid Credentials (401):**
```json
{
  "error": "Invalid email or password"
}
```

**Email Not Verified (403):**
```json
{
  "error": "Please verify your email before logging in",
  "requiresEmailVerification": true,
  "email": "learner@example.com"
}
```

#### Token Usage

Add the returned token to all subsequent requests:

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Token Expiration:** 7 days

---

### 3. Verify Email

**Endpoint:** `POST /api/auth/verify-email`

Verify user's email address using the code sent to their inbox.

#### Request

```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "learner@example.com",
    "code": "A2F5B7"
  }'
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ | Email to verify |
| `code` | string | ✅ | 6-character code from email |

#### Success Response (200)

```json
{
  "message": "Email verified successfully! You can now log in.",
  "user": {
    "id": "clh1a2b3c4d5e6f7g8h9i0j1k",
    "email": "learner@example.com",
    "firstName": "Alex",
    "lastName": "Johnson"
  }
}
```

#### Error Responses

**Invalid Code (400):**
```json
{
  "error": "Validation failed",
  "details": {
    "code": ["Verification code must be 6 characters"]
  }
}
```

**User Not Found (404):**
```json
{
  "error": "User not found"
}
```

#### Welcome Email

After verification, user receives a welcome email with:
- Acknowledgment of email verification
- Link to start learning
- Overview of accessibility features

---

### 4. Request Password Reset

**Endpoint:** `POST /api/auth/request-password-reset`

Start password reset flow. Email with reset link is sent.

#### Request

```bash
curl -X POST http://localhost:5000/api/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "learner@example.com"
  }'
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ | Account email address |

#### Success Response (200)

```json
{
  "message": "If email exists, a password reset link has been sent"
}
```

**Note:** Response is the same whether email exists or not (security best practice).

#### What User Receives

Email containing:
- Password reset link: `http://localhost:3000/auth/reset-password?token=...`
- Expiration notice (24 hours)
- Security warning to ignore if not requested by user

---

### 5. Reset Password

**Endpoint:** `POST /api/auth/reset-password`

Complete password reset using token from email.

#### Request

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-from-email...",
    "password": "NewPassword123!",
    "confirmPassword": "NewPassword123!"
  }'
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | ✅ | Reset token from email link |
| `password` | string | ✅ | New password (min 8 chars) |
| `confirmPassword` | string | ✅ | Must match password |

#### Success Response (200)

```json
{
  "message": "Password reset successfully! You can now log in with your new password."
}
```

#### Error Responses

**Invalid Token (400):**
```json
{
  "error": "Invalid or expired reset token"
}
```

**Validation Error (400):**
```json
{
  "error": "Validation failed",
  "details": {
    "password": ["Password must be at least 8 characters"],
    "confirmPassword": ["Passwords do not match"]
  }
}
```

#### Next Steps

User can now login with new password using [Login](#2-login) endpoint.

---

### 6. Get Current User (Protected)

**Endpoint:** `GET /api/auth/me`

Retrieve current authenticated user's information.

#### Request

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Headers Required

| Header | Value | Description |
|--------|-------|-------------|
| `Authorization` | `Bearer <token>` | JWT token from login |

#### Success Response (200)

```json
{
  "user": {
    "id": "clh1a2b3c4d5e6f7g8h9i0j1k",
    "email": "learner@example.com",
    "firstName": "Alex",
    "lastName": "Johnson",
    "role": "LEARNER",
    "isEmailVerified": true
  }
}
```

#### Error Responses

**Missing Token (401):**
```json
{
  "error": "Missing or invalid Authorization header",
  "message": "Please provide a valid JWT token"
}
```

**Invalid/Expired Token (401):**
```json
{
  "error": "Invalid or expired token",
  "message": "Please log in again"
}
```

---

### 7. Logout

**Endpoint:** `POST /api/auth/logout`

Logout current user (client-side token deletion is primary method).

#### Request

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Success Response (200)

```json
{
  "message": "Logged out successfully. Please delete your auth token."
}
```

#### How Logout Works

With JWT authentication:
1. Server endpoint logs the logout (for analytics/security)
2. **Client must delete the token** from:
   - Browser localStorage
   - Browser sessionStorage
   - Auth state management
   - Cookies (if applicable)

---

## Authentication Flow

### Complete Sign-Up to Login Flow

```
1. User Registration (Sign Up)
   POST /api/auth/signup
   → Returns user info (email not yet verified)
   → Email sent with verification code

2. Email Verification
   POST /api/auth/verify-email
   → Code from email used
   → Returns success
   → Welcome email sent

3. User Login
   POST /api/auth/login
   → Returns JWT token
   → Token stored on client

4. Authenticated Requests
   GET /api/auth/me
   → Authorization: Bearer <token>
   → Returns current user info
```

### Password Reset Flow

```
1. Request Password Reset
   POST /api/auth/request-password-reset
   → Email sent with reset token

2. Reset Password
   POST /api/auth/reset-password
   → Token from email used
   → New password set

3. Login with New Password
   POST /api/auth/login
   → Returns JWT token
```

---

## Error Handling

### Standard Error Response Format

All errors follow this format:

```json
{
  "error": "Error title",
  "message": "Optional detailed message",
  "details": {
    "field_name": ["Specific error about field"]
  }
}
```

### HTTP Status Codes

| Status | Meaning | When |
|--------|---------|------|
| 200 | OK | Successful request |
| 201 | Created | User successfully created |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing/invalid token, wrong credentials |
| 403 | Forbidden | Email not verified, forbidden action |
| 404 | Not Found | User/resource not found |
| 409 | Conflict | User already exists |
| 500 | Server Error | Internal server error |

---

## Security Considerations

### Password Requirements

- Minimum 8 characters
- Should include uppercase, lowercase, numbers, special chars
- Hashed using bcrypt (10 rounds) before storage
- Never returned in API responses

### JWT Token

- **Secret:** Stored in `JWT_SECRET` environment variable
- **Expiration:** 7 days
- **Algorithm:** HS256
- **Storage:** Client should store securely:
  - ✅ HttpOnly cookies (most secure)
  - ✅ localStorage (if HTTPS + CSP)
  - ❌ Plain cookies (vulnerable to XSS)
  - ❌ sessionStorage (lost on page refresh)

### Email Verification

- Prevents fake email registration
- Verification code: 6 random characters
- Expires: 24 hours
- Sent via SendGrid (development: logged to console)

### Password Reset

- Requires email address first (no user enumeration)
- Reset token: Cryptographically secure (32 bytes)
- Expires: 24 hours
- Cannot be used for login (only password reset)

---

## Testing with cURL

### Complete Test Sequence

```bash
# 1. Sign Up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "confirmPassword": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "LEARNER"
  }'

# 2. Verify Email (use code from console/email)
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "A2F5B7"
  }'

# 3. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# 4. Get current user (use token from login response)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Development Notes

### Database Models Used

- `User` model (Prisma) - All user data
- `VerificationToken` model (TODO) - Email verification codes
- `PasswordReset` model (TODO) - Password reset tokens

### Service Functions

See `backend/src/services/authService.ts`:
- `hashPassword()` - Bcrypt password hashing
- `comparePasswords()` - Password verification
- `generateToken()` - JWT creation
- `verifyToken()` - JWT validation
- `registerUser()` - Create new user
- `authenticateUser()` - Login logic
- `verifyEmail()` - Mark email verified
- `resetPassword()` - Update password

### Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/linguaaccess

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Encryption
BCRYPT_ROUNDS=10

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@linguaaccess.com

# URLs
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

---

## Frontend Integration

See `frontend/src/lib/validations/auth.ts` for Zod schemas that match backend validation.

The frontend should:
1. Send requests to `http://localhost:5000/api/auth/*`
2. Store JWT token from login response
3. Add `Authorization: Bearer <token>` header to protected requests
4. Handle error responses and display user-friendly messages
5. Redirect to login on 401 response

---

## Common Issues & Solutions

### "User with this email already exists"

- Email already registered
- Solution: Use different email or reset password

### "Please verify your email before logging in"

- Email not verified yet
- Solution: Call `/verify-email` with code from email

### "Invalid or expired token"

- Token was deleted/expired
- Solution: Login again to get new token

### Verification code not received

- Check spam folder
- Resend request not yet implemented (TODO)
- In development: Check server console

---

## What's Next

After authentication is complete, the frontend will integrate with:

1. **User Onboarding** - Set accessibility preferences, language choices
2. **Dashboard** - View learner profile, progress, upcoming lessons
3. **Lesson Interface** - Interactive multi-modal lessons
4. **Parent Features** - Monitor children, set restrictions
5. **ML Services** - Speech recognition, pronunciation practice
