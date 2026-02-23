import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Bankability from './pages/Bankability';
import PropertyFilter from './pages/PropertyFilter';
import GrowthSimulator from './pages/GrowthSimulator';
import Execution from './pages/Execution';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app grain">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/bankability" element={<Bankability />} />
            <Route path="/filter" element={<PropertyFilter />} />
            <Route path="/simulator" element={<GrowthSimulator />} />
            <Route path="/execute" element={<Execution />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
  }
