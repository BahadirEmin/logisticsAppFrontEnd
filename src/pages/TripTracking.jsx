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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import { 
  Search, 
  LocalShipping, 
  LocationOn, 
  Schedule, 
  CheckCircle,
  Warning,
  DirectionsCar
} from '@mui/icons-material';

const TripTracking = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, this would be an API call
      const mockTrips = [
        {
          id: 1,
          tripNumber: 'TRP-2024-001',
          driverName: 'Ahmet Yılmaz',
          vehiclePlate: '34 ABC 123',
          fromLocation: 'İstanbul, Türkiye',
          toLocation: 'Ankara, Türkiye',
          status: 'in_progress',
          progress: 65,
          startDate: '2024-01-15',
          estimatedArrival: '2024-01-16',
          currentLocation: 'Eskişehir, Türkiye',
          cargoType: 'Genel Kargo',
          weight: '1500 kg',
          customer: 'ABC Şirketi'
        },
        {
          id: 2,
          tripNumber: 'TRP-2024-002',
          driverName: 'Mehmet Demir',
          vehiclePlate: '06 XYZ 789',
          fromLocation: 'İzmir, Türkiye',
          toLocation: 'Bursa, Türkiye',
          status: 'completed',
          progress: 100,
          startDate: '2024-01-14',
          estimatedArrival: '2024-01-15',
          currentLocation: 'Bursa, Türkiye',
          cargoType: 'Soğuk Zincir',
          weight: '800 kg',
          customer: 'XYZ Lojistik'
        },
        {
          id: 3,
          tripNumber: 'TRP-2024-003',
          driverName: 'Ali Kaya',
          vehiclePlate: '07 DEF 456',
          fromLocation: 'Antalya, Türkiye',
          toLocation: 'İstanbul, Türkiye',
          status: 'delayed',
          progress: 30,
          startDate: '2024-01-13',
          estimatedArrival: '2024-01-16',
          currentLocation: 'Afyon, Türkiye',
          cargoType: 'Tehlikeli Madde',
          weight: '2000 kg',
          customer: 'DEF Ticaret'
        }
      ];
      setTrips(mockTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      in_progress: { label: 'Yolda', color: 'primary', icon: <LocalShipping /> },
      completed: { label: 'Tamamlandı', color: 'success', icon: <CheckCircle /> },
      delayed: { label: 'Gecikmeli', color: 'warning', icon: <Warning /> },
      pending: { label: 'Beklemede', color: 'default', icon: <Schedule /> }
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

  const getProgressColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'delayed': return 'warning';
      case 'in_progress': return 'primary';
      default: return 'default';
    }
  };

  const filteredTrips = trips.filter(trip => 
    trip.tripNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.customer.toLowerCase().includes(searchTerm.toLowerCase())
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
                {trips.length}
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
                {trips.filter(t => t.status === 'in_progress').length}
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
                {trips.filter(t => t.status === 'completed').length}
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
                {trips.filter(t => t.status === 'delayed').length}
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
          onChange={(e) => setSearchTerm(e.target.value)}
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
        {filteredTrips.map((trip) => (
          <Grid item xs={12} md={6} lg={4} key={trip.id}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {trip.tripNumber}
                  </Typography>
                  {getStatusChip(trip.status)}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <DirectionsCar sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    {trip.vehiclePlate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    {trip.driverName}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Nereden:</strong> {trip.fromLocation}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Nereye:</strong> {trip.toLocation}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Mevcut Konum:</strong> {trip.currentLocation}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Müşteri:</strong> {trip.customer}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Yük:</strong> {trip.cargoType} - {trip.weight}
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Başlangıç: {new Date(trip.startDate).toLocaleDateString('tr-TR')}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Tahmini: {new Date(trip.estimatedArrival).toLocaleDateString('tr-TR')}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<LocationOn />}
                  >
                    Takip Et
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTrips.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Arama kriterlerinize uygun sefer bulunamadı.
        </Alert>
      )}
    </Container>
  );
};

export default TripTracking; 