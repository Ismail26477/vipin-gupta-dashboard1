# Baggage Boss Dashboard - MongoDB Integration Guide

Welcome! Your Baggage Boss Dashboard is now fully connected to MongoDB with all collections created and sample data loaded.

## 🎯 Quick Start (Copy-Paste These Commands)

```bash
# 1. Install everything
npm install

# 2. Set up database (one time only)
npm run setup:db

# 3. Start the app
npm run dev:all
```

Then open:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001/api/health

That's it! You now have a fully functional dashboard with MongoDB backend.

---

## 📊 What's Included

### ✅ 6 MongoDB Collections
| Collection | Records | Purpose |
|-----------|---------|---------|
| **categories** | 5 | Product categories (Cabin, Check-in, Backpacks, etc.) |
| **products** | 7 | Luggage items with prices, stock, specs |
| **customers** | 6 | Customer profiles with order history |
| **orders** | 6 | Order tracking with different statuses |
| **reviews** | 6 | Product reviews with ratings (2-5 stars) |
| **subcategories** | 6 | Sub-categories within main categories |

### ✅ Sample Products Ready to Use
1. Wave Luxe Set – Fuchsia (₹8,999)
2. Voyager Cabin 20" (₹6,999)
3. Explorer Check-in 28" (₹4,999)
4. Elite Spinner 24" (₹9,999)
5. Urban Backpack Pro (₹2,999)
6. Weekend Duffel (₹1,999)
7. Hardshell Carry-on (₹7,999)

### ✅ Working Dashboard Features
- ✓ View/Add/Edit/Delete Products
- ✓ Manage Categories & Subcategories
- ✓ Track Orders & Status
- ✓ View Customer Profiles
- ✓ Moderate Product Reviews
- ✓ Analytics & Charts

---

## 🚀 Running the Application

### Option 1: Everything in One Command (Recommended)
```bash
npm run dev:all
```
This starts both frontend and backend simultaneously.

### Option 2: Separate Terminals (Alternative)
```bash
# Terminal 1
npm run dev

# Terminal 2 (in new terminal)
npm run server
```

### Option 3: Frontend Only (No Backend)
```bash
npm run dev
```
The UI will work but can't fetch data from MongoDB.

---

## 📁 What Files Were Added

### Core MongoDB Files
```
src/integrations/mongodb/client.ts      - Connection to MongoDB
src/services/mongodb.ts                 - API calls from React
server.js                               - Express backend API
scripts/setup-mongodb.js                - Database setup script
```

### Configuration
```
.env.local                              - MongoDB credentials
.env.example                            - Template
```

### Documentation
```
QUICK_START.md                          - This quick guide
MONGODB_SETUP.md                        - Detailed setup
MONGODB_INTEGRATION_SUMMARY.md          - What was added
ARCHITECTURE.md                         - System design
```

---

## 🔌 MongoDB Connection

Your database is hosted on **MongoDB Atlas** (cloud-based):

```
URL:      mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0
Database: trolley
User:     ismail
Password: ismail123
```

**Already configured in `.env.local`** - No additional setup needed!

---

## 🛠️ NPM Scripts Explained

```bash
npm install              # Install all dependencies
npm run dev             # Start React frontend (port 5173)
npm run server          # Start Express backend (port 3001)
npm run dev:all         # Start both frontend + backend
npm run setup:db        # Initialize MongoDB collections
npm run build           # Build for production
npm run lint            # Check code quality
npm run test            # Run tests
npm run preview         # Preview production build
```

---

## 📡 API Endpoints Available

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Other Resources
- **Orders**: GET, POST, PUT `/api/orders`
- **Customers**: GET `/api/customers`
- **Reviews**: GET, POST, DELETE `/api/reviews`
- **Subcategories**: GET, POST, DELETE `/api/subcategories`

### Health Check
- `GET /api/health` - Verify API is running

**Example API Call:**
```bash
curl http://localhost:3001/api/products
```

---

## 🗂️ Database Collections Structure

### Products Collection
```javascript
{
  _id: "prod_1",
  name: "Wave Luxe Set – Fuchsia",
  description: "Premium cabin-size trolley...",
  category_id: "cat_1",
  price: 8999,
  discount_price: 7919,
  stock: 45,
  brand: "WAVE",
  tags: ["premium", "lightweight", "spinner"],
  specifications: [
    { key: "Capacity", value: "35L" },
    { key: "Material", value: "ABS + Polycarbonate" }
  ],
  images: ["https://..."],
  featured: true,
  trending: true,
  best_seller: true,
  new_arrival: false,
  status: "Active",
  rating: 4.8,
  created_at: ISODate("2024-04-13T...")
}
```

