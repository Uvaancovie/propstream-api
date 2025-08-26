# Propstream API Test Script
# This PowerShell script tests all major API endpoints

Write-Host "🚀 Starting Propstream API Test Suite" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

$baseUrl = "http://localhost:4000"

# Test 1: API Welcome/Documentation
Write-Host "`n1. Testing API Welcome Page..." -ForegroundColor Yellow
try {
    $welcome = Invoke-RestMethod -Uri $baseUrl -Method GET
    Write-Host "✅ Welcome page loaded successfully" -ForegroundColor Green
    Write-Host "   API Version: $($welcome.version)" -ForegroundColor Cyan
    Write-Host "   Description: $($welcome.description)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to load welcome page" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Health Check
Write-Host "`n2. Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health check passed" -ForegroundColor Green
    Write-Host "   Status: $($health.message)" -ForegroundColor Cyan
    Write-Host "   Uptime: $([math]::Round($health.uptime, 2)) seconds" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Health check failed" -ForegroundColor Red
}

# Test 3: User Registration
Write-Host "`n3. Testing User Registration..." -ForegroundColor Yellow
$testUser = @{
    email = "test-$(Get-Random)@example.com"
    password = "password123"
    name = "Test User"
} | ConvertTo-Json

try {
    $registration = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -ContentType "application/json" -Body $testUser
    Write-Host "✅ User registration successful" -ForegroundColor Green
    Write-Host "   User ID: $($registration.user.id)" -ForegroundColor Cyan
    Write-Host "   Email: $($registration.user.email)" -ForegroundColor Cyan
    $token = $registration.token
} catch {
    Write-Host "❌ User registration failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: Authentication Required Endpoint (without token)
Write-Host "`n4. Testing Authentication Error..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/api/properties" -Method GET
    Write-Host "❌ Should have required authentication" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Authentication properly required" -ForegroundColor Green
        Write-Host "   Correct 401 error returned" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Unexpected error" -ForegroundColor Red
    }
}

# Test 5: User Profile (with token)
Write-Host "`n5. Testing Authenticated Request..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}
try {
    $userProfile = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method GET -Headers $headers
    Write-Host "✅ Authenticated request successful" -ForegroundColor Green
    Write-Host "   User: $($userProfile.user.name) ($($userProfile.user.email))" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Authenticated request failed" -ForegroundColor Red
}

# Test 6: Create Property
Write-Host "`n6. Testing Property Creation..." -ForegroundColor Yellow
$property = @{
    title = "Test Beach House"
    address = "123 Ocean Drive, Test City"
    description = "A beautiful test property"
    amenities = @("WiFi", "Pool", "Kitchen")
} | ConvertTo-Json

try {
    $newProperty = Invoke-RestMethod -Uri "$baseUrl/api/properties" -Method POST -ContentType "application/json" -Body $property -Headers $headers
    Write-Host "✅ Property created successfully" -ForegroundColor Green
    Write-Host "   Property ID: $($newProperty.property._id)" -ForegroundColor Cyan
    Write-Host "   Title: $($newProperty.property.title)" -ForegroundColor Cyan
    $propertyId = $newProperty.property._id
} catch {
    Write-Host "❌ Property creation failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: List Properties
Write-Host "`n7. Testing Property Listing..." -ForegroundColor Yellow
try {
    $properties = Invoke-RestMethod -Uri "$baseUrl/api/properties" -Method GET -Headers $headers
    Write-Host "✅ Properties listed successfully" -ForegroundColor Green
    Write-Host "   Count: $($properties.count)" -ForegroundColor Cyan
    Write-Host "   Message: $($properties.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Property listing failed" -ForegroundColor Red
}

# Test 8: Create Booking
if ($propertyId) {
    Write-Host "`n8. Testing Booking Creation..." -ForegroundColor Yellow
    $booking = @{
        propertyId = $propertyId
        start = "2024-01-15T15:00:00Z"
        end = "2024-01-22T11:00:00Z"
        guestName = "John Doe"
        guestEmail = "john.doe@example.com"
        notes = "Test booking"
    } | ConvertTo-Json

    try {
        $newBooking = Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method POST -ContentType "application/json" -Body $booking -Headers $headers
        Write-Host "✅ Booking created successfully" -ForegroundColor Green
        Write-Host "   Booking ID: $($newBooking.booking._id)" -ForegroundColor Cyan
        Write-Host "   Guest: $($newBooking.booking.guestName)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Booking creation failed" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test 9: Get iCal Export URL
    Write-Host "`n9. Testing iCal Export URL..." -ForegroundColor Yellow
    try {
        $icalUrl = Invoke-RestMethod -Uri "$baseUrl/api/platforms/$propertyId/ics-export" -Method GET -Headers $headers
        Write-Host "✅ iCal export URL generated" -ForegroundColor Green
        Write-Host "   URL: $($icalUrl.url)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ iCal export URL generation failed" -ForegroundColor Red
    }
}

# Test 10: List Bookings
Write-Host "`n10. Testing Booking Listing..." -ForegroundColor Yellow
try {
    $bookings = Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method GET -Headers $headers
    Write-Host "✅ Bookings listed successfully" -ForegroundColor Green
    Write-Host "   Count: $($bookings.count)" -ForegroundColor Cyan
    Write-Host "   Message: $($bookings.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Booking listing failed" -ForegroundColor Red
}

# Test 11: 404 Error
Write-Host "`n11. Testing 404 Error Handling..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/api/nonexistent" -Method GET
    Write-Host "❌ Should have returned 404" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ 404 error properly handled" -ForegroundColor Green
        Write-Host "   Helpful error message provided" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Unexpected error type" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n" + "="*50 -ForegroundColor Green
Write-Host "🎉 API Test Suite Complete!" -ForegroundColor Green
Write-Host "="*50 -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. 📖 Read the API_TESTING_GUIDE.md for detailed examples" -ForegroundColor Cyan
Write-Host "2. 🌐 Visit http://localhost:4000 for full API documentation" -ForegroundColor Cyan
Write-Host "3. 🔧 Configure your .env file with MongoDB and Payfast credentials" -ForegroundColor Cyan
Write-Host "4. 🚀 Start building your frontend with this API!" -ForegroundColor Cyan
Write-Host "`nToken for further testing: $token" -ForegroundColor Magenta
