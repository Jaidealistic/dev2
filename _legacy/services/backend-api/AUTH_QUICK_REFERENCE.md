# 🔐 Authentication Quick Reference

## API Endpoints (7 Total)

### Public Endpoints (No Authentication Required)

```
POST   /api/auth/signup                  Register new user
POST   /api/auth/login                   User login
POST   /api/auth/verify-email            Verify email with code
POST   /api/auth/request-password-reset  Request password reset email
POST   /api/auth/reset-password          Reset password with token
```

### Protected Endpoints (Requires JWT Token)

```
GET    /api/auth/me                      Get current user info
POST   /api/auth/logout                  Logout user
```

---

## Request/Response Examples

### 1️⃣ Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "LEARNER"
}

Response (201):
{
  "message": "Signup successful! Check your email to verify your account.",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "LEARNER"
  }
}
```

### 2️⃣ Verify Email
```bash
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "A2F5B7"
}

Response (200):
{
  "message": "Email verified successfully! You can now log in.",
  "user": { ... }
}
```

### 3️⃣ Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "LEARNER",
    "isEmailVerified": true
  }
}
```

### 4️⃣ Get Current User (Protected)
```bash
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200):
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "LEARNER",
    "isEmailVerified": true
  }
}
```

### 5️⃣ Request Password Reset
```bash
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "message": "If email exists, a password reset link has been sent"
}
```

### 6️⃣ Reset Password
```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}

Response (200):
{
  "message": "Password reset successfully! You can now log in with your new password."
}
```

### 7️⃣ Logout
```bash
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200):
{
  "message": "Logged out successfully. Please delete your auth token."
}
```

---

## Complete User Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER ARRIVES (Not Authenticated)                     │
└─────────────────────────────────────────────────────────┘
                         │
         ╔═══════════════╬═══════════════╗
         │               │               │
    Has Account?     Forgot Password?  New User?
         │               │               │
         NO              YES             YES
         │               │               │
         ▼               ▼               ▼
    ┌────────────────────┐    ┌──────────────────┐
    │ POST /login        │    │ POST /signup     │
    │ email + password   │    │ email + password │
    │                    │    │ firstName, etc   │
    │ Returns: JWT Token │    │                  │
    │ ✅ NOW LOGGED IN   │    │ Email sent →     │
    └────────────────────┘    │ Go to verify     │
                              └──────────────────┘
                                       │
                                       ▼
                            ┌──────────────────┐
                            │ POST /verify-email
                            │ code from email  │
                            │ ✅ EMAIL VERIFIED
                            │ User can login   │
                            └──────────────────┘
                                       │
                                       ▼
                            ┌──────────────────┐
                            │ POST /login      │
                            │ (now allowed)    │
                            │ Returns: Token   │
                            │ ✅ NOW LOGGED IN │
                            └──────────────────┘
                                       │
                                       ▼
         ╔═════════════════════════════════════════════╗
         │ AUTHENTICATED - Use Token for All Requests  │
         │ Authorization: Bearer <token>               │
         │                                             │
         │ GET /me → User info                         │
         │ GET /api/... → Access protected endpoints   │
         │ POST /api/... → Perform actions             │
         └─────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FORGOT PASSWORD FLOW (If user is not logged in)│
└─────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ POST /request-password-reset       │
│ email address                      │
│                                    │
│ Email sent with reset link        │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ User opens link from email        │
│ → /auth/reset-password?token=...  │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ POST /reset-password               │
│ token + new password               │
│                                    │
│ ✅ Password updated                │
│ User can now login                 │
└────────────────────────────────────┘
```

---

## Error Status Codes Quick Reference

| Code | Error | Cause | Solution |
|------|-------|-------|----------|
| 400 | Bad Request | Invalid input | Check request format/validation |
| 401 | Unauthorized | Wrong credentials/no token | Login again or provide valid token |
| 403 | Forbidden | Email not verified | Verify email first |
| 404 | Not Found | User doesn't exist | Create account first |
| 409 | Conflict | User already exists | Use different email or login |
| 500 | Server Error | Backend problem | Check server logs |

---

## Environment Setup

### Backend Environment Variables
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@linguaaccess.com
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Start Backend
```bash
cd backend
npm install
npm run db:push  # Setup database
npm run dev      # Start on port 5000
```

---

## Testing with cURL

### Complete Test Sequence

```bash
# 1. Sign up
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "LEARNER"
  }')

# 2. Verify email (check console for code)
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "ABC123"
  }'

# 3. Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 4. Use token
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Integration Checklist (Frontend)

- [ ] Create sign-up page at `/auth/signup`
- [ ] Create login page at `/auth/login`
- [ ] Create email verification page at `/auth/verify-email`
- [ ] Create password reset pages
- [ ] Implement API client (axios/fetch)
- [ ] Add form validation using Zod
- [ ] Store JWT token securely
- [ ] Add auth middleware for protected routes
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test all flows
- [ ] Verify accessibility (WCAG AAA)

---

## Key Points

✅ **7 endpoints** for complete authentication  
✅ **Zod validation** on all inputs  
✅ **JWT tokens** with 7-day expiration  
✅ **Email verification** required before login  
✅ **Password reset** with secure tokens  
✅ **Middleware** for protecting routes  
✅ **Production-ready** security  
✅ **WCAG AAA** compatible responses  

---

## Next Steps

1. **Test Backend** - Use cURL examples to test all endpoints
2. **Build Frontend** - Create sign-up, login, verify email pages
3. **Integrate API** - Connect frontend forms to backend
4. **Add Onboarding** - Create accessibility preference setup
5. **Build Dashboard** - Create learner profile and dashboard

---

For complete documentation, see:
- [AUTH_API.md](AUTH_API.md) - Full API documentation
- [AUTH_IMPLEMENTATION_SUMMARY.md](../AUTH_IMPLEMENTATION_SUMMARY.md) - Implementation details
- [IMPLEMENTATION_GUIDE.md](../IMPLEMENTATION_GUIDE.md) - Week-by-week plan
