import React from 'react';
import Section from '../components/Section';

const Payment = () => {
  return (
    <>
      <div className="main-content">
        <Section title="Personalize Care At Your Fingertips" bgColor="#eddbb0" className="value-prop-section-1">
          <div className="kpi">
            <h1>A Consistent Practice</h1>
            <p>Enhances Reduction in Anxiety</p>
          </div>
          <div className="kpi">
            <h1>Mentalization Techniques</h1>
            <p>Improve Attachment Patterns</p>
            <p>Reduce Depression</p>
          </div>
          <div className="kpi">
            <h1>Daily Interactions</h1>
            <p>Improve Memory and Problem Solving</p>
          </div>
        </Section>
    </div>
    </>
  );
};

export default Payment;