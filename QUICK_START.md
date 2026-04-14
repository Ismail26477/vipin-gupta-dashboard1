# Quick Start Guide - Baggage Boss Dashboard + MongoDB

## TL;DR - Get Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Initialize Database (One Time Only)
```bash
npm run setup:db
```

This creates all MongoDB collections and loads sample data:
- 7 Products with prices, stock, and images
- 6 Customers with order history
- 6 Orders with different statuses
- 6 Product reviews with ratings
- Categories and subcategories

### 3️⃣ Start the Application
```bash
npm run dev:all
```

This starts both:
- **Frontend**: `http://localhost:5173` (React/Vite)
- **Backend API**: `http://localhost:3001` (Express + MongoDB)

## MongoDB Details

- **Database**: `trolley`
- **URI**: `mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0`
- **Collections**: categories, products, orders, customers, reviews, subcategories

## What You Can Do

Once running, you can:

✅ View Products, Categories, Orders, Customers, Reviews in the dashboard
✅ Add/Edit/Delete products and categories
✅ Track order status
✅ View customer purchase history
✅ Manage product reviews

## Separate Terminal Approach (Alternative)

If `npm run dev:all` doesn't work, run in separate terminals:

**Terminal 1:**
```bash
npm run dev        # Frontend at http://localhost:5173
```

**Terminal 2:**
```bash
npm run server     # Backend API at http://localhost:3001
```

## For Full Details

See `MONGODB_SETUP.md` for:
- Complete API endpoint documentation
- Detailed setup instructions
- Sample data breakdown
- Troubleshooting guide
- Environment configuration

## Key Files

- `server.js` - Express backend with MongoDB integration
- `src/services/mongodb.ts` - Frontend API service
- `scripts/setup-mongodb.js` - Database initialization
- `.env.local` - MongoDB connection (already configured)

## Notes

- The backend must be running for the dashboard to fetch data
- All sample data is included and ready to use
- The MongoDB database is already set up and accessible with provided credentials
- CORS is enabled for local development

Enjoy your Baggage Boss Dashboard! 🧳
