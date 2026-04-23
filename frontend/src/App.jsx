import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import Subjects from './pages/Subjects';
import Rooms from './pages/Rooms';
import Classes from './pages/Classes';
import TimeSlots from './pages/TimeSlots';
import GenerateTimetable from './pages/GenerateTimetable';
import StudentTimetable from './pages/StudentTimetable';
import TeacherTimetable from './pages/TeacherTimetable';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/teachers" element={
              <ProtectedRoute>
                <Teachers />
              </ProtectedRoute>
            } />
            <Route path="/subjects" element={
              <ProtectedRoute>
                <Subjects />
              </ProtectedRoute>
            } />
            <Route path="/rooms" element={
              <ProtectedRoute>
                <Rooms />
              </ProtectedRoute>
            } />
            <Route path="/classes" element={
              <ProtectedRoute>
                <Classes />
              </ProtectedRoute>
            } />
            <Route path="/timeslots" element={
              <ProtectedRoute>
                <TimeSlots />
              </ProtectedRoute>
            } />
            <Route path="/generate" element={
              <ProtectedRoute>
                <GenerateTimetable />
              </ProtectedRoute>
            } />
            <Route path="/student-timetable" element={
              <ProtectedRoute>
                <StudentTimetable />
              </ProtectedRoute>
            } />
            <Route path="/teacher-timetable" element={
              <ProtectedRoute>
                <TeacherTimetable />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
