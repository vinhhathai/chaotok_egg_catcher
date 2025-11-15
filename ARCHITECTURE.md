# 🎮 Chaotok Game Platform - Architecture

## 📐 Kiến trúc tách biệt

### Tại sao tách Game Server riêng?

✅ **Separation of Concerns** - Game và Social Network là 2 hệ thống độc lập
✅ **Scalability** - Game có thể scale riêng khi có nhiều người chơi
✅ **Performance** - Không ảnh hưởng social network khi game có load cao
✅ **Database** - Game dùng database riêng, tối ưu cho gaming data
✅ **Deployment** - Deploy game server độc lập
✅ **Development** - Team game có thể làm việc độc lập

## 🏗️ Cấu trúc hệ thống

```
┌─────────────────┐
│   Game Client   │ (Port 4000)
│   React + Vite  │
└────────┬────────┘
         │
         │ HTTP API
         ▼
┌─────────────────┐
│  Game Server    │ (Port 4001)
│  Express + JWT  │
│  MongoDB        │
└────────┬────────┘
         │
         │ Optional
         ▼
┌─────────────────┐
│  Social Server  │ (Port 5000)
│  User Auth      │
│  User Coins     │
└─────────────────┘
```

## 📦 Component Chi tiết

### 1. Game Client (Port 4000)
```
chaotok_game/client/
├── src/
│   ├── games/
│   │   └── egg-catch/       # Phaser game
│   ├── api/
│   │   └── gameAPI.js       # API client
│   └── components/
│       └── GameFrame/       # Game wrapper
```

**API Client Configuration:**
```javascript
VITE_API_URL=http://localhost:4001        // Game server
VITE_MAIN_API_URL=http://localhost:5000   // Social server (optional)
VITE_USE_MOCK_API=false                   // Use real API
```

### 2. Game Server (Port 4001)
```
chaotok_game/server/
├── src/
│   ├── models/         # MongoDB schemas
│   ├── services/       # Business logic
│   ├── controllers/    # Request handlers
│   ├── routes/         # API routes
│   ├── middleware/     # Auth, etc.
│   └── utils/          # Helpers
└── migrations/         # DB initialization
```

**Database:** `chaotok_games`
- games collection
- gamescores collection
- gamesessions collection

### 3. Social Server (Port 5000) - Optional
FaceTok social network server (existing)
- User authentication
- User profile
- Coins management

## 🔄 Data Flow

### Playing a Game

```
1. User Login
   Client → Social Server
   ← JWT Token

2. Start Game
   Client → Game Server (with JWT)
   ← Session ID

3. Play Game
   Client (Phaser game running)

4. Submit Score
   Client → Game Server
   - Validate JWT
   - Save score to game DB
   - Calculate coins
   ← Result (score, rank, coins)

5. Update Coins (Optional)
   Game Server → Social Server API
   - Add coins to user account
```

## 🔐 Authentication

Game server accepts JWT tokens from Social server:
```javascript
// In request header
Authorization: Bearer <jwt-token>

// Token payload
{
  userId: "...",
  username: "...",
  avatar: "...",
  ...
}
```

## 💾 Data Storage

### Game Database (MongoDB - chaotok_games)

**Games Collection:**
```javascript
{
  gameId: "egg-catch",
  name: "Egg Catch",
  coinMultiplier: 1,
  playCount: 1234,
  isActive: true
}
```

**GameScores Collection:**
```javascript
{
  userId: "user-id",
  username: "Player",  // Cached for leaderboard
  avatar: "url",       // Cached for leaderboard
  gameId: "egg-catch",
  score: 300,
  playTime: 45,
  coinsEarned: 30,
  isHighScore: true,
  createdAt: "2025-11-13T..."
}
```

**GameSessions Collection:**
```javascript
{
  userId: "user-id",
  gameId: "egg-catch",
  sessionId: "uuid",
  status: "completed",
  startTime: "...",
  endTime: "..."
}
```

### Social Database (MongoDB - chaotok_social)
User data, posts, messages, etc. (separate)

## 🚀 Deployment Options

### Option 1: Cùng máy chủ (Development)
```
Server: localhost
├── Game Client:   http://localhost:4000
├── Game Server:   http://localhost:4001
└── Social Server: http://localhost:5000
```

### Option 2: Tách máy chủ (Production)
```
Game Platform:
├── Client: https://games.chaotok.com
└── Server: https://games-api.chaotok.com

Social Network:
├── Client: https://chaotok.com
└── Server: https://api.chaotok.com
```

### Option 3: Microservices (Scale)
```
Load Balancer
├── Game Servers (multiple instances)
│   ├── Game Server 1
│   ├── Game Server 2
│   └── Game Server 3
├── Game DB (MongoDB cluster)
└── Cache (Redis)
```

## 📝 Setup Instructions

### 1. Game Server Setup
```bash
cd chaotok_game/server
npm install
cp .env.example .env
npm run init-games
npm run dev
```

### 2. Game Client Setup
```bash
cd chaotok_game/client
npm install
npm run dev
```

### 3. Test Integration
1. Open http://localhost:4000
2. Login with Social Network account
3. Play Egg Catch game
4. Check leaderboard

## 🔧 Configuration Files

### Game Server .env
```env
PORT=4001
MONGODB_URI=mongodb://localhost:27017/chaotok_games
JWT_SECRET=game-secret
CORS_ORIGIN=http://localhost:4000
SOCIAL_API_URL=http://localhost:5000
```

### Game Client .env.development
```env
VITE_API_URL=http://localhost:4001
VITE_MAIN_API_URL=http://localhost:5000
VITE_USE_MOCK_API=false
```

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /game/start | ✅ | Start game session |
| POST | /game/submit-score | ✅ | Submit score |
| GET | /game/:id/leaderboard | ❌ | Get leaderboard |
| GET | /game/:id/my-score | ✅ | Get my high score |
| GET | /game/:id/stats | ✅ | Get my statistics |

## 🎯 Next Steps

1. ✅ Basic game server - DONE
2. ⏳ Integrate coins with Social server
3. ⏳ Add more anti-cheat measures
4. ⏳ Add more games
5. ⏳ Add achievements
6. ⏳ Add tournaments
7. ⏳ Add daily challenges
8. ⏳ Add real-time multiplayer

## 🐛 Troubleshooting

**Q: Cannot connect to game server**
A: Check if game server is running on port 4001

**Q: JWT authentication failed**
A: Make sure JWT_SECRET matches between servers

**Q: Leaderboard empty**
A: Run `npm run init-games` to initialize database

**Q: CORS error**
A: Check CORS_ORIGIN in game server .env

## 📚 Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
