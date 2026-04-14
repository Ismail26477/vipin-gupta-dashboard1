# MongoDB Connection Setup

## Your MongoDB Cluster
- **Cluster:** Cluster0
- **Database:** trolley
- **Connection String:** `mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0`

## Collections
- `products` - Product catalog with images and specifications
- `categories` - Product categories 
- `subcategories` - Sub-categories linked to categories
- `orders` - Customer orders with shipping status
- `customers` - Customer information
- `reviews` - Product reviews with ratings

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database & Sample Data
```bash
npm run setup:db
```
This will create all collections and populate with sample products, categories, orders, and reviews.

### 3. Start the Application
```bash
npm run dev:all
```
This starts both:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

Or run separately:
```bash
npm run dev          # Frontend only
npm run server       # Backend API only
```

## Login Credentials
- **Email:** admin@lugadmin.com
- **Password:** admin123

## API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order

### Customers
- `GET /api/customers` - List customers

### Reviews
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review

## Environment Variables
See `.env` file - MongoDB connection already configured.

## Features
- Product management with image uploads
- Category and subcategory organization
- Order tracking with status updates
- Customer management
- Product reviews and ratings
- Analytics dashboard
- Settings management

All data is stored in MongoDB and persisted across sessions.
