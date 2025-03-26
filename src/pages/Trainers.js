import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import '../css/Trainers.css';
import defaultTrainerImage from '../assets/profile/default_profile_image.jpg';
import { getProfilePicture } from '../services/profileService';

function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'Trainer')
        );

        const querySnapshot = await getDocs(q);
        const trainersData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const trainerData = {
              id: doc.id,
              ...doc.data()
            };

            // Fetch profile picture if not already in the data
            if (!trainerData.photoURL) {
              const photoResult = await getProfilePicture(doc.id);
              if (photoResult.success) {
                trainerData.photoURL = photoResult.photoURL;
              }
            }

            return trainerData;
          })
        );

        console.log('Fetched trainers:', trainersData); // Debug log
        setTrainers(trainersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trainers:', err);
        setError('Failed to load trainers. Please try again later.');
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  if (loading) {
    return (
      <div className="trainers-container">
        <div className="loading">Loading trainers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trainers-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="trainers-container">
      <div className="trainers-header">
        <h1>Our <span className="expert">Expert</span> Trainers</h1>
        <p>Choose from our certified fitness professionals</p>
      </div>

      <div className="trainers-grid">
        {trainers.length === 0 ? (
          <div className="no-trainers">No trainers found</div>
        ) : (
          trainers.map(trainer => (
            <div key={trainer.id} className="trainer-card">
              <div className="trainer-image-container">
                <img
                  src={trainer.photoURL || defaultTrainerImage}
                  alt={trainer.fullName}
                  className="trainer-image"
                  onError={(e) => {
                    e.target.src = defaultTrainerImage;
                  }}
                />
              </div>
              <div className="trainer-info">
                <h2 className="trainer-name">{trainer.fullName}</h2>
                <p className="trainer-specialization">{trainer.specialization || 'General Fitness'}</p>
              </div>
              <div className="trainer-stats">
                <div className="stat">
                  <div className="trainer-info-container">
                    <div className="stat-label">Clients:</div><div className="stat-value">{trainer.stats?.clientsTrained || '0'}</div>
                  </div>
                </div>
                <div className="stat">
                  <div className="trainer-info-container">
                    <div className="stat-label">Success Rate:</div><div className="stat-value">{trainer.stats?.successRate || '0%'}</div>
                  </div>
                </div>
                <div className="stat">
                  <div className="trainer-info-container">
                    <div className="stat-label">Certifications:</div><div className="stat-value">{trainer.stats?.certifications || '0'}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Trainers;
