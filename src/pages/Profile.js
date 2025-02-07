import React, { useState, useEffect } from "react";
import '../css/Profile.css'; 
import { auth } from '../firebase/config';
import defaultProfileImage from '../assets/images/image1.jpg'; 
import { logout } from '../services/authService';
import { fetchUserProfile } from '../services/profileService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        if (!auth.currentUser) {
          navigate('/login');
          return;
        }

        const result = await fetchUserProfile(auth.currentUser.uid);
        
        if (result.success) {
          setUserData(result.data);
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    } else {
      setError('Logout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header-actions">
        <h2>Trainer Profile</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="profile-content">
        <div className="profile-top">
          <div className="profile-photo-container">
            <img 
              src={userData?.photoURL || defaultProfileImage} 
              alt="Profile" 
              className="profile-photo" 
            />
          </div>
          <div className="profile-header">
            <h3>{userData?.fullName || 'Name Not Set'}</h3>
            <p className="profile-role">{userData?.role || 'Member'}</p>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-number">{userData?.stats.clientsTrained}</div>
            <div className="stat-label">Clients Trained</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{userData?.stats.successRate}</div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{userData?.stats.certifications}</div>
            <div className="stat-label">Certifications</div>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-info-grid">
            <div className="profile-info">
              <strong>Email:</strong> {userData?.email || 'Not provided'}
            </div>
            <div className="profile-info">
              <strong>Phone:</strong> {userData?.phone || 'Not provided'}
            </div>
            <div className="profile-info">
              <strong>Experience:</strong> {userData?.experience || 'Not provided'}
            </div>
          </div>
          <div className="profile-bio">
            {userData?.bio || 'No bio available'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

