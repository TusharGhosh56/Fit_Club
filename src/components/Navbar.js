import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../firebase/config'; 
import { onAuthStateChanged } from 'firebase/auth';
import '../css/Navbar.css';


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <button className='gym-name' onClick={()=>navigate('/')}>FitClub-Fitness with Community</button>
        </div>
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
