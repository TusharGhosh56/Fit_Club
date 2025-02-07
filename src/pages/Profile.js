import React, { useState, useEffect } from "react";
import '../css/Profile.css'; 
import { auth } from '../firebase/config';
import defaultProfileImage from '../assets/images/image1.jpg'; 
import { logout } from '../services/authService';
import { fetchUserProfile, updateUserProfile } from '../services/profileService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
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
          setEditedData(result.data);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const result = await updateUserProfile(auth.currentUser.uid, editedData);
      if (result.success) {
        setUserData(editedData);
        setIsEditing(false);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatsChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [field]: value
      }
    }));
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
            <div className="stat-number">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData?.stats?.clientsTrained || "0"}
                  onChange={(e) => handleStatsChange('clientsTrained', e.target.value)}
                  className="stat-input"
                />
              ) : (
                userData?.stats.clientsTrained
              )}
            </div>
            <div className="stat-label">Clients Trained</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData?.stats?.successRate || "0%"}
                  onChange={(e) => handleStatsChange('successRate', e.target.value)}
                  className="stat-input"
                />
              ) : (
                userData?.stats.successRate
              )}
            </div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData?.stats?.certifications || "0"}
                  onChange={(e) => handleStatsChange('certifications', e.target.value)}
                  className="stat-input"
                />
              ) : (
                userData?.stats.certifications
              )}
            </div>
            <div className="stat-label">Certifications</div>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-info-grid">
            <div className="profile-info">
              <strong>Email:</strong>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData?.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              ) : (
                userData?.email || 'Not provided'
              )}
            </div>
            <div className="profile-info">
              <strong>Phone:</strong>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData?.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              ) : (
                userData?.phone || 'Not provided'
              )}
            </div>
            <div className="profile-info">
              <strong>Experience:</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData?.experience || ''}
                  onChange={(e) => handleChange('experience', e.target.value)}
                />
              ) : (
                userData?.experience || 'Not provided'
              )}
            </div>
          </div>
          <div className="profile-bio">
            {isEditing ? (
              <textarea
                value={editedData?.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
            ) : (
              userData?.bio || 'No bio available'
            )}
          </div>
        </div>
      </div>
      
      <div className="profile-edit">
        {isEditing ? (
          <button className="save-button" onClick={handleSave}>Save Changes</button>
        ) : (
          <button className="edit-button" onClick={handleEdit}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default Profile;

