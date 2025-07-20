import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import OperatorDashboard from '../pages/OperatorDashboard';
import SalesDashboard from '../pages/SalesDashboard';
import OfferForm from '../pages/OfferForm';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes - Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/trucks" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <div>Trucks Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/drivers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <div>Drivers Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/personnels" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <div>Personnels Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/trailers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <div>Trailers Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Protected routes - Operator */}
        <Route path="/operator" element={
          <ProtectedRoute allowedRoles={['operator']}>
            <MainLayout>
              <OperatorDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/operator/hesabim" element={
          <ProtectedRoute allowedRoles={['operator']}>
            <MainLayout>
              <div>Hesabım Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/operator/onaylanan-teklifler" element={
          <ProtectedRoute allowedRoles={['operator']}>
            <MainLayout>
              <div>Onaylanan Teklifler Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/operator/sefer-takip" element={
          <ProtectedRoute allowedRoles={['operator']}>
            <MainLayout>
              <div>Sefer Takip Ekranı - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Protected routes - Sales */}
        <Route path="/sales" element={
          <ProtectedRoute allowedRoles={['sales']}>
            <MainLayout>
              <SalesDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/sales/teklif-ver" element={
          <ProtectedRoute allowedRoles={['sales']}>
            <MainLayout>
              <OfferForm />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/sales/tekliflerim" element={
          <ProtectedRoute allowedRoles={['sales']}>
            <MainLayout>
              <div>Tekliflerim Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes; 