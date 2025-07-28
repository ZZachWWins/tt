BigInt.prototype.toJSON = function () { return this.toString(); };

const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');

exports.handler = async (event) => {
  const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Production,
  });

  if (event.httpMethod !== 'POST') {
    console.error('Invalid HTTP method:', event.httpMethod);
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
    const body = JSON.parse(event.body);
    const { nonce, amount, currency, billingContact, cart } = body;

    if (!nonce || !amount || !currency || !billingContact || !cart || !billingContact.email) {
      console.error('Missing required parameters:', { nonce, amount, currency, billingContact, cart });
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST',
        },
        body: JSON.stringify({ error: 'Missing required parameters: nonce, amount, currency, billingContact, cart, or email' }),
      };
    }

    // Validate amount
    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      console.error('Invalid amount:', amount);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST',
        },
        body: JSON.stringify({ error: 'Invalid amount: must be a positive number' }),
      };
    }

    // Create an order in Square
    const orderResponse = await client.ordersApi.createOrder({
      order: {
        locationId: process.env.REACT_APP_SQUARE_LOCATION_ID,
        lineItems: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity.toString(),
          basePriceMoney: {
            amount: Math.round(item.price * 100), // Convert to cents
            currency: 'USD',
          },
        })),
        fulfillments: [
          {
            type: 'SHIPMENT',
            state: 'PROPOSED',
            shipmentDetails: {
              recipient: {
                displayName: `${billingContact.firstName} ${billingContact.lastName}`,
                emailAddress: billingContact.email,
                address: {
                  addressLine1: billingContact.addressLine1,
                  locality: billingContact.city,
                  administrativeDistrictLevel1: billingContact.state,
                  postalCode: billingContact.zip,
                  country: billingContact.country,
                },
              },
            },
          },
        ],
      },
      idempotencyKey: randomUUID(),
    });

    const orderId = orderResponse.result.order.id;
    console.log('Order created successfully:', orderId);

    // Create payment linked to the order
    const paymentResponse = await client.paymentsApi.createPayment({
      sourceId: nonce,
      amountMoney: {
        amount: amountInCents,
        currency: currency || 'USD',
      },
      idempotencyKey: randomUUID(),
      orderId: orderId,
      buyerEmailAddress: billingContact.email,
      billingAddress: {
        addressLine1: billingContact.addressLine1,
        locality: billingContact.city,
        administrativeDistrictLevel1: billingContact.state,
        postalCode: billingContact.zip,
        country: billingContact.country,
        firstName: billingContact.firstName,
        lastName: billingContact.lastName,
      },
    });

    console.log('Payment created successfully:', paymentResponse.result.payment.id);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify({
        payment: paymentResponse.result,
        orderId: orderId,
        billingContact,
      }),
    };
  } catch (error) {
    console.error('Payment or order processing error:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      errors: error.errors,
      stack: error.stack,
    });
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify({
        error: error.message || 'Payment processing failed',
        code: error.code,
        detail: error.detail,
        errors: error.errors,
      }),
    };
  }
};