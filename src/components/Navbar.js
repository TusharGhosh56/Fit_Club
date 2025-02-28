import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase/config'; 
import { onAuthStateChanged } from 'firebase/auth';
import '../css/Navbar.css';
import logo from "../assets/logo/logo1.png"

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe(); 
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <button className='gym-name' onClick={() => navigate('/')}><img src={logo} alt="logo" className='navbar-logo'></img></button>
      </div>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰ {/* Hamburger icon */}
      </button>
      <ul className={`nav-links ${isSidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
        <li><Link to="/" onClick={closeSidebar}>Home</Link></li>
        <li><Link to="/programs" onClick={closeSidebar}>Programs</Link></li>
        <li><Link to="/about" onClick={closeSidebar}>About</Link></li>
        <li><Link to="/blog" onClick={closeSidebar}>Blog</Link></li>
        {!isLoggedIn && (
          <li className="auth-links">
            <Link to="/login" className="login-btn" onClick={closeSidebar}>Login/Signup</Link>
          </li>
        )}
        {isLoggedIn && <li><Link to="/profile" onClick={closeSidebar}>Profile</Link></li>}
      </ul>
    </nav>
  );
}

export default Navbar;
