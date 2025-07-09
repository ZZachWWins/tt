const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    const response = await axios.get('https://api.cloudinary.com/v1_1/dcmv6p5a8/resources/video', {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64')}`,
      },
    });

    const videos = response.data.resources.map(video => ({
      url: video.secure_url,
      title: video.public_id,
      description: 'A video on detoxification.',
      uploader: 'Anonymous',
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(videos),
    };
  } catch (error) {
    console.error('Error fetching videos from Cloudinary:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch videos' }),
    };
  }
};