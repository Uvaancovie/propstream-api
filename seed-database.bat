@echo off
echo 🌱 PropStream Database Seeding Script
echo =====================================

REM Check if SQL files exist
if not exist "seed-sql.sql" (
    echo ❌ Error: seed-sql.sql not found. Please run this script from the propstream-api directory.
    pause
    exit /b 1
)

if not exist "seed-simple.sql" (
    echo ❌ Error: seed-simple.sql not found. Please run this script from the propstream-api directory.
    pause
    exit /b 1
)

REM Get database URL from environment or user input
if "%DATABASE_URL%"=="" (
    echo 🔗 DATABASE_URL not found in environment variables.
    set /p DATABASE_URL="Please enter your PostgreSQL database URL: "
)

if "%DATABASE_URL%"=="" (
    echo ❌ Error: Database URL is required.
    pause
    exit /b 1
)

echo 🚀 Connecting to database...
echo.

REM Menu for seed options
echo Choose seeding option:
echo 1. Simple seed (matches frontend localStorage data)
echo 2. Comprehensive seed (full demo data with more properties/bookings)
echo 3. Both (simple first, then comprehensive)
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo 🌱 Running simple seed...
    psql "%DATABASE_URL%" -f "seed-simple.sql"
    if %ERRORLEVEL% equ 0 (
        echo ✅ Simple seed completed successfully!
    ) else (
        echo ❌ Simple seed failed!
        goto error
    )
) else if "%choice%"=="2" (
    echo 🌱 Running comprehensive seed...
    psql "%DATABASE_URL%" -f "seed-sql.sql"
    if %ERRORLEVEL% equ 0 (
        echo ✅ Comprehensive seed completed successfully!
    ) else (
        echo ❌ Comprehensive seed failed!
        goto error
    )
) else if "%choice%"=="3" (
    echo 🌱 Running both seed files...
    echo    📝 Step 1: Simple seed...
    psql "%DATABASE_URL%" -f "seed-simple.sql"
    if %ERRORLEVEL% equ 0 (
        echo    ✅ Simple seed completed successfully!
    ) else (
        echo    ❌ Simple seed failed!
        goto error
    )
    
    echo    📝 Step 2: Comprehensive seed...
    psql "%DATABASE_URL%" -f "seed-sql.sql"
    if %ERRORLEVEL% equ 0 (
        echo    ✅ Comprehensive seed completed successfully!
        echo ✅ Both seed files executed successfully!
    ) else (
        echo    ❌ Comprehensive seed failed!
        goto error
    )
) else (
    echo ❌ Invalid choice. Exiting.
    pause
    exit /b 1
)

echo.
echo 🎉 Seeding completed! Your database now contains:
echo    • Demo users (realtors and clients)
echo    • Sample properties with images and amenities
echo    • Booking examples with various statuses
echo    • Newsletter subscriptions
echo.
echo 🔐 Test login credentials:
echo    Realtor: realtor@test.com / password123
echo    Client:  client@test.com / password123
echo.
echo 🚀 Start your servers and test the functionality!
echo.
pause
exit /b 0

:error
echo.
echo 💡 Troubleshooting tips:
echo    - Make sure PostgreSQL client (psql) is installed and in PATH
echo    - Verify your DATABASE_URL is correct
echo    - Check if your database tables exist (run database-setup.js first)
echo.
pause
exit /b 1
