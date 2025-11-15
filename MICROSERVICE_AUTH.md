# Microservice Authentication Setup

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  Game Client    │────────>│   Game Server    │
│  (Browser)      │  Token  │   (Port 4001)    │
└─────────────────┘         └──────────────────┘
                                      │
                                      │ Verify Token
                                      ▼
                            ┌──────────────────┐
                            │  Social Server   │
                            │   (Port 5000)    │
                            │  Auth Service    │
                            └──────────────────┘
```

## 🔐 Setup Instructions

### 1. Configure Social Network Server (.env)

Add to `FaceTok_Sever/.env`:

```bash
# Service-to-Service Secret
SERVICE_SECRET=shared-secret-dev-2024
```

### 2. Configure Game Server (.env)

Already configured in `chaotok_game/server/.env`:

```bash
# Social Network API
SOCIAL_API_URL=http://localhost:5000
SOCIAL_API_SECRET=shared-secret-dev-2024
```

### 3. Restart Both Servers

```bash
# Social Network Server
cd FaceTok_Sever
npm run dev

# Game Server
cd chaotok_game/server
npm run dev
```

## 📡 API Flow

### Token Verification Flow:

1. **Client → Game Server**
   ```http
   POST /game/submit-score
   Authorization: Bearer <jwt-token>
   ```

2. **Game Server → Social Server**
   ```http
   GET /auth/verify-token
   Authorization: Bearer <jwt-token>
   X-Service-Secret: shared-secret-dev-2024
   ```

3. **Social Server Response**
   ```json
   {
     "success": true,
     "data": {
       "userId": "507f1f77bcf86cd799439011",
       "user": {
         "id": "507f1f77bcf86cd799439011",
         "username": "john_doe",
         "email": "john@example.com",
         "avatar": "https://...",
         "coins": 1500
       }
     }
   }
   ```

4. **Game Server → Client**
   ```json
   {
     "success": true,
     "message": "Score submitted",
     "data": {
       "score": 300,
       "coinsEarned": 30,
       "rank": 5
     }
   }
   ```

## 🔒 Security Features

### Service Secret (`X-Service-Secret`)
- Only microservices with correct secret can verify tokens
- Prevents external services from using the verification endpoint
- Different from JWT_SECRET

### JWT Token
- Issued by Social Network server on login
- Contains user ID and expiration
- Verified by Social Network server (single source of truth)

### Benefits:
1. ✅ **Centralized Auth** - Social server controls all authentication
2. ✅ **Token Revocation** - Can invalidate tokens in one place
3. ✅ **User Data Sync** - Always get latest user data
4. ✅ **Service Isolation** - Game server doesn't need user database
5. ✅ **Security** - Service secret prevents unauthorized access

## 🧪 Testing

### 1. Login to get token:
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "...",
  "user": {...}
}
```

### 2. Use token in game API:
```bash
curl -X POST http://localhost:4001/game/submit-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "gameId": "egg-catch",
    "score": 300,
    "playTime": 45
  }'
```

### 3. Verify token directly (for testing):
```bash
curl -X GET http://localhost:5000/auth/verify-token \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "X-Service-Secret: shared-secret-dev-2024"
```

## 🔧 Error Handling

### 401 - Unauthorized
- No token provided
- Invalid token
- Expired token
- User not found

### 403 - Forbidden
- Invalid service secret
- Token doesn't match user

### 503 - Service Unavailable
- Social server is down
- Network timeout (5 seconds)

## 🚀 Fallback Strategy (Optional)

If you want game server to work even when social server is down, you can:

1. Use shared JWT_SECRET in both servers
2. Add fallback to local verification:

```javascript
// In game.routes.js
const { verifyToken, verifyTokenLocal } = require('../middleware/auth');

// Try remote verification, fallback to local
router.post('/submit-score', verifyToken, gameController.submitScore);

// Or use local only (not recommended)
router.post('/submit-score', verifyTokenLocal, gameController.submitScore);
```

## 📝 Environment Variables Summary

### Social Server (FaceTok_Sever/.env)
```bash
JWT_SECRET=your-jwt-secret-key
SERVICE_SECRET=shared-secret-dev-2024
```

### Game Server (chaotok_game/server/.env)
```bash
SOCIAL_API_URL=http://localhost:5000
SOCIAL_API_SECRET=shared-secret-dev-2024
JWT_SECRET=game-dev-secret-2024  # Only for fallback
```

## 🔄 Migration from Local to Microservice Auth

Already done! The changes:
- ✅ Game server now calls Social server for verification
- ✅ Social server has `/auth/verify-token` endpoint
- ✅ Service secret protection added
- ✅ Proper error handling
- ✅ Timeout protection (5s)

## 🎯 Production Considerations

1. **HTTPS** - Use HTTPS for all inter-service communication
2. **Service Discovery** - Use service mesh or API gateway
3. **Caching** - Cache verified tokens for 1-5 minutes
4. **Rate Limiting** - Limit verification requests per service
5. **Monitoring** - Log all verification requests
6. **Secrets Management** - Use environment-specific secrets
7. **Circuit Breaker** - Implement circuit breaker pattern

## 📚 Resources

- JWT Best Practices: https://jwt.io/introduction
- Microservice Authentication: https://microservices.io/patterns/security/access-token.html
- Service-to-Service Auth: https://auth0.com/docs/secure/tokens
