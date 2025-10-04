import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/shared/LoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import OperatorDashboard from '../pages/operator/OperatorDashboard';
import OperatorProfile from '../pages/operator/OperatorProfile';
import ApprovedOffers from '../pages/operator/ApprovedOffers';
import TripTracking from '../pages/shared/TripTracking';
import OperatorMyOffers from '../pages/operator/OperatorMyOffers';
import FleetMyOffers from '../pages/fleet/FleetMyOffers';
import SalesDashboard from '../pages/sales/SalesDashboard';
import OfferForm from '../pages/sales/OfferForm';
import CustomerList from '../pages/sales/CustomerList';
import SalesOfferList from '../pages/sales/OfferList';
import FleetDashboard from '../pages/fleet/FleetDashboard';
import AdminVehicleList from '../pages/admin/VehicleList';
import FleetVehicleList from '../pages/fleet/FleetVehicleList';
import AdminTrailerList from '../pages/admin/TrailerList';
import FleetTrailerList from '../pages/fleet/FleetTrailerList';
import AdminDriverList from '../pages/admin/DriverList';
import FleetDriverList from '../pages/fleet/FleetDriverList';
import ProtectedRoute from '../components/ProtectedRoute';
import SuppliersList from '../pages/sales/SuppliersList';
import OrderDetail from '../pages/shared/OrderDetail';
import OrderEdit from '../pages/shared/OrderEdit';
import FleetOfferList from '../pages/fleet/FleetOfferList';
import OperatorOrderDetail from '../pages/operator/OperatorOrderDetail';
import OperatorOrderEdit from '../pages/operator/OperatorOrderEdit';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes - Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/trucks"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <AdminVehicleList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drivers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <AdminDriverList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/personnels"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <div>Personnels Page - Coming Soon</div>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/trailers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <AdminTrailerList />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected routes - Operator */}
        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={['operator', 'operation']}>
              <MainLayout>
                <OperatorDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/hesabim"
          element={
            <ProtectedRoute allowedRoles={['operator', 'operation']}>
              <MainLayout>
                <OperatorProfile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/onaylanan-teklifler"
          element={
            <ProtectedRoute allowedRoles={['operator', 'operation']}>
              <MainLayout>
                <ApprovedOffers />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/sefer-takip"
          element={
            <ProtectedRoute allowedRoles={['operator', 'operation']}>
              <MainLayout>
                <TripTracking />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/tekliflerim"
          element={
            <ProtectedRoute allowedRoles={['operator', 'operation']}>
              <MainLayout>
                <OperatorMyOffers />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/teklifler/:orderId"
          element={
            <ProtectedRoute allowedRoles={['operator', 'operation']}>
              <MainLayout>
                <OperatorOrderDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/teklifler/:orderId/duzenle"
          element={
            <ProtectedRoute allowedRoles={['operator', 'operation']}>
              <MainLayout>
                <OperatorOrderEdit />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected routes - Sales */}
        <Route
          path="/sales"
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <MainLayout>
                <SalesDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/teklif-ver"
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <MainLayout>
                <OfferForm />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/musteriler"
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <MainLayout>
                <CustomerList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/tedarikciler"
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <MainLayout>
                <SuppliersList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/teklifler"
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <MainLayout>
                <SalesOfferList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/teklifler/:orderId"
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <MainLayout>
                <OrderDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/teklifler/:orderId/duzenle"
          element={
            <ProtectedRoute allowedRoles={['sales']}>
              <MainLayout>
                <OrderEdit />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected routes - Fleet */}
        <Route
          path="/fleet"
          element={
            <ProtectedRoute allowedRoles={['fleet']}>
              <MainLayout>
                <FleetDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fleet/tirlar"
          element={
            <ProtectedRoute allowedRoles={['fleet']}>
              <MainLayout>
                <FleetVehicleList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fleet/suruculer"
          element={
            <ProtectedRoute allowedRoles={['fleet']}>
              <MainLayout>
                <FleetDriverList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fleet/romorklar"
          element={
            <ProtectedRoute allowedRoles={['fleet']}>
              <MainLayout>
                <FleetTrailerList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fleet/teklifler"
          element={
            <ProtectedRoute allowedRoles={['fleet']}>
              <MainLayout>
                <FleetOfferList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fleet/tekliflerim"
          element={
            <ProtectedRoute allowedRoles={['fleet']}>
              <MainLayout>
                <FleetMyOffers />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fleet/detay/:orderId"
          element={
            <ProtectedRoute allowedRoles={['fleet']}>
              <MainLayout>
                <OrderDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
