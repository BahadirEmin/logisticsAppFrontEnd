import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import OperatorDashboard from '../pages/OperatorDashboard';
import OperatorProfile from '../pages/OperatorProfile';
import ApprovedOffers from '../pages/ApprovedOffers';
import TripTracking from '../pages/TripTracking';
import OperatorMyOffers from '../pages/OperatorMyOffers';
import FleetMyOffers from '../pages/FleetMyOffers';
import SalesDashboard from '../pages/SalesDashboard';
import OfferForm from '../pages/OfferForm';
import CustomerList from '../pages/CustomerList';
import OfferList from '../pages/OfferList';
import FleetDashboard from '../pages/FleetDashboard';
import VehicleList from '../pages/VehicleList';
import TrailerList from '../pages/TrailerList';
import ProtectedRoute from '../components/ProtectedRoute';
import SalesMyOffers from '../pages/SalesMyOffers';

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
              <VehicleList />
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
              <TrailerList />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Protected routes - Operator */}
        <Route path="/operator" element={
          <ProtectedRoute allowedRoles={['operator', 'operation']}>
            <MainLayout>
              <OperatorDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/operator/hesabim" element={
          <ProtectedRoute allowedRoles={['operator', 'operation']}>
            <MainLayout>
              <OperatorProfile />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/operator/onaylanan-teklifler" element={
          <ProtectedRoute allowedRoles={['operator', 'operation']}>
            <MainLayout>
              <ApprovedOffers />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/operator/sefer-takip" element={
          <ProtectedRoute allowedRoles={['operator', 'operation']}>
            <MainLayout>
              <TripTracking />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/operator/tekliflerim" element={
          <ProtectedRoute allowedRoles={['operator', 'operation']}>
            <MainLayout>
              <OperatorMyOffers />
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
        <Route path="/sales/musteriler" element={
          <ProtectedRoute allowedRoles={['sales']}>
            <MainLayout>
              <CustomerList />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/sales/teklifler" element={
          <ProtectedRoute allowedRoles={['sales']}>
            <MainLayout>
              <OfferList />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/sales/tekliflerim" element={
          <ProtectedRoute allowedRoles={['sales']}>
            <MainLayout>
              <SalesMyOffers />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Protected routes - Fleet */}
        <Route path="/fleet" element={
          <ProtectedRoute allowedRoles={['fleet']}>
            <MainLayout>
              <FleetDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/fleet/tirlar" element={
          <ProtectedRoute allowedRoles={['fleet']}>
            <MainLayout>
              <VehicleList />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/fleet/suruculer" element={
          <ProtectedRoute allowedRoles={['fleet']}>
            <MainLayout>
              <div>Sürücüler Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/fleet/romorklar" element={
          <ProtectedRoute allowedRoles={['fleet']}>
            <MainLayout>
              <TrailerList />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/fleet/teklifler" element={
          <ProtectedRoute allowedRoles={['fleet']}>
            <MainLayout>
              <OfferList />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/fleet/tekliflerim" element={
          <ProtectedRoute allowedRoles={['fleet']}>
            <MainLayout>
              <FleetMyOffers />
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