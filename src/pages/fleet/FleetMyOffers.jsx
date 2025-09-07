import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  CheckCircle,
  Schedule,
  LocalShipping,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { ordersAPI } from '../../api/orders';
import { useAuth } from '../../contexts/AuthContext';
import FleetResourceAssignment from '../../components/FleetResourceAssignment';

const FleetMyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignmentDialog, setAssignmentDialog] = useState({ open: false, order: null });
  const { user } = useAuth();

  // Fleet-specific status options
  const fleetStatusOptions = [
    { value: 'pending', label: 'Beklemede', color: 'default', icon: <Schedule /> },
    { value: 'approved', label: 'Onaylandı', color: 'success', icon: <CheckCircle /> },
    { value: 'in_transit', label: 'Yolda', color: 'primary', icon: <LocalShipping /> },
    { value: 'delivered', label: 'Teslim Edildi', color: 'info', icon: <CheckCircle /> }
  ];

  const loadFleetOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get orders assigned to fleet user
      console.log('Fetching orders for fleet person ID:', user.id);
      const data = await ordersAPI.getByFleetPersonId(user.id);
      console.log('Fleet My Offers API Response:', data);
      setOffers(data);
    } catch (err) {
      console.error('Fleet teklifleri yüklenirken hata:', err);
      setError('Teklifler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadFleetOffers();
  }, [loadFleetOffers]);

  const getStatusIcon = (status) => {
    const statusOption = fleetStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.icon : <Schedule />;
  };

  const getStatusLabel = (status) => {
    const statusOption = fleetStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getStatusColor = (status) => {
    const statusOption = fleetStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'default';
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

  const handleAssignResources = (order) => {
    setAssignmentDialog({ open: true, order });
  };

  const handleCloseAssignment = () => {
    setAssignmentDialog({ open: false, order: null });
  };

  const handleAssignmentSuccess = () => {
    // Reload offers after successful assignment
    loadFleetOffers();
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
        Fleet olarak size atanan teklifler
      </Typography>

      {/* Debug Section - Remove this after testing */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          Debug: Toplam {offers.length} atanmış teklif. 
          User ID: {user?.id} | User Role: {user?.role}
        </Typography>
        {offers.length > 0 && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            İlk teklif: ID={offers[0]?.id}, Durum={offers[0]?.tripStatus || offers[0]?.status}
          </Typography>
        )}
      </Alert>

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
                Yolda
              </Typography>
              <Typography variant="h4" component="div" color="primary.main">
                {offers.filter(o => (o.tripStatus || o.status) === 'in_transit').length}
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
              <Typography variant="h4" component="div" color="success.main">
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
                {fleetStatusOptions.map((status) => (
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
      <Paper elevation={2}>
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
                      <Tooltip title="Kaynak Ata">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleAssignResources(offer)}
                        >
                          <AssignmentIcon />
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

      {/* Fleet Resource Assignment Dialog */}
      <FleetResourceAssignment
        open={assignmentDialog.open}
        onClose={handleCloseAssignment}
        orderId={assignmentDialog.order?.id}
        orderInfo={assignmentDialog.order}
        onSuccess={handleAssignmentSuccess}
      />
    </Container>
  );
};

export default FleetMyOffers; 