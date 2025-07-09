
import React from 'react';
import Navbar from './Navbar';

const AdminLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">{children}</div>
    </>
  );
};

export default AdminLayout;
