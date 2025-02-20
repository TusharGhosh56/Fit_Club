import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../firebase/config'; // Ensure Firebase is properly imported
import { onAuthStateChanged } from 'firebase/auth';
import '../css/Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-brand">FitClub-Fitness with Community</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/programs">Programs</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        {!isLoggedIn && (
          <li className="auth-links">
            <Link to="/login" className="login-btn">Login/Signup</Link>
          </li>
        )}
        {isLoggedIn && <li><Link to="/profile">Profile</Link></li>}
      </ul>
    </nav>
  );
}

export default Navbar;
