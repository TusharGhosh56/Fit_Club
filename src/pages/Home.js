import '../css/Home.css';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from "framer-motion";
import React, { useEffect, useRef, useState } from 'react';
import introVideo from '../assets/intro.mp4';

function Home() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleVideoLoad = () => {
        setIsVideoLoaded(true);
        video.play().catch(error => {
          console.log("Video autoplay failed:", error);
        });
      };

      video.addEventListener('loadeddata', handleVideoLoad);
      
      // Ensure smooth playback
      video.addEventListener('pause', () => {
        video.play().catch(() => {});
      });

      return () => {
        video.removeEventListener('loadeddata', handleVideoLoad);
      };
    }
  }, []);

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="home" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.7 }}
    >
      <div className="hero">
        <div className="video-overlay"></div>
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={introVideo} type="video/mp4" />
        </video>
        
        {isVideoLoaded && (
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2 }}
          >
            <motion.h1 
              variants={contentVariants}
              transition={{ duration: 0.8 }}
            >
              Transform Your <span className="highlight">Life</span>
            </motion.h1>
            <motion.p
              variants={contentVariants}
              transition={{ duration: 0.8 }}
            >
              Join the ultimate fitness experience where strength meets community. Start your journey today.
            </motion.p>
            <motion.button 
              className="cta-button"
              variants={contentVariants}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
              onClick={() => navigate('/login')}
            >
              Start Free Trial
            </motion.button>
          </motion.div>
        )}
      </div>

      <div className="features">
        <motion.div 
          className="feature1 ff"
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className='bg-grad'></div>
          <div style={{ zIndex: 1000, position: "relative" }}>
            <h3>Expert <span className="highlight">Trainers</span></h3>
            <p>Our certified professionals create personalized programs to help you reach your goals faster.</p>
          </div>
        </motion.div>

        <motion.div 
          className="feature2 ff"
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className='bg-grad'></div>
          <div style={{ zIndex: 1000, position: "relative" }}>
            <h3>Modern <span className="highlight">Equipment</span></h3>
            <p>State-of-the-art facilities with the latest fitness technology and equipment.</p>
          </div>
        </motion.div>

        <motion.div 
          className="feature3 ff"
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className='bg-grad'></div>
          <div style={{ zIndex: 1000, position: "relative" }}>
            <h3>24/7 <span className="highlight">Access</span></h3>
            <p>Train on your schedule with round-the-clock access to our facilities.</p>
          </div>
        </motion.div>
      </div>

      <section className="classes">
        <h2 className="section-title">Featured <span className="highlight">Classes</span></h2>
        <div className="classes-grid">
          <motion.div 
            className="class-card" 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <h3>HIIT Training</h3>
            <p>High-intensity interval training for maximum results</p>
            <span className="time">Mon, Wed, Fri - 6:00 AM</span>
          </motion.div>
          <motion.div 
            className="class-card" 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3>Yoga Flow</h3>
            <p>Find your balance and inner peace</p>
            <span className="time">Tue, Thu - 7:00 AM</span>
          </motion.div>
          <motion.div 
            className="class-card" 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3>Strength & Conditioning</h3>
            <p>Build muscle and improve endurance</p>
            <span className="time">Mon, Wed, Fri - 5:00 PM</span>
          </motion.div>
        </div>
      </section>

      <section className="membership-plans">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Membership <span className="highlight">Plans</span>
        </motion.h2>
        <div className="plans-grid">
          {[
            { name: "Basic", price: "$29.99/mo", features: ["Full Gym Access", "Locker Room Access", "Basic Equipment"] },
            { name: "Premium", price: "$49.99/mo", features: ["Full Gym Access", "Group Classes", "Personal Trainer (2x/month)", "Spa Access"] }
          ].map((plan, index) => (
            <motion.div 
              className={`plan ${plan.name === "Premium" ? "featured" : ""}`}
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3>{plan.name}</h3>
              <p className="price">{plan.price}</p>
              <ul>
                {plan.features.map((feature, i) => <li key={i}>{feature}</li>)}
              </ul>
              <motion.button 
                className="cta-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Choose Plan
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default Home;