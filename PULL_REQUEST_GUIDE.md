# 🚀 Pull Request Guide - Zenith 26

## ⚠️ SECURITY CHECKLIST (COMPLETE BEFORE PR)

### Before Creating Pull Request:

1. **✅ Remove All Sensitive Information**
   - [ ] No real API keys in code
   - [ ] No database passwords
   - [ ] No JWT secrets
   - [ ] No authentication tokens
   - [ ] `.env` files are in `.gitignore`

2. **✅ Verify .gitignore**
   ```bash
   # Check if .env is being tracked
   git ls-files backend/.env
   # Should return NOTHING
   
   # If it returns the file, untrack it:
   git rm --cached backend/.env
   git commit -m "Remove .env from tracking"
   ```

3. **✅ Check for Exposed Secrets**
   ```bash
   # Search for potential secrets in tracked files
   git grep -i "password"
   git grep -i "secret"
   git grep -i "api_key"
   git grep -i "mongodb+srv"
   ```

4. **✅ Use Example Files Only**
   - Keep only `.env.example` files with placeholder values
   - Example format:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     CLOUDINARY_API_KEY=your_api_key_here
     ```

---

## 📝 Step-by-Step Pull Request Process

### Step 1: Prepare Your Branch

```bash
# Make sure you're on your feature branch
git status

# Check current branch
git branch

# If not on correct branch, switch to it
git checkout feature/marathon
```

### Step 2: Review Your Changes

```bash
# See what files have changed
git status

# See the actual changes
git diff

# Check staged changes
git diff --staged
```

### Step 3: Stage Your Changes

```bash
# Stage all changes
git add .

# OR stage specific files
git add frontend/src/pages/AdminMarathon.jsx
git add backend/controllers/marathon.controller.js

# Check what's staged
git status
```

### Step 4: Commit Your Changes

```bash
# Commit with a descriptive message
git commit -m "feat: Add marathon admin panel with payment verification

- Added view details modal for registrations
- Implemented payment verification system
- Added confirm/reject/delete actions for admin
- Enhanced UI with payment status tracking
- Fixed security issues by removing exposed secrets"
```

### Step 5: Push to Remote

```bash
# Push your branch to GitHub
git push origin feature/marathon

# If it's your first push on this branch
git push -u origin feature/marathon
```

### Step 6: Create Pull Request on GitHub

1. **Go to GitHub Repository**
   - Navigate to: https://github.com/atharva038/Zenith-26

2. **Click "Pull Requests" Tab**

3. **Click "New Pull Request"**

4. **Select Branches**
   - Base: `main` (or your default branch)
   - Compare: `feature/marathon`

5. **Fill Pull Request Template**

---

## 📋 Pull Request Template

Use this template when creating your PR:

```markdown
## 🎯 Description
Brief description of what this PR does

## ✨ Changes Made
- Added marathon admin panel with enhanced features
- Implemented payment verification system
- Added view details modal with complete registration info
- Added confirm/reject/delete actions for registrations
- Enhanced UI with better status indicators
- **Security:** Removed all exposed API keys and secrets

## 🔐 Security Updates
- [x] Removed exposed MongoDB credentials from documentation
- [x] Removed Cloudinary API keys from .env.example
- [x] Verified .env files are not tracked in git
- [x] Updated PRODUCTION_ENV_GUIDE.md with placeholder values

## 🖼️ Screenshots
[Optional: Add screenshots of new features]

## ✅ Testing
- [x] Tested locally on development server
- [x] Verified admin panel loads correctly
- [x] Confirmed all actions (view, confirm, reject, delete) work
- [x] Tested payment verification functionality

## 📱 Responsive Design
- [x] Works on desktop
- [x] Works on tablet
- [x] Works on mobile

## 🔗 Related Issues
Closes #[issue number if applicable]

