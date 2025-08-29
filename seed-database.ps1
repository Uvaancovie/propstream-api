# Seed Database Script for PropStream
# This script will populate your PostgreSQL database with demo data

Write-Host "🌱 PropStream Database Seeding Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "seed-sql.sql")) {
    Write-Host "❌ Error: seed-sql.sql not found. Please run this script from the propstream-api directory." -ForegroundColor Red
    exit 1
}

# Load environment variables if .env exists
if (Test-Path ".env") {
    Write-Host "📄 Loading environment variables from .env file..." -ForegroundColor Yellow
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#].*)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

# Get database URL from environment or prompt user
$DATABASE_URL = $env:DATABASE_URL
if (-not $DATABASE_URL) {
    Write-Host "🔗 DATABASE_URL not found in environment variables." -ForegroundColor Yellow
    $DATABASE_URL = Read-Host "Please enter your PostgreSQL database URL"
}

if (-not $DATABASE_URL) {
    Write-Host "❌ Error: Database URL is required." -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Connecting to database..." -ForegroundColor Cyan

# Menu for seed options
Write-Host ""
Write-Host "Choose seeding option:" -ForegroundColor Yellow
Write-Host "1. Simple seed (matches frontend localStorage data)" -ForegroundColor White
Write-Host "2. Comprehensive seed (full demo data with more properties/bookings)" -ForegroundColor White
Write-Host "3. Both (simple first, then comprehensive)" -ForegroundColor White

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "🌱 Running simple seed..." -ForegroundColor Green
        $sqlFile = "seed-simple.sql"
    }
    "2" {
        Write-Host "🌱 Running comprehensive seed..." -ForegroundColor Green
        $sqlFile = "seed-sql.sql"
    }
    "3" {
        Write-Host "🌱 Running both seed files..." -ForegroundColor Green
        
        # Run simple seed first
        Write-Host "   📝 Step 1: Simple seed..." -ForegroundColor Cyan
        try {
            psql $DATABASE_URL -f "seed-simple.sql"
            Write-Host "   ✅ Simple seed completed successfully!" -ForegroundColor Green
        }
        catch {
            Write-Host "   ❌ Simple seed failed: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # Run comprehensive seed
        Write-Host "   📝 Step 2: Comprehensive seed..." -ForegroundColor Cyan
        $sqlFile = "seed-sql.sql"
    }
    default {
        Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

# Execute the SQL file(s)
try {
    if ($choice -ne "3") {
        Write-Host "📝 Executing $sqlFile..." -ForegroundColor Cyan
        psql $DATABASE_URL -f $sqlFile
        Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
    } else {
        # For option 3, run the comprehensive seed as step 2
        psql $DATABASE_URL -f $sqlFile
        Write-Host "   ✅ Comprehensive seed completed successfully!" -ForegroundColor Green
        Write-Host "✅ Both seed files executed successfully!" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Error seeding database: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "   - Make sure PostgreSQL client (psql) is installed and in PATH" -ForegroundColor White
    Write-Host "   - Verify your DATABASE_URL is correct" -ForegroundColor White
    Write-Host "   - Check if your database tables exist (run database-setup.js first)" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "🎉 Seeding completed! Your database now contains:" -ForegroundColor Green
Write-Host "   • Demo users (realtors and clients)" -ForegroundColor White
Write-Host "   • Sample properties with images and amenities" -ForegroundColor White
Write-Host "   • Booking examples with various statuses" -ForegroundColor White
Write-Host "   • Newsletter subscriptions" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Test login credentials:" -ForegroundColor Cyan
Write-Host "   Realtor: realtor@test.com / password123" -ForegroundColor White
Write-Host "   Client:  client@test.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Start your servers and test the functionality!" -ForegroundColor Green
