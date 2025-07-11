// src/pages/Contact.js
import React, { useState } from 'react';
import '../App.css'; // Assuming styles are in App.css or adjust as needed

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For Netlify Forms: The form will be handled by Netlify automatically on submit
    setSubmitted(true);
    // Reset form after submission
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section className="contact-section" id="contact">
      <h2 className="contact-title">Contact Us</h2>
      <p className="contact-text">
        Have questions about our products, pre-orders, or anything else? Reach out to us at treatstejas@gmail.com or use the form below.
      </p>
      {submitted ? (
        <p className="success-message">Thank you for your message! We'll get back to you soon.</p>
      ) : (
        <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit}>
          <input type="hidden" name="form-name" value="contact" />
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      )}
    </section>
  );
}

export default Contact;