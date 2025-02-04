import React, { useState, useEffect } from "react";
import '../css/Profile.css'; 
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import defaultProfileImage from '../assets/images/image1.jpg'; 
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData({
            ...userDoc.data(),
            stats: {
              clientsTrained: userDoc.data().clientsTrained || "0",
              successRate: userDoc.data().successRate || "0%",
              certifications: userDoc.data().certifications || "0"
            }
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) {
      fetchUserData();
    }
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    } else {
      console.error("Logout failed:", result.error);
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

