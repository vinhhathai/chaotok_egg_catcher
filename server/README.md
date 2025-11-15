# Chaotok Game Server

🎮 Dedicated game server for Chaotok game platform.

## Features

- ✅ Game session management
- ✅ Score submission & leaderboards
- ✅ User statistics
- ✅ JWT authentication
- ✅ MongoDB database
- ✅ Separate from social network

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Initialize Database
```bash
npm run init-games
```

### 4. Start Server
```bash
npm run dev
```

Server runs on **http://localhost:4001**

## API Endpoints

### Start Game
```http
POST /game/start
Authorization: Bearer <token>
Body: { "gameId": "egg-catch" }
```

### Submit Score
```http
POST /game/submit-score
Authorization: Bearer <token>
Body: {
  "gameId": "egg-catch",
  "score": 300,
  "playTime": 45,
  "sessionId": "uuid"
}
```

### Leaderboard
```http
GET /game/egg-catch/leaderboard?period=alltime&limit=50
```

### My High Score
```http
GET /game/egg-catch/my-score
Authorization: Bearer <token>
```

### My Stats
```http
GET /game/egg-catch/stats
Authorization: Bearer <token>
```

## Project Structure

```
server/
├── src/
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   ├── config/
│   │   └── database.js     # MongoDB connection
│   ├── controllers/
│   │   └── game.controller.js
│   ├── services/
│   │   └── game.service.js
│   ├── models/
│   │   └── game.model.js
│   ├── routes/
│   │   └── game.routes.js
│   ├── middleware/
│   │   └── auth.js
│   └── utils/
│       ├── logger.js
│       └── response.js
├── migrations/
│   └── init-games.js
├── .env
└── package.json
```

## Environment Variables

```env
PORT=4001
MONGODB_URI=mongodb://localhost:27017/chaotok_games
JWT_SECRET=your-secret
CORS_ORIGIN=http://localhost:4000
SOCIAL_API_URL=http://localhost:5000
```

## Database Collections

- **games** - Game metadata
- **gamescores** - Player scores
- **gamesessions** - Active sessions

## Client Configuration

Update game client `.env.development`:
```env
VITE_USE_MOCK_API=false
VITE_API_URL=http://localhost:4001
VITE_MAIN_API_URL=http://localhost:5000
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run init-games` - Initialize default games

## License

ISC
