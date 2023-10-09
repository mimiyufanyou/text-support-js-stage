import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Nav from './components/Nav';
import Home from './components/Home'; 
import About from './components/About';
import Research from './components/Research';
import FAQ from './components/FAQ';
import Login from './components/Login';
import StartQuiz from './components/StartQuiz';
import Payment from './components/Payment';
import Privacy from './components/Privacy';
import Terms from './components/Terms';

import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
      <Nav /> 

      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<Research />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/start-quiz" element={<StartQuiz />} />
        <Route path="/payments" element={<Payment />} />  
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} /> 
      </Routes>
      </div> 

    <div className="footer">
      <Footer />
    </div>
    </Router>
  );
}

export default App;
