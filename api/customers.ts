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
    const customersCollection = db.collection('customers');

    if (req.method === 'GET') {
      if (req.query.id) {
        const customer = await customersCollection.findOne({ _id: req.query.id as string });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        return res.status(200).json(customer);
      }
      const customers = await customersCollection.find({}).toArray();
      return res.status(200).json(customers);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('[v0] Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
