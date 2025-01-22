import '../css/About.css';

function About() {
  return (
    <div className="about">
      <h2>About FitLife Gym</h2>
      <div className="about-content">
        <div className="about-text">
          <p>Founded in 2020, FitLife Gym is dedicated to helping people achieve their fitness goals.</p>
          <p>Our team of expert trainers and modern facilities provide the perfect environment for your fitness journey.</p>
        </div>
        <div className="team-section">
          <h3>Our Team</h3>
          <div className="team-grid">
            <div className="team-member">
              <h4>John Doe</h4>
              <p>Head Trainer</p>
            </div>
            <div className="team-member">
              <h4>Jane Smith</h4>
              <p>Nutrition Specialist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;