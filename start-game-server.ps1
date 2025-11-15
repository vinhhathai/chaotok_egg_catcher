# Chaotok Game Server - Setup & Run Script

Write-Host "🎮 Chaotok Game Server Setup" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Navigate to server directory
Set-Location -Path "server"

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "`n⚙️  Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env created. Please edit it with your settings." -ForegroundColor Green
}

# Initialize games
Write-Host "`n🎮 Initializing games in database..." -ForegroundColor Yellow
npm run init-games

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Game initialization failed. Make sure MongoDB is running." -ForegroundColor Yellow
}

# Start server
Write-Host "`n🚀 Starting game server..." -ForegroundColor Green
npm run dev
