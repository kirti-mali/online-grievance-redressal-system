# Test Users Registration Script

$apiUrl = "http://localhost:5002/api/auth"

$testUsers = @(
    @{ name = "John Citizen"; email = "citizen@test.com"; password = "TestPass123!"; role = "citizen" },
    @{ name = "Jane Staff"; email = "staff@test.com"; password = "TestPass123!"; role = "staff" },
    @{ name = "Admin User"; email = "admin@test.com"; password = "TestPass123!"; role = "admin" }
)

Write-Host "Starting test user registration..."

foreach ($user in $testUsers) {
    Write-Host "Registering $($user.role): $($user.name)"
    
    $body = @{
        name = $user.name
        email = $user.email
        password = $user.password
        role = $user.role
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$apiUrl/register" -Method Post -ContentType "application/json" -Body $body
        Write-Host "Success: $($user.email)"
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

Write-Host "`nTest Credentials:"
Write-Host "Citizen  : citizen@test.com / TestPass123!"
Write-Host "Staff    : staff@test.com / TestPass123!"
Write-Host "Admin    : admin@test.com / TestPass123!"
