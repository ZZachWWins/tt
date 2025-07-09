const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const { username, password, testimonial } = JSON.parse(event.body);

  if (!username || !password) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Username and password are required' }) };
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('video-vault');
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Username already exists' }) };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword, role: 'user' };
    const result = await usersCollection.insertOne(user);

    // Save testimonial if provided
    if (testimonial) {
      const testimonialsCollection = db.collection('testimonials');
      await testimonialsCollection.insertOne({
        userId: result.insertedId,
        username, // Store username for display
        testimonial,
        createdAt: new Date(),
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Signup successful' }),
    };
  } catch (err) {
    console.error('Signup error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  } finally {
    await client.close();
  }
};