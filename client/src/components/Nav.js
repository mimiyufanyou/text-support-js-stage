import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    console.log('toggle menu');
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="nav-bar">
      <div className="hamburger-icon" onClick={() => toggleMenu()}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-left">
          <li><Link to="/research">Research</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
        <ul className="nav-center">
          <li><Link to="/" style={{fontSize: '2rem'}}>THRIVE</Link></li>
        </ul>
        <ul className="nav-right">
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/start-quiz">Start Quiz</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;