// components/Home.js

import React from 'react';
import Header from './Header';
import Section from './Section';
import FAQ from './FAQ';

// const title = "MAKE <br/> TIME </br> TO </br> THRIVE" 
const Home = () => {
  return (
    <>
      <Header title="MAKE TIME TO THRIVE" />
      <div className="main-content">
        <Section title="Personalized Care At Your Fingertips" bgColor="#ede4d2" className="value-prop-section-1">
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
        
        <Section title="Support when you want it." bgColor="#ede4d2" />
      </div>
      <div> 
        <FAQ />
      </div>
    </>
  );
};

export default Home;