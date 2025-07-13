const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { items } = JSON.parse(event.body);

    // Map cart items to Stripe line_items (create prices/products on the fly)
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
          images: [item.image], // Optional: Adds product image to checkout page
        },
        unit_amount: Math.round(item.price * 100), // Convert price to cents
      },
      quantity: item.quantity || 1, // Use quantity from cart item
    }));

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.URL}/success`, // Use Netlify site URL env for production
      cancel_url: `${process.env.URL}/cancel`,
      shipping_address_collection: {
        allowed_countries: ['US'], // Add more countries if you ship internationally, e.g., ['US', 'CA']
      },
      // Optional: Collect billing address too (set to 'required' to force collection)
      billing_address_collection: 'auto', // Or 'required' if needed; 'auto' collects only if necessary (e.g., for taxes)
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};