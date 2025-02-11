import React, { useState, useEffect } from "react";
import "../css/Profile.css"; 
import { auth } from "../firebase/config";
import defaultProfileImage from "../assets/images/image1.jpg"; 
import { logout } from "../services/authService";
import { fetchUserProfile, updateUserProfile } from "../services/profileService";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;
    let mounted = true;

    const initializeAuth = async () => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!mounted) return;

        if (!user) {
          navigate("/login");
          setLoading(false);
          return;
        }

        try {
          const result = await fetchUserProfile(user.uid);
          if (mounted) {
            if (result.success) {
              setUserData(result.data);
              setEditedData(result.data);
              setError("");
            } else {
              setError(result.error);
            }
          }
        } catch (err) {
          if (mounted) {
            setError("Failed to load profile data");
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      });
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const result = await updateUserProfile(auth.currentUser.uid, editedData);
      if (result.success) {
        setUserData(editedData);
        setIsEditing(false);
        setError("");
      } else {
        setError(result.error);
      }
    } catch {
      setError("Failed to update profile");
    }
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatsChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [field]: value,
      },
    }));
  };

  if (loading) {
    return <div className="profile-container"><div className="loading">Loading profile...</div></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header-actions">
        <h2>Trainer Profile</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-content">
        <div className="profile-top">
          <div className="profile-photo-container">
            <img src={userData?.photoURL || defaultProfileImage} alt="Profile" className="profile-photo" />
          </div>
          <div className="profile-header">
            <h3>{userData?.fullName || "Name Not Set"}</h3>
            <p className="profile-role">{userData?.role || "Member"}</p>
          </div>
        </div>

        <div className="stats-container">
          {["clientsTrained", "successRate", "certifications"].map((field) => (
            <div key={field} className="stat-box">
              <div className="stat-number">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData?.stats?.[field] || "0"}
                    onChange={(e) => handleStatsChange(field, e.target.value)}
                    className="stat-input"
                  />
                ) : (
                  userData?.stats?.[field] || "0"
                )}
              </div>
              <div className="stat-label">{field.replace(/([A-Z])/g, " $1").trim()}</div>
            </div>
          ))}
        </div>

        <div className="profile-details">
          <div className="profile-info-grid">
            {["email", "phone", "experience"].map((field) => (
              <div key={field} className="profile-info">
                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                {isEditing ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={editedData?.[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                ) : (
                  userData?.[field] || "Not provided"
                )}
              </div>
            ))}
          </div>
          <div className="profile-bio">
            {isEditing ? (
              <textarea
                value={editedData?.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
              />
            ) : (
              userData?.bio || "No bio available"
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
