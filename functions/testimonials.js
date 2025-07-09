const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('video-vault');
    const testimonialsCollection = db.collection('testimonials');

    const testimonials = await testimonialsCollection.find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(testimonials),
    };
  } catch (err) {
    console.error('Fetch testimonials error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  } finally {
    await client.close();
  }
};