#!/bin/bash

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🚀 Zenith 2026 - Production Deployment Script       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the project root
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Must be run from project root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Pre-deployment Checklist:${NC}"
echo "   1. Backend is running on DigitalOcean"
echo "   2. MongoDB is accessible"
echo "   3. Environment variables are set"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo -e "${GREEN}Step 1/3: Building Frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
fi

# Build for production
echo "   Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

echo -e "${GREEN}Step 2/3: Checking Production Environment...${NC}"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  Creating .env.production...${NC}"
    echo "VITE_API_URL=https://zenithapp-5onhx.ondigitalocean.app" > .env.production
    echo -e "${GREEN}✅ Created .env.production${NC}"
else
    echo "✅ .env.production exists"
fi

echo ""

echo -e "${GREEN}Step 3/3: Deployment Options${NC}"
echo "   Choose deployment method:"
echo "   1) Vercel"
echo "   2) Netlify"
echo "   3) Manual (copy dist folder)"
echo "   4) Skip deployment"
echo ""

read -p "Select option (1-4): " -n 1 -r
echo

case $REPLY in
    1)
        echo "   Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo -e "${RED}❌ Vercel CLI not installed. Install with: npm i -g vercel${NC}"
            echo "   Or deploy manually by pushing to GitHub"
        fi
        ;;
    2)
        echo "   Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod
        else
            echo -e "${RED}❌ Netlify CLI not installed. Install with: npm i -g netlify-cli${NC}"
            echo "   Or deploy manually through Netlify dashboard"
        fi
        ;;
    3)
        echo -e "${YELLOW}📦 Manual deployment:${NC}"
        echo "   1. Upload 'frontend/dist' folder to your hosting"
        echo "   2. Configure web server to serve index.html for all routes"
        ;;
    4)
        echo "   Skipping deployment"
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        ;;
esac

cd ..

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                    🎉 BUILD COMPLETE!                    ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "   1. Verify deployment is live"
echo "   2. Run backend admin setup:"
echo "      ${YELLOW}ssh your-server${NC}"
echo "      ${YELLOW}cd backend && node setupProductionAdmin.js${NC}"
echo "   3. Test login with:"
echo "      📧 Email: admin@zenith2026.com"
echo "      🔑 Password: Admin@123"
echo ""
echo -e "${GREEN}✅ Production ready!${NC}"
