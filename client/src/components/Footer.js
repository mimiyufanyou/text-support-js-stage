import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({}) => (
  <div className="footer">
          <ul className="nav-left">
          <li><Link to="/">>THRIVE</Link></li>
          <li><Link to="/research">RESEARCH</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/login">LOGIN</Link></li>
          <li><Link to="/start-quiz">START</Link></li>
        </ul>
  </div>
);

export default Footer;