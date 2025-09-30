import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  Person as DriverIcon,
  DirectionsCar as TrailerIcon,
  Assignment as OfferIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { statisticsAPI, statisticsUtils } from '../../api/statistics';

const FleetDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    vehicleStats: {
      total: 0,
      active: 0,
      maintenance: 0,
      available: 0,
    },
    driverStats: {
      total: 0,
      active: 0,
      onLeave: 0,
    },
    trailerStats: {
      total: 0,
      active: 0,
      maintenance: 0,
    },
    offerStats: {
      total: 0,
      pending: 0,
      approved: 0,
      completed: 0,
    },
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Sadece dashboard stats'ı çek
      const fleetStats = await statisticsAPI.getFleetDashboardStats(user?.id);
      setDashboardData(fleetStats);
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Filo Yönetimi Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Hoş geldiniz, {user?.name || user?.username}! Filo durumunuzu buradan takip edebilirsiniz.
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Trucks Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Toplam Tır
                  </Typography>
                  <Typography variant="h4" component="div">
                    {dashboardData.vehicleStats.total}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {dashboardData.vehicleStats.active} Aktif
                  </Typography>
                </Box>
                <TruckIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Drivers Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Toplam Sürücü
                  </Typography>
                  <Typography variant="h4" component="div">
                    {dashboardData.driverStats.total}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {dashboardData.driverStats.active} Aktif
                  </Typography>
                </Box>
                <DriverIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Trailers Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Toplam Römork
                  </Typography>
                  <Typography variant="h4" component="div">
                    {dashboardData.trailerStats.total}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {dashboardData.trailerStats.active} Aktif
                  </Typography>
                </Box>
                <TrailerIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Offers Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Toplam Teklif
                  </Typography>
                  <Typography variant="h4" component="div">
                    {dashboardData.offerStats.total}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {dashboardData.offerStats.approved} Onaylı
                  </Typography>
                </Box>
                <OfferIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Trucks Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tır Durumu
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="success.main">
                      {dashboardData.vehicleStats.active}
                    </Typography>
                    <Typography variant="body2">Aktif</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="warning.main">
                      {dashboardData.vehicleStats.maintenance}
                    </Typography>
                    <Typography variant="body2">Bakımda</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="info.main">
                      {dashboardData.vehicleStats.available}
                    </Typography>
                    <Typography variant="body2">Müsait</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="error.main">
                      {dashboardData.vehicleStats.total -
                        dashboardData.vehicleStats.active -
                        dashboardData.vehicleStats.maintenance -
                        dashboardData.vehicleStats.available}
                    </Typography>
                    <Typography variant="body2">Pasif</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Drivers Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sürücü Durumu
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="success.main">
                      {dashboardData.driverStats.active}
                    </Typography>
                    <Typography variant="body2">Aktif</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="warning.main">
                      {dashboardData.driverStats.onLeave}
                    </Typography>
                    <Typography variant="body2">İzinde</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="info.main">
                      {dashboardData.driverStats.total -
                        dashboardData.driverStats.active -
                        dashboardData.driverStats.onLeave}
                    </Typography>
                    <Typography variant="body2">Müsait</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="error.main">
                      0
                    </Typography>
                    <Typography variant="body2">Pasif</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FleetDashboard;
