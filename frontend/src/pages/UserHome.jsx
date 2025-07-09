import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserHome.css';

const UserHome = () => {
  const [categories, setCategories] = useState([]);
  const [latest, setLatest] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchLatest();
    fetchNewArrivals();
  }, []);

  const fetchCategories = async () => {
    const res = await axiosInstance.post('/api/admin/categories');
    setCategories(res.data);
  };

  const fetchLatest = async () => {
    const res = await axiosInstance.post('/api/admin/products?filter=latest');
    setLatest(res.data);
  };

  const fetchNewArrivals = async () => {
    const res = await axiosInstance.post('/api/admin/products?filter=new');
    setNewArrivals(res.data);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/'

  };
  return (

    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-4">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">User Dashboard</span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#userNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="userNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">My Orders</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Help</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-sm btn-light ms-3" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="user-home container py-4">
        {/* Category Carousel */}
        <h3 className="mb-3">Shop by Category</h3>
        <div className="category-carousel d-flex overflow-auto mb-5">
          {categories.map(cat => (
            <div key={cat.id} className="category-card me-3">
              <div className="cat-img" />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Latest Products */}
        <h3 className="mb-3">Latest Picks</h3>
        <div className="row">
          {latest.map((p, idx) => (
            <div key={p.id} className="col-md-3 mb-4 fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="card product-card h-100">
                <img src={`http://localhost:8000/${p.image}`} className="card-img-top" alt={p.name} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text text-muted">₹{p.Grossprice}</p>
                  <button className="btn btn-primary mt-auto">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Arrivals */}
        <h3 className="mt-5 mb-3">New Arrivals</h3>
        <div className="new-arrivals d-flex overflow-auto">
          {newArrivals.map(p => (
            <div key={p.id} className="arrival-card me-3 text-center">
              <div className="arrival-img mb-2" />
              <h6>{p.name}</h6>
              <small>₹{p.Grossprice}</small>
            </div>
          ))}
        </div>
      </div>
    </>

  );
};

export default UserHome;