## 📝 Notes for Reviewers
- Payment verification now requires admin action
- Modal shows complete registration details
- Status changes are reflected in real-time
```

---

## 🛡️ Security Best Practices

### What Should NEVER Be in Git:

❌ **Never Commit:**
- `.env` files
- Database passwords
- API keys or secrets
- JWT secrets
- OAuth tokens
- Private keys
- Connection strings with credentials

✅ **Always Use:**
- `.env.example` with placeholder values
- Environment variables in production
- Secret management tools
- `.gitignore` to exclude sensitive files

### If You Accidentally Committed Secrets:

**⚠️ URGENT STEPS:**

1. **Rotate ALL exposed credentials immediately:**
   - Change MongoDB password
   - Generate new JWT secret
   - Regenerate API keys
   - Update all services

2. **Remove from Git history:**
   ```bash
   # WARNING: This rewrites history
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch backend/.env" \
   --prune-empty --tag-name-filter cat -- --all
   
   # Force push (be careful!)
   git push origin --force --all
   ```

3. **Better approach - Use BFG Repo Cleaner:**
   ```bash
   # Install BFG
   # Download from: https://rtyley.github.io/bfg-repo-cleaner/
   
   # Remove secrets
   java -jar bfg.jar --delete-files .env
   
   # Clean up
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   
   # Force push
   git push origin --force --all
   ```

---

## 🎨 Commit Message Best Practices

### Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `security`: Security fixes

### Examples:
```bash
feat(marathon): Add payment verification system

- Implemented admin payment verification
- Added view details modal
- Enhanced registration status tracking

Closes #123
```

```bash
fix(admin): Fix registration delete functionality

- Fixed API endpoint for deletion
- Added confirmation dialog
- Improved error handling
```

```bash
security: Remove exposed credentials

- Removed MongoDB password from docs
- Sanitized .env.example file
- Updated security guidelines
```

---

## 🔍 Pre-Push Checklist

Before pushing, verify:

- [ ] ✅ All tests pass
- [ ] ✅ No console.log() statements (or they're intentional)
- [ ] ✅ No commented-out code
- [ ] ✅ Code is formatted properly
- [ ] ✅ No merge conflicts
- [ ] ✅ Branch is up-to-date with main
- [ ] ✅ Commit messages are clear
- [ ] ✅ No sensitive data in commits
- [ ] ✅ .env file is NOT in git
- [ ] ✅ All new dependencies are documented

---

## 🤝 After Creating PR

1. **Wait for CI/CD checks** (if configured)
2. **Respond to review comments**
3. **Make requested changes** in new commits
4. **Don't force push** after review has started
5. **Merge when approved** by maintainer

---

## 🆘 Common Issues

### Issue: ".env file is tracked in git"
**Solution:**
```bash
git rm --cached backend/.env
echo "backend/.env" >> .gitignore
git add .gitignore
git commit -m "chore: Untrack .env file"
```

### Issue: "Merge conflicts"
**Solution:**
```bash
# Update your branch with main
git checkout main
git pull origin main
git checkout feature/marathon
git merge main

# Resolve conflicts, then:
git add .
git commit -m "chore: Resolve merge conflicts"
```

### Issue: "Accidentally pushed secrets"
**Solution:**
1. **IMMEDIATELY** rotate all credentials
2. Follow the "Remove from Git history" steps above
3. Never reuse the exposed credentials

---

## 📚 Additional Resources

- [GitHub Pull Request Guide](https://docs.github.com/en/pull-requests)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

---

## ✅ Final Checklist Before PR

```bash
# 1. Security scan
git diff --name-only | xargs grep -l "password\|secret\|api_key" || echo "✅ No secrets found"

# 2. Check .env status
git ls-files backend/.env && echo "❌ .env IS TRACKED!" || echo "✅ .env not tracked"

# 3. Verify changes
git diff origin/main...HEAD --stat

# 4. Run tests (if you have them)
npm test

# 5. All good? Push!
git push origin feature/marathon
```

---

## 🎉 You're Ready!

Once you've completed all the steps above, you're ready to create your pull request. Good luck! 🚀
