# Vercel Deployment Guide - MongoDB Dashboard

## What Changed

Your app had a critical issue: the frontend was trying to call a backend server at `http://localhost:3001` which doesn't exist when deployed to Vercel. 

**Solution**: I've converted your Node.js backend server (`server.js`) into **Vercel serverless functions** that run in the `/api` directory. These functions automatically handle your MongoDB connections.

## Setup Instructions

### 1. Ensure Environment Variables are Set in Vercel

Go to your Vercel project settings and add these environment variables:

```
MONGODB_URI=mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=trolley
```

These are read from:
- `process.env.MONGODB_URI` (from your `.env` file)
- `process.env.MONGODB_DB_NAME` (defaults to `trolley`)

### 2. Deploy to Vercel

```bash
# Option A: Using Vercel CLI
vercel --prod

# Option B: Push to GitHub and auto-deploy
git add .
git commit -m "Convert backend to Vercel serverless functions"
git push origin main
```

### 3. How It Works

**Before (Broken)**:
- Frontend at `vipin-gupta-dashboard1.vercel.app` tried to call `http://localhost:3001/api/products`
- This URL doesn't exist in production → `ERR_CONNECTION_REFUSED`

**After (Fixed)**:
- Frontend at `vipin-gupta-dashboard1.vercel.app` calls `/api/products`
- Vercel automatically routes `/api/products` → `api/products.ts` serverless function
- Function connects directly to MongoDB Atlas → data loads successfully

## API Endpoints

All endpoints are now under `/api`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/api/products` | Get all products |
| `POST` | `/api/products` | Create product |
| `PUT`  | `/api/products?id=ID` | Update product |
| `DELETE` | `/api/products?id=ID` | Delete product |
| `GET`  | `/api/categories` | Get all categories |
| `POST` | `/api/categories` | Create category |
| `PUT`  | `/api/categories?id=ID` | Update category |
| `DELETE` | `/api/categories?id=ID` | Delete category |
| `GET`  | `/api/customers` | Get all customers |
| `GET`  | `/api/orders` | Get all orders |
| `POST` | `/api/orders` | Create order |
| `PUT`  | `/api/orders?id=ID` | Update order |
| `GET`  | `/api/reviews` | Get all reviews |
| `POST` | `/api/reviews` | Create review |
| `DELETE` | `/api/reviews?id=ID` | Delete review |
| `GET`  | `/api/health` | Health check |

## Local Development

To test locally, you can run both frontend and backend:

```bash
# In one terminal
npm run dev

# In another terminal
npm run server

# Or run both concurrently
npm run dev:all
```

The frontend will automatically detect `localhost` and call `http://localhost:5000/api` (the local server).

## Files Changed/Created

**Created**:
- `/api/products.ts` - Products API
- `/api/categories.ts` - Categories API
- `/api/customers.ts` - Customers API
- `/api/orders.ts` - Orders API
- `/api/reviews.ts` - Reviews API
- `/api/subcategories.ts` - Subcategories API
- `/api/health.ts` - Health check endpoint
- `/vercel.json` - Vercel deployment config
- `/DEPLOYMENT_GUIDE.md` - This file

**Modified**:
- `src/services/mongodb.ts` - Updated to use `/api` endpoints in production
- `package.json` - Added `@vercel/node` dependency

**Not Changed**:
- `server.js` - Still works for local development
- All frontend components and pages

## Troubleshooting

### Still getting `ERR_CONNECTION_REFUSED`?

1. Check that environment variables are set in Vercel:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure `MONGODB_URI` and `MONGODB_DB_NAME` are present

2. Check MongoDB connectivity:
   - Visit `https://your-deployment.vercel.app/api/health`
   - Should return `{"status":"ok"}`

3. Check function logs:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment and check "Function Logs"
   - Look for MongoDB connection errors

### CORS Issues?

All API endpoints have CORS headers enabled and should work from any origin. If you still have issues:
- Check browser console for specific CORS errors
- Verify the API endpoint URL in `src/services/mongodb.ts`

### MongoDB Connection Timeout?

MongoDB Atlas may need IP whitelist configuration:
1. Go to MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` to allow connections from anywhere (including Vercel)
3. Or add your Vercel IP specifically (found in function logs)

## Next Steps

Once deployed and working:
1. Test each dashboard section (Dashboard, Products, Categories, Orders, Customers, Reviews)
2. Try creating, updating, deleting items
3. Monitor function logs for any errors
4. Consider adding authentication to protect your admin dashboard

Happy deploying!
