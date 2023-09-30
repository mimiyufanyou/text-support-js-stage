import React from 'react';

const Nav = () => {
  return (
    <div className="nav-bar">
      <nav className="nav-menu">
        <ul className="nav-left">
          <li><a href="#About">About</a></li>
          <li><a href="#Research">Research</a></li>
          <li><a href="#FAQ">FAQ</a></li>
        </ul>
        <ul className="nav-center">
          <li><a style={{fontSize: '2rem'}}>THRIVE</a></li>
        </ul>
        <ul className="nav-right">
          <li><a href="#Login">Login</a></li>
          <li><a href="#Start Quiz">Start Quiz</a></li>
        </ul>  
      </nav>
    </div>
  );
}

export default Nav;