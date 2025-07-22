BigInt.prototype.toJSON = function () { return this.toString(); };

const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');

exports.handler = async (event) => {
  const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Production,
  });

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { nonce, amount, currency, billingContact } = JSON.parse(event.body);

    if (!nonce || !amount || !currency || !billingContact) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST',
        },
        body: JSON.stringify({ error: 'Missing required parameters: nonce, amount, currency, or billingContact' }),
      };
    }

    const response = await client.paymentsApi.createPayment({
      sourceId: nonce,
      amountMoney: {
        amount: Math.round(parseFloat(amount) * 100), // Convert dollars to cents
        currency: currency || 'USD',
      },
      idempotencyKey: randomUUID(),
      buyerEmailAddress: billingContact.email || 'customer@treatstejas.com', // Placeholder email
      billingAddress: {
        addressLines: [billingContact.addressLine1],
        familyName: billingContact.lastName,
        givenName: billingContact.firstName,
        countryCode: billingContact.country,
        city: billingContact.city,
        state: billingContact.state,
        postalCode: billingContact.zip,
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify({
        payment: response.result,
        billingContact, // Return for order processing
      }),
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify({ error: error.message || 'Payment processing failed' }),
    };
  }
};