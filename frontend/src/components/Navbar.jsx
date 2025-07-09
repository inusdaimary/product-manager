import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; 

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || { name: "Admin" });
  const [showName, setShowName] = useState(false);


  const handleLogout = () => {
    sessionStorage.clear();      
    setUser(null);        
    // navigate('/');       
    window.location.href  = '/'   
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Product Manager</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            {/* Forms */}
            <li className="nav-item dropdown hover-dropdown">
              <span className="nav-link dropdown-toggle" role="button">Forms</span>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/admin/add-product">Add Product</Link></li>
                <li><Link className="dropdown-item" to="/admin/add-category">Add Category</Link></li>
              </ul>
            </li>

            {/* Reports */}
            <li className="nav-item dropdown hover-dropdown">
              <span className="nav-link dropdown-toggle" role="button">Reports</span>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/admin/SalesPage/reports/">Sales Report</Link></li>
              </ul>
            </li>

            {/* Others */}
            <li className="nav-item dropdown hover-dropdown">
              <span className="nav-link dropdown-toggle" role="button">Others</span>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                <li><Link className="dropdown-item" to="/help">Help</Link></li>
                <li>
                  <span className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>LogOut</span>
                </li>
              </ul>
            </li>
          </ul>

          {/* Avatar */}
          {user && (
            <div
              className="d-flex align-items-center position-relative"
              onMouseEnter={() => setShowName(true)}
              onMouseLeave={() => setShowName(false)}
            >
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg"
                alt="avatar"
                className="rounded-circle"
                width="40"
                height="40"
                style={{ cursor: 'pointer' }}
              />
              {showName && (
                <div
                  className="position-absolute bg-white text-dark shadow-sm rounded px-3 py-1"
                  style={{
                    top: '110%',
                    right: 0,
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                  }}
                >
                  {user.name}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
