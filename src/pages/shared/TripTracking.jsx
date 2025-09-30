import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  LocalShipping,
  LocationOn,
  Schedule,
  CheckCircle,
  Warning,
  DirectionsCar,
} from '@mui/icons-material';
import { statisticsAPI } from '../../api/statistics';

const TripTracking = () => {
  const [tripData, setTripData] = useState({
    summary: {
      total: 0,
      inProgress: 0,
      completed: 0,
      delayed: 0,
    },
    trips: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  // Auto-refresh her 30 saniyede bir
  useEffect(() => {
    const interval = setInterval(() => {
      loadTrips();
    }, 30000); // 30 saniye

    return () => clearInterval(interval);
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await statisticsAPI.getTripTrackingStats({ 
        limit: 50,
        search: searchTerm 
      });
      setTripData(data);
    } catch (error) {
      console.error('Error loading trips:', error);
      // Fallback to empty data on error
      setTripData({
        summary: { total: 0, inProgress: 0, completed: 0, delayed: 0 },
        trips: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Search değiştiğinde debounced yükleme
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadTrips();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getStatusChip = status => {
    const statusConfig = {
      in_progress: { label: 'Yolda', color: 'primary', icon: <LocalShipping /> },
      completed: { label: 'Tamamlandı', color: 'success', icon: <CheckCircle /> },
      delayed: { label: 'Gecikmeli', color: 'warning', icon: <Warning /> },
      pending: { label: 'Beklemede', color: 'default', icon: <Schedule /> },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const getProgressColor = status => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'delayed':
        return 'warning';
      case 'in_progress':
        return 'primary';
      default:
        return 'default';
    }
  };

  // Client-side filtering for real-time search
  const filteredTrips = tripData.trips.filter(
    trip =>
      trip.tripNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.vehicle?.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2', mb: 4 }}>
        Sefer Takip Ekranı
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Sefer
              </Typography>
              <Typography variant="h4" component="div">
                {tripData.summary.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Yolda Olan
              </Typography>
              <Typography variant="h4" component="div" color="primary.main">
                {tripData.summary.inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tamamlanan
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {tripData.summary.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Gecikmeli
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {tripData.summary.delayed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Sefer no, sürücü adı, plaka ara..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Paper>

      {/* Trips Grid */}
      <Grid container spacing={3}>
        {filteredTrips.map(trip => (
          <Grid item xs={12} md={6} lg={4} key={trip.id}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" component="h2" gutterBottom>
                    {trip.tripNumber}
                  </Typography>
                  {getStatusChip(trip.status)}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <DirectionsCar sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    {trip.vehicle?.plate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    {trip.driver?.name}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Nereden:</strong> {trip.route?.from}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Nereye:</strong> {trip.route?.to}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Mevcut Konum:</strong> {trip.route?.currentLocation}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Müşteri:</strong> {trip.customer?.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Yük:</strong> {trip.cargo?.type} - {trip.cargo?.weight}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>İlerleme:</strong>
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={trip.progress}
                    color={getProgressColor(trip.status)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    %{trip.progress} tamamlandı
                  </Typography>
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Başlangıç: {new Date(trip.dates?.startDate).toLocaleDateString('tr-TR')}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Tahmini: {new Date(trip.dates?.estimatedArrival).toLocaleDateString('tr-TR')}
                    </Typography>
                  </Box>
                  <Button size="small" variant="outlined" startIcon={<LocationOn />}>
                    Takip Et
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTrips.length === 0 && !loading && (
        <Alert severity="info" sx={{ mt: 3 }}>
          {searchTerm ? 'Arama kriterlerinize uygun sefer bulunamadı.' : 'Henüz sefer bulunmuyor.'}
        </Alert>
      )}
    </Container>
  );
};

export default TripTracking;
