import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserHome from './pages/UserHome';
import AddCategory from './pages/admin/AddCategory';
import Addproduct from './pages/admin/Addproduct';
import SalesPage from './pages/admin/SalesPage';
import PrintInvoice from './pages/admin/PrintInvoice';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [role, setRole] = useState(sessionStorage.getItem('user_role'));


  const isAdmin = role === 'admin';
  const isUser = role === 'user';

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={role ? <Navigate to={`/${role}`} /> : <Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin/add-category" element={isAdmin ? <AddCategory /> : <Navigate to="/" />} />
        <Route path="/admin/add-product" element={isAdmin ? <Addproduct /> : <Navigate to="/" />} />
        <Route path="/admin/SalesPage/reports" element={isAdmin ? <SalesPage /> : <Navigate to="/" />} />
        <Route path="/admin/print-invoice/:id" element={isAdmin ? <PrintInvoice /> : <Navigate to="/" />} />

        {/* User Routes */}
        <Route path="/user" element={isUser ? <UserHome /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
