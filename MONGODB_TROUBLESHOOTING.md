# MongoDB Connection Troubleshooting Guide

## Error: "queryTxt EREFUSED cluster0.fjw1q9u.mongodb.net"

This DNS resolution error means your application cannot reach your MongoDB cluster. Here's how to fix it:

### Solution 1: Add Your IP to MongoDB Atlas Whitelist (MOST COMMON FIX)

1. Go to [MongoDB Atlas](https://account.mongodb.com/account/login)
2. Log in to your account
3. Go to your cluster "Cluster0"
4. Click **Network Access** (left sidebar)
5. Click **+ ADD IP ADDRESS**
6. Select **Allow Access from Anywhere** OR manually add your current IP:
   - Your current IP appears when you click "Add Current IP Address"
   - Or go to whatismyipaddress.com to find your IP
7. Click **Confirm**

**Note:** For development, "Allow Access from Anywhere" (0.0.0.0/0) is fine. For production, add specific IPs.

### Solution 2: Verify Connection String Format

Make sure your `.env` file has the correct format:

```
VITE_MONGODB_URI=mongodb+srv://username:password@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0
```

- `username` = Your MongoDB user (not email)
- `password` = Your MongoDB password (URL-encoded if it has special chars)
- `cluster0.fjw1q9u.mongodb.net` = Your actual cluster URL

### Solution 3: Check Your Cluster Status

1. Go to MongoDB Atlas > Clusters
2. Make sure your cluster shows **"Running"** (not paused or terminated)
3. If paused, click the play button to resume it

### Solution 4: Verify Database & Collections Exist

Make sure you've run the setup script to create collections:

```bash
npm run setup:db
```

This creates:
- Database: `trolley`
- Collections: products, categories, orders, customers, reviews, subcategories

### Solution 5: Test Connection String

Use MongoDB Compass to test your connection:
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Paste your connection string
3. Click **Connect**

If it fails here too, the issue is with MongoDB Atlas settings, not your app code.

### Solution 6: Check Special Characters in Password

If your MongoDB password contains special characters (e.g., `@`, `#`, `!`, etc.), they must be URL-encoded:

- `@` → `%40`
- `#` → `%23`
- `!` → `%21`
- `:` → `%3A`
- `/` → `%2F`

Example:
```
Password: pass@word#123
Encoded in URL: pass%40word%23123
```

## Server Won't Start

If you see: `npm run server exited with code 1`

**This is now fixed!** The server will start even if MongoDB isn't connected, but you'll see a warning. Once you whitelist your IP in MongoDB Atlas, reconnect and it will work.

## Frontend Shows Empty Dashboard

If the dashboard shows but no data appears:
1. Make sure the backend server is running (you should see `[v0] Server running on http://localhost:3001`)
2. Check browser console (F12 > Console) for API errors
3. Verify MongoDB Atlas network access is configured (Solution 1 above)

## Port Issues

Make sure:
- **Backend runs on port 3001**: `http://localhost:3001`
- **Frontend runs on port 8080**: `http://localhost:8080`
- Both ports are not already in use

Check with:
```bash
# On Mac/Linux
lsof -i :3001
lsof -i :8080

# On Windows
netstat -ano | findstr :3001
```

## Still Not Working?

1. Check that the connection string is correct (copy from MongoDB Atlas > Connect > Connection String)
2. Verify your IP is whitelisted in Network Access
3. Restart both servers:
   ```bash
   npm run dev:all
   ```
4. Check server logs for connection messages starting with `[v0]`
