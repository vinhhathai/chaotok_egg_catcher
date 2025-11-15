# 🎮 Chaotok Game Platform# 🎮 Chaotok Game Platform



> Mini-game platform integrated with Chaotok Social NetworkMulti-game platform với khả năng mở rộng. Dễ dàng thêm game mới chỉ bằng vài bước.



## 📋 Overview## 🏗️ Kiến trúc



The Chaotok Game Platform allows users to play casual games within the social network interface via iframe integration. Games are deployed separately but seamlessly integrated into the main application.- **Frontend**: React 18 + **Vite** + Phaser 3 + Material-UI

- **Backend**: Node.js/Express (Game_Service)

## 🏗️ Architecture- **Database**: MongoDB (game scores) + Redis (leaderboard cache)

- **Mobile**: PWA ready → Capacitor later

```

┌─────────────────────────────────────────┐## 🚀 Quick Start

│         Social Network (Chaotok)        │

│  ┌──────────────────────────────────┐  │### Development (Standalone - Mock API)

│  │    GamesPage (Iframe Host)       │  │

│  │  https://chaotok.site/games      │  │```bash

│  └──────────────────────────────────┘  │cd chaotok_game/client

│                  │                      │npm install

│                  │ postMessage          │npm run dev

│                  ▼                      │```

│  ┌──────────────────────────────────┐  │

│  │     Game Platform (Embedded)     │  │App sẽ chạy tại: http://localhost:3000

│  │   https://game.chaotok.site      │  │

│  │  ┌────────────┐  ┌─────────────┐ │  │⚡ **Vite = Lightning Fast!** Dev server khởi động < 1 giây!

│  │  │ GameList   │  │ GameFrame   │ │  │

│  │  └────────────┘  └─────────────┘ │  │### Production (With Backend)

│  └──────────────────────────────────┘  │

│                  │                      │1. Start Game Service:

│                  │ API Calls            │```bash

│                  ▼                      │cd chaotok_game/server

│  ┌──────────────────────────────────┐  │npm install

│  │      Game Server (Backend)       │  │npm start  # Port 4000

│  │  https://game-api.chaotok.site   │  │```

│  │     - JWT Auth                   │  │

│  │     - Score Storage (Optional)   │  │2. Start Client:

│  │     - Leaderboard (Future)       │  │```bash

│  └──────────────────────────────────┘  │cd chaotok_game/client

└─────────────────────────────────────────┘npm run dev  # Port 3000

``````



## 🚀 Technology Stack## 🎮 Thêm Game Mới



### Frontend (Game Client)### Bước 1: Tạo game component

- **Framework:** React + Vite

- **UI:** Material-UI (MUI)```bash

- **Game Engine:** Phaser 3chaotok_game/client/src/games/your-game/

- **Routing:** React Router v6├── YourGame.jsx              # Main component

- **Hosting:** AWS S3 + CloudFront├── scenes/

│   ├── GameScene.js          # Game logic

### Backend (Game Server)│   └── GameOverScene.js

- **Runtime:** Node.js 18+└── assets/                   # Game assets (optional)

- **Framework:** Express.js```

- **Database:** MongoDB (optional)

- **Auth:** JWT (shared with Social)### Bước 2: Register game

- **Hosting:** AWS EC2 + Nginx

Mở `src/config/gameRegistry.js` và thêm:

## 📦 Project Structure

```javascript

```{

chaotok_game/  id: 'your-game',

├── client/                    # Frontend (React + Vite)  name: 'Your Game Name',

│   ├── src/  description: 'Game description',

│   │   ├── pages/  icon: '🎲',

│   │   │   └── GameList/      # Games selection page  thumbnail: '/assets/games/your-game/thumbnail.png',

│   │   ├── components/  difficulty: 'medium',

│   │   │   └── GameFrame/     # Game container + modal  coinMultiplier: 0.12,

│   │   ├── games/  enabled: true,

│   │   │   └── egg-catch/     # Phaser game  component: () => import('../games/your-game/YourGame'),

│   │   ├── config/}

│   │   │   └── gameRegistry.js # Games configuration```

│   │   └── App.jsx

│   ├── .env.production**Xong!** Game mới sẽ tự động xuất hiện trong danh sách.

│   ├── deploy-to-s3.ps1       # Deploy script

│   └── package.json## 📁 Cấu trúc Project

│

└── server/                    # Backend (Express)```

    ├── src/chaotok_game/

    │   ├── controllers/       # API controllers├── client/                      # Frontend

    │   ├── services/          # Business logic│   ├── src/

    │   ├── models/            # Database models│   │   ├── games/              # Tất cả game ở đây

    │   ├── routes/            # API routes│   │   │   ├── egg-catch/      # Game 1

    │   └── server.js│   │   │   ├── flappy-bird/    # Game 2 (thêm sau)

    ├── .env.production.example│   │   │   └── puzzle/         # Game 3 (thêm sau)

    ├── deploy.sh              # Deploy script│   │   ├── components/

    ├── nginx-config.conf      # Nginx configuration│   │   │   └── GameFrame/      # Wrapper cho mọi game

    └── package.json│   │   ├── pages/

