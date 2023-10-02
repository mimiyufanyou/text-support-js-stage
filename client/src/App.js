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

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
      <Nav /> 

      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/research" element={<Research />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/start-quiz" element={<StartQuiz />} />
        <Route path="/payments" element={<Payment />} />  
      </Routes>
        <Footer contactEmail="info@myawesomeproduct.com" />
    </div>
    </Router>
  );
}

export default App;
