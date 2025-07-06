import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';

const AppRoutes = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trucks" element={<div>Trucks Page - Coming Soon</div>} />
          <Route path="/drivers" element={<div>Drivers Page - Coming Soon</div>} />
          <Route path="/personnels" element={<div>Personnels Page - Coming Soon</div>} />
          <Route path="/trailers" element={<div>Trailers Page - Coming Soon</div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes; 