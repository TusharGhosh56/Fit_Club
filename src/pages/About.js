import '../css/About.css';
import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';

function About() {
  return (
    <div className="about">
      <h2>About FitClub Fitness</h2>
      <div className="about-content">
       
        <section className="mission">
          <h3>Our Mission</h3>
          <p>
            At FitClub Fitness, we are committed to creating a supportive and inclusive fitness community. 
            Our mission is to inspire individuals to lead healthier, more active lifestyles.
          </p>
        </section>

       
        <section className="facilities">
          <h3>Our Facilities & Services</h3>
          <ul>
            <li>State-of-the-art gym equipment</li>
            <li>Personalized training programs</li>
            <li>Group classes: Yoga, Zumba, HIIT</li>
            <li>Nutrition consultations</li>
            <li>Community fitness events and workshops</li>
          </ul>
        </section>


        <section className="team-section">
          <h3>Meet Our Team</h3>
          <div className="team-grid">
            <div className="team-member">
              <img src={image1} alt="John Doe" />
              <h4>John Doe</h4>
              <p>Head Trainer</p>
            </div>
            <div className="team-member">
              <img src={image3} alt="Jane Smith" />
              <h4>Jane Smith</h4>
              <p>Nutrition Specialist</p>
            </div>
            <div className="team-member">
              <img src={image2} alt="Emily Johnson" />
              <h4>Emily Johnson</h4>
              <p>Yoga Instructor</p>
            </div>
          </div>
        </section>

       
        <section className="testimonials">
          <h3>What Our Members Say</h3>
          <div className="testimonial">
            <p>"FitClub Fitness transformed my life! The trainers are fantastic, and the community is so supportive." - Alex T.</p>
          </div>
          <div className="testimonial">
            <p>"I love the variety of classes and the personalized approach. Highly recommend!" - Sara M.</p>
          </div>
        </section>

  
        <section className="cta">
          <h3>Join the FitClub Community Today</h3>
          <p>Start your fitness journey with us and achieve your goals.</p>
          <button>Get Started</button>
        </section>
      </div>
    </div>
  );
}

export default About;
