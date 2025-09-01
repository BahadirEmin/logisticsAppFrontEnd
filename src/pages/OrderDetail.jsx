import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  LocalShipping as CargoIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api/orders';

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const tripStatusOptions = [
    { value: 'TEKLIF_ASAMASI', label: 'Teklif Aşaması', color: 'default' },
    { value: 'ONAYLANDI', label: 'Onaylandı', color: 'success' },
    { value: 'YOLA_CIKTI', label: 'Yola Çıktı', color: 'info' },
    { value: 'GUMRUKTE', label: 'Gümrükte', color: 'warning' },
    { value: 'TAMAMLANDI', label: 'Tamamlandı', color: 'success' },
    { value: 'IPTAL_EDILDI', label: 'İptal Edildi', color: 'error' }
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
      console.error('Sipariş detayları yüklenirken hata:', err);
      setError('Sipariş detayları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusOption = tripStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  const getStatusLabel = (status) => {
    const statusOption = tripStatusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const handleEdit = () => {
    navigate(`/sales/teklifler/${orderId}/duzenle`);
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

  if (error) {
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
            onClick={() => navigate('/sales/tekliflerim')}
          >
            Geri Dön
          </Button>
          <Typography variant="h4" component="h1">
            Sipariş Detayı #{order.id}
          </Typography>
        </Box>
        {order.tripStatus === 'TEKLIF_ASAMASI' && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            color="primary"
          >
            Düzenle
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Status Card */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Sipariş Durumu"
              action={
                <Chip
                  label={getStatusLabel(order.tripStatus)}
                  color={getStatusColor(order.tripStatus)}
                  variant="outlined"
                />
              }
            />
          </Card>
        </Grid>

        {/* Departure Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Kalkış Bilgileri"
              avatar={<LocationIcon color="primary" />}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {order.departureCity}, {order.departureCountry}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {order.departureAddress}
              </Typography>
              <Typography variant="body2">
                <strong>İlçe:</strong> {order.departureDistrict || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2">
                <strong>Posta Kodu:</strong> {order.departurePostalCode || 'Belirtilmemiş'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                İletişim Bilgileri
              </Typography>
              <Typography variant="body2">
                <strong>Ad Soyad:</strong> {order.departureContactName || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2">
                <strong>Telefon:</strong> {order.departureContactPhone || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2">
                <strong>E-posta:</strong> {order.departureContactEmail || 'Belirtilmemiş'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Arrival Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Varış Bilgileri"
              avatar={<LocationIcon color="secondary" />}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {order.arrivalCity}, {order.arrivalCountry}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {order.arrivalAddress}
              </Typography>
              <Typography variant="body2">
                <strong>İlçe:</strong> {order.arrivalDistrict || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2">
                <strong>Posta Kodu:</strong> {order.arrivalPostalCode || 'Belirtilmemiş'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                İletişim Bilgileri
              </Typography>
              <Typography variant="body2">
                <strong>Ad Soyad:</strong> {order.arrivalContactName || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2">
                <strong>Telefon:</strong> {order.arrivalContactPhone || 'Belirtilmemiş'}
              </Typography>
              <Typography variant="body2">
                <strong>E-posta:</strong> {order.arrivalContactEmail || 'Belirtilmemiş'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Cargo Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Yük Bilgileri"
              avatar={<CargoIcon color="info" />}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {order.cargoType}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Ağırlık:</strong> {order.cargoWeightKg} kg
              </Typography>
              <Typography variant="body2">
                <strong>Boyutlar:</strong> {order.cargoWidth} x {order.cargoLength} x {order.cargoHeight} m
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Transfer Edilebilir:</strong> {order.canTransfer ? 'Evet' : 'Hayır'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Dates Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Tarih Bilgileri"
              avatar={<ScheduleIcon color="warning" />}
            />
            <CardContent>
              <Typography variant="body2" paragraph>
                <strong>Yükleme Tarihi:</strong> {formatDate(order.loadingDate)}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Son Teslim Tarihi:</strong> {formatDate(order.deadlineDate)}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Tahmini Varış Tarihi:</strong> {formatDate(order.estimatedArrivalDate)}
              </Typography>
              <Typography variant="body2">
                <strong>Oluşturulma Tarihi:</strong> {formatDate(order.createdAt)}
              </Typography>
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
                  <Typography variant="body2">
                    <strong>Müşteri ID:</strong> {order.customerId}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Satış Personeli ID:</strong> {order.salesPersonId}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Operasyon Personeli ID:</strong> {order.operationPersonId || 'Atanmamış'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Filo Personeli ID:</strong> {order.fleetPersonId || 'Atanmamış'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Atanan Tır ID:</strong> {order.assignedTruckId || 'Atanmamış'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Atanan Romork ID:</strong> {order.assignedTrailerId || 'Atanmamış'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Gümrük Adresi:</strong> {order.customsAddress || 'Belirtilmemiş'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Gümrük Personeli ID:</strong> {order.customsPersonId || 'Atanmamış'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail;
