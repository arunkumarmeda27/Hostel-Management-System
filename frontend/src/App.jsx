import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import Announcements from './pages/Announcements';
import Login from './pages/Login';
import Students from './pages/Students';
import Rooms from './pages/Rooms';
import Fees from './pages/Fees';
import Complaints from './pages/Complaints';
import Mess from './pages/Mess';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated, role } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      
      {/* Protected Routes */}
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
        <Route index element={role === 'admin' ? <Dashboard /> : <StudentDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="fees" element={<Fees />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="mess" element={<Mess />} />
        <Route path="announcements" element={<Announcements />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
