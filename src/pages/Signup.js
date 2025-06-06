import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../services/signupService';
import { getValidationErrors } from '../utils/validation';
import '../css/Auth.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isTrainer: false,
    specialization: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
    setError('');
  };

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      isTrainer: !prev.isTrainer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const validationErrors = getValidationErrors(formData);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setIsLoading(false);
      return;
    }

    try {
      const result = await signupUser(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.isTrainer,
        formData.isTrainer ? formData.specialization : null
      );
      if (result.success) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join <span className="highlight">FitClub</span> Today</h2>
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              required 
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              required 
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={handleChange}
              required 
              placeholder="Create a password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
              placeholder="Confirm your password"
            />
          </div>
          <div className="form-group">
            <label>
              Are you a trainer?
              <input
                type="checkbox"
                checked={formData.isTrainer}
                onChange={handleCheckboxChange}
              />
            </label>
          </div>
          {formData.isTrainer && (
            <div className="form-group">
              <label htmlFor="specialization">Specialization</label>
              <select
                id="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required={formData.isTrainer}
              >
                <option value="">Select Specialization</option>
                <option value="yoga">Yoga</option>
                <option value="weightTraining">Weight Training</option>
                <option value="cardio">Cardio</option>
                <option value="crossfit">CrossFit</option>
                <option value="pilates">Pilates</option>
                <option value="nutrition">Nutrition</option>
              </select>
            </div>
          )}
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup; 