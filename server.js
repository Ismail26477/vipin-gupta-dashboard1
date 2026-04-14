import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3001;

const MONGODB_URI = process.env.VITE_MONGODB_URI || "mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0";
const DATABASE_NAME = "trolley";

let mongoClient;
let db;

// Middleware
app.use(cors());
app.use(express.json());

// Simple JWT-like token generation
function generateToken(email) {
  return Buffer.from(email).toString("base64");
}

function verifyToken(token) {
  try {
    return Buffer.from(token, "base64").toString();
  } catch {
    return null;
  }
}

// Authentication Endpoint
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Simple demo authentication
  if (email === "admin@lugadmin.com" && password === "admin123") {
    const token = generateToken(email);
    res.json({ token, message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

app.post("/api/auth/verify", async (req, res) => {
  const { token } = req.body;
  const email = verifyToken(token);
  if (email) {
    res.json({ valid: true, email });
  } else {
    res.status(401).json({ valid: false });
  }
});

// Connect to MongoDB
async function connectDB() {
  try {
    console.log("[v0] Attempting to connect to MongoDB at:", MONGODB_URI.substring(0, 50) + "...");
    mongoClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: "majority"
    });
    await mongoClient.connect();
    db = mongoClient.db(DATABASE_NAME);
    console.log("[v0] Successfully connected to MongoDB database:", DATABASE_NAME);
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error.message);
    console.error("[v0] Make sure your MongoDB Atlas cluster is accessible and the connection string is correct.");
    console.error("[v0] Connection string format: mongodb+srv://username:password@cluster.mongodb.net/?appName=YourApp");
    // Don't exit, allow app to start but show error
    console.log("[v0] Starting server without database connection...");
  }
}

// Middleware to check DB connection
app.use((req, res, next) => {
  if (!db) {
    return res.status(503).json({ 
      error: "Database connection not available. Please check your MongoDB connection string and ensure the cluster is accessible." 
    });
  }
  next();
});

// Routes for Products
app.get("/api/products", async (req, res) => {
  try {
    const products = await db.collection("products").find({}).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await db.collection("products").findOne({ _id: req.params.id });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = { ...req.body, _id: req.body._id || `prod_${Date.now()}`, created_at: new Date() };
    const result = await db.collection("products").insertOne(product);
    res.json({ _id: result.insertedId, ...product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const result = await db.collection("products").updateOne({ _id: req.params.id }, { $set: req.body });
    if (result.matchedCount === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const result = await db.collection("products").deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for Categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await db.collection("categories").find({}).sort({ sort_order: 1 }).toArray();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const category = { ...req.body, _id: req.body._id || `cat_${Date.now()}`, created_at: new Date() };
    const result = await db.collection("categories").insertOne(category);
    res.json({ _id: result.insertedId, ...category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/categories/:id", async (req, res) => {
  try {
    const result = await db.collection("categories").updateOne({ _id: req.params.id }, { $set: req.body });
    if (result.matchedCount === 0) return res.status(404).json({ error: "Category not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  try {
    const result = await db.collection("categories").deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Category not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for Subcategories
app.get("/api/subcategories", async (req, res) => {
  try {
    const subcategories = await db.collection("subcategories").find({}).toArray();
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/subcategories", async (req, res) => {
  try {
    const subcategory = { ...req.body, _id: req.body._id || `subcat_${Date.now()}`, created_at: new Date() };
    const result = await db.collection("subcategories").insertOne(subcategory);
    res.json({ _id: result.insertedId, ...subcategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/subcategories/:id", async (req, res) => {
  try {
    const result = await db.collection("subcategories").deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Subcategory not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for Orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await db.collection("orders").find({}).sort({ date: -1 }).toArray();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await db.collection("orders").findOne({ _id: req.params.id });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const order = { ...req.body, _id: req.body._id || `ORD-${Date.now()}`, created_at: new Date() };
    const result = await db.collection("orders").insertOne(order);
    res.json({ _id: result.insertedId, ...order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/orders/:id", async (req, res) => {
  try {
    const result = await db.collection("orders").updateOne({ _id: req.params.id }, { $set: req.body });
    if (result.matchedCount === 0) return res.status(404).json({ error: "Order not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for Customers
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await db.collection("customers").find({}).toArray();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/customers/:id", async (req, res) => {
  try {
    const customer = await db.collection("customers").findOne({ _id: req.params.id });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for Reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await db.collection("reviews").find({}).sort({ date: -1 }).toArray();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const review = { ...req.body, _id: req.body._id || `rev_${Date.now()}`, created_at: new Date() };
    const result = await db.collection("reviews").insertOne(review);
    res.json({ _id: result.insertedId, ...review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const result = await db.collection("reviews").deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Review not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[v0] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("[v0] Shutting down...");
  if (mongoClient) await mongoClient.close();
  process.exit(0);
});
