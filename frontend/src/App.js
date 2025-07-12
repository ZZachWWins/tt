// src/App.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); // Replace with your Stripe publishable key

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showAgeVerify, setShowAgeVerify] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const products = [
    {
      id: 1,
      name: 'Red Velvet Delta-9 Cupcake - 300mg of Delta-9 THC',
      price: 39.99,
      description: 'Our strongest bacth, Delicious red velvet flavored muffins infused with 300 mg of hemp-derived delta-9 THC. Pre-order: Ships next week. TEXAS SIZED!',
      image: 'https://via.placeholder.com/300x300?text=Pecan+Gummies'
    },
    {
      id: 2,
      name: 'Sweet Delight Chocolate Bar - 150 mg of Delta-9 THC',
      price: 19.99,
      description: 'Rich chocolate bars with a texas size, containing compliant delta-9 THC. Our Number One. Pre-order: Ships next week.',
      image: 'https://via.placeholder.com/300x300?text=Chili+Chocolate'
    },
    {
      id: 3,
      name: 'Blueberry Bliss Muffin - 150 mg of Delta-9 THC',
      price: 19.99,
      description: 'Hemp-derived delta-9 muffin with natural blueberry flavor and terpenes for relaxation. Pre-order: Ships next week.',
      image: 'https://via.placeholder.com/300x300?text=Blueberry+Tincture'
    },
    {
      id: 4,
      name: 'Infused Cinnamon Coffee Cake - 150 mg of Delta-9 THC',
      price: 19.99,
      description: 'Refreshing coffee cake infused with delta-9 THC, Texas style. Pre-order: Ships next week.',
      image: 'https://via.placeholder.com/300x300?text=Texas+Tea'
    },
    {
      id: 5,
      name: 'Iced Chocolate Cupcake - 150 mg of Delta-9 THC',
      price: 19.99,
      description: 'Hemp-derived delta-9 muffin with natural blueberry flavor and terpenes for relaxation. Pre-order: Ships next week.',
      image: 'https://via.placeholder.com/300x300?text=Blueberry+Tincture'
    }
  ];

  const featuredProducts = [products[0], products[1]]; // Select first two products for Featured section

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login - replace with real auth if needed
    setUser({ username });
    setUsername('');
    setPassword('');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Mock signup - replace with real auth if needed
    alert('Signup successful! Please log in.');
    setSignupUsername('');
    setSignupPassword('');
  };

  const handleLogout = () => {
    setUser(null);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: cart }),
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  const Landing = () => (
    <section className="landing-section">
      <h2 className="landing-title">Welcome to Tejas Treats</h2>
      <p className="landing-text">
        Howdy from Tejas Treats! We're a Texas-born company crafting federally compliant delta-9 THC edibles under the 2018 Farm Bill. Our gummies, chocolates, and treats bring the Lone Star spirit to every bite, blending authentic Texas flavors with the relaxing benefits of hemp-derived delta-9. All products available for pre-order now—shipping starts next week! ALL PRODUCTS CONTAIN FULL SPECTRUM HEMP, A ONE to ONE RATIO of CBD to THC. 
      </p>
      <div className="featured-products-section">
        <h2 className="featured-products-title">Featured Products</h2>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <button onClick={() => addToCart(product)} className="add-to-cart-btn">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
      <button className="cta-btn" onClick={() => setShowHistory(true)}>
        History of Delta-9 & Hemp
      </button>
      <p className="landing-disclaimer">
        Disclaimer: Tejas Treats products contain delta-9 THC at or below 0.3% by dry weight, compliant with the 2018 Farm Bill. We do not offer medical advice or diagnose conditions. Consult a healthcare professional before use. Products are for adults 21+ and not intended for resale or distribution in states where prohibited.
      </p>
    </section>
  );

  const Shop = () => (
    <section className="product-section">
      <h2 className="product-title">Our Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)} className="add-to-cart-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );

  const Success = () => (
    <div className="success-page">
      <h2>Thank you for your pre-order!</h2>
      <p>Your order will ship next week. We'll email you with details.</p>
    </div>
  );

  const Cancel = () => (
    <div className="cancel-page">
      <h2>Checkout Cancelled</h2>
      <p>You can continue shopping or contact us if you have questions.</p>
    </div>
  );

  return (
    <div className="app">
      {!showAgeVerify ? (
        <Router>
          <header className="header">
            <h1 className="title">Tejas Treats</h1>
            <p className="subtitle">Texas-Made Delta-9 Delights</p>
            <nav className="navigation">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <button onClick={() => setShowCart(true)} className="cart-btn">
                Cart ({cart.length})
              </button>
            </nav>
            {user ? (
              <div className="auth-section">
                <span>Welcome, {user.username}</span>
                <button onClick={handleLogout} className="auth-btn">Logout</button>
              </div>
            ) : (
              <div className="auth-section">
                <form onSubmit={handleLogin} className="login-form">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  <button type="submit" className="auth-btn">Login</button>
                </form>
                <form onSubmit={handleSignup} className="signup-form">
                  <input
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="Choose Username"
                    required
                  />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Choose Password"
                    required
                  />
                  <button type="submit" className="auth-btn">Signup</button>
                </form>
              </div>
            )}
          </header>

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Routes>

          {showHistory && (
            <div className="history-modal">
              <div className="history-content">
                <h2 className="history-title">Delta-9 THC & Hemp: A Texas Tale</h2>
                <p className="history-text">
                  Hemp has deep roots in Texas, once a key crop for rope and textiles. The 2018 Farm Bill redefined hemp as cannabis with 0.3% or less delta-9 THC, removing it from the Controlled Substances Act and legalizing its cultivation nationwide. This opened the door for hemp-derived delta-9 THC edibles, like those from Tejas Treats, which comply with federal and Texas laws. From CBD oils to gummies, hemp products have surged, with Texas leading the charge in innovative, compliant edibles that honor our state's bold spirit.
                </p>
                <button className="close-btn" onClick={() => setShowHistory(false)}>
                  Close
                </button>
              </div>
            </div>
          )}

          {showCart && (
            <div className="cart-modal">
              <div className="cart-content">
                <h2 className="cart-title">Your Cart</h2>
                {cart.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <>
                    <ul>
                      {cart.map((item, index) => (
                        <li key={index}>{item.name} - ${item.price.toFixed(2)}</li>
                      ))}
                    </ul>
                    <p>Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
                    <button onClick={handleCheckout} className="checkout-btn">Checkout (Pre-order)</button>
                  </>
                )}
                <button className="close-btn" onClick={() => setShowCart(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Router>
      ) : (
        <div className="age-modal">
          <div className="age-modal-content">
            <h2 className="age-title">Age Verification</h2>
            <p className="age-text">You must be 21 years or older to access this site.</p>
            <div className="age-buttons">
              <button className="auth-btn" onClick={() => setShowAgeVerify(false)}>Yes, I am 21+</button>
              <button className="auth-btn" onClick={() => window.location.href = 'https://www.google.com'}>No, I'm under 21</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;