import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programs from './pages/Programs';
import About from './pages/About';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Chat from './pages/Chat';
import Trainers from './pages/Trainers';
import { auth } from './firebase/config'; 
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); 
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/chat/:userId" element={<Chat />} />
            <Route path="/trainers" element={<Trainers />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;