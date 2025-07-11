// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

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
      name: 'Pecan Praline Delta-9 Gummies',
      price: 25.99,
      description: 'Delicious pecan praline flavored gummies infused with hemp-derived delta-9 THC.',
      image: 'https://via.placeholder.com/300x300?text=Pecan+Gummies'
    },
    {
      id: 2,
      name: 'Spicy Chili Chocolate Bars',
      price: 19.99,
      description: 'Rich chocolate bars with a spicy chili kick, containing compliant delta-9 THC.',
      image: 'https://via.placeholder.com/300x300?text=Chili+Chocolate'
    },
    {
      id: 3,
      name: 'Blueberry Bliss Tincture',
      price: 34.99,
      description: 'Hemp-derived delta-9 tincture with natural blueberry flavor for relaxation.',
      image: 'https://via.placeholder.com/300x300?text=Blueberry+Tincture'
    },
    {
      id: 4,
      name: 'Texas Tea Infused Beverages',
      price: 15.99,
      description: 'Refreshing tea beverages infused with delta-9 THC, Texas style.',
      image: 'https://via.placeholder.com/300x300?text=Texas+Tea'
    }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login
    setUser({ username });
    setUsername('');
    setPassword('');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Mock signup
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

  return (
    <div className="app">
      {!showAgeVerify ? (
        <>
          <header className="header">
            <h1 className="title">Tejas Treats</h1>
            <p className="subtitle">Texas-Made Delta-9 Delights</p>
            <nav className="navigation">
              <a href="#home">Home</a>
              <a href="#shop">Shop</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
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

          <section className="landing-section" id="home">
            <h2 className="landing-title">Welcome to Tejas Treats</h2>
            <p className="landing-text">
              Howdy from Tejas Treats! We're a Texas-born company crafting federally compliant delta-9 THC edibles under the 2018 Farm Bill. Our gummies, chocolates, and treats bring the Lone Star spirit to every bite.
            </p>
            <button className="cta-btn" onClick={() => setShowHistory(true)}>
              History of Delta-9 & Hemp
            </button>
            <p className="landing-disclaimer">
              Disclaimer: Products for adults 21+. Consult a healthcare professional before use.
            </p>
          </section>

          <section className="product-section" id="shop">
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

          {showHistory && (
            <div className="history-modal">
              <div className="history-content">
                <h2 className="history-title">Delta-9 THC & Hemp: A Texas Tale</h2>
                <p className="history-text">
                  Hemp has deep roots in Texas... (abbreviated)
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
                  <ul>
                    {cart.map((item, index) => (
                      <li key={index}>{item.name} - ${item.price.toFixed(2)}</li>
                    ))}
                  </ul>
                )}
                <button className="close-btn" onClick={() => setShowCart(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </>
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