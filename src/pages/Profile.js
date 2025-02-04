import React from "react";
import '../css/Profile.css'; 
import image1 from '../assets/images/image1.jpg'; 

const Profile = () => {
 
  const user = {
    name: "John Doe",
    role: "Certified Fitness Trainer",
    email: "john.doe@example.com",
    phone: "+1 (123) 456-7890",
    experience: "5 years in strength training and nutrition coaching",
    bio: "Passionate fitness coach dedicated to helping clients achieve their health and fitness goals through personalized training and nutritional guidance. Specialized in strength training, HIIT workouts, and nutrition planning. Committed to creating sustainable fitness journeys for clients of all levels.",
    photo: image1, 
    stats: {
      clientsTrained: "200+",
      successRate: "95%",
      certifications: "4"
    }
  };

  return (
    <div className="profile-container">
      <h2>Trainer Profile</h2>
      <div className="profile-content">
        <div className="profile-top">
          <div className="profile-photo-container">
            <img src={user.photo} alt="Profile" className="profile-photo" />
          </div>
          <div className="profile-header">
            <h3>{user.name}</h3>
            <p className="profile-role">{user.role}</p>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-number">{user.stats.clientsTrained}</div>
            <div className="stat-label">Clients Trained</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{user.stats.successRate}</div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{user.stats.certifications}</div>
            <div className="stat-label">Certifications</div>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-info-grid">
            <div className="profile-info">
              <strong>Email:</strong> {user.email}
            </div>
            <div className="profile-info">
              <strong>Phone:</strong> {user.phone}
            </div>
            <div className="profile-info">
              <strong>Experience:</strong> {user.experience}
            </div>
          </div>
          <div className="profile-bio">{user.bio}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
