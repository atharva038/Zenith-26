# Project Scripts

This folder contains deployment, testing, and maintenance scripts for Zenith 2026.

## Deployment Scripts

### `deploy.sh`
Automated deployment script for production.

```bash
./scripts/deploy.sh
```

**Features:**
- Builds frontend and backend
- Runs tests
- Deploys to production server
- Handles environment configuration

## Testing Scripts

### `test-women-tournament.sh`
Test script for Women's Tournament functionality.

```bash
./scripts/test-women-tournament.sh
```

**What it tests:**
- Registration workflow
- Payment processing
- Admin panel operations
- Email notifications

## Maintenance Scripts

### `fix_marathon.py`
Python script to fix marathon-related database issues.

```bash
python scripts/fix_marathon.py
```

**Purpose:**
- Fixes data inconsistencies in marathon registrations
- Updates status fields
- Cleans up orphaned records

## Usage Guidelines

1. **Permissions**: Make scripts executable with `chmod +x script-name.sh`
2. **Environment**: Ensure correct environment variables are set
3. **Testing**: Always test scripts in development before production use
4. **Backups**: Create database backups before running maintenance scripts
5. **Logging**: Check logs after script execution for any errors

## Script Execution Order (For Fresh Setup)

1. Setup backend admin: `cd backend && node scripts/setupProductionAdmin.js`
2. Upload images: Run relevant upload scripts from `backend/scripts/`
3. Test functionality: `./scripts/test-women-tournament.sh`
4. Deploy: `./scripts/deploy.sh`

## Troubleshooting

- **Permission Denied**: Run `chmod +x script-name.sh`
- **Module Not Found**: Ensure `node_modules` are installed with `npm install`
- **Environment Issues**: Verify `.env` file exists and contains required variables
- **Python Errors**: Ensure Python 3.x is installed and required packages are available

## Contributing

When adding new scripts:
1. Add appropriate comments and documentation
2. Include error handling
3. Update this README with script details
4. Test thoroughly in development
