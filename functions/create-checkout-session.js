const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Add secret key to Netlify env vars

exports.handler = async (event) => {
  try {
    const { amount, description } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: description },
          unit_amount: amount, // $17.76 in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.URL}/success`, // e.g., https://vaccinepolice.com/success
      cancel_url: `${process.env.URL}/cancel`,   // e.g., https://vaccinepolice.com/cancel
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};