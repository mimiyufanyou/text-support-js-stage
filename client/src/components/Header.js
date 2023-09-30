import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title }) => (
  <div className="header" 
  style={{ 
    backgroundImage: `linear-gradient(rgba(237, 219, 176, 0.90), rgba(85, 113, 82, 0.7)), url('/background_2.png')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }}
  >
    <h1>{title}</h1>
    <button className="get-started-button"> 
        Get Started
    </button> 
    <p className="subtext"> No Appointments | No Scheduling | Immediate Support </p>
  </div>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;