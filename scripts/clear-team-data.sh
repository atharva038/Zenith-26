#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   🧹 ZENITH 2026 - Team Member Data Cleanup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${RED}⚠️  WARNING: This will permanently delete ALL team member data!${NC}"
echo -e "${YELLOW}This includes:${NC}"
echo -e "  • All team member records from MongoDB"
echo -e "  • All team member photos from Cloudinary"
echo -e "  • This action CANNOT be undone!\n"

read -p "$(echo -e ${YELLOW}"Are you sure you want to continue? Type 'yes' to proceed: "${NC})" -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]
then
    echo -e "${GREEN}✅ Operation cancelled. No data was deleted.${NC}\n"
    exit 0
fi

echo -e "\n${YELLOW}🔄 Running cleanup script...${NC}\n"

# Change to backend directory
cd "$BACKEND_DIR" || exit 1

# Run the Node.js cleanup script
node scripts/clearAllTeamMembers.js

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "\n${GREEN}✅ Cleanup completed successfully!${NC}\n"
else
    echo -e "\n${RED}❌ Cleanup failed with exit code: $EXIT_CODE${NC}\n"
    exit $EXIT_CODE
fi
