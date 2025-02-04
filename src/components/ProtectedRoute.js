import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';

function ProtectedRoute({ children }) {
  if (!auth.currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Access Denied</h2>
          <p className="auth-message">Please sign in to view your profile</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="auth-button"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute; 