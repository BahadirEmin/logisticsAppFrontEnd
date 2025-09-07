import React, { useState, useEffect, useCallback } from 'react';
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
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  LocalShipping as VehicleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../api/orders';
import { useAuth } from '../../contexts/AuthContext';
import FleetResourceAssignment from '../../components/FleetResourceAssignment';

const OfferList = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [assignmentDialog, setAssignmentDialog] = useState({ open: false, order: null });
  const navigate = useNavigate();
  const { user } = useAuth();

  // Trip status options
  const tripStatusOptions = [
    { value: 'TEKLIF_ASAMASI', label: 'Teklif Aşaması', color: 'default' },
    { value: 'ONAYLANDI', label: 'Onaylandı', color: 'success' },
    { value: 'YOLA_CIKTI', label: 'Yola Çıktı', color: 'info' },
    { value: 'GUMRUKTE', label: 'Gümrükte', color: 'warning' },
    { value: 'TAMAMLANDI', label: 'Tamamlandı', color: 'success' },
    { value: 'IPTAL_EDILDI', label: 'İptal Edildi', color: 'error' }
  ];

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersAPI.getAll();
      console.log('Loaded offers:', data);
      console.log('User ID:', user?.id);
      setOffers(data);
    } catch (err) {
      console.error('Teklifler yüklenirken hata:', err);
      setError('Teklifler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const getStatusColor = (status) => {
    const statusOption = tripStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  const getStatusLabel = (status) => {
    const statusOption = tripStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.departureCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.arrivalCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.cargoType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.id?.toString().includes(searchTerm);

    const matchesStatus = !statusFilter || offer.tripStatus === statusFilter;
    const matchesCustomer = !customerFilter || offer.customerName?.toLowerCase().includes(customerFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const handleViewOffer = (offerId) => {
    navigate(`/sales/teklifler/${offerId}`);
  };

  const handleEditOffer = (offerId) => {
    navigate(`/sales/teklifler/${offerId}/duzenle`);
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
      try {
        await ordersAPI.delete(offerId);
        await loadOffers(); // Reload the list
      } catch (err) {
        console.error('Teklif silinirken hata:', err);
        alert('Teklif silinirken bir hata oluştu.');
      }
    }
  };

  const handleCreateOffer = () => {
    navigate('/sales/teklif-olustur');
  };

  const handleAssignResources = (order) => {
    setAssignmentDialog({ open: true, order });
  };

  const handleCloseAssignment = () => {
    setAssignmentDialog({ open: false, order: null });
  };

  const handleAssignmentSuccess = () => {
    // Reload offers after successful assignment
    loadOffers();
  };

  const handleTakeOrder = async (orderId) => {
    if (window.confirm('Bu siparişi almak istediğinizden emin misiniz?')) {
      try {
        setAssigningOrder(orderId);
        console.log(`Taking order ${orderId} for user ${user.id}`);
        await ordersAPI.assignToFleet(orderId, user.id);
        alert('Sipariş başarıyla alındı!');
        await loadOffers(); // Reload the list
      } catch (err) {
        console.error('Sipariş alınırken hata:', err);
        console.error('Error details:', err.response?.data);
        console.error('Error status:', err.response?.status);
        
        let errorMessage = 'Sipariş alınırken bir hata oluştu.';
        if (err.response?.status === 500) {
          errorMessage = 'Sunucu hatası (500). Lütfen backend loglarını kontrol edin.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        
        alert(errorMessage);
      } finally {
        setAssigningOrder(null);
      }
    }
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
      <Typography variant="h4" component="h1" gutterBottom>
        Fleet - Tüm Teklifler
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Henüz atanmamış siparişleri alabilirsiniz
      </Typography>

      {/* Debug Section - Remove this after testing */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          Debug: Toplam {offers.length} teklif yüklendi. 
          Onaylanmış: {offers.filter(o => o.tripStatus === 'ONAYLANDI').length}, 
          Atanmamış: {offers.filter(o => !o.fleetPersonId).length}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          User ID: {user?.id} | User Role: {user?.role}
        </Typography>
        {offers.length > 0 && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            İlk teklif durumu: {offers[0]?.tripStatus} | Fleet Person ID: {offers[0]?.fleetPersonId}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 1, color: 'warning.main' }}>
          Not: "Siparişi Al" butonu henüz atanmamış tüm tekliflerde görünür.
        </Typography>
        {offers.length > 0 && (
          <Typography variant="body2" sx={{ mt: 1, color: 'info.main' }}>
            Test için: İlk sipariş ID={offers[0]?.id}, User ID={user?.id}
          </Typography>
        )}
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters and Actions */}
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
                <MenuItem value="">Tümü</MenuItem>
                {tripStatusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Chip 
                      label={status.label} 
                      color={status.color} 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Müşteri Ara"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Box display="flex" justifyContent="flex-end">
              <Tooltip title="Yeni Teklif Oluştur">
                <IconButton 
                  color="primary" 
                  onClick={handleCreateOffer}
                  sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Toplam Teklif
              </Typography>
              <Typography variant="h4">
                {offers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Teklif Aşamasında
              </Typography>
              <Typography variant="h4" color="default">
                {offers.filter(o => o.tripStatus === 'TEKLIF_ASAMASI').length}
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
              <Typography variant="h4" color="success.main">
                {offers.filter(o => o.tripStatus === 'ONAYLANDI').length}
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
              <Typography variant="h4" color="success.main">
                {offers.filter(o => o.tripStatus === 'TAMAMLANDI').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Offers Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Teklif No</TableCell>
                <TableCell>Müşteri</TableCell>
                <TableCell>Nereden</TableCell>
                <TableCell>Nereye</TableCell>
                <TableCell>Yük Bilgileri</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOffers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="textSecondary">
                      {searchTerm || statusFilter || customerFilter 
                        ? 'Arama kriterlerinize uygun teklif bulunamadı.' 
                        : 'Henüz teklif bulunmuyor.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOffers.map((offer) => (
                  <TableRow key={offer.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        #{offer.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {offer.customerName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {offer.customerId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {offer.departureCity}, {offer.departureCountry}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {offer.departureAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {offer.arrivalCity}, {offer.arrivalCountry}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {offer.arrivalAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {offer.cargoType}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {offer.cargoWeightKg} kg
                        {offer.cargoWidth && offer.cargoLength && offer.cargoHeight && 
                          ` • ${offer.cargoWidth}x${offer.cargoLength}x${offer.cargoHeight}m`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(offer.tripStatus)}
                        color={getStatusColor(offer.tripStatus)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(offer.createdAt).toLocaleDateString('tr-TR')}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(offer.createdAt).toLocaleTimeString('tr-TR')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Tooltip title="Görüntüle">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewOffer(offer.id)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {(() => {
                          const canTakeOrder = !offer.fleetPersonId; // Tüm atanmamış siparişler için
                          console.log(`Offer ${offer.id}: tripStatus=${offer.tripStatus}, fleetPersonId=${offer.fleetPersonId}, canTakeOrder=${canTakeOrder}`);
                          return canTakeOrder;
                        })() && (
                          <Tooltip title="Siparişi Al">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleTakeOrder(offer.id)}
                              disabled={assigningOrder === offer.id}
                            >
                              {assigningOrder === offer.id ? (
                                <CircularProgress size={16} />
                              ) : (
                                <AssignmentIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                        {(() => {
                          const canAssignResources = offer.fleetPersonId === user?.id; // Only for orders assigned to current user
                          return canAssignResources;
                        })() && (
                          <Tooltip title="Kaynak Ata">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleAssignResources(offer)}
                            >
                              <VehicleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {offer.tripStatus === 'TEKLIF_ASAMASI' && (
                          <>
                            <Tooltip title="Düzenle">
                              <IconButton
                                size="small"
                                color="warning"
                                onClick={() => handleEditOffer(offer.id)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Sil">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteOffer(offer.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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

export default OfferList; 