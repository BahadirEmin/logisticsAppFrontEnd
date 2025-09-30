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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../api/orders';

const SalesMyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [approvalDialog, setApprovalDialog] = useState({ open: false, offer: null });
  const [approving, setApproving] = useState(false);
  const navigate = useNavigate();

  const tripStatusOptions = [
    { value: 'TEKLIF_ASAMASI', label: 'Teklif Aşaması', color: 'warning' },
    { value: 'ONAYLANAN_TEKLIF', label: 'Onaylanan Teklif', color: 'success' },
    { value: 'YOLA_CIKTI', label: 'Yola Çıktı', color: 'info' },
    { value: 'TESLIM_EDILDI', label: 'Teslim Edildi', color: 'success' },
    { value: 'REDDEDILDI', label: 'Reddedildi', color: 'error' },
    { value: 'IPTAL_EDILDI', label: 'İptal Edildi', color: 'error' },
  ];

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersAPI.getAll();
      setOffers(data);
    } catch (err) {
      console.error('Tekliflerim yüklenirken hata:', err);
      setError('Tekliflerim yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = status => {
    const statusOption = tripStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  const getStatusLabel = status => {
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

    return matchesSearch && matchesStatus;
  });

  const handleViewOffer = offerId => {
    navigate(`/sales/teklifler/${offerId}`);
  };

  const handleEditOffer = offerId => {
    navigate(`/sales/teklifler/${offerId}/duzenle`);
  };

  const handleDeleteOffer = async offerId => {
    if (window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
      try {
        await ordersAPI.delete(offerId);
        await loadOffers();
      } catch (err) {
        console.error('Teklif silinirken hata:', err);
        alert('Teklif silinirken bir hata oluştu.');
      }
    }
  };

  const handleApproveOffer = offer => {
    setApprovalDialog({ open: true, offer });
  };

  const handleConfirmApproval = async () => {
    if (!approvalDialog.offer) return;

    try {
      setApproving(true);

      // Update order with all required fields, changing tripStatus to 'ONAYLANAN_TEKLIF'
      const updateData = {
        tripStatus: 'ONAYLANAN_TEKLIF',
        orderNumber: approvalDialog.offer.orderNumber || `ORD-${approvalDialog.offer.id}`,
        customerId: approvalDialog.offer.customerId,
        salesPersonId: approvalDialog.offer.salesPersonId,
        fleetPersonId: approvalDialog.offer.fleetPersonId,
        operationPersonId: approvalDialog.offer.operationPersonId,
        vehicleId: approvalDialog.offer.vehicleId,
        trailerId: approvalDialog.offer.trailerId,
        driverId: approvalDialog.offer.driverId,
        pickupDate: approvalDialog.offer.pickupDate,
        deliveryDate: approvalDialog.offer.deliveryDate,
        pickupAddress: approvalDialog.offer.departureAddress || approvalDialog.offer.pickupAddress,
        deliveryAddress:
          approvalDialog.offer.arrivalAddress || approvalDialog.offer.deliveryAddress,
        cargoDescription: approvalDialog.offer.cargoType || approvalDialog.offer.cargoDescription,
        weight: approvalDialog.offer.cargoWeightKg || approvalDialog.offer.weight,
        volume: approvalDialog.offer.volume,
        price: approvalDialog.offer.quotePrice || approvalDialog.offer.price,
        currency: approvalDialog.offer.currency || 'TRY',
        notes: approvalDialog.offer.notes,
      };

      await ordersAPI.update(approvalDialog.offer.id, updateData);

      // Close dialog and refresh offers
      setApprovalDialog({ open: false, offer: null });
      await loadOffers();

      // Show success message
      setError(null);
    } catch (err) {
      console.error('Teklif onaylanırken hata:', err);
      setError('Teklif onaylanırken bir hata oluştu.');
    } finally {
      setApproving(false);
    }
  };

  const handleCancelApproval = () => {
    setApprovalDialog({ open: false, offer: null });
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
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: 'primary.main' }}>
          Satış Tekliflerim
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/sales/teklif-ver')}
          sx={{ minWidth: 'auto' }}
        >
          Yeni Teklif
        </Button>
      </Box>

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
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {offers.filter(o => o.tripStatus === 'ONAYLANAN_TEKLIF').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Onaylanan
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {offers.filter(o => o.tripStatus === 'TEKLIF_ASAMASI').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bekleyen
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main" fontWeight="bold">
              {offers.filter(o => o.tripStatus === 'REDDEDILDI').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reddedilen
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Info Alert about order status management */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Bilgi:</strong> Onayladığınız siparişlerin durumunu sadece görüntüleyebilir,
          değiştiremezsiniz. Sipariş durumu değişiklikleri operasyon ekibi tarafından
          yönetilmektedir.
        </Typography>
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Arama"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <InputLabel shrink>Durum Filtresi</InputLabel>
              <Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                label="Durum Filtresi"
                notched
              >
                <MenuItem value="">Tümü</MenuItem>
                {tripStatusOptions.map(status => (
                  <MenuItem
                    key={status.value}
                    value={status.value}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    <Chip label={status.label} color={status.color} size="small" />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

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
                      {searchTerm || statusFilter
                        ? 'Arama kriterlerinize uygun teklif bulunamadı.'
                        : 'Henüz teklif bulunmuyor.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOffers.map(offer => (
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
                      <Typography variant="body2">{offer.cargoType}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {offer.cargoWeightKg} kg
                        {offer.cargoWidth &&
                          offer.cargoLength &&
                          offer.cargoHeight &&
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
                        {offer.tripStatus === 'TEKLIF_ASAMASI' && (
                          <>
                            <Tooltip title="Onayla">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleApproveOffer(offer)}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
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

      {/* Approval Confirmation Dialog */}
      <Dialog open={approvalDialog.open} onClose={handleCancelApproval} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircleIcon color="success" />
            <Typography variant="h6">Teklifi Onayla</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          {approvalDialog.offer && (
            <Box>
              <Alert severity="warning" sx={{ mb: 3 }}>
                Bu teklifi onaylamak istediğinizden emin misiniz? Onaylandıktan sonra teklif durumu
                "Onaylanan Teklif" olarak değişecektir.
              </Alert>

              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Teklif Detayları
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Teklif No:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      #{approvalDialog.offer.id}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Müşteri:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {approvalDialog.offer.customerName}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Nereden:
                    </Typography>
                    <Typography variant="body1">
                      {approvalDialog.offer.departureCity}, {approvalDialog.offer.departureCountry}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {approvalDialog.offer.departureAddress}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Nereye:
                    </Typography>
                    <Typography variant="body1">
                      {approvalDialog.offer.arrivalCity}, {approvalDialog.offer.arrivalCountry}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {approvalDialog.offer.arrivalAddress}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Yük Tipi:
                    </Typography>
                    <Typography variant="body1">{approvalDialog.offer.cargoType}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Ağırlık:
                    </Typography>
                    <Typography variant="body1">{approvalDialog.offer.cargoWeightKg} kg</Typography>
                  </Grid>

                  {approvalDialog.offer.cargoWidth &&
                    approvalDialog.offer.cargoLength &&
                    approvalDialog.offer.cargoHeight && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Ölçüler:
                        </Typography>
                        <Typography variant="body1">
                          {approvalDialog.offer.cargoWidth} x {approvalDialog.offer.cargoLength} x{' '}
                          {approvalDialog.offer.cargoHeight} m
                        </Typography>
                      </Grid>
                    )}

                  {approvalDialog.offer.quotePrice && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Teklif Fiyatı:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="success.main">
                        {approvalDialog.offer.quotePrice.toLocaleString('tr-TR')} TL
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Oluşturulma Tarihi:
                    </Typography>
                    <Typography variant="body1">
                      {new Date(approvalDialog.offer.createdAt).toLocaleDateString('tr-TR')} -
                      {new Date(approvalDialog.offer.createdAt).toLocaleTimeString('tr-TR')}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCancelApproval} disabled={approving} color="inherit">
            İptal
          </Button>
          <Button
            onClick={handleConfirmApproval}
            variant="contained"
            color="success"
            disabled={approving}
            startIcon={approving ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          >
            {approving ? 'Onaylanıyor...' : 'Evet, Onayla'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SalesMyOffers;
