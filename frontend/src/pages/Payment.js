import React, { useState, useEffect } from 'react';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import '../App.css';

const Payment = ({ cart, onSuccess, onCancel }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isSquareLoaded, setIsSquareLoaded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    addressLine1: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.addressLine1 || !formData.city || !formData.state || !formData.zip) {
      setError('Please fill in all required fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const loadSquareSDK = () => {
    setError(null);
    const script = document.createElement('script');
    script.src = 'https://web.squarecdn.com/v1/square.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      console.log('Square SDK script loaded successfully from https://web.squarecdn.com/v1/square.js');
      if (window.Square) {
        console.log('Square SDK object available');
        setIsSquareLoaded(true);
      } else {
        console.error('Square SDK object not available after script load');
        setError('Failed to initialize Square payment system. Please try again or contact support at treatstejas@gmail.com.');
      }
    };
    script.onerror = (e) => {
      console.error('Failed to load Square SDK script:', e);
      setError('Failed to load Square payment system. Please check your network, disable ad-blockers, or contact support at treatstejas@gmail.com.');
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

    // Load Square SDK immediately
    loadSquareSDK();
  }, []);

  const handlePayment = async (token) => {
    if (!validateForm()) return;

    setProcessing(true);
    setError(null);

    try {
      console.log('Sending payment request with nonce:', token, 'Form data:', formData);
      const response = await fetch('/.netlify/functions/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nonce: token,
          amount: total,
          currency: 'USD',
          billingContact: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            addressLine1: formData.addressLine1,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
          },
          cart,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Payment successful:', result);
        onSuccess();
      } else {
        console.error('Payment failed:', result);
        setError(
          result.error || result.message || `Payment failed with code ${result.code || 'unknown'}. Please try again or contact support at treatstejas@gmail.com.`
        );
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('An error occurred during payment processing: ' + err.message + '. Please try again or contact support at treatstejas@gmail.com.');
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
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#333333', marginBottom: '15px' }}>
          Shipping Information
        </h3>
        <form style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name *"
              required
              style={{
                padding: '10px',
                border: '1px solid #dddddd',
                borderRadius: '8px',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '16px',
              }}
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name *"
              required
              style={{
                padding: '10px',
                border: '1px solid #dddddd',
                borderRadius: '8px',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '16px',
              }}
            />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email *"
            required
            style={{
              padding: '10px',
              border: '1px solid #dddddd',
              borderRadius: '8px',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '16px',
            }}
          />
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
            placeholder="Address Line 1 *"
            required
            style={{
              padding: '10px',
              border: '1px solid #dddddd',
              borderRadius: '8px',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '16px',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City *"
              required
              style={{
                padding: '10px',
                border: '1px solid #dddddd',
                borderRadius: '8px',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '16px',
              }}
            />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State *"
              required
              style={{
                padding: '10px',
                border: '1px solid #dddddd',
                borderRadius: '8px',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '16px',
              }}
            />
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              placeholder="ZIP Code *"
              required
              style={{
                padding: '10px',
                border: '1px solid #dddddd',
                borderRadius: '8px',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '16px',
              }}
            />
          </div>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            style={{
              padding: '10px',
              border: '1px solid #dddddd',
              borderRadius: '8px',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '16px',
            }}
          >
            <option value="US">United States</option>
          </select>
        </form>
        <h3 style={{ fontSize: '1.5rem', color: '#333333', marginBottom: '15px' }}>
          Payment Information
        </h3>
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
                addressLines: [formData.addressLine1],
                familyName: formData.lastName,
                givenName: formData.firstName,
                email: formData.email,
                countryCode: formData.country,
                city: formData.city,
                state: formData.state,
                postalCode: formData.zip,
              },
              currencyCode: 'USD',
              intent: 'CHARGE',
            })}
          >
            <CreditCard
              buttonProps={{
                css: {
                  backgroundColor: '#FF1493',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '600',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.7 : 1,
                  transition: 'transform 0.2s',
                  ':hover': {
                    transform: 'translateY(-2px)',
                  },
                },
                isLoading: processing,
                children: processing ? 'Processing...' : 'Pay Now',
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
              onClick={loadSquareSDK}
              style={{ display: 'block', margin: '10px auto' }}
            >
              Retry Loading Payment Form
            </button>
          </div>
        )}
      </div>
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