# Deploying to Railway

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (recommended)

## Step 2: Create a New Project
1. Click "New Project" → Select "Deploy from GitHub"
2. Connect your GitHub account
3. Select the `marks-site` repository
4. Railway will auto-detect and deploy

## Step 3: Add PostgreSQL Database
1. In your Railway project, click "Add Service"
2. Select "PostgreSQL"
3. Railway creates a PostgreSQL database automatically

## Step 4: Connect Database to Your App
Railway automatically sets environment variables. Verify in your dashboard:

**Look for these variables (set automatically):**
- `DATABASE_URL` (full connection string)
- Or individual variables:
  - `DB_HOST`
  - `DB_USER` 
  - `DB_PASSWORD`
  - `DB_PORT`
  - `DB_NAME`

## Step 5: View Your Live App
Once deployed, Railway provides a URL like:
```
https://your-app-name.railway.app
```

## Step 6: Initialize Database (First Time Only)
The database starts empty. Run this SQL in a PostgreSQL client:

```sql
CREATE TABLE marks (
  roll VARCHAR(20) PRIMARY KEY,
  name VARCHAR(50),
  math INT,
  phy INT,
  chem INT
);

-- Add sample data
INSERT INTO marks VALUES ('101', 'John Doe', 85, 90, 88);
```

## Important: Update Environment Variables
If Railway's database variables don't match our code, add custom variables:

**Railway Dashboard → Variables:**
```
DB_USER=postgres
DB_PASSWORD=<from Railway PostgreSQL>
DB_HOST=<from Railway PostgreSQL>
DB_PORT=5432
DB_NAME=railway
DB_SSL=true
```

## Testing After Deployment
1. Visit your Railway URL
2. Enter roll number `101`
3. Click Search
4. Should see John Doe's marks

## Troubleshooting

**"DB Error" message?**
- Check Environment Variables match your PostgreSQL details
- Verify the `marks` table exists in the database

**Stuck on loading?**
- Check Railway build logs (click your app → "Logs")
- Ensure `npm run build` completes successfully

**Need to restart?**
- Railway → Your App → Redeploy

## Local Development Still Works
```bash
npm run dev
# Uses localhost database (server.js reads DB_HOST=localhost from .env)
```

## Switching Between Local and Railway

**Local (.env file):**
```
DB_HOST=localhost
DB_PASSWORD=plmokn
```

**Railway (set in dashboard):**
```
DB_HOST=your-railway-host.railway.app
DB_PASSWORD=your-railway-password
DB_SSL=true
```
