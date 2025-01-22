import '../css/Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Transform Your <span className="highlight">Life</span></h1>
        <p>Join the ultimate fitness experience where strength meets community. Start your journey today.</p>
        <button className="cta-button">Start Free Trial</button>
      </div>

      <div className="features">
        <div className="feature">
          <h3>Expert <span className="highlight">Trainers</span></h3>
          <p>Our certified professionals create personalized programs to help you reach your goals faster.</p>
        </div>
        <div className="feature">
          <h3>Modern <span className="highlight">Equipment</span></h3>
          <p>State-of-the-art facilities with the latest fitness technology and equipment.</p>
        </div>
        <div className="feature">
          <h3>24/7 <span className="highlight">Access</span></h3>
          <p>Train on your schedule with round-the-clock access to our facilities.</p>
        </div>
      </div>

      <section className="membership-plans">
        <h2 className="section-title">Membership <span className="highlight">Plans</span></h2>
        <div className="plans-grid">
          <div className="plan">
            <h3>Basic</h3>
            <p className="price">$29.99/mo</p>
            <ul>
              <li>Full Gym Access</li>
              <li>Locker Room Access</li>
              <li>Basic Equipment</li>
            </ul>
            <button className="cta-button">Choose Plan</button>
          </div>
          <div className="plan featured">
            <h3>Premium</h3>
            <p className="price">$49.99/mo</p>
            <ul>
              <li>Full Gym Access</li>
              <li>Group Classes</li>
              <li>Personal Trainer (2x/month)</li>
              <li>Spa Access</li>
            </ul>
            <button className="cta-button">Choose Plan</button>
          </div>
        </div>
      </section>

      <section className="classes">
        <h2 className="section-title">Featured <span className="highlight">Classes</span></h2>
        <div className="classes-grid">
          <div className="class-card">
            <h3>HIIT Training</h3>
            <p>High-intensity interval training for maximum results</p>
            <span className="time">Mon, Wed, Fri - 6:00 AM</span>
          </div>
          <div className="class-card">
            <h3>Yoga Flow</h3>
            <p>Find your balance and inner peace</p>
            <span className="time">Tue, Thu - 7:00 AM</span>
          </div>
          <div className="class-card">
            <h3>Strength & Conditioning</h3>
            <p>Build muscle and improve endurance</p>
            <span className="time">Mon, Wed, Fri - 5:00 PM</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;