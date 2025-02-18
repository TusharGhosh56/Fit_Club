import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  if (!auth.currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Access Denied</h2>
          <p className="auth-message">Please sign in to view your profile</p>
          <button 
            onClick={() => navigate('/login')} 
            className="auth-button"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 