# Quick Git Setup - Zenith 2026

## Initial Git Setup

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Restructured project with frontend and backend folders"

# Create main branch (if needed)
git branch -M main
```

## Connect to GitHub

### Option 1: New Repository
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/Zenith-26.git
git push -u origin main
```

### Option 2: Existing Repository
```bash
# If you already have a remote
git remote -v  # Check current remote

# Update remote if needed
git remote set-url origin https://github.com/yourusername/Zenith-26.git

# Push changes
git push -u origin main
```

## Recommended .gitignore

The project already includes a comprehensive `.gitignore` file that covers:
- ✅ node_modules
- ✅ Environment files (.env)
- ✅ Build outputs (dist, build)
- ✅ Editor files (.vscode, .idea)
- ✅ OS files (.DS_Store)
- ✅ Log files

## Branch Strategy

```bash
# Create development branch
git checkout -b develop

# Create feature branches
git checkout -b feature/backend-setup
git checkout -b feature/auth-system
git checkout -b feature/event-management

# Create hotfix branches
git checkout -b hotfix/critical-bug
```

## Commit Message Convention

Follow conventional commits:

```bash
# Features
git commit -m "feat: add user authentication"
git commit -m "feat: implement event registration"

# Bug fixes
git commit -m "fix: resolve theme toggle issue"
git commit -m "fix: correct animation timing"

# Documentation
git commit -m "docs: update README with setup instructions"

# Styling
git commit -m "style: improve homepage layout"

# Refactoring
git commit -m "refactor: optimize intro animation performance"

# Testing
git commit -m "test: add unit tests for auth service"
```

## Before First Push

```bash
# Check what will be committed
git status

# Review changes
git diff

# Check commit history
git log --oneline

# Ensure everything is ready
git add .
git commit -m "Initial commit: Project restructure with frontend/backend separation"
git push -u origin main
```

## Common Git Commands

```bash
# Check status
git status

# Stage specific files
git add frontend/src/components/NewComponent.jsx

# Commit with message
git commit -m "feat: add new component"

# Push to remote
git push

# Pull latest changes
git pull

# Create and switch to new branch
git checkout -b feature/new-feature

# Switch between branches
git checkout main
git checkout develop

# Merge branches
git merge feature/new-feature

# Delete branch
git branch -d feature/completed-feature
```

## GitHub Repository Setup

### Repository Name
`Zenith-26`

### Description
"Official repository for Zenith 2026 - SGGSIE&T Annual Sports Festival Platform. Where Champions Rise 🏆"

### Topics/Tags
- `sports-festival`
- `react`
- `vite`
- `tailwind-css`
- `nodejs`
- `express`
- `mongodb`
- `event-management`

### README Badges (Optional)
Add these to your README:

```markdown
![React](https://img.shields.io/badge/React-18.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-cyan)
![License](https://img.shields.io/badge/License-MIT-green)
```

## Protecting Main Branch

Once on GitHub:
1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable "Require pull request reviews"
4. Enable "Require status checks to pass"

---

**Ready to push? 🚀**

```bash
git add .
git commit -m "feat: initial project setup with frontend and backend structure"
git push -u origin main
```
