import '../css/About.css';
import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

function About() {
  const navigate = useNavigate();

  return (
    <div className="about">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <div className='title-white'>About</div><div className='title-orange'>FitClub</div><div className='title-white'>Fitness</div>
      </motion.h2>
      <div className="about-content">
       
        <motion.section 
          className="mission"
          initial={{ opacity: 0, x: -100 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <h3>Our Mission</h3>
          <p>
            At FitClub Fitness, we are committed to creating a supportive and inclusive fitness community. 
            Our mission is to inspire individuals to lead healthier, more active lifestyles.
          </p>
        </motion.section>

        <motion.section 
          className="facilities"
          initial={{ opacity: 0, x: -100 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <h3>Our Facilities & Services</h3>
          <ul>
            <li>State-of-the-art gym equipment</li>
            <li>Personalized training programs</li>
            <li>Group classes: Yoga, Zumba, HIIT</li>
            <li>Nutrition consultations</li>
            <li>Community fitness events and workshops</li>
          </ul>
        </motion.section>

        <motion.section 
          className="team-section"
          initial={{ opacity: 0, x: -100 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <h3>Meet Our Team</h3>
          <div className="team-grid">
            <motion.div 
              className="team-member"
              initial={{ opacity: 0, x: 100 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <img src={image1} alt="imageNotFound" />
              <h4>Tushar</h4>
              <p>Head Trainer</p>
            </motion.div>
            <motion.div 
              className="team-member"
              initial={{ opacity: 0, x: 100 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img src={image3} alt="imageNotFound" />
              <h4>Snehil</h4>
              <p>Nutrition Specialist</p>
            </motion.div>
            <motion.div 
              className="team-member"
              initial={{ opacity: 0, x: 100 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src={image2} alt="imageNotFound" />
              <h4>Kishan</h4>
              <p>Yoga Instructor</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section 
          className="testimonials"
          initial={{ opacity: 0, x: -100 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <h3>What Our Members Say</h3>
          <div className="testimonial">
            <p>"FitClub Fitness transformed my life! The trainers are fantastic, and the community is so supportive." - Alex T.</p>
          </div>
          <div className="testimonial">
            <p>"I love the variety of classes and the personalized approach. Highly recommend!" - Sara M.</p>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          className="cta"
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <h3>Join the FitClub Community Today</h3>
          <p>Start your fitness journey with us and achieve your goals.</p>
          <button onClick={() => navigate("/login")}>Get Started</button>
        </motion.section>
      </div>
    </div>
  );
}

export default About;
