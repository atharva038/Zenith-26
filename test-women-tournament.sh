#!/bin/bash

# Women's Tournament Integration Test Script

echo "🧪 Testing Women's Tournament Integration"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo "1️⃣ Checking if backend server is accessible..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend server is running${NC}"
else
    echo -e "${RED}❌ Backend server is not running. Please start it first.${NC}"
    echo "Run: cd backend && npm start"
    exit 1
fi

echo ""
echo "2️⃣ Testing Women's Tournament API endpoints..."

# Test registration endpoint (should work without auth)
echo -n "   Testing POST /api/women-tournament/register... "
RESPONSE=$(curl -s -X POST http://localhost:5000/api/women-tournament/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "registrationNumber": "TEST'$(date +%s)'",
    "mobileNumber": "9876543210",
    "selectedCategory": "category1",
    "selectedSports": ["Sack Race", "Balloon Bursting"],
    "category3TeamName": ""
  }')

if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Pass${NC}"
else
    echo -e "${RED}❌ Fail${NC}"
    echo "Response: $RESPONSE"
fi

# Test admin endpoint (should require auth)
echo -n "   Testing GET /api/women-tournament/admin/registrations (no auth)... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/women-tournament/admin/registrations)

if [ "$STATUS" -eq 401 ] || [ "$STATUS" -eq 403 ]; then
    echo -e "${GREEN}✅ Protected correctly (401/403)${NC}"
else
    echo -e "${YELLOW}⚠️  Unexpected status: $STATUS${NC}"
fi

echo ""
echo "3️⃣ Checking database model..."
if [ -f "backend/models/WomenTournament.js" ]; then
    echo -e "${GREEN}✅ WomenTournament model exists${NC}"
else
    echo -e "${RED}❌ WomenTournament model not found${NC}"
fi

echo ""
echo "4️⃣ Checking routes..."
if [ -f "backend/routes/womenTournament.routes.js" ]; then
    echo -e "${GREEN}✅ Women's Tournament routes exist${NC}"
else
    echo -e "${RED}❌ Women's Tournament routes not found${NC}"
fi

echo ""
echo "5️⃣ Checking frontend components..."
if [ -f "frontend/src/pages/AdminWomenTournament.jsx" ]; then
    echo -e "${GREEN}✅ Admin page exists${NC}"
else
    echo -e "${RED}❌ Admin page not found${NC}"
fi

echo ""
echo "6️⃣ Checking route configuration..."
if grep -q "AdminWomenTournament" "frontend/src/App.jsx"; then
    echo -e "${GREEN}✅ Route configured in App.jsx${NC}"
else
    echo -e "${RED}❌ Route not configured${NC}"
fi

if grep -q "women-tournament" "frontend/src/components/AdminSidebar.jsx"; then
    echo -e "${GREEN}✅ Sidebar link added${NC}"
else
    echo -e "${RED}❌ Sidebar link not found${NC}"
fi

echo ""
echo "=========================================="
echo "✨ Integration test complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Start backend: cd backend && npm start"
echo "   2. Start frontend: cd frontend && npm run dev"
echo "   3. Login to admin panel: http://localhost:5173/admin/login"
echo "   4. Navigate to Women's Tournament section"
echo "   5. Test form submission at: http://localhost:5173/women-tournament"
