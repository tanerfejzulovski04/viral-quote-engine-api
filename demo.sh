#!/bin/bash

echo "=== Viral Quote Engine API Demo ==="
echo ""

BASE_URL="http://localhost:8000"

echo "1. Starting the API server..."
php -S localhost:8000 api-server.php &
SERVER_PID=$!
sleep 3

echo "2. Testing API root endpoint..."
curl -s "$BASE_URL/api/" | jq .
echo ""

echo "3. Registering a new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"password123","password_confirmation":"password123"}')

echo "$REGISTER_RESPONSE" | jq .
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r .token)
echo ""

echo "4. Getting user profile with token..."
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/auth/me" | jq .
echo ""

echo "5. Logging out..."
curl -s -X POST -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/auth/logout" | jq .
echo ""

echo "6. Trying to access profile after logout (should fail)..."
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/auth/me" | jq .
echo ""

echo "7. Testing login with existing user..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}')

echo "$LOGIN_RESPONSE" | jq .
NEW_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r .token)
echo ""

echo "8. Getting profile with new login token..."
curl -s -H "Authorization: Bearer $NEW_TOKEN" "$BASE_URL/api/auth/me" | jq .
echo ""

echo "9. Testing validation errors..."
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalid-email","password":"123"}' | jq .
echo ""

echo "=== Demo Complete ==="
kill $SERVER_PID