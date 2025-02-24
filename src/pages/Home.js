import '../css/Home.css';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  return (
    <motion.div className="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className="hero" initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
        <h1>Transform Your <span className="highlight">Life</span></h1>
        <p>Join the ultimate fitness experience where strength meets community. Start your journey today.</p>
        <video autoPlay loop muted playsInline src="https://video.wixstatic.com/video/d47472_58cce06729c54ccb935886c4b3647274/1080p/mp4/file.mp4"></video>
        <motion.button 
          className="cta-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/login')}
        >
          Start Free Trial
        </motion.button>
      </motion.div>

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