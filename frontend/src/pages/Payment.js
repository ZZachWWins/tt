import React, { useState } from 'react';
import { Card } from '@square/web-sdk';
import '../App.css';

const Payment = ({ cart, onSuccess, onCancel }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handlePayment = async (nonce) => {
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nonce, amount: total, currency: 'USD' }),
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(result.error || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
      <Card
        applicationId={process.env.REACT_APP_SQUARE_APPLICATION_ID}
        locationId={process.env.REACT_APP_SQUARE_LOCATION_ID}
        callbacks={{
          cardNonceResponseReceived: (errors, nonce) => {
            if (errors) {
              setError(errors.map((e) => e.message).join(', '));
              return;
            }
            handlePayment(nonce);
          },
        }}
      />
      <button
        className="checkout-btn"
        disabled={processing}
        style={{ display: 'block', margin: '20px auto' }}
        onClick={() => document.getElementById('card-container').dispatchEvent(new Event('submit'))}
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
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