import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NewCase from './components/NewCase';
import AddSuspect from './components/AddSuspect';
import Results from './components/Results';
import CaseHistory from './components/CaseHistory';
import Settings from './components/Settings';
import FingerprintAnalyzer from './components/FingerprintAnalyzer';
import IrisRecognizer from './components/IrisRecognizer';
import ObjectDetect from './components/ObjectDetect';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-case" element={<NewCase />} />
            <Route path="/add-suspect" element={<AddSuspect />} />
            <Route path="/fingerPrint" element={<FingerprintAnalyzer/>}/>
            <Route path='/object' element={<ObjectDetect />} />
            <Route path="/iris" element={<IrisRecognizer />} />
            <Route path="/results" element={<Results />} />
            <Route path="/case-history" element={<CaseHistory />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App