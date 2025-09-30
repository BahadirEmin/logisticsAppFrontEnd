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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocalShipping as LocalShippingIcon,
  Assignment as AssignmentIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../api/orders';
import { useAuth } from '../../contexts/AuthContext';
import { shouldFormatField, handleNumberInput } from '../../utils/numberFormatter';

const OperatorMyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editDialog, setEditDialog] = useState({ open: false, offer: null });
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    navigate(`/operator/teklifler/${offerId}`, { 
      state: { from: '/operator/tekliflerim' } 
    });
  };

  const handleTrackTrip = (offerId) => {
    navigate(`/operator/sefer-takip?orderId=${offerId}`);
  };

  const handleEditOffer = (offer) => {
    setEditDialog({ open: true, offer: { ...offer } });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, offer: null });
  };

  const handleSaveOffer = async () => {
    if (!editDialog.offer) return;
    
    try {
      setSaving(true);
      await ordersAPI.update(editDialog.offer.id, editDialog.offer);
      await loadOperatorOffers(); // Reload the list
      setEditDialog({ open: false, offer: null });
    } catch (err) {
      console.error('Teklif güncellenirken hata:', err);
      setError('Teklif güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditDialog(prev => ({
      ...prev,
      offer: {
        ...prev.offer,
        [field]: value
      }
    }));
  };


  const handleDownloadDriverDocument = async (orderId) => {
    try {
      await ordersAPI.downloadDriverInformationDocument(orderId);
      console.log('Driver information document downloaded successfully');
    } catch (error) {
      console.error('Error downloading driver information document:', error);
      setError('Şoför bilgilendirme dokümanı indirilirken bir hata oluştu.');
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
        Operatör Tekliflerim
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {offers.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toplam Teklif
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {offers.filter(o => (o.tripStatus || o.status) === 'pending').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Beklemede
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {offers.filter(o => (o.tripStatus || o.status) === 'approved').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Onaylanan
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              ₺{offers.reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toplam Değer
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label="Arama"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <InputLabel shrink>Durum Filtresi</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Durum Filtresi"
                notched
              >
                <MenuItem value="all">Tümü</MenuItem>
                {operatorStatusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Chip 
                      label={status.label} 
                      color={status.color} 
                      size="small"
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                <TableRow 
                  key={offer.id} 
                  hover 
                  onDoubleClick={() => handleTrackTrip(offer.id)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
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
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Tooltip title="Detay Görüntüle">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOffer(offer.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Şoför Bilgilendirme Dokümanı İndir">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadDriverDocument(offer.id)}
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      {/* Show edit button for assigned offers */}
                      {(offer.operationPersonId === user?.id || offer.fleetPersonId === user?.id) && (
                        <Tooltip title="Düzenle">
                          <IconButton
                            size="small"
                            onClick={() => handleEditOffer(offer)}
                            color="warning"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {/* Show "Sizin Üzerinizde" icon for assigned offers */}
                      {(offer.operationPersonId === user?.id || offer.fleetPersonId === user?.id) && (
                        <Tooltip title="Sizin Üzerinizde">
                          <PersonIcon color="success" fontSize="small" />
                        </Tooltip>
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
          Arama kriterlerinize uygun teklif bulunamadı.
        </Alert>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <EditIcon color="primary" />
            <Typography variant="h6">Teklifi Düzenle</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {editDialog.offer && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {/* Status */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                    <InputLabel shrink>Durum</InputLabel>
                    <Select
                      value={editDialog.offer.tripStatus || editDialog.offer.status || ''}
                      onChange={(e) => handleEditInputChange('tripStatus', e.target.value)}
                      label="Durum"
                      notched
                    >
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

                {/* Departure Address */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Kalkış Adresi"
                    value={editDialog.offer.departureAddress || ''}
                    onChange={(e) => handleEditInputChange('departureAddress', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>

                {/* Arrival Address */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Varış Adresi"
                    value={editDialog.offer.arrivalAddress || ''}
                    onChange={(e) => handleEditInputChange('arrivalAddress', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>

                {/* Cargo Type */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Yük Tipi"
                    value={editDialog.offer.cargoType || ''}
                    onChange={(e) => handleEditInputChange('cargoType', e.target.value)}
                  />
                </Grid>

                {/* Cargo Weight */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ağırlık (kg)"
                    type="number"
                    value={editDialog.offer.cargoWeightKg || ''}
                    onChange={(e) => handleEditInputChange('cargoWeightKg', Number(e.target.value))}
                  />
                </Grid>

                {/* Price */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Fiyat (₺)"
                    type="number"
                    value={editDialog.offer.price || editDialog.offer.quotePrice || ''}
                    onChange={(e) => handleEditInputChange('price', Number(e.target.value))}
                  />
                </Grid>

                {/* Estimated Delivery Date */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tahmini Teslimat Tarihi"
                    type="date"
                    value={editDialog.offer.estimatedDeliveryDate ? editDialog.offer.estimatedDeliveryDate.split('T')[0] : ''}
                    onChange={(e) => handleEditInputChange('estimatedDeliveryDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notlar"
                    value={editDialog.offer.notes || ''}
                    onChange={(e) => handleEditInputChange('notes', e.target.value)}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseEditDialog}
            disabled={saving}
            color="inherit"
          >
            İptal
          </Button>
          <Button
            onClick={handleSaveOffer}
            variant="contained"
            color="primary"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <EditIcon />}
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OperatorMyOffers; 