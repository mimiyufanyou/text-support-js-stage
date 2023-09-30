import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Section from './components/Section';
import Nav from './components/Nav';
import './App.css';
import FAQ from './components/FAQ';

function App() {
  return (
    <div className="App">
      <Nav /> 
      <Header title="Make Time to Thrive" />

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

        <Section title="Value Proposition 2" bgColor="#85925e" />
      </div>
      <div> 
        <FAQ />
      </div>

      <Footer contactEmail="info@myawesomeproduct.com" />
    </div>
  );
}

export default App;
