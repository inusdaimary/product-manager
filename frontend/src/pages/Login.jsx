import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axiosInstance from '../service/axios';
import './Login.css';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin@123');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.get('/sanctum/csrf-cookie');

      const res = await axiosInstance.post('/api/login', {
        email,
        password,
      });

      if (res.data.status === 1) {
        const { id, name, role } = res.data.user;

        // Store session
        sessionStorage.setItem('user_id', id);
        sessionStorage.setItem('user_name', name);
        sessionStorage.setItem('user_role', role);

        toast.success(res.data.message, { position: 'top-right' });


        console.log(role)
        if (role === 'admin') {
         
          window.location.href  = '/admin'
        } else {
          window.location.href  = '/user'
        }
      } else {
        toast.error(res.data.message, { position: 'top-right' });
      }

    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage, { position: 'top-right' });
    }
  };

  return (
    <div className="login-bg d-flex justify-content-center align-items-center vh-100">
      <div className="login-card animate__animated animate__fadeInDown">
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" placeholder="Email" className="form-control"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" placeholder="Password" className="form-control"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
