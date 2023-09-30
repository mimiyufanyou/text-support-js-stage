import React from 'react';
import PropTypes from 'prop-types';

const Section = ({ title, bgColor, className, children }) => (
  <div className={`section ${className}`} style={{ backgroundColor: bgColor }}>
    <p className="section-title">{title}</p>
    <div className="section-content">
    {children}  {/* This will render any nested components or content */}
    </div>
  </div>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  className: PropTypes.string,
};

export default Section;