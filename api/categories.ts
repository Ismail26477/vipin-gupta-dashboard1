import { MongoClient } from 'mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DB_NAME || 'trolley';

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  const mongoClient = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });
  
  await mongoClient.connect();
  return mongoClient.db(DATABASE_NAME);
}

export default async (req: VercelRequest, res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let mongoClient: MongoClient | null = null;
  try {
    if (!MONGODB_URI) {
      return res.status(500).json({ error: 'MONGODB_URI not configured' });
    }
    
    mongoClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    await mongoClient.connect();
    
    const db = mongoClient.db(DATABASE_NAME);
    const categoriesCollection = db.collection('categories');

    if (req.method === 'GET') {
      const categories = await categoriesCollection.find({}).sort({ sort_order: 1 }).toArray();
      return res.status(200).json(categories);
    }

    if (req.method === 'POST') {
      const category = {
        ...req.body,
        _id: req.body._id || `cat_${Date.now()}`,
        created_at: new Date()
      };
      const result = await categoriesCollection.insertOne(category);
      return res.status(200).json({ _id: result.insertedId, ...category });
    }

    if (req.method === 'PUT') {
      const result = await categoriesCollection.updateOne(
        { _id: req.query.id as string },
        { $set: req.body }
      );
      if (result.matchedCount === 0) return res.status(404).json({ error: 'Category not found' });
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const result = await categoriesCollection.deleteOne({ _id: req.query.id as string });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Category not found' });
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Categories API error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  } finally {
    if (mongoClient) {
      await mongoClient.close().catch(err => console.error('Error closing connection:', err));
    }
  }
};
