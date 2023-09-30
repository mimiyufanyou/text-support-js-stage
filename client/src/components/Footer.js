import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ contactEmail }) => (
  <div className="footer">
    <h2>Contact Us</h2>
    <p>Email: {contactEmail}</p>
  </div>
);

Footer.propTypes = {
  contactEmail: PropTypes.string.isRequired,
};

export default Footer;