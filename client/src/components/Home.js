// components/Home.js
import React from 'react';
import Header from './Header';
import Section from './Section';
import { Link } from 'react-router-dom';

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

        <Section title="Support When You Want It" bgColor="#ede4d2">
          <div className="kpi">
          <p>"[...] the most frequently reported barriers were related to personal circumstances (78.2%), such as not knowing where to get help, <b>being too busy</b>, or not being able to pay for services."</p>
          </div>
        </Section>

        <Section title="Self-Empowered Care is the Next Community-Led Care" bgColor="#ede4d2">
          <div className="kpi">
          <p>"[A] systematic review included 32 studies, all of which demonstrated a moderate to <b>high promising effect for community-based</b> and recovery-oriented practices or programs [...]" </p>
          </div> 
        </Section>

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

export default Home;