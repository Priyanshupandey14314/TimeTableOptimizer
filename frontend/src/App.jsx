import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import Subjects from './pages/Subjects';
import Rooms from './pages/Rooms';
import Classes from './pages/Classes';
import TimeSlots from './pages/TimeSlots';
import GenerateTimetable from './pages/GenerateTimetable';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/timeslots" element={<TimeSlots />} />
            <Route path="/generate" element={<GenerateTimetable />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;
