# Health Hub Live - Startup Script

Write-Host "🏥 Starting Health Hub Live..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exist in server
if (-not (Test-Path "server\node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

# Check if node_modules exist in root
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🚀 Starting Backend Server (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "🌐 Starting Frontend Server (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Both servers starting..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "🌐 Frontend: https://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "🔒 IMPORTANT: The site now uses HTTPS for location access!" -ForegroundColor Yellow
Write-Host "   Your browser may show a security warning for the self-signed certificate." -ForegroundColor White
Write-Host "   Click 'Advanced' and 'Proceed to localhost' to continue." -ForegroundColor White
Write-Host ""
Write-Host "🔐 Test Login:" -ForegroundColor Yellow
Write-Host "   Email: test@example.com" -ForegroundColor White
Write-Host "   Password: password123" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Note: Close both PowerShell windows to stop the servers" -ForegroundColor Yellow
