import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search, 
  LocalShipping, 
  LocationOn, 
  Schedule, 
  CheckCircle,
  Warning,
  DirectionsCar,
  Assignment,
  Visibility
} from '@mui/icons-material';
import { ordersAPI } from '../api/orders';
import { useAuth } from '../contexts/AuthContext';

const ApprovedOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Status options for filtering
  const statusOptions = [
    { value: 'all', label: 'Tümü' },
    { value: 'pending', label: 'Beklemede' },
    { value: 'approved', label: 'Onaylandı' },
    { value: 'in_transit', label: 'Yolda' },
    { value: 'delivered', label: 'Teslim Edildi' }
  ];

  useEffect(() => {
    loadApprovedOffers();
  }, []);

  const loadApprovedOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Make real API call to get all orders
      const data = await ordersAPI.getAll();
      console.log('API Response:', data);
      setOffers(data);
    } catch (err) {
      console.error('Operatör teklifleri yüklenirken hata:', err);
      setError('Teklifler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const statusConfig = {
      approved: <CheckCircle />,
      in_transit: <LocalShipping />,
      delivered: <CheckCircle />,
      pending: <Schedule />
    };
    return statusConfig[status] || <Schedule />;
  };

  const getStatusLabel = (status) => {
    const statusConfig = {
      approved: 'Onaylandı',
      in_transit: 'Yolda',
      delivered: 'Teslim Edildi',
      pending: 'Beklemede'
    };
    return statusConfig[status] || 'Beklemede';
  };

  const getStatusColor = (status) => {
    const statusConfig = {
      approved: 'success',
      in_transit: 'warning',
      delivered: 'info',
      pending: 'default'
    };
    return statusConfig[status] || 'default';
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      (offer.customerName || offer.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.departureCity || offer.departureAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.arrivalCity || offer.arrivalAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.cargoType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.id?.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || (offer.tripStatus || offer.status) === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const handleViewOffer = (offerId) => {
    // Navigate to offer detail view
    console.log('Viewing offer:', offerId);
  };

  const handleAssignToMe = async (offerId) => {
    try {
      if (user?.role === 'operator' || user?.role === 'operation') {
        await ordersAPI.assignToOperation(offerId, user.id);
        alert('Teklif başarıyla size atandı!');
      } else if (user?.role === 'fleet') {
        await ordersAPI.assignToFleet(offerId, user.id);
        alert('Teklif başarıyla size atandı!');
      }
      // Reload the offers list
      await loadApprovedOffers();
    } catch (error) {
      console.error('Teklif atama hatası:', error);
      alert('Teklif atanırken bir hata oluştu.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2', mb: 4 }}>
        Onaylanan Teklifler
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Onaylanan
              </Typography>
              <Typography variant="h4" component="div">
                {offers.length}
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
              <Typography variant="h4" component="div" color="warning.main">
                {offers.filter(o => (o.tripStatus || o.status) === 'in_transit').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Teslim Edilen
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {offers.filter(o => (o.tripStatus || o.status) === 'delivered').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Değer
              </Typography>
              <Typography variant="h4" component="div" color="primary.main">
                ₺{offers.reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Müşteri adı, adres ara..."
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
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {statusOptions.map((status) => (
                <Chip
                  key={status.value}
                  label={status.label}
                  onClick={() => setFilterStatus(status.value)}
                  color={filterStatus === status.value ? 'primary' : 'default'}
                  variant={filterStatus === status.value ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Offers Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Müşteri</strong></TableCell>
                <TableCell><strong>Nereden</strong></TableCell>
                <TableCell><strong>Nereye</strong></TableCell>
                <TableCell><strong>Yük Tipi</strong></TableCell>
                <TableCell><strong>Durum</strong></TableCell>
                <TableCell><strong>Onay Tarihi</strong></TableCell>
                <TableCell><strong>Tahmini Teslimat</strong></TableCell>
                <TableCell><strong>Fiyat</strong></TableCell>
                <TableCell><strong>İşlemler</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOffers.map((offer) => (
                <TableRow key={offer.id} hover>
                  <TableCell>#{offer.id}</TableCell>
                  <TableCell>{offer.customerName || offer.customer?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {offer.departureCity || offer.departureAddress || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {offer.arrivalCity || offer.arrivalAddress || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {offer.cargoType || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {offer.cargoWeightKg ? `${offer.cargoWeightKg} kg` : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(offer.tripStatus || offer.status)}
                      label={getStatusLabel(offer.tripStatus || offer.status)}
                      color={getStatusColor(offer.tripStatus || offer.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString('tr-TR') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {offer.estimatedDeliveryDate ? new Date(offer.estimatedDeliveryDate).toLocaleDateString('tr-TR') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <strong>{offer.price ? `₺${offer.price}` : 'N/A'}</strong>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        variant="outlined"
                        onClick={() => handleViewOffer(offer.id)}
                      >
                        Detay
                      </Button>
                      
                      {/* Show assign button only for operators and fleet users */}
                      {(user?.role === 'operator' || user?.role === 'operation' || user?.role === 'fleet') && (
                        <Button
                          size="small"
                          startIcon={<Assignment />}
                          variant="contained"
                          color="primary"
                          onClick={() => handleAssignToMe(offer.id)}
                        >
                          Üzerine Al
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {filteredOffers.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Arama kriterlerinize uygun onaylanan teklif bulunamadı.
        </Alert>
      )}
    </Container>
  );
};

export default ApprovedOffers; 