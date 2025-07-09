import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.5,
    }));

    const constellations = [
      { points: [[200, 200], [200, 300], [150, 250], [250, 250]], color: '#d32f2f' },
      { points: [[400, 100], [450, 150], [500, 200], [450, 250], [400, 200]], color: '#1976d2' },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
        star.alpha += Math.random() * 0.05 - 0.025;
        if (star.alpha > 1) star.alpha = 1;
        if (star.alpha < 0.5) star.alpha = 0.5;
      });

      constellations.forEach(constellation => {
        ctx.beginPath();
        ctx.strokeStyle = constellation.color;
        ctx.lineWidth = 1;
        constellation.points.forEach(([x, y], i) => {
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const fetchVideos = async () => {
      try {
        const res = await axios.get('/.netlify/functions/videos');
        console.log('Fetched videos:', res.data);
        setVideos(res.data || []);
      } catch (err) {
        console.error('Fetch error:', err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/.netlify/functions/login', { username, password });
      setUser(res.data.user);
      setUsername('');
      setPassword('');
    } catch (err) {
      alert('Login failed—check your credentials!');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/.netlify/functions/signup', { username: signupUsername, password: signupPassword });
      alert('Signup successful! Please log in.');
      setSignupUsername('');
      setSignupPassword('');
    } catch (err) {
      alert('Signup failed—username might be taken!');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/.netlify/functions/logout');
      setUser(null);
    } catch (err) {
      alert('Logout failed—try again!');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to upload videos!');
      return;
    }
    if (!file) {
      alert('Please select a video file!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'video-vault-preset');

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dwmnbrjtu/video/upload', formData);
      const videoData = {
        title,
        description,
        fileUrl: res.data.secure_url,
        thumbnailUrl: res.data.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_320,h_240/'),
        uploadedBy: user.username,
      };

      await axios.post('/.netlify/functions/videos', videoData);
      setFile(null);
      setTitle('');
      setDescription('');
      const videosRes = await axios.get('/.netlify/functions/videos');
      console.log('Videos after upload:', videosRes.data);
      setVideos(videosRes.data || []);
      alert('Video uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err.response ? err.response.data : err.message);
      alert('Upload failed—check your file or permissions!');
    }
  };

  const handleViewIncrement = async (id) => {
    try {
      const res = await axios.put('/.netlify/functions/videos', { id });
      console.log('Updated video views:', res.data);
      setVideos(videos.map(video => 
        video._id === id ? { ...video, views: res.data.views } : video
      ));
    } catch (err) {
      console.error('Failed to increment views:', err.response ? err.response.data : err.message);
    }
  };

  const featuredVideo = videos.length > 0 ? videos[0] : null;

  return (
    <div className="app">
      <canvas ref={canvasRef} className="starry-background" />
      <header className="header">
        <h1 className="title">Tejas Treats</h1>
        <p className="subtitle">Texas-Made Delta-9 Delights</p>
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

      <section className="landing-section">
        <h2 className="landing-title">Welcome to Tejas Treats</h2>
        <p className="landing-text">
          Howdy from Tejas Treats! We're a Texas-born company crafting federally compliant delta-9 THC edibles under the 2018 Farm Bill. Our gummies, chocolates, and treats bring the Lone Star spirit to every bite, blending authentic Texas flavors with the relaxing benefits of hemp-derived delta-9. Share your stories and recipes through video and join our community celebrating Texas hemp culture.
        </p>
        <h2 className="landing-title">The Delta-9 Difference</h2>
        <p className="landing-text">
          Delta-9 THC, legal at 0.3% or less by dry weight, offers a mild, uplifting experience. Our products are crafted with care to meet federal and Texas standards, ensuring quality and compliance. Watch videos from our community to learn how Texans are incorporating delta-9 edibles into their lives, from backyard BBQs to quiet evenings under the stars.
        </p>
        <h2 className="landing-title">Your Taste, Your Texas</h2>
        <p className="landing-text">
          At Tejas Treats, we celebrate your freedom to choose. Our platform showcases real stories from folks across Texas sharing their love for hemp edibles. From pecan praline gummies to spicy chili chocolates, explore our videos, get inspired, and upload your own to show how you enjoy Tejas Treats in true Texas style.
        </p>
        <button className="cta-btn" onClick={() => window.location.href = 'mailto:info@tejastreats.com'}>
          Share Your Story
        </button>
        <button className="cta-btn" onClick={() => setShowHistory(true)}>
          History of Delta-9 & Hemp
        </button>
        <p className="landing-disclaimer">
          Disclaimer: Tejas Treats products contain delta-9 THC at or below 0.3% by dry weight, compliant with the 2018 Farm Bill. We do not offer medical advice or diagnose conditions. Consult a healthcare professional before use. Products are for adults 21+ and not intended for resale or distribution in states where prohibited.
        </p>

        {showHistory && (
          <div className="history-modal">
            <div className="history-content">
              <h2 className="history-title">Delta-9 THC & Hemp: A Texas Tale</h2>
              <p className="history-text">
                Hemp has deep roots in Texas, once a key crop for rope and textiles. The 2018 Farm Bill redefined hemp as cannabis with 0.3% or less delta-9 THC, removing it from the Controlled Substances Act and legalizing its cultivation nationwide. This opened the door for hemp-derived delta-9 THC edibles, like those from Tejas Treats, which comply with federal and Texas laws. From CBD oils to gummies, hemp products have surged, with Texas leading the charge in innovative, compliant edibles that honor our state's bold spirit.[](https://www.fda.gov/news-events/congressional-testimony/hemp-production-and-2018-farm-bill-07252019)[](https://guides.sll.texas.gov/cannabis/cbd)
              </p>
              <button className="close-btn" onClick={() => setShowHistory(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </section>

      <main className="main">
        {featuredVideo && (
          <section className="featured-section">
            <h2 className="featured-title">Featured Video</h2>
            <div className="featured-video">
              <ReactPlayer
                url={featuredVideo.fileUrl}
                light={featuredVideo.thumbnailUrl}
                width="100%"
                height="400px"
                controls
                onStart={() => handleViewIncrement(featuredVideo._id)}
              />
              <h3 className="video-title">{featuredVideo.title}</h3>
              <p className="video-description">{featuredVideo.description}</p>
              <p className="video-uploader">Uploaded by: {featuredVideo.uploadedBy}</p>
              <p className="video-views">Views: {featuredVideo.views || 0}</p>
            </div>
          </section>
        )}

        {user && (
          <form onSubmit={handleUpload} className="upload-form">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="video/*"
              required
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            />
            <button type="submit" className="upload-btn">Upload Video</button>
          </form>
        )}

        <section className="video-grid">
          {loading ? (
            <div className="loader"></div>
          ) : videos.length === 0 ? (
            <p className="no-videos">No videos yet—upload some!</p>
          ) : (
            videos.map((video) => (
              <div key={video._id} className="video-card">
                <ReactPlayer
                  url={video.fileUrl}
                  light={video.thumbnailUrl}
                  width="100%"
                  height="200px"
                  controls
                  lazy={true}
                  onStart={() => handleViewIncrement(video._id)}
                />
                <h2 className="video-title">{video.title}</h2>
                <p className="video-description">{video.description}</p>
                <p className="video-uploader">Uploaded by: {video.uploadedBy}</p>
                <p className="video-views">Views: {video.views || 0}</p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;