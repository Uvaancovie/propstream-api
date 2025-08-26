# Propstream API Quick Setup Script
# This script helps you get the API up and running quickly

param(
    [switch]$InstallDeps,
    [switch]$SetupEnv,
    [switch]$StartDev,
    [switch]$RunTests,
    [switch]$All
)

function Write-Step {
    param($Message)
    Write-Host "`n🔧 $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

Write-Host "🚀 Propstream API Setup" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green

if ($All) {
    $InstallDeps = $true
    $SetupEnv = $true
    $StartDev = $true
    $RunTests = $true
}

# Install Dependencies
if ($InstallDeps -or $All) {
    Write-Step "Installing npm dependencies..."
    try {
        npm install
        Write-Success "Dependencies installed successfully"
    } catch {
        Write-Error "Failed to install dependencies"
        exit 1
    }
}

# Setup Environment
if ($SetupEnv -or $All) {
    Write-Step "Setting up environment file..."
    if (Test-Path ".env") {
        Write-Host "⚠️  .env file already exists" -ForegroundColor Yellow
        $overwrite = Read-Host "Overwrite existing .env file? (y/N)"
        if ($overwrite -eq "y" -or $overwrite -eq "Y") {
            Copy-Item ".env.example" ".env" -Force
            Write-Success "Environment file created from template"
        } else {
            Write-Host "Keeping existing .env file" -ForegroundColor Yellow
        }
    } else {
        Copy-Item ".env.example" ".env"
        Write-Success "Environment file created from template"
    }
    
    Write-Host "`n📝 Please edit .env file with your actual values:" -ForegroundColor Yellow
    Write-Host "   - MONGODB_URI: Your MongoDB connection string" -ForegroundColor Cyan
    Write-Host "   - JWT_SECRET: A secure random string" -ForegroundColor Cyan
    Write-Host "   - Payfast credentials (if using billing features)" -ForegroundColor Cyan
}

# Start Development Server
if ($StartDev -or $All) {
    Write-Step "Starting development server..."
    Write-Host "Server will start at http://localhost:4000" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    
    if ($RunTests) {
        Write-Host "`nNote: Tests will run after server starts" -ForegroundColor Yellow
        Write-Host "Wait for 'MongoDB connected' message, then press Enter to run tests..." -ForegroundColor Yellow
        
        # Start server in background
        Start-Job -Name "PropstreamAPI" -ScriptBlock { 
            Set-Location $using:PWD
            npm run dev 
        } | Out-Null
        
        # Wait for server to start
        Start-Sleep -Seconds 5
        
        # Check if server is running
        try {
            Invoke-RestMethod -Uri "http://localhost:4000/health" -TimeoutSec 10 | Out-Null
            Write-Success "Server is running!"
        } catch {
            Write-Error "Server failed to start properly"
            Get-Job -Name "PropstreamAPI" | Stop-Job
            exit 1
        }
    } else {
        npm run dev
    }
}

# Run Tests
if ($RunTests -and -not $StartDev) {
    Write-Step "Running API tests..."
    .\test-api.ps1
}

if ($RunTests -and $StartDev) {
    Write-Host "`nPress Enter to run tests..." -ForegroundColor Yellow
    Read-Host
    .\test-api.ps1
    
    Write-Host "`nStopping development server..." -ForegroundColor Yellow
    Get-Job -Name "PropstreamAPI" | Stop-Job
    Get-Job -Name "PropstreamAPI" | Remove-Job
}

if (-not ($InstallDeps -or $SetupEnv -or $StartDev -or $RunTests -or $All)) {
    Write-Host "`nUsage:" -ForegroundColor Yellow
    Write-Host "  .\setup.ps1 -All              # Complete setup and start server" -ForegroundColor Cyan
    Write-Host "  .\setup.ps1 -InstallDeps      # Install npm dependencies" -ForegroundColor Cyan
    Write-Host "  .\setup.ps1 -SetupEnv         # Create .env file" -ForegroundColor Cyan
    Write-Host "  .\setup.ps1 -StartDev         # Start development server" -ForegroundColor Cyan
    Write-Host "  .\setup.ps1 -RunTests         # Run API tests" -ForegroundColor Cyan
    Write-Host "`nQuick start: .\setup.ps1 -All" -ForegroundColor Green
}

Write-Host "`n🎉 Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. 📖 Read README.md for detailed documentation" -ForegroundColor Cyan
Write-Host "2. 📋 Check API_TESTING_GUIDE.md for testing examples" -ForegroundColor Cyan
Write-Host "3. 🌐 Visit http://localhost:4000 for API documentation" -ForegroundColor Cyan
Write-Host "4. 🔧 Configure MongoDB and other services in .env" -ForegroundColor Cyan
