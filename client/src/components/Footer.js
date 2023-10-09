import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';  


const Footer = ({}) => (
  <div className="footer">
          <ul className="nav-left">
          <li><Link to="/">{'>'}THRIVE</Link></li>
          <li><Link to="/research">RESEARCH</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/privacy">PRIVACY POLICY</Link></li>
          <li><Link to="/terms">TERMS OF USE</Link></li>
          <li><Link to="/login">LOGIN</Link></li>
          <li><Link to="/start-quiz">START</Link></li>
        </ul>
  </div>
);

export default Footer;