### Orders Collection
```javascript
{
  _id: "ORD-1001",
  customer: "Rahul Sharma",
  customer_id: "cust_1",
  amount: 4998,
  status: "Delivered",
  date: ISODate("2026-04-10T..."),
  items: ["Voyager Cabin 20\"", "Travel Organizer Set"],
  address: "123 MG Road, Mumbai",
  payment: "UPI",
  created_at: ISODate("2024-04-13T...")
}
```

See `MONGODB_SETUP.md` for complete field definitions.

---

## 🔧 Customization Guide

### To Modify Sample Data
Edit `/scripts/setup-mongodb.js`:
1. Open the file
2. Find `sampleProducts`, `sampleOrders`, etc.
3. Modify values as needed
4. Run `npm run setup:db` again

### To Add New Collections
1. In `server.js`, add new route handlers
2. In `/src/services/mongodb.ts`, add new service functions
3. Update `setup-mongodb.js` to create and seed the collection

### To Change API Port
Edit `/server.js`:
```javascript
const PORT = process.env.PORT || 3001;  // Change 3001 to desired port
```

---

## ❌ Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Check internet connection
- Verify credentials in `.env.local`
- Confirm MongoDB Atlas account is active

### Issue: "API port 3001 already in use"
**Solution**:
- Kill the existing process
- Or change PORT in `server.js`
- Or in Terminal: `lsof -i :3001` then `kill -9 <PID>`

### Issue: "CORS error when fetching data"
**Solution**:
- Ensure backend is running (`npm run server`)
- Check frontend is calling `http://localhost:3001`
- Ensure both are running on correct ports

### Issue: "Empty database after setup"
**Solution**:
- Run `npm run setup:db` again
- Check MongoDB credentials
- Verify connection to MongoDB Atlas

### Issue: "Module not found errors"
**Solution**:
- Run `npm install` again
- Delete `node_modules` folder
- Run `npm install` fresh

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **QUICK_START.md** | TL;DR - Get running in 3 steps |
| **MONGODB_SETUP.md** | Comprehensive setup & reference |
| **ARCHITECTURE.md** | System design & data flow diagrams |
| **MONGODB_INTEGRATION_SUMMARY.md** | Detailed integration overview |
| **README_MONGODB.md** | This file |

---

## 🎓 Learning Resources

### MongoDB
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [MongoDB Query Language](https://docs.mongodb.com/manual/reference/method/)

### Express.js
- [Express Beginner Guide](https://expressjs.com/starter/basic-routing.html)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)

### React
- [React Documentation](https://react.dev)
- [React Hooks Guide](https://react.dev/reference/react)

### Vite
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🚢 Deployment (Future)

To deploy this application:

### Frontend (Vercel)
```bash
npm run build
# Deploy the `dist` folder to Vercel
```

### Backend (Heroku, Railway, etc.)
```bash
# Would need to adjust environment variables
# And potentially MongoDB credentials management
```

**Note**: Currently optimized for local development.

---

## 💡 Tips & Best Practices

✅ **Do:**
- Keep MongoDB credentials in `.env.local` (not in git)
- Run setup script once per database
- Check API health with `GET /api/health`
- Use API service layer for all data fetches
- Handle errors with try-catch blocks

❌ **Don't:**
- Commit `.env.local` to version control
- Manually edit MongoDB from the client
- Keep dev server running when not working
- Hardcode API URLs (use constants)
- Skip CORS configuration

---

## 🎯 Next Steps

1. **Explore**: Browse the Dashboard UI
2. **Test**: Try adding/editing/deleting products
3. **Customize**: Modify sample data
4. **Integrate**: Connect more pages to MongoDB
5. **Deploy**: When ready, prepare for production

---

## 📞 Support Resources

If you encounter issues:

1. **Check Documentation**: See the 4 guide files above
2. **Read Error Messages**: Console shows helpful details
3. **Verify Setup**: Run `npm run setup:db` again
4. **Test API**: Use `curl` or Postman to test endpoints
5. **Check Ports**: Frontend (5173), Backend (3001)

---

## ✨ What's Working Now

✅ Complete MongoDB integration
✅ Express API backend
✅ All collections created
✅ Sample data loaded
✅ CORS enabled for localhost
✅ Dashboard UI ready to use
✅ Data fetching infrastructure in place

---

## 🎉 You're All Set!

Your Baggage Boss Dashboard is ready to use!

**Start with:**
```bash
npm run dev:all
```

Then visit `http://localhost:5173` and enjoy! 🧳

---

**Last Updated**: April 13, 2024
**MongoDB Database**: trolley (Cluster0)
**Status**: ✅ Fully Configured & Ready to Use
