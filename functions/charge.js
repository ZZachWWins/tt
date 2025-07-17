const { Client, Environment } = require('square');

exports.handler = async (event) => {
  const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Production,
  });

  try {
    const { nonce, amount, currency } = JSON.parse(event.body);
    const response = await client.paymentsApi.createPayment({
      sourceId: nonce,
      amountMoney: {
        amount: Math.round(amount * 100), // Convert dollars to cents
        currency: currency || 'USD',
      },
      idempotencyKey: `${Date.now()}-${Math.random()}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.result),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};