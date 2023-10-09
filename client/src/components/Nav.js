import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="nav-header">
    <div className="nav-bar">
      <div className="hamburger-icon" onClick={() => toggleMenu()}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-left">
          <li><Link to="/">{'>'}THRIVE</Link></li>
          <li><Link to="/research">RESEARCH</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/login">LOGIN</Link></li>
          <li><Link to="/start-quiz">START</Link></li>
        </ul>
      </nav>
    </div>
    </div> 
  );
};

export default Nav;