```│   │   │   └── GameList/       # Danh sách game

│   │   ├── config/

## 🎮 Features│   │   │   └── gameRegistry.js # **QUAN TRỌNG** - Đăng ký game

│   │   └── api/

### Current│   │       └── gameAPI.js      # API client

- ✅ Iframe integration with Social Network│   └── package.json

- ✅ Responsive game sizing (mobile → desktop)│

- ✅ PostMessage communication (Home button)└── server/                      # Backend (implement sau)

- ✅ JWT token passing via URL    ├── src/

- ✅ Egg Catch mini-game (Phaser 3)    │   ├── modules/

- ✅ Game result modal    │   │   ├── game/

- ✅ Chaotok branding (logo + colors)    │   │   ├── score/

    │   │   └── leaderboard/

### Future (Not Implemented)    │   └── server.js

- ⏳ Score persistence to backend    └── package.json

- ⏳ Leaderboard system```

- ⏳ Coins economy integration

- ⏳ Multiple games## 🎯 Features

- ⏳ User achievements

- ⏳ Social sharing### ✅ Đã có:

- [x] Game registry system (dễ dàng thêm game)

## 🛠️ Development Setup- [x] GameFrame wrapper (UI chung cho tất cả game)

- [x] Egg Catch game (sample)

### Prerequisites- [x] Mock API (dev không cần backend)

- Node.js 18+- [x] Responsive design (mobile-friendly)

- npm or yarn- [x] Touch controls

- AWS CLI (for deployment)- [x] Score submission

- [x] Coin rewards

### Install Dependencies

### 🔜 Sắp có:

```bash- [ ] Backend Game Service

# Client- [ ] Real-time leaderboard

cd chaotok_game/client- [ ] User authentication

npm install- [ ] More games

- [ ] PWA features

# Server- [ ] Mobile app (Capacitor)

cd chaotok_game/server

npm install## 🎨 Game Development Guidelines

```

Mỗi game **PHẢI** có:

### Environment Variables

1. `onGameOver` prop để submit score:

