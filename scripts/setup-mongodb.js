import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = "mongodb+srv://ismail:ismail123@cluster0.fjw1q9u.mongodb.net/?appName=Cluster0";
const DATABASE_NAME = "trolley";

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("[v0] Connected to MongoDB");

    const db = client.db(DATABASE_NAME);

    // Create collections
    const collections = ["categories", "products", "orders", "customers", "reviews", "subcategories"];
    
    for (const collectionName of collections) {
      const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
      if (!collectionExists) {
        await db.createCollection(collectionName);
        console.log(`[v0] Created collection: ${collectionName}`);
      } else {
        console.log(`[v0] Collection already exists: ${collectionName}`);
      }
    }

    // Insert sample categories
    const categoriesCollection = db.collection("categories");
    const existingCategories = await categoriesCollection.countDocuments();
    
    if (existingCategories === 0) {
      const sampleCategories = [
        {
          _id: "cat_1",
          name: "Cabin Trolleys",
          image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
          icon_url: null,
          sort_order: 0,
          is_deal: false,
          created_at: new Date(),
        },
        {
          _id: "cat_2",
          name: "Check-in Trolleys",
          image_url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop",
          icon_url: null,
          sort_order: 1,
          is_deal: false,
          created_at: new Date(),
        },
        {
          _id: "cat_3",
          name: "Backpacks",
          image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
          icon_url: null,
          sort_order: 2,
          is_deal: false,
          created_at: new Date(),
        },
        {
          _id: "cat_4",
          name: "Duffels",
          image_url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=200&fit=crop",
          icon_url: null,
          sort_order: 3,
          is_deal: false,
          created_at: new Date(),
        },
        {
          _id: "cat_5",
          name: "Deals",
          image_url: null,
          icon_url: null,
          sort_order: 4,
          is_deal: true,
          created_at: new Date(),
        },
      ];
      
      await categoriesCollection.insertMany(sampleCategories);
      console.log("[v0] Inserted sample categories");
    }

    // Insert sample products
    const productsCollection = db.collection("products");
    const existingProducts = await productsCollection.countDocuments();
    
    if (existingProducts === 0) {
      const sampleProducts = [
        {
          _id: "prod_1",
          name: "Wave Luxe Set – Fuchsia",
          description: "Premium cabin-size trolley with 4 spinner wheels and TSA lock. Perfect for weekend getaways.",
          category_id: "cat_1",
          price: 8999,
          discount_price: 7919,
          stock: 45,
          brand: "WAVE",
          tags: ["premium", "lightweight", "spinner", "tsa-lock"],
          specifications: [
            { key: "Capacity", value: "35L" },
            { key: "Material", value: "ABS + Polycarbonate" },
            { key: "Wheels", value: "4 Spinner" },
          ],
          images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"],
          featured: true,
          trending: true,
          best_seller: true,
          new_arrival: false,
          status: "Active",
          rating: 4.8,
          created_at: new Date(),
        },
        {
          _id: "prod_2",
          name: "Voyager Cabin 20\"",
          description: "Lightweight cabin luggage with dual wheels and integrated USB charging port.",
          category_id: "cat_1",
          price: 6999,
          discount_price: 5999,
          stock: 32,
          brand: "VOYAGER",
          tags: ["lightweight", "usb-charging", "compact"],
          specifications: [
            { key: "Capacity", value: "32L" },
            { key: "Material", value: "Polycarbonate" },
            { key: "Wheels", value: "2 Dual Wheels" },
          ],
          images: ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop"],
          featured: true,
          trending: false,
          best_seller: true,
          new_arrival: true,
          status: "Active",
          rating: 4.6,
          created_at: new Date(),
        },
        {
          _id: "prod_3",
          name: "Explorer Check-in 28\"",
          description: "Large check-in trolley with 360-degree wheels and expandable compartment.",
          category_id: "cat_2",
          price: 4999,
          discount_price: null,
          stock: 28,
          brand: "EXPLORER",
          tags: ["large", "expandable", "durable"],
          specifications: [
            { key: "Capacity", value: "75L" },
            { key: "Material", value: "ABS Plastic" },
            { key: "Wheels", value: "4 360° Wheels" },
          ],
          images: ["https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400&h=400&fit=crop"],
          featured: false,
          trending: true,
          best_seller: false,
          new_arrival: false,
          status: "Active",
          rating: 4.4,
          created_at: new Date(),
        },
        {
          _id: "prod_4",
          name: "Elite Spinner 24\"",
          description: "Premium medium-sized trolley with top-tier build quality and warranty.",
          category_id: "cat_1",
          price: 9999,
          discount_price: 8499,
          stock: 15,
          brand: "ELITE",
          tags: ["premium", "warranty", "spinner"],
          specifications: [
            { key: "Capacity", value: "60L" },
            { key: "Material", value: "Polycarbonate + Aluminum" },
            { key: "Wheels", value: "4 Spinner" },
          ],
          images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop"],
          featured: true,
          trending: true,
          best_seller: false,
          new_arrival: true,
          status: "Active",
          rating: 4.9,
          created_at: new Date(),
        },
        {
          _id: "prod_5",
          name: "Urban Backpack Pro",
          description: "Professional travel backpack with multiple compartments and ergonomic design.",
          category_id: "cat_3",
          price: 2999,
          discount_price: 2499,
          stock: 67,
          brand: "URBAN",
          tags: ["ergonomic", "multipocket", "professional"],
          specifications: [
            { key: "Capacity", value: "40L" },
            { key: "Material", value: "Nylon + Polyester" },
            { key: "Pockets", value: "8 Compartments" },
          ],
          images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"],
          featured: false,
          trending: false,
          best_seller: true,
          new_arrival: false,
          status: "Active",
          rating: 4.5,
          created_at: new Date(),
        },
        {
          _id: "prod_6",
          name: "Weekend Duffel",
          description: "Spacious duffel bag for weekend trips with comfortable shoulder straps.",
          category_id: "cat_4",
          price: 1999,
          discount_price: null,
          stock: 42,
          brand: "TREK",
          tags: ["spacious", "comfortable", "durable"],
          specifications: [
            { key: "Capacity", value: "65L" },
            { key: "Material", value: "Canvas" },
            { key: "Straps", value: "Padded Shoulder" },
          ],
          images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"],
          featured: false,
          trending: false,
          best_seller: false,
          new_arrival: false,
          status: "Active",
          rating: 4.2,
          created_at: new Date(),
        },
        {
          _id: "prod_7",
          name: "Hardshell Carry-on",
          description: "Durable hardshell carry-on with impact resistance and lightweight design.",
          category_id: "cat_1",
          price: 7999,
          discount_price: 6999,
          stock: 19,
          brand: "FORTRESS",
          tags: ["hardshell", "durable", "lightweight"],
          specifications: [
            { key: "Capacity", value: "38L" },
            { key: "Material", value: "Polycarbonate" },
            { key: "Wheels", value: "4 Spinner" },
          ],
          images: ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop"],
          featured: false,
          trending: false,
          best_seller: false,
          new_arrival: true,
          status: "Active",
          rating: 4.3,
          created_at: new Date(),
        },
      ];
      
      await productsCollection.insertMany(sampleProducts);
      console.log("[v0] Inserted sample products");
    }

    // Insert sample customers
    const customersCollection = db.collection("customers");
    const existingCustomers = await customersCollection.countDocuments();
    
    if (existingCustomers === 0) {
      const sampleCustomers = [
        {
          _id: "cust_1",
          name: "Rahul Sharma",
          email: "rahul@email.com",
          phone: "+91-9876543210",
          orders: 5,
          spent: 12495,
          joined: new Date("2025-11-01"),
          recentOrders: ["ORD-1001", "ORD-980", "ORD-945"],
          created_at: new Date(),
        },
        {
          _id: "cust_2",
          name: "Priya Patel",
          email: "priya@email.com",
          phone: "+91-9876543211",
          orders: 3,
          spent: 7497,
          joined: new Date("2025-12-15"),
          recentOrders: ["ORD-1002", "ORD-960"],
          created_at: new Date(),
        },
        {
          _id: "cust_3",
          name: "Amit Kumar",
          email: "amit@email.com",
          phone: "+91-9876543212",
          orders: 2,
          spent: 3998,
          joined: new Date("2026-01-10"),
          recentOrders: ["ORD-1003"],
          created_at: new Date(),
        },
        {
          _id: "cust_4",
          name: "Sneha Reddy",
          email: "sneha@email.com",
          phone: "+91-9876543213",
          orders: 8,
          spent: 24990,
          joined: new Date("2025-08-22"),
          recentOrders: ["ORD-1004", "ORD-990", "ORD-975"],
          created_at: new Date(),
        },
        {
          _id: "cust_5",
          name: "Vikram Singh",
          email: "vikram@email.com",
          phone: "+91-9876543214",
          orders: 1,
          spent: 999,
          joined: new Date("2026-03-05"),
          recentOrders: ["ORD-1005"],
          created_at: new Date(),
        },
        {
          _id: "cust_6",
          name: "Anita Gupta",
          email: "anita@email.com",
          phone: "+91-9876543215",
          orders: 4,
          spent: 9996,
          joined: new Date("2025-10-18"),
          recentOrders: ["ORD-1006", "ORD-970"],
          created_at: new Date(),
        },
      ];
      
      await customersCollection.insertMany(sampleCustomers);
      console.log("[v0] Inserted sample customers");
    }

    // Insert sample orders
    const ordersCollection = db.collection("orders");
    const existingOrders = await ordersCollection.countDocuments();
    
    if (existingOrders === 0) {
      const sampleOrders = [
        {
          _id: "ORD-1001",
          customer: "Rahul Sharma",
          customer_id: "cust_1",
          amount: 4998,
          status: "Delivered",
          date: new Date("2026-04-10"),
          items: ["Voyager Cabin 20\"", "Travel Organizer Set"],
          address: "123 MG Road, Mumbai",
          payment: "UPI",
          created_at: new Date(),
        },
        {
          _id: "ORD-1002",
          customer: "Priya Patel",
          customer_id: "cust_2",
          amount: 2999,
          status: "Shipped",
          date: new Date("2026-04-09"),
          items: ["Explorer Check-in 28\""],
          address: "456 Nehru St, Delhi",
          payment: "Card",
          created_at: new Date(),
        },
        {
          _id: "ORD-1003",
          customer: "Amit Kumar",
          customer_id: "cust_3",
          amount: 1999,
          status: "Pending",
          date: new Date("2026-04-09"),
          items: ["Voyager Cabin 20\""],
          address: "789 Park Ave, Bangalore",
          payment: "COD",
          created_at: new Date(),
        },
        {
          _id: "ORD-1004",
          customer: "Sneha Reddy",
          customer_id: "cust_4",
          amount: 5498,
          status: "Delivered",
          date: new Date("2026-04-08"),
          items: ["Elite Spinner 24\"", "Urban Backpack Pro"],
          address: "321 Lake Rd, Hyderabad",
          payment: "Card",
          created_at: new Date(),
        },
        {
          _id: "ORD-1005",
          customer: "Vikram Singh",
          customer_id: "cust_5",
          amount: 999,
          status: "Cancelled",
          date: new Date("2026-04-08"),
          items: ["Urban Backpack Pro"],
          address: "654 Hill Rd, Pune",
          payment: "UPI",
          created_at: new Date(),
        },
        {
          _id: "ORD-1006",
          customer: "Anita Gupta",
          customer_id: "cust_6",
          amount: 3498,
          status: "Shipped",
          date: new Date("2026-04-07"),
          items: ["Weekend Duffel", "Voyager Cabin 20\""],
          address: "987 Main St, Chennai",
          payment: "Card",
          created_at: new Date(),
        },
      ];
      
      await ordersCollection.insertMany(sampleOrders);
      console.log("[v0] Inserted sample orders");
    }

    // Insert sample reviews
    const reviewsCollection = db.collection("reviews");
    const existingReviews = await reviewsCollection.countDocuments();
    
    if (existingReviews === 0) {
      const sampleReviews = [
        {
          _id: "rev_1",
          product: "Voyager Cabin 20\"",
          product_id: "prod_2",
          customer: "Rahul S.",
          customer_id: "cust_1",
          rating: 5,
          comment: "Excellent quality! Lightweight and durable. Survived 3 international trips.",
          date: new Date("2026-04-08"),
          created_at: new Date(),
        },
        {
          _id: "rev_2",
          product: "Explorer Check-in 28\"",
          product_id: "prod_3",
          customer: "Priya P.",
          customer_id: "cust_2",
          rating: 4,
          comment: "Spacious and well-built. Zipper could be smoother. Overall great value.",
          date: new Date("2026-04-07"),
          created_at: new Date(),
        },
        {
          _id: "rev_3",
          product: "Urban Backpack Pro",
          product_id: "prod_5",
          customer: "Amit K.",
          customer_id: "cust_3",
          rating: 3,
          comment: "Good backpack but padding on straps could be better for heavy loads.",
          date: new Date("2026-04-06"),
          created_at: new Date(),
        },
        {
          _id: "rev_4",
          product: "Elite Spinner 24\"",
          product_id: "prod_4",
          customer: "Sneha R.",
          customer_id: "cust_4",
          rating: 5,
          comment: "Absolutely love the spinner wheels! Glides effortlessly. Premium feel.",
          date: new Date("2026-04-05"),
          created_at: new Date(),
        },
        {
          _id: "rev_5",
          product: "Weekend Duffel",
          product_id: "prod_6",
          customer: "Vikram S.",
          customer_id: "cust_5",
          rating: 2,
          comment: "Handle broke after 2 months. Disappointed with the quality.",
          date: new Date("2026-04-04"),
          created_at: new Date(),
        },
        {
          _id: "rev_6",
          product: "Hardshell Carry-on",
          product_id: "prod_7",
          customer: "Anita G.",
          customer_id: "cust_6",
          rating: 4,
          comment: "Solid construction. Love the color options. Worth the price.",
          date: new Date("2026-04-03"),
          created_at: new Date(),
        },
      ];
      
      await reviewsCollection.insertMany(sampleReviews);
      console.log("[v0] Inserted sample reviews");
    }

    // Insert sample subcategories
    const subcategoriesCollection = db.collection("subcategories");
    const existingSubcategories = await subcategoriesCollection.countDocuments();
    
    if (existingSubcategories === 0) {
      const sampleSubcategories = [
        { _id: "subcat_1", category_id: "cat_1", name: "Small (20\")", created_at: new Date() },
        { _id: "subcat_2", category_id: "cat_1", name: "Medium (24\")", created_at: new Date() },
        { _id: "subcat_3", category_id: "cat_2", name: "Large (28\")", created_at: new Date() },
        { _id: "subcat_4", category_id: "cat_2", name: "Extra Large (32\")", created_at: new Date() },
        { _id: "subcat_5", category_id: "cat_3", name: "20-30L", created_at: new Date() },
        { _id: "subcat_6", category_id: "cat_3", name: "40-50L", created_at: new Date() },
      ];
      
      await subcategoriesCollection.insertMany(sampleSubcategories);
      console.log("[v0] Inserted sample subcategories");
    }

    console.log("[v0] MongoDB setup completed successfully!");
    
  } catch (error) {
    console.error("[v0] Setup error:", error);
  } finally {
    await client.close();
    console.log("[v0] Database connection closed");
  }
}

setupDatabase();
