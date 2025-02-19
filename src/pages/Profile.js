import React, { useState, useEffect } from "react";
import "../css/Profile.css"; 
import { auth } from "../firebase/config";
import defaultProfileImage from "../assets/profile/default_profile_image.jpg"; 
import { logout } from "../services/authService";
import { fetchUserProfile, updateUserProfile, uploadProfilePicture } from "../services/profileService";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          localStorage.setItem('userName', user.displayName || 'Name Not Set');

          const storedUserName = localStorage.getItem('userName');
          if (storedUserName) {
            setUserData({
              fullName: storedUserName,
              email: user.email,
              role: 'Member',
              photoURL: user.photoURL || null,
              stats: {
                clientsTrained: "0",
                successRate: "0%",
                certifications: "0"
              },
              bio: '',
              phone: '',
              experience: ''
            });
            setEditedData({
              fullName: storedUserName,
              email: user.email,
              role: 'Member',
              photoURL: user.photoURL || null,
              stats: {
                clientsTrained: "0",
                successRate: "0%",
                certifications: "0"
              },
              bio: '',
              phone: '',
              experience: ''
            });
          } else {
            const result = await fetchUserProfile(user.uid);
            if (result.success) {
              setUserData(result.data);
              setEditedData(result.data);
              setError("");
            } else {
              setError(result.error);
            }
          }
        } else {
          setError("Access Denied");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
   
    setUserData(null);
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const result = await updateUserProfile(auth.currentUser.uid, editedData);
      if (result.success) {
        setUserData(editedData);
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await uploadProfilePicture(file);
      if (result.success) {
        setUserData((prev) => ({
          ...prev,
          photoURL: result.photoURL
        }));
        setEditedData((prev) => ({
          ...prev,
          photoURL: result.photoURL
        }));
        setSuccessMessage('Profile picture updated successfully!');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to upload image');
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userData && !loading) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header-actions">
        <h2>Trainer Profile</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="profile-content">
        <div className="profile-top">
          <div className="profile-photo-container">
            <img 
              src={userData?.photoURL || defaultProfileImage} 
              alt="Profile" 
              className="profile-photo"
              onError={(e) => {
                console.error('Image failed to load');
                e.target.src = defaultProfileImage;
              }} 
            />
            {isEditing && (
              <div className="photo-upload-overlay">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="photo-upload-input"
                  disabled={uploadLoading}
                />
                <label htmlFor="photo-upload" className="photo-upload-label">
                  {uploadLoading ? 'Uploading...' : 'Change Photo'}
                </label>
              </div>
            )}
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