**Client (.env.development):**```javascript

```bashexport default function YourGame({ onGameOver }) {

VITE_USE_MOCK_API=true  const handleGameEnd = async () => {

VITE_API_URL=http://localhost:4001    await onGameOver(score, playTime, gameplayData);

```  };

}

**Server (.env.development):**```

```bash

NODE_ENV=development2. Responsive design:

PORT=4001```javascript

MONGODB_URI=mongodb://localhost:27017/chaotok_gameswidth: Math.min(window.innerWidth, 800),

JWT_SECRET=dev-secret-change-in-productionheight: Math.min(window.innerHeight - 120, 600),

CORS_ORIGIN=http://localhost:3004,http://localhost:4000```

```

3. Touch + Mouse support cho mobile

### Run Development Servers

## 📱 Mobile Strategy

```bash

# Terminal 1: Game Client (Port 4000)1. **Phase 1**: PWA (hiện tại)

cd chaotok_game/client   - Add to home screen

npm run dev   - Offline support

   - Push notifications

# Terminal 2: Game Server (Port 4001)

cd chaotok_game/server2. **Phase 2**: Capacitor (sau này)

npm run dev   - Wrap thành native app

   - Deploy lên App Store/Play Store

# Terminal 3: Social Client (Port 3004)

cd FaceTok_client## 🔗 Integration với Chaotok Main

npm start

```### Khi backend sẵn sàng:



Visit:1. Update `.env.production`:

- Game Platform: http://localhost:4000```env

- Social Network: http://localhost:3004/gamesVITE_USE_MOCK_API=false

VITE_API_URL=https://game-api.chaotok.com

## 📤 DeploymentVITE_MAIN_API_URL=https://api.chaotok.com

```

See detailed guides:

- [GAME_DEPLOYMENT_GUIDE.md](../GAME_DEPLOYMENT_GUIDE.md) - Full deployment instructions2. Backend API endpoints cần:

- [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist- `POST /game/start` - Bắt đầu game

- `POST /game/submit-score` - Nộp điểm

### Quick Deploy- `GET /game/:gameId/leaderboard` - Bảng xếp hạng

- `GET /game/:gameId/my-score` - Điểm cao nhất

**Client:**

```powershell3. Main Service API:

cd chaotok_game/client- `GET /api/user/me` - Lấy thông tin user + coins

.\deploy-to-s3.ps1- `POST /api/internal/coins/add` - Cộng xu (internal only)

```

## 🎮 Game Ideas

**Server:**

```bashCác game có thể thêm:

cd chaotok_game/server- Flappy Bird clone

./deploy.sh- Memory/Puzzle game

```- Snake game

- Tetris clone

## 🎯 Adding New Games- Platformer

- Quiz game

### 1. Create Game Component- Card games



```javascript## 📝 Notes

// src/games/my-game/MyGame.jsx

import React, { useEffect, useRef } from 'react';- Mock API enabled mặc định → Dev không cần backend

import * as Phaser from 'phaser';- Thêm game mới chỉ cần edit `gameRegistry.js`

- Mỗi game độc lập, không ảnh hưởng nhau

export default function MyGame({ onGameOver }) {- Platform handle UI, scoring, coins tự động

  // Implement game logic

  // Call onGameOver(score, playTime, gameplayData) when done## ⚡ Tại sao Vite?

}

```- **Dev server < 1s** vs CRA ~10s

- **Hot reload instant** vs CRA chậm

### 2. Register Game- **Build 10-20s** vs CRA 1-2 phút

- **Bundle nhỏ hơn** - Code splitting tự động

```javascript- **Modern** - CRA đã deprecated

// src/config/gameRegistry.js

import MyGame from '../games/my-game/MyGame';---



export const GAME_REGISTRY = [**Bắt đầu với:** `cd client && npm install && npm run dev`

  // ... existing games
  {
    id: 'my-game',
    name: 'My Game',
    description: 'Game description',
    icon: '🎮',
    thumbnail: '/assets/games/my-game/thumbnail.png',
    difficulty: 'medium',
    enabled: true,
    component: MyGame,
  },
];
```

### 3. Test & Deploy

```bash
npm run dev  # Test locally
npm run build # Build for production
```

## 🔧 Configuration

### Dynamic URLs

The platform automatically detects the parent origin:

```javascript
// GameList.jsx
const socialOrigin = document.referrer 
  ? new URL(document.referrer).origin 
  : window.location.origin.replace(':4000', ':3004');
```

No hardcoded localhost URLs! Works in:
- Development (localhost:3004 → localhost:4000)
- Production (chaotok.site → game.chaotok.site)

### Responsive Sizing

Games automatically calculate size based on viewport:

```javascript
const getGameSize = () => {
  const maxWidth = Math.min(window.innerWidth - 40, 900);
  const maxHeight = Math.min(window.innerHeight - 200, 600);
  const aspectRatio = 7 / 5;
  // ... calculate responsive size
};
```

## 🎨 Branding

### Colors
- Primary: `#4ECDC4` (Teal/Turquoise)
- Secondary: `#3AB0A8` (Darker Teal)
- Gradient: `linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)`

### Logo
- Location: `/logo.webp` (served from Social Client)
- Dynamic loading from parent origin

## 🔒 Security

### JWT Validation
- Token passed via URL query: `?token=${token}`
- Server validates JWT on protected endpoints
- Shared secret with Social Server

### CORS
- Only allow Social Network domains
- Production: `https://chaotok.site`, `https://game.chaotok.site`
- Development: `http://localhost:3004`, `http://localhost:4000`

### Content Security Policy
- Iframe allowed only from trusted origins
- postMessage communication with origin verification

## 📊 Monitoring

### Health Checks
```bash
# Game Server
curl https://game-api.chaotok.site/health

# Response: {"status":"ok","timestamp":"..."}
```

### Logs
```bash
# PM2 Logs (on EC2)
pm2 logs chaotok-game-server

# Nginx Logs
sudo tail -f /var/log/nginx/game-api.access.log
sudo tail -f /var/log/nginx/game-api.error.log
```

## 🐛 Troubleshooting

### Game not loading
1. Check browser console for errors
2. Verify token in URL
3. Check CORS headers: `Origin: https://chaotok.site`
4. Verify CloudFront distribution is active

### Home button not working
1. Check postMessage listener in GamesPage.jsx
2. Verify event.data.type === 'NAVIGATE_HOME'
3. Check iframe and parent window same protocol (HTTPS)

### Server crashes
1. Check PM2 logs: `pm2 logs chaotok-game-server --err`
2. Check system resources: `htop`, `df -h`
3. Verify .env file exists
4. Check MongoDB connection

## 📚 API Documentation

### Endpoints

**Public:**
- `GET /health` - Health check (no auth)

**Protected (JWT required):**
- `POST /api/games/:gameId/scores` - Submit score
- `GET /api/games/:gameId/leaderboard` - Get leaderboard
- `GET /api/user/stats` - Get user game stats

## 🤝 Contributing

1. Create feature branch
2. Test locally
3. Update documentation
4. Submit PR with screenshots

## 📝 License

Proprietary - Chaotok Team

## 👥 Team

- Backend: [Name]
- Frontend: [Name]
- Game Dev: [Name]
- DevOps: [Name]

---

**Last Updated:** 2025-11-13
**Version:** 1.0.0
**Status:** ✅ Ready for Production
#   c h a o t o k _ e g g _ c a t c h e r  
 