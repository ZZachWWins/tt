import React, { useState, useEffect } from 'react';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import '../App.css';

const Payment = ({ cart, onSuccess, onCancel }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isSquareLoaded, setIsSquareLoaded] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const loadSquareSDK = (urls, index = 0) => {
    if (index >= urls.length) {
      console.error('All Square SDK URLs failed to load');
      setError('Failed to load Square payment system. Please try the button below, check your network, disable ad-blockers, or contact support at treatstejas@gmail.com.');
      return;
    }

    setError(null);
    const script = document.createElement('script');
    script.src = urls[index];
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      console.log(`Square SDK script loaded successfully from ${urls[index]}`);
      if (window.Square) {
        console.log('Square SDK object available');
        setIsSquareLoaded(true);
      } else {
        console.error('Square SDK object not available after script load');
        setError('Failed to initialize Square payment system. Please try again or contact support at treatstejas@gmail.com.');
      }
    };
    script.onerror = (e) => {
      console.error(`Failed to load Square SDK script from ${urls[index]}:`, e);
      loadSquareSDK(urls, index + 1);
    };
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  };

  useEffect(() => {
    // Check environment variables
    if (!process.env.REACT_APP_SQUARE_APPLICATION_ID || !process.env.REACT_APP_SQUARE_LOCATION_ID) {
      console.error('Missing Square environment variables', {
        appId: process.env.REACT_APP_SQUARE_APPLICATION_ID,
        locationId: process.env.REACT_APP_SQUARE_LOCATION_ID,
      });
      setError('Square configuration is missing. Please contact support at treatstejas@gmail.com.');
      return;
    }

    // Check if Square SDK is already loaded or load it
    const checkSquareSDK = (attempts = 10, delay = 2000) => {
      if (window.Square) {
        console.log('Square SDK already loaded');
        setIsSquareLoaded(true);
      } else if (attempts > 0) {
        console.warn(`Square SDK not loaded, retrying (${attempts} attempts left)`);
        setTimeout(() => checkSquareSDK(attempts - 1, delay), delay);
      } else {
        console.error('Square SDK not loaded after retries, loading script');
        loadSquareSDK([
          'https://web.squarecdn.com/v1/square.js',
          'https://js.squareup.com/v2/paymentform/1.0.0',
        ]);
      }
    };

    checkSquareSDK();
  }, []);

  const handlePayment = async (token) => {
    setProcessing(true);
    setError(null);

    try {
      console.log('Sending payment request with nonce:', token);
      const response = await fetch('/.netlify/functions/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nonce: token, amount: total, currency: 'USD' }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Payment successful:', result);
        onSuccess();
      } else {
        console.error('Payment failed:', result.error);
        setError(result.error || 'Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('An error occurred during payment processing. Please try again or contact support at treatstejas@gmail.com.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="success-page" style={{ background: '#ffffff', padding: '40px 20px' }}>
      <img
        src="https://res.cloudinary.com/diyk64mcr/image/upload/v1752426950/transtt_cvuwz6.png"
        alt="Tejas Treats Logo"
        style={{ width: '150px', height: 'auto', margin: '0 auto 20px', display: 'block' }}
      />
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#333333', textAlign: 'center' }}>
        Secure Checkout
      </h2>
      <p style={{ fontSize: '1.2rem', color: '#666666', textAlign: 'center', marginBottom: '20px' }}>
        Total: ${total}
      </p>
      {error && (
        <p style={{ color: '#DC143C', textAlign: 'center', marginBottom: '20px' }}>
          {error}
        </p>
      )}
      {isSquareLoaded ? (
        <PaymentForm
          applicationId={process.env.REACT_APP_SQUARE_APPLICATION_ID}
          locationId={process.env.REACT_APP_SQUARE_LOCATION_ID}
          cardTokenizeResponseReceived={(token, buyer) => {
            if (token.errors) {
              console.error('Tokenization errors:', token.errors);
              setError(token.errors.map((e) => e.message).join(', '));
              return;
            }
            console.log('Payment token:', token, 'Buyer:', buyer);
            handlePayment(token.token);
          }}
          createVerificationDetails={() => ({
            amount: total,
            billingContact: {
              addressLines: ['123 Main Street'],
              familyName: 'Customer',
              givenName: 'Test',
              countryCode: 'US',
              city: 'Austin',
            },
            currencyCode: 'USD',
            intent: 'CHARGE',
          })}
        >
          <CreditCard
            buttonProps={{
              css: {
                background: 'linear-gradient(45deg, #FF1493, #DC143C)',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing ? 0.7 : 1,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              },
              isLoading: processing,
              children: processing ? 'Processing...' : 'Pay Now',
            }}
            style={{
              '.input-container': {
                border: '1px solid #dddddd',
                borderRadius: '8px',
                background: '#f9f9f9',
              },
              '.input-container.is-focus': {
                border: '1px solid #FF1493',
              },
              input: {
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1rem',
                color: '#333333',
              },
            }}
          />
        </PaymentForm>
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ color: '#666666', fontSize: '1.2rem' }}>
            Loading payment form... If this persists, please try the following:
          </p>
          <ul style={{ color: '#666666', fontSize: '1rem', textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
            <li>Disable any ad-blockers or browser extensions.</li>
            <li>Ensure a stable internet connection.</li>
            <li>Try a different browser (e.g., Chrome or Firefox).</li>
            <li>Contact support at <a href="mailto:treatstejas@gmail.com">treatstejas@gmail.com</a>.</li>
          </ul>
          <button
            className="close-btn"
            onClick={() => loadSquareSDK(['https://web.squarecdn.com/v1/square.js', 'https://js.squareup.com/v2/paymentform/1.0.0'])}
            style={{ display: 'block', margin: '10px auto' }}
          >
            Retry Loading Payment Form
          </button>
        </div>
      )}
      <button
        className="close-btn"
        onClick={onCancel}
        style={{ display: 'block', margin: '10px auto' }}
      >
        Cancel
      </button>
    </div>
  );
};

export default Payment;