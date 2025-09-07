import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  Person as DriverIcon,
  DirectionsCar as TrailerIcon,
  Assignment as OfferIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const FleetDashboard = () => {
  const { user } = useAuth();

  // Mock data - gerçek uygulamada API'den gelecek
  const dashboardData = {
    totalTrucks: 25,
    activeTrucks: 18,
    maintenanceTrucks: 3,
    availableTrucks: 4,
    totalDrivers: 30,
    activeDrivers: 28,
    onLeaveDrivers: 2,
    totalTrailers: 35,
    activeTrailers: 32,
    maintenanceTrailers: 3,
    totalOffers: 45,
    pendingOffers: 12,
    approvedOffers: 28,
    completedOffers: 5
  };

  const recentActivities = [
    { id: 1, type: 'truck', message: 'Tır #TRK-001 bakımdan döndü', time: '2 saat önce', status: 'success' },
    { id: 2, type: 'driver', message: 'Sürücü Ahmet Yılmaz izin aldı', time: '4 saat önce', status: 'warning' },
    { id: 3, type: 'offer', message: 'Teklif #OF-123 onaylandı', time: '6 saat önce', status: 'success' },
    { id: 4, type: 'trailer', message: 'Römork #TRL-005 bakıma alındı', time: '1 gün önce', status: 'warning' },
    { id: 5, type: 'truck', message: 'Tır #TRK-015 yola çıktı', time: '1 gün önce', status: 'info' }
  ];

  const getStatusIcon = (status) => {
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
                      {dashboardData.totalTrucks - dashboardData.activeTrucks - dashboardData.maintenanceTrucks - dashboardData.availableTrucks}
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
                      {dashboardData.totalDrivers - dashboardData.activeDrivers - dashboardData.onLeaveDrivers}
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
                      <ListItemIcon>
                        {getStatusIcon(activity.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.message}
                        secondary={activity.time}
                      />
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