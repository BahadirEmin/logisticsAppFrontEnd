import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocalShipping as LocalShippingIcon,
  Assignment as AssignmentIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../api/orders';
import { useAuth } from '../../contexts/AuthContext';

const OperatorMyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  // Operator-specific status options
  const operatorStatusOptions = [
    { value: 'BEKLEMEDE', label: 'Beklemede', color: 'default', icon: <ScheduleIcon /> },
    { value: 'ISLEME_ALINDI', label: 'İşleme Alındı', color: 'info', icon: <AssignmentIcon /> },
    { value: 'ONAYLANDI', label: 'Onaylandı', color: 'success', icon: <CheckCircleIcon /> },
    { value: 'YOLA_CIKTI', label: 'Yola Çıktı', color: 'primary', icon: <LocalShippingIcon /> },
    { value: 'GUMRUKTE', label: 'Gümrükte', color: 'warning', icon: <ScheduleIcon /> },
    { value: 'TAMAMLANDI', label: 'Tamamlandı', color: 'success', icon: <CheckCircleIcon /> },
    { value: 'IPTAL_EDILDI', label: 'İptal Edildi', color: 'error', icon: <ScheduleIcon /> }
  ];

  // Priority options
  const priorityOptions = [
    { value: 'YUKSEK', label: 'Yüksek', color: 'error' },
    { value: 'ORTA', label: 'Orta', color: 'warning' },
    { value: 'DUSUK', label: 'Düşük', color: 'success' }
  ];

  useEffect(() => {
    loadOperatorOffers();
  }, []);

  const loadOperatorOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      // Get orders based on user role
      if (user?.role === 'operator' || user?.role === 'operation') {
        // For operators, get orders assigned to them
        data = await ordersAPI.getByOperationPersonId(user.id);
      } else if (user?.role === 'fleet') {
        // For fleet users, get orders assigned to them
        data = await ordersAPI.getByFleetPersonId(user.id);
      } else {
        // For other roles, get all orders (fallback)
        data = await ordersAPI.getAll();
      }
      
      console.log('My Offers API Response:', data);
      setOffers(data);
    } catch (err) {
      console.error('Operatör teklifleri yüklenirken hata:', err);
      setError('Teklifler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusOption = operatorStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  const getStatusLabel = (status) => {
    const statusOption = operatorStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getStatusIcon = (status) => {
    const statusOption = operatorStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.icon : <ScheduleIcon />;
  };

  const getPriorityColor = (priority) => {
    const priorityOption = priorityOptions.find(option => option.value === priority);
    return priorityOption ? priorityOption.color : 'default';
  };

  const getPriorityLabel = (priority) => {
    const priorityOption = priorityOptions.find(option => option.value === priority);
    return priorityOption ? priorityOption.label : priority;
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      (offer.customerName || offer.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.departureCity || offer.departureAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.arrivalCity || offer.arrivalAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.cargoType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.id?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || (offer.tripStatus || offer.status) === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewOffer = (offerId) => {
    // Navigate to offer detail view
    console.log('Viewing offer:', offerId);
  };

  const handleProcessOffer = (offerId) => {
    // Process the offer (change status to ISLEME_ALINDI)
    console.log('Processing offer:', offerId);
  };

  const handleApproveOffer = (offerId) => {
    // Approve the offer (change status to ONAYLANDI)
    console.log('Approving offer:', offerId);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2' }}>
        Tekliflerim
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Operatör olarak işlediğiniz ve takip ettiğiniz teklifler
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Teklif
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
                Bekleyen
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {offers.filter(o => (o.tripStatus || o.status) === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Onaylanan
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {offers.filter(o => (o.tripStatus || o.status) === 'approved').length}
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
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Durum Filtresi</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Durum Filtresi"
              >
                <MenuItem value="all">Tümü</MenuItem>
                {operatorStatusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {status.icon}
                      <Chip 
                        label={status.label} 
                        color={status.color} 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box display="flex" justifyContent="flex-end">
              <Tooltip title="Filtreleri Temizle">
                <IconButton 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Offers Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Teklif No</strong></TableCell>
                <TableCell><strong>Müşteri</strong></TableCell>
                <TableCell><strong>Rota</strong></TableCell>
                <TableCell><strong>Yük Bilgisi</strong></TableCell>
                <TableCell><strong>Durum</strong></TableCell>
                <TableCell><strong>Atanma Tarihi</strong></TableCell>
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
                      {offer.departureCity || offer.departureAddress || 'N/A'} → {offer.arrivalCity || offer.arrivalAddress || 'N/A'}
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
                      <Tooltip title="Detay Görüntüle">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOffer(offer.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
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
          Arama kriterlerinize uygun teklif bulunamadı.
        </Alert>
      )}
    </Container>
  );
};

export default OperatorMyOffers; 