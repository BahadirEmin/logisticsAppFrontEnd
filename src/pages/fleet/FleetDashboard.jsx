import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  Person as DriverIcon,
  DirectionsCar as TrailerIcon,
  Assignment as OfferIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { vehicleAPI } from '../../api/vehicles';
import { driversAPI } from '../../api/drivers';
import { trailerAPI } from '../../api/trailers';
import { ordersAPI } from '../../api/orders';

const FleetDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalTrucks: 0,
    activeTrucks: 0,
    maintenanceTrucks: 0,
    availableTrucks: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    onLeaveDrivers: 0,
    totalTrailers: 0,
    activeTrailers: 0,
    maintenanceTrailers: 0,
    totalOffers: 0,
    pendingOffers: 0,
    approvedOffers: 0,
    completedOffers: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Paralel olarak tüm verileri çek
      const [vehicles, drivers, trailers, orders] = await Promise.all([
        vehicleAPI.getAll(),
        driversAPI.getAll(),
        trailerAPI.getAll(),
        ordersAPI.getAll(),
      ]);

      // Araç istatistikleri
      const totalTrucks = vehicles.length;
      const activeTrucks = vehicles.filter(v => v.isActive && v.status !== 'maintenance').length;
      const maintenanceTrucks = vehicles.filter(v => v.status === 'maintenance').length;
      const availableTrucks = vehicles.filter(v => v.isActive && v.status === 'available').length;

      // Şoför istatistikleri
      const totalDrivers = drivers.length;
      const activeDrivers = drivers.filter(d => d.isActive).length;
      const onLeaveDrivers = drivers.filter(d => d.status === 'on_leave').length;

      // Römork istatistikleri
      const totalTrailers = trailers.length;
      const activeTrailers = trailers.filter(t => t.isActive).length;
      const maintenanceTrailers = trailers.filter(t => t.status === 'maintenance').length;

      // Teklif istatistikleri
      const totalOffers = orders.length;
      const pendingOffers = orders.filter(o => o.tripStatus === 'TEKLIF_ASAMASI').length;
      const approvedOffers = orders.filter(o => o.tripStatus === 'ONAYLANDI').length;
      const completedOffers = orders.filter(o => o.tripStatus === 'TAMAMLANDI').length;

      setDashboardData({
        totalTrucks,
        activeTrucks,
        maintenanceTrucks,
        availableTrucks,
        totalDrivers,
        activeDrivers,
        onLeaveDrivers,
        totalTrailers,
        activeTrailers,
        maintenanceTrailers,
        totalOffers,
        pendingOffers,
        approvedOffers,
        completedOffers,
      });
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentActivities = [
    {
      id: 1,
      type: 'truck',
      message: 'Tır #TRK-001 bakımdan döndü',
      time: '2 saat önce',
      status: 'success',
    },
    {
      id: 2,
      type: 'driver',
      message: 'Sürücü Ahmet Yılmaz izin aldı',
      time: '4 saat önce',
      status: 'warning',
    },
    {
      id: 3,
      type: 'offer',
      message: 'Teklif #OF-123 onaylandı',
      time: '6 saat önce',
      status: 'success',
    },
    {
      id: 4,
      type: 'trailer',
      message: 'Römork #TRL-005 bakıma alındı',
      time: '1 gün önce',
      status: 'warning',
    },
    {
      id: 5,
      type: 'truck',
      message: 'Tır #TRK-015 yola çıktı',
      time: '1 gün önce',
      status: 'info',
    },
  ];

  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <TrendingUpIcon color="info" />;
      default:
        return <ScheduleIcon color="action" />;
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
                    {dashboardData.totalTrucks}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {dashboardData.activeTrucks} Aktif
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
                    {dashboardData.totalDrivers}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {dashboardData.activeDrivers} Aktif
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
                    {dashboardData.totalTrailers}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {dashboardData.activeTrailers} Aktif
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
                    {dashboardData.totalOffers}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {dashboardData.approvedOffers} Onaylı
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
                      {dashboardData.activeTrucks}
                    </Typography>
                    <Typography variant="body2">Aktif</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="warning.main">
                      {dashboardData.maintenanceTrucks}
                    </Typography>
                    <Typography variant="body2">Bakımda</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="info.main">
                      {dashboardData.availableTrucks}
                    </Typography>
                    <Typography variant="body2">Müsait</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="error.main">
                      {dashboardData.totalTrucks -
                        dashboardData.activeTrucks -
                        dashboardData.maintenanceTrucks -
                        dashboardData.availableTrucks}
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
                      {dashboardData.activeDrivers}
                    </Typography>
                    <Typography variant="body2">Aktif</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="warning.main">
                      {dashboardData.onLeaveDrivers}
                    </Typography>
                    <Typography variant="body2">İzinde</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="info.main">
                      {dashboardData.totalDrivers -
                        dashboardData.activeDrivers -
                        dashboardData.onLeaveDrivers}
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

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Son Aktiviteler
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>{getStatusIcon(activity.status)}</ListItemIcon>
                      <ListItemText primary={activity.message} secondary={activity.time} />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FleetDashboard;
