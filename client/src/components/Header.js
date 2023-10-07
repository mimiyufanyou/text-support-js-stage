import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = ({ title }) => {
  const lines = title.split(' '); // Split by space
  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1 className="header-title">
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index !== lines.length - 1 && <br />}
          </React.Fragment>
        ))}
          </h1>
        </div>
        <Link to="/payments">
          <button className="get-started-button">
            Get Started
          </button>
        </Link>
        <p className="subtext">No Appointments | No Scheduling | Immediate Support</p>
      </div>
    </>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;