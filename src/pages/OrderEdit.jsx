import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api/orders';

const OrderEdit = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const tripStatusOptions = [
    { value: 'TEKLIF_ASAMASI', label: 'Teklif Aşaması' },
    { value: 'ONAYLANDI', label: 'Onaylandı' },
    { value: 'YOLA_CIKTI', label: 'Yola Çıktı' },
    { value: 'GUMRUKTE', label: 'Gümrükte' },
    { value: 'TAMAMLANDI', label: 'Tamamlandı' },
    { value: 'IPTAL_EDILDI', label: 'İptal Edildi' }
  ];

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersAPI.getById(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Sipariş yüklenirken hata:', err);
      setError('Sipariş yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await ordersAPI.update(orderId, order);
      navigate(`/sales/teklifler/${orderId}`);
    } catch (err) {
      console.error('Sipariş güncellenirken hata:', err);
      setError('Sipariş güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/sales/teklifler/${orderId}`);
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

  if (error && !order) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/sales/tekliflerim')}
        >
          Geri Dön
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Sipariş bulunamadı.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/sales/tekliflerim')}
        >
          Geri Dön
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/sales/teklifler/${orderId}`)}
          >
            Geri Dön
          </Button>
          <Typography variant="h4" component="h1">
            Sipariş Düzenle #{order.id}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Status */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Sipariş Durumu" />
              <CardContent>
                <FormControl fullWidth>
                  <InputLabel>Durum</InputLabel>
                  <Select
                    value={order.tripStatus}
                    onChange={(e) => handleInputChange('tripStatus', e.target.value)}
                    label="Durum"
                  >
                    {tripStatusOptions.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Departure Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Kalkış Bilgileri" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ülke"
                      value={order.departureCountry || ''}
                      onChange={(e) => handleInputChange('departureCountry', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Şehir"
                      value={order.departureCity || ''}
                      onChange={(e) => handleInputChange('departureCity', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="İlçe"
                      value={order.departureDistrict || ''}
                      onChange={(e) => handleInputChange('departureDistrict', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Posta Kodu"
                      value={order.departurePostalCode || ''}
                      onChange={(e) => handleInputChange('departurePostalCode', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adres"
                      multiline
                      rows={3}
                      value={order.departureAddress || ''}
                      onChange={(e) => handleInputChange('departureAddress', e.target.value)}
                    />
                  </Grid>
                  <Divider sx={{ width: '100%', my: 2 }} />
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      İletişim Bilgileri
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ad Soyad"
                      value={order.departureContactName || ''}
                      onChange={(e) => handleInputChange('departureContactName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      value={order.departureContactPhone || ''}
                      onChange={(e) => handleInputChange('departureContactPhone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      type="email"
                      value={order.departureContactEmail || ''}
                      onChange={(e) => handleInputChange('departureContactEmail', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Arrival Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Varış Bilgileri" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ülke"
                      value={order.arrivalCountry || ''}
                      onChange={(e) => handleInputChange('arrivalCountry', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Şehir"
                      value={order.arrivalCity || ''}
                      onChange={(e) => handleInputChange('arrivalCity', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="İlçe"
                      value={order.arrivalDistrict || ''}
                      onChange={(e) => handleInputChange('arrivalDistrict', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Posta Kodu"
                      value={order.arrivalPostalCode || ''}
                      onChange={(e) => handleInputChange('arrivalPostalCode', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adres"
                      multiline
                      rows={3}
                      value={order.arrivalAddress || ''}
                      onChange={(e) => handleInputChange('arrivalAddress', e.target.value)}
                    />
                  </Grid>
                  <Divider sx={{ width: '100%', my: 2 }} />
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      İletişim Bilgileri
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ad Soyad"
                      value={order.arrivalContactName || ''}
                      onChange={(e) => handleInputChange('arrivalContactName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      value={order.arrivalContactPhone || ''}
                      onChange={(e) => handleInputChange('arrivalContactPhone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      type="email"
                      value={order.arrivalContactEmail || ''}
                      onChange={(e) => handleInputChange('arrivalContactEmail', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Cargo Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Yük Bilgileri" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Yük Türü"
                      value={order.cargoType || ''}
                      onChange={(e) => handleInputChange('cargoType', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ağırlık (kg)"
                      type="number"
                      value={order.cargoWeightKg || ''}
                      onChange={(e) => handleInputChange('cargoWeightKg', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Genişlik (m)"
                      type="number"
                      value={order.cargoWidth || ''}
                      onChange={(e) => handleInputChange('cargoWidth', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Uzunluk (m)"
                      type="number"
                      value={order.cargoLength || ''}
                      onChange={(e) => handleInputChange('cargoLength', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Yükseklik (m)"
                      type="number"
                      value={order.cargoHeight || ''}
                      onChange={(e) => handleInputChange('cargoHeight', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={order.canTransfer || false}
                          onChange={(e) => handleInputChange('canTransfer', e.target.checked)}
                        />
                      }
                      label="Transfer Edilebilir"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Dates Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Tarih Bilgileri" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Yükleme Tarihi"
                      type="date"
                      value={order.loadingDate ? order.loadingDate.split('T')[0] : ''}
                      onChange={(e) => handleInputChange('loadingDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Son Teslim Tarihi"
                      type="date"
                      value={order.deadlineDate ? order.deadlineDate.split('T')[0] : ''}
                      onChange={(e) => handleInputChange('deadlineDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tahmini Varış Tarihi"
                      type="date"
                      value={order.estimatedArrivalDate ? order.estimatedArrivalDate.split('T')[0] : ''}
                      onChange={(e) => handleInputChange('estimatedArrivalDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Ek Bilgiler" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Müşteri ID"
                      type="number"
                      value={order.customerId || ''}
                      onChange={(e) => handleInputChange('customerId', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Satış Personeli ID"
                      type="number"
                      value={order.salesPersonId || ''}
                      onChange={(e) => handleInputChange('salesPersonId', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Operasyon Personeli ID"
                      type="number"
                      value={order.operationPersonId || ''}
                      onChange={(e) => handleInputChange('operationPersonId', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Filo Personeli ID"
                      type="number"
                      value={order.fleetPersonId || ''}
                      onChange={(e) => handleInputChange('fleetPersonId', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Atanan Tır ID"
                      type="number"
                      value={order.assignedTruckId || ''}
                      onChange={(e) => handleInputChange('assignedTruckId', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Atanan Romork ID"
                      type="number"
                      value={order.assignedTrailerId || ''}
                      onChange={(e) => handleInputChange('assignedTrailerId', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Gümrük Adresi"
                      value={order.customsAddress || ''}
                      onChange={(e) => handleInputChange('customsAddress', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Gümrük Personeli ID"
                      type="number"
                      value={order.customsPersonId || ''}
                      onChange={(e) => handleInputChange('customsPersonId', Number(e.target.value))}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={saving}
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={saving}
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default OrderEdit;
