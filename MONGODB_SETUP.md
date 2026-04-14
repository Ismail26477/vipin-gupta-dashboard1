# MongoDB Setup Guide - Baggage Boss Dashboard

This guide explains how to set up and run the Baggage Boss Dashboard with MongoDB integration.

## MongoDB Connection Details

- **Database URL**: `mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0`
- **Database Name**: `trolley`
- **Username**: `ismail`
- **Password**: `ismail123`

## Project Structure

### Collections Created
The MongoDB database includes the following collections:

1. **categories** - Product categories (Cabin Trolleys, Check-in Trolleys, Backpacks, Duffels, etc.)
2. **products** - Product inventory with pricing, stock, specifications, and images
3. **orders** - Customer orders with status tracking
4. **customers** - Customer information and purchase history
5. **reviews** - Product reviews and ratings
6. **subcategories** - Subcategories within each product category

### Files Added/Created

```
/src/integrations/mongodb/client.ts    - MongoDB connection utility
/src/services/mongodb.ts               - Frontend API service
/scripts/setup-mongodb.js              - Database initialization script
/server.js                             - Express backend API server
/.env.local                            - Environment variables (MongoDB URI)
/.env.example                          - Example environment file
/MONGODB_SETUP.md                      - This file
```

## Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- `mongodb` - MongoDB driver
- `express` - Backend server framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### Step 2: Set Up the Database (Run Once)

Initialize the MongoDB collections and insert sample data:

```bash
npm run setup:db
```

This script will:
- Create all necessary collections (categories, products, orders, customers, reviews, subcategories)
- Insert 7 sample products with full details
- Add 6 sample customers with purchase history
- Create 6 sample orders with various statuses
- Add 6 sample product reviews
- Set up subcategories for each category

**Output Example:**
```
[v0] Connected to MongoDB
[v0] Created collection: categories
[v0] Created collection: products
[v0] Inserted sample categories
[v0] Inserted sample products
[v0] Inserted sample customers
[v0] Inserted sample orders
[v0] Inserted sample reviews
[v0] Inserted sample subcategories
[v0] MongoDB setup completed successfully!
```

### Step 3: Start the Application

#### Option A: Run Frontend Only (Without Backend API)
If you only want to run the React dev server (for UI testing):
```bash
npm run dev
```

#### Option B: Run Frontend + Backend (Recommended for Full Functionality)
Start both the Vite dev server and Express backend concurrently:
```bash
npm run dev:all
```

Or manually start both in separate terminals:

**Terminal 1 - Frontend:**
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

**Terminal 2 - Backend API:**
```bash
npm run server
```
The backend API will be available at `http://localhost:3001`

## Available API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Subcategories
- `GET /api/subcategories` - Get all subcategories
- `POST /api/subcategories` - Create subcategory
- `DELETE /api/subcategories/:id` - Delete subcategory

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review

### Health Check
- `GET /api/health` - Check if API is running

## Sample Data Included

### Products (7 items)
1. Wave Luxe Set – Fuchsia (₹8,999)
2. Voyager Cabin 20" (₹6,999)
3. Explorer Check-in 28" (₹4,999)
4. Elite Spinner 24" (₹9,999)
5. Urban Backpack Pro (₹2,999)
6. Weekend Duffel (₹1,999)
7. Hardshell Carry-on (₹7,999)

### Customers (6)
- Rahul Sharma
- Priya Patel
- Amit Kumar
- Sneha Reddy
- Vikram Singh
- Anita Gupta

### Orders (6)
- ORD-1001 to ORD-1006 with various statuses (Delivered, Shipped, Pending, Cancelled)

### Reviews (6)
- Customer reviews for each product with ratings from 2-5 stars

## Environment Variables

The application uses the following environment variable:

```
VITE_MONGODB_URI=mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0
```

This is already configured in `.env.local` and the Node script.

## Frontend Integration

The frontend is currently configured to use Supabase in the existing code. To fully integrate MongoDB:

The MongoDB API service is available at `/src/services/mongodb.ts` with methods like:
- `mongodbProducts.getAll()`
- `mongodbCategories.getAll()`
- `mongodbOrders.getAll()`
- And more...

To migrate existing pages from Supabase to MongoDB, replace `supabase` calls with corresponding MongoDB API calls:

```typescript
// Instead of: supabase.from("products").select("*")
// Use: mongodbProducts.getAll()
```

## Troubleshooting

### MongoDB Connection Error
**Problem**: "MongoDB connection error" when running setup
- **Solution**: Verify your internet connection and MongoDB credentials in `.env.local`

### API Server Not Starting
**Problem**: "Port 3001 is already in use"
- **Solution**: Change the PORT in `.env.local` or kill the process using port 3001

### CORS Errors in Frontend
**Problem**: "CORS policy blocked" when calling API
- **Solution**: Ensure the backend is running on `http://localhost:3001` and the frontend is making calls to the correct URL

### Sample Data Not Loading
**Problem**: Collections are empty after setup
- **Solution**: Run `npm run setup:db` again. Make sure you're using the correct MongoDB URI.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Additional Notes

- The database is hosted on MongoDB Atlas (cloud-based MongoDB)
- All sample data is pre-populated and ready to use
- The backend API handles CORS so the frontend can communicate from `localhost:5173`
- Product images use Unsplash image URLs as placeholders
- Timestamps are automatically added to all records

## Support

For issues or questions about the MongoDB setup, please refer to:
- MongoDB Documentation: https://docs.mongodb.com/
- Express API Guide: https://expressjs.com/
- React Documentation: https://react.dev/
