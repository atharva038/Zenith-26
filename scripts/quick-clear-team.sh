#!/bin/bash

# Quick cleanup script without confirmation (for development use)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

echo ""
echo "🧹 Quick Team Data Cleanup (No Confirmation)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd "$BACKEND_DIR" || exit 1
node scripts/clearAllTeamMembers.js
