import React from 'react';
import { Link } from 'react-router-dom';     

const Nav = () => {
  return (
    <div className="nav-bar">
      <nav className="nav-menu">
        <ul className="nav-left">
          <li><Link to="/about">About</Link></li>
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
}

export default Nav;