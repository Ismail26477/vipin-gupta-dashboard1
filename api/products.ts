import { MongoClient } from 'mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const MONGODB_URI = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DB_NAME || 'trolley';

async function connectDB() {
  const mongoClient = new MongoClient(MONGODB_URI!, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    w: 'majority'
  });
  
  await mongoClient.connect();
  return mongoClient.db(DATABASE_NAME);
}

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await connectDB();
    const productsCollection = db.collection('products');

    if (req.method === 'GET') {
      if (req.query.id) {
        const product = await productsCollection.findOne({ _id: req.query.id as string });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        return res.status(200).json(product);
      }
      const products = await productsCollection.find({}).toArray();
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const product = {
        ...req.body,
        _id: req.body._id || `prod_${Date.now()}`,
        created_at: new Date()
      };
      const result = await productsCollection.insertOne(product);
      return res.status(200).json({ _id: result.insertedId, ...product });
    }

    if (req.method === 'PUT') {
      const result = await productsCollection.updateOne(
        { _id: req.query.id as string },
        { $set: req.body }
      );
      if (result.matchedCount === 0) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const result = await productsCollection.deleteOne({ _id: req.query.id as string });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[v0] Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
