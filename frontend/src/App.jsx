import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Students from './pages/Students';
import Rooms from './pages/Rooms';
import Fees from './pages/Fees';
import Complaints from './pages/Complaints';
import Mess from './pages/Mess';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="fees" element={<Fees />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="mess" element={<Mess />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
