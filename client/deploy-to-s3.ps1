# Deploy Game Client to S3 and CloudFront
# Usage: .\deploy-game-client.ps1

$ErrorActionPreference = "Stop"

# ==================== CONFIGURATION ====================
$S3_BUCKET = "game-chaotok-site"  # UPDATE THIS
$CLOUDFRONT_ID = "E1234567890ABC"  # UPDATE THIS
$REGION = "ap-southeast-1"
$BUILD_FOLDER = "dist"

# Colors
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  CHAOTOK GAME CLIENT DEPLOYMENT" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# ==================== CHECK AWS CLI ====================
Write-Host "[1/6] Checking AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version
    Write-Host "  ✅ AWS CLI found" -ForegroundColor Green
} catch {
    Write-Host "  ❌ AWS CLI not found!" -ForegroundColor Red
    Write-Host "  Download: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# ==================== CHECK NODE & NPM ====================
Write-Host ""
Write-Host "[2/6] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js not found!" -ForegroundColor Red
    exit 1
}

# ==================== INSTALL DEPENDENCIES ====================
Write-Host ""
Write-Host "[3/6] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Dependencies installed" -ForegroundColor Green

# ==================== BUILD ====================
Write-Host ""
Write-Host "[4/6] Building production bundle..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Build failed!" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $BUILD_FOLDER)) {
    Write-Host "  ❌ Build folder not found: $BUILD_FOLDER" -ForegroundColor Red
    exit 1
}

Write-Host "  ✅ Build successful" -ForegroundColor Green

# ==================== UPLOAD TO S3 ====================
Write-Host ""
Write-Host "[5/6] Uploading to S3..." -ForegroundColor Yellow

# Backup current version
Write-Host "  Creating backup..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFolder = "backup_$timestamp"
aws s3 sync "s3://$S3_BUCKET/" "s3://$S3_BUCKET-backups/$backupFolder/" --region $REGION --quiet

# Upload all files with long cache (except index.html)
Write-Host "  Uploading static assets..." -ForegroundColor Cyan
aws s3 sync "$BUILD_FOLDER/" "s3://$S3_BUCKET/" `
    --delete `
    --region $REGION `
    --cache-control "max-age=31536000, public" `
    --exclude "index.html" `
    --exclude "*.map"

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ S3 upload failed!" -ForegroundColor Red
    exit 1
}

# Upload index.html with no cache
Write-Host "  Uploading index.html..." -ForegroundColor Cyan
aws s3 cp "$BUILD_FOLDER/index.html" "s3://$S3_BUCKET/index.html" `
    --cache-control "no-cache, no-store, must-revalidate" `
    --region $REGION

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ index.html upload failed!" -ForegroundColor Red
    exit 1
}

Write-Host "  ✅ Files uploaded to S3" -ForegroundColor Green

# ==================== INVALIDATE CLOUDFRONT ====================
Write-Host ""
Write-Host "[6/6] Invalidating CloudFront cache..." -ForegroundColor Yellow

$invalidation = aws cloudfront create-invalidation `
    --distribution-id $CLOUDFRONT_ID `
    --paths "/*" `
    --query 'Invalidation.Id' `
    --output text

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ CloudFront invalidation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "  ✅ Invalidation created: $invalidation" -ForegroundColor Green
Write-Host "  ⏳ Waiting for invalidation to complete (this may take 1-2 minutes)..." -ForegroundColor Cyan

# Wait for invalidation
aws cloudfront wait invalidation-completed `
    --distribution-id $CLOUDFRONT_ID `
    --id $invalidation

Write-Host "  ✅ CloudFront cache invalidated" -ForegroundColor Green

# ==================== SUMMARY ====================
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  ✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Game Client URL: https://game.chaotok.site" -ForegroundColor Cyan
Write-Host "S3 Bucket: $S3_BUCKET" -ForegroundColor Cyan
Write-Host "CloudFront: $CLOUDFRONT_ID" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backup stored at: s3://$S3_BUCKET-backups/$backupFolder/" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎮 Game is now live! Test at: https://game.chaotok.site" -ForegroundColor Cyan
Write-Host ""
