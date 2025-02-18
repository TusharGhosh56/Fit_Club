import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserProfile } from '../services/profileService';
import defaultProfileImage from '../assets/profile/default_profile_image.jpg';
import '../css/Profile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserProfile = async () => {
      const result = await fetchUserProfile(userId);
      if (result.success) {
        setUserData(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    loadUserProfile();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header-actions">
        <h2>{userData.fullName}'s Profile</h2>
      </div>
      <div className="profile-content">
        <div className="profile-top">
          <div className="profile-photo-container">
            <img 
              src={userData.photoURL || defaultProfileImage} 
              alt="Profile" 
              className="profile-photo"
            />
          </div>
          <div className="profile-header">
            <h3>{userData.fullName || "Name Not Set"}</h3>
            <p className="profile-role">{userData.role || "Member"}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-info-grid">
            <div className="profile-info">
              <strong>Email:</strong> {userData.email}
            </div>
            <div className="profile-info">
              <strong>Phone:</strong> {userData.phone || "Not provided"}
            </div>
            <div className="profile-info">
              <strong>Experience:</strong> {userData.experience || "Not provided"}
            </div>
          </div>
          <div className="profile-bio">
            <strong>Bio:</strong> {userData.bio || "No bio available"}
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-number">{userData.stats.clientsTrained}</div>
            <div className="stat-label">Clients Trained</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{userData.stats.successRate}</div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{userData.stats.certifications}</div>
            <div className="stat-label">Certifications</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 