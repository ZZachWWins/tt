import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Payment from './pages/Payment';
import './App.css';

const logo = 'https://res.cloudinary.com/diyk64mcr/image/upload/v1752426950/transtt_cvuwz6.png';

function App() {
  const [showHistory, setShowHistory] = useState(false);
  const [showAgeVerify, setShowAgeVerify] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const products = [
    {
      id: 1,
      name: 'Red Velvet Delta-9 Cupcake - 300mg',
      price: 39.99,
      description: 'Our strongest batch, Delicious red velvet flavored muffins infused with 300 mg of hemp-derived delta-9 THC. Pre-order: Ships next week. TEXAS SIZED!',
      image: 'https://res.cloudinary.com/diyk64mcr/image/upload/v1752425778/Super-Moist-Red-Velvet-Cupcakes_ldrr4g.jpg',
      cannabinoids: ['Delta-9 THC', 'CBD'],
      terpenes: ['Myrcene', 'Limonene'],
      effect: 'Balanced Relaxation'
    },
    {
      id: 2,
      name: 'Sweet Delight Chocolate Bar - 150 mg',
      price: 19.99,
      description: 'Rich chocolate bars with a Texas size, containing compliant delta-9 THC. Our Number One. Pre-order: Ships next week.',
      image: 'https://res.cloudinary.com/diyk64mcr/image/upload/v1752425834/stack-chocolate_pf62bq.jpg',
      cannabinoids: ['Delta-9 THC', 'CBN'],
      terpenes: ['Myrcene', 'Linalool'],
      effect: 'Sleepy'
    },
    {
      id: 3,
      name: 'Blueberry Bliss Muffin - 150 mg',
      price: 19.99,
      description: 'Hemp-derived delta-9 muffin with natural blueberry flavor and terpenes for relaxation. Pre-order: Ships next week.',
      image: 'https://res.cloudinary.com/diyk64mcr/image/upload/v1752425729/blueberry-muffins-square-35-720x720_1_e9pohw.jpg',
      cannabinoids: ['Delta-9 THC', 'CBD'],
      terpenes: ['Pinene', 'Terpinolene'],
      effect: 'Calm Focus'
    },
    {
      id: 4,
      name: 'Infused Cinnamon Coffee Cake - 150 mg',
      price: 19.99,
      description: 'Refreshing coffee cake infused with delta-9 THC, Texas style. Pre-order: Ships next week.',
      image: 'https://res.cloudinary.com/diyk64mcr/image/upload/v1752425905/Coffee-Cake-Muffins-2023-Square_ic7yoa.webp',
      cannabinoids: ['Delta-9 THC', 'CBG'],
      terpenes: ['Humulene', 'Caryophyllene'],
      effect: 'Energetic'
    },
    {
      id: 5,
      name: 'Iced Chocolate Cupcake - 150 mg',
      price: 19.99,
      description: 'Hemp-derived delta-9 muffin with natural blueberry flavor and terpenes for relaxation. Pre-order: Ships next week.',
      image: 'https://res.cloudinary.com/diyk64mcr/image/upload/v1752425908/choc-cupcake-2_coelak.jpg',
      cannabinoids: ['Delta-9 THC', 'CBC'],
      terpenes: ['Limonene', 'Pinene'],
      effect: 'Uplifted Mood'
    },
    {
      id: 6,
      name: 'Infused Tincture, Sleep 150 mg|150 mg',
      price: 39.99,
      description: 'Hemp-derived tincture designed for better sleep, infused with delta-9 THC and CBD. Pre-order: Ships next week.',
      image: 'https://res.cloudinary.com/diyk64mcr/image/upload/v1752533367/istockphoto-1215748393-612x612_ksonpl.jpg',
      cannabinoids: ['Delta-9 THC', 'CBN', 'CBD'],
      terpenes: ['Myrcene', 'Linalool', 'Nerolidol'],
      effect: 'Deep Sleep'
    },
    {
      id: 7,
      name: 'Infused Tincture, Energize 150 mg|150 mg',
      price: 39.99,
      description: 'Hemp-derived tincture for an energy boost, infused with delta-9 THC and CBD. Pre-order: Ships next week.',
      image: 'https://res.cloudinary.com/diyk64mcr/image/upload/v1752533367/istockphoto-1215748393-612x612_ksonpl.jpg',
      cannabinoids: ['Delta-9 THC', 'CBG', 'CBD'],
      terpenes: ['Pinene', 'Limonene', 'Terpinolene'],
      effect: 'Energized'
    },
    {
      id: 8,
      name: 'Infused Tincture, Social 150 mg|150 mg',
      price: 39.99,
      description: 'Hemp-derived tincture to enhance social interactions, infused with delta-9 THC and CBD. Pre-order: Ships next week.',
      image: 'https://res.cloudinary.com/diyk64mcr/image/upload/v1752533367/istockphoto-1215748393-612x612_ksonpl.jpg',
      cannabinoids: ['Delta-9 THC', 'CBC', 'CBD'],
      terpenes: ['Limonene', 'Linalool', 'Beta-Caryophyllene'],
      effect: 'Social & Relaxed'
    },
    {
      id: 9,
      name: 'Infused Tincture, Creative 150 mg|150 mg',
      price: 39.99,
      description: 'Hemp-derived tincture to spark creativity, infused with delta-9 THC and CBD. Pre-order: Ships next week.',
      image: 'https://res.cloudinary.com/diyk64mcr/image/upload/v1752533367/istockphoto-1215748393-612x612_ksonpl.jpg',
      cannabinoids: ['Delta-9 THC', 'CBG', 'CBD'],
      terpenes: ['Alpha-Pinene', 'Limonene', 'Ocimene'],
      effect: 'Creative Focus'
    }
  ];

  const featuredProducts = [products[0], products[1]];

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map((item) =>
      item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter((item) => item.quantity > 0));
  };

  const getCartQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const EndocannabinoidSystem = () => (
    <section className="product-section">
      <h2 className="product-title">Endocannabinoid System & Tejas Treats</h2>
      <p className="landing-text">
        The endocannabinoid system (ECS) is your body’s natural regulator, influencing mood, sleep, pain, and energy. At Tejas Treats, we craft hemp-derived edibles with a full spectrum of cannabinoids and tailored terpene blends to support your ECS and enhance specific effects. Explore how our products align with your needs:
      </p>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p><strong>Effect:</strong> {product.effect}</p>
            <p><strong>Cannabinoids:</strong> {product.cannabinoids.join(', ')}</p>
            <p><strong>Terpenes:</strong> {product.terpenes.join(', ')}</p>
            <p className="product-price">${product.price.toFixed(2)}</p>
            {getCartQuantity(product.id) > 0 && (
              <p className="cart-quantity">In cart: {getCartQuantity(product.id)}</p>
            )}
            <button onClick={() => addToCart(product)} className="add-to-cart-btn">Add to Cart</button>
          </div>
        ))}
      </div>
      <p className="landing-text">
        Each product is designed to interact with your ECS, offering effects like relaxation with Myrcene and CBN, or energy with CBG and Humulene. Pre-order now—shipping starts next week!
      </p>
    </section>
  );

  const Landing = () => (
    <section className="landing-section">
      <h2 className="landing-title">Welcome to Tejas Treats</h2>
      <p className="landing-text">
        Howdy from Tejas Treats! We're a Texas-born company crafting federally compliant delta-9 THC edibles under the 2018 Farm Bill. Our gummies, chocolates, and treats bring the Lone Star spirit to every bite, blending authentic Texas flavors with the relaxing benefits of hemp-derived delta-9. All products available for pre-order now—shipping starts next week! ALL PRODUCTS CONTAIN FULL SPECTRUM HEMP, A ONE TO ONE RATIO OF CBD TO THC.
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
              {getCartQuantity(product.id) > 0 && (
                <p className="cart-quantity">In cart: {getCartQuantity(product.id)}</p>
              )}
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
            {getCartQuantity(product.id) > 0 && (
              <p className="cart-quantity">In cart: {getCartQuantity(product.id)}</p>
            )}
            <button onClick={() => addToCart(product)} className="add-to-cart-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );

  const Hemp101 = () => (
    <section className="product-section">
      <h2 className="product-title">Hemp 101: Legal Delta-9 Edibles</h2>
      <p className="landing-text">
        At Tejas Treats, our edibles deliver the same Delta-9 THC experience as those found in recreational cannabis states, but with a key difference: they're derived from hemp and fully compliant with the 2018 Farm Bill. This federal legislation legalizes hemp products containing no more than 0.3% Delta-9 THC by dry weight, making our treats shippable to all 50 states—unlike state-restricted cannabis.
      </p>
      <p className="landing-text">
        Our formulations often pack a stronger punch per serving because we maximize the allowable THC concentration within the dry weight limit, combined with full-spectrum cannabinoids like CBD, CBG, and CBN for enhanced effects via the entourage effect. This means you get potent, consistent results without the legal hurdles of traditional cannabis edibles.
      </p>
      <p className="landing-text">
        Whether you're seeking relaxation, energy, or focus, our hemp-derived Delta-9 edibles provide a legal, accessible alternative that's just as effective—if not more so—for many users. Always consult local laws and a healthcare professional before use.
      </p>
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
            <div className="shipping-banner">Free Shipping & Handling on Orders over $75</div>
            <nav className="navigation" style={{ justifyContent: 'space-between', width: '100%' }}>
              <div className="nav-left" style={{ display: 'flex', gap: '20px' }}>
                <Link to="/">HOME</Link>
                <Link to="/shop">SHOP</Link>
                <Link to="/product-finder">PRODUCT FINDER</Link>
              </div>
              <Link to="/">
                <img src={logo} alt="Tejas Treats" className="logo" style={{ width: '150px', height: 'auto' }} />
              </Link>
              <div className="nav-right" style={{ display: 'flex', gap: '20px' }}>
                <Link to="/about">FAQs</Link>
                <Link to="/hemp101">HEMP 101</Link>
                <Link to="/contact">GET IN TOUCH</Link>
                <button onClick={() => setShowCart(true)} className="cart-btn">
                  Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </button>
              </div>
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product-finder" element={<EndocannabinoidSystem />} />
            <Route path="/hemp101" element={<Hemp101 />} />
            <Route path="/payment" element={<Payment cart={cart} onSuccess={() => window.location.href='/success'} onCancel={() => window.location.href='/cancel'} />} />
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
                        <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span>{item.name} (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)}</span>
                          <div>
                            <button onClick={() => updateQuantity(item.id, -1)} style={{ marginRight: '5px' }}>-</button>
                            <button onClick={() => updateQuantity(item.id, 1)} style={{ marginRight: '5px' }}>+</button>
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p>Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
                    <Link to="/payment" className="checkout-btn">Checkout (Pre-order)</Link>
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