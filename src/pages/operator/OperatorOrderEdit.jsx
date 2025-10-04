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
  CardHeader,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../api/orders';
import { usersAPI } from '../../api/users';
import { driversAPI } from '../../api/drivers';
import { vehicleAPI } from '../../api/vehicles';
import { trailerAPI } from '../../api/trailers';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { STATUS_OPTIONS } from '../../constants/statusConstants';

const OperatorOrderEdit = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();



  useEffect(() => {
    loadOrder();
    loadDropdownData();
  }, [orderId]);

  // Order yüklendikten sonra default değerleri set et
  useEffect(() => {
    if (order && users.length > 0 && drivers.length > 0 && vehicles.length > 0 && trailers.length > 0) {
      console.log('Setting default values from order:', order);
      
      // Operasyon personeli eşleştir
      if (order.operationPersonName && !order.operationPersonId) {
        const foundUser = users.find(user => 
          (user.fullName === order.operationPersonName || user.username === order.operationPersonName) &&
          (user.role === 'OPERATOR' || user.role === 'OPERATION')
        );
        if (foundUser) {
          console.log('Found operation person:', foundUser);
          handleInputChange('operationPersonId', foundUser.id);
        }
      }

      // Şoför eşleştir
      if (order.assignedDriverName && !order.assignedDriverId) {
        const foundDriver = drivers.find(driver => 
          driver.name === order.assignedDriverName
        );
        if (foundDriver) {
          console.log('Found driver:', foundDriver);
          handleInputChange('assignedDriverId', foundDriver.id);
        }
      }

      // Tır eşleştir (plaka ile)
      if (order.assignedTruckPlateNo && !order.assignedTruckId) {
        const foundVehicle = vehicles.find(vehicle => 
          vehicle.plateNo === order.assignedTruckPlateNo
        );
        if (foundVehicle) {
          console.log('Found vehicle:', foundVehicle);
          handleInputChange('assignedTruckId', foundVehicle.id);
        }
      }

      // Römork eşleştir (römork numarası ile)
      if (order.assignedTrailerNo && !order.assignedTrailerId) {
        const foundTrailer = trailers.find(trailer => 
          trailer.trailerNo === order.assignedTrailerNo
        );
        if (foundTrailer) {
          console.log('Found trailer:', foundTrailer);
          handleInputChange('assignedTrailerId', foundTrailer.id);
        }
      }

      // Gümrük personeli eşleştir
      if (order.customsPersonName && !order.customsPersonId) {
        const foundUser = users.find(user => 
          (user.fullName === order.customsPersonName || user.username === order.customsPersonName) &&
          user.role === 'CUSTOMS'
        );
        if (foundUser) {
          console.log('Found customs person:', foundUser);
          handleInputChange('customsPersonId', foundUser.id);
        }
      }
    }
  }, [order, users, drivers, vehicles, trailers]);

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

  const loadDropdownData = async () => {
    try {
      setDropdownLoading(true);
      console.log('Loading dropdown data...');
      
      // Load each API separately to handle individual failures
      const loadUsers = async () => {
        try {
          const response = await usersAPI.getAll();
          console.log('Raw users response:', response);
          // Handle different response structures
          const userData = response?.data || response || [];
          setUsers(Array.isArray(userData) ? userData : []);
          console.log('Users loaded:', Array.isArray(userData) ? userData.length : 0);
        } catch (error) {
          console.error('Users API failed:', error);
          setUsers([]);
        }
      };

      const loadDrivers = async () => {
        try {
          const response = await driversAPI.getAll();
          console.log('Raw drivers response:', response);
          console.log('Response type:', typeof response);
          console.log('Is array?:', Array.isArray(response));
          // Handle different response structures
          const driversData = response?.data || response || [];
          setDrivers(Array.isArray(driversData) ? driversData : []);
          console.log('Drivers loaded:', Array.isArray(driversData) ? driversData.length : 0);
          if (Array.isArray(driversData) && driversData.length > 0) {
            console.log('Sample driver:', driversData[0]);
          }
        } catch (error) {
          console.error('Drivers API failed:', error);
          setDrivers([]);
        }
      };

      const loadVehicles = async () => {
        try {
          const response = await vehicleAPI.getAll();
          console.log('Raw vehicles response:', response);
          // Handle different response structures
          const vehiclesData = response?.data || response || [];
          setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
          console.log('Vehicles loaded:', Array.isArray(vehiclesData) ? vehiclesData.length : 0);
          if (Array.isArray(vehiclesData) && vehiclesData.length > 0) {
            console.log('Sample vehicle:', vehiclesData[0]);
          }
        } catch (error) {
          console.error('Vehicles API failed:', error);
          setVehicles([]);
        }
      };

      const loadTrailers = async () => {
        try {
          const response = await trailerAPI.getAll();
          console.log('Raw trailers response:', response);
          // Handle different response structures
          const trailersData = response?.data || response || [];
          setTrailers(Array.isArray(trailersData) ? trailersData : []);
          console.log('Trailers loaded:', Array.isArray(trailersData) ? trailersData.length : 0);
        } catch (error) {
          console.error('Trailers API failed:', error);
          setTrailers([]);
        }
      };

      // Load all data in parallel but handle each separately
      await Promise.all([
        loadUsers(),
        loadDrivers(),
        loadVehicles(),
        loadTrailers()
      ]);
      
      console.log('All dropdown data loading completed');
    } catch (error) {
      console.error('Critical error in loadDropdownData:', error);
      // Ensure all states are set to empty arrays in case of critical failure
      setUsers([]);
      setDrivers([]);
      setVehicles([]);
      setTrailers([]);
    } finally {
      setDropdownLoading(false);
    }
  };  const handleInputChange = (field, value) => {
    setOrder(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await ordersAPI.update(orderId, order);
      
      toast.success('Sipariş başarıyla güncellendi!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      
      navigate(`/operator/teklifler/${orderId}`);
    } catch (err) {
      console.error('Sipariş güncellenirken hata:', err);
      setError('Sipariş güncellenirken bir hata oluştu.');
      
      toast.error('Sipariş güncellenirken bir hata oluştu.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/operator/teklifler/${orderId}`);
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
          onClick={() => navigate('/operator/onaylanan-teklifler')}
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
          onClick={() => navigate('/operator/onaylanan-teklifler')}
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
            onClick={() => navigate(`/operator/teklifler/${orderId}`)}
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
                <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                  <InputLabel shrink>Durum</InputLabel>
                  <Select
                    value={order.tripStatus}
                    onChange={e => handleInputChange('tripStatus', e.target.value)}
                    label="Durum"
                    notched
                  >
                    {STATUS_OPTIONS.map(status => (
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
                      onChange={e => handleInputChange('departureCountry', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Şehir"
                      value={order.departureCity || ''}
                      onChange={e => handleInputChange('departureCity', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="İlçe"
                      value={order.departureDistrict || ''}
                      onChange={e => handleInputChange('departureDistrict', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Posta Kodu"
                      value={order.departurePostalCode || ''}
                      onChange={e => handleInputChange('departurePostalCode', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adres"
                      multiline
                      rows={3}
                      value={order.departureAddress || ''}
                      onChange={e => handleInputChange('departureAddress', e.target.value)}
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
                      onChange={e => handleInputChange('departureContactName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      value={order.departureContactPhone || ''}
                      onChange={e => handleInputChange('departureContactPhone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      type="email"
                      value={order.departureContactEmail || ''}
                      onChange={e => handleInputChange('departureContactEmail', e.target.value)}
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
                      onChange={e => handleInputChange('arrivalCountry', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Şehir"
                      value={order.arrivalCity || ''}
                      onChange={e => handleInputChange('arrivalCity', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="İlçe"
                      value={order.arrivalDistrict || ''}
                      onChange={e => handleInputChange('arrivalDistrict', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Posta Kodu"
                      value={order.arrivalPostalCode || ''}
                      onChange={e => handleInputChange('arrivalPostalCode', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adres"
                      multiline
                      rows={3}
                      value={order.arrivalAddress || ''}
                      onChange={e => handleInputChange('arrivalAddress', e.target.value)}
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
                      onChange={e => handleInputChange('arrivalContactName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      value={order.arrivalContactPhone || ''}
                      onChange={e => handleInputChange('arrivalContactPhone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      type="email"
                      value={order.arrivalContactEmail || ''}
                      onChange={e => handleInputChange('arrivalContactEmail', e.target.value)}
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
                      onChange={e => handleInputChange('cargoType', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ağırlık (kg)"
                      type="number"
                      value={order.cargoWeightKg || ''}
                      onChange={e => handleInputChange('cargoWeightKg', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Genişlik (m)"
                      type="number"
                      value={order.cargoWidth || ''}
                      onChange={e => handleInputChange('cargoWidth', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Uzunluk (m)"
                      type="number"
                      value={order.cargoLength || ''}
                      onChange={e => handleInputChange('cargoLength', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Yükseklik (m)"
                      type="number"
                      value={order.cargoHeight || ''}
                      onChange={e => handleInputChange('cargoHeight', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={order.canTransfer || false}
                          onChange={e => handleInputChange('canTransfer', e.target.checked)}
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
                      onChange={e => handleInputChange('loadingDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Son Teslim Tarihi"
                      type="date"
                      value={order.deadlineDate ? order.deadlineDate.split('T')[0] : ''}
                      onChange={e => handleInputChange('deadlineDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tahmini Varış Tarihi"
                      type="date"
                      value={
                        order.estimatedArrivalDate ? order.estimatedArrivalDate.split('T')[0] : ''
                      }
                      onChange={e => handleInputChange('estimatedArrivalDate', e.target.value)}
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
                      label="Müşteri Adı"
                      value={order.customerName || ''}
                      onChange={e => handleInputChange('customerName', e.target.value)}
                      disabled
                      helperText="Değiştirilemez"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Satış Personeli"
                      value={order.salesPersonName || ''}
                      onChange={e => handleInputChange('salesPersonName', e.target.value)}
                      disabled
                      helperText="Değiştirilemez"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ minWidth: 300 }}>
                      <InputLabel>Operasyon Personeli</InputLabel>
                      <Select
                        value={order.operationPersonId || ''}
                        onChange={e => handleInputChange('operationPersonId', e.target.value)}
                        label="Operasyon Personeli"
                        disabled={dropdownLoading}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              width: 350,
                            },
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Seçiniz</em>
                        </MenuItem>
                        {loading ? (
                          <MenuItem disabled>
                            <em>Yükleniyor...</em>
                          </MenuItem>
                        ) : users.length === 0 ? (
                          <MenuItem disabled>
                            <em>Operasyon personeli bulunamadı</em>
                          </MenuItem>
                        ) : (
                          users
                            .filter(user => user && (user.role === 'OPERATOR' || user.role === 'OPERATION'))
                            .map(user => (
                              <MenuItem key={user.id} value={user.id}>
                                {user.fullName || user.username || user.name || `User ${user.id}`} ({user.role})
                              </MenuItem>
                            ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ minWidth: 300 }}>
                      <InputLabel>Atanan Soför</InputLabel>
                      <Select
                        value={order.assignedDriverId || ''}
                        onChange={e => handleInputChange('assignedDriverId', e.target.value)}
                        label="Atanan Soför"
                        disabled={dropdownLoading}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              width: 400,
                            },
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Seçiniz</em>
                        </MenuItem>
                        {dropdownLoading ? (
                          <MenuItem disabled>
                            <em>Yükleniyor...</em>
                          </MenuItem>
                        ) : drivers.length === 0 ? (
                          <MenuItem disabled>
                            <em>Şoför bulunamadı</em>
                          </MenuItem>
                        ) : (
                          drivers
                            .filter(driver => driver && driver.id)
                            .map(driver => (
                              <MenuItem key={driver.id} value={driver.id}>
                                {driver.fullName || driver.firstName + ' ' + driver.lastName || `Şoför ${driver.id}`}
                                {driver.licenseNo ? ` - ${driver.licenseNo}` : ''}
                              </MenuItem>
                            ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ minWidth: 300 }}>
                      <InputLabel>Atanan Tır</InputLabel>
                      <Select
                        value={order.assignedTruckId || ''}
                        onChange={e => handleInputChange('assignedTruckId', e.target.value)}
                        label="Atanan Tır"
                        disabled={dropdownLoading}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              width: 450,
                            },
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Seçiniz</em>
                        </MenuItem>
                        {dropdownLoading ? (
                          <MenuItem disabled>
                            <em>Yükleniyor...</em>
                          </MenuItem>
                        ) : vehicles.length === 0 ? (
                          <MenuItem disabled>
                            <em>Araç bulunamadı</em>
                          </MenuItem>
                        ) : (
                          vehicles
                            .filter(vehicle => vehicle && vehicle.id)
                            .map(vehicle => (
                              <MenuItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.plateNo || 'Plaka Yok'} - {vehicle.make || ''} {vehicle.model || ''}
                              </MenuItem>
                            ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ minWidth: 300 }}>
                      <InputLabel>Atanan Römork</InputLabel>
                      <Select
                        value={order.assignedTrailerId || ''}
                        onChange={e => handleInputChange('assignedTrailerId', e.target.value)}
                        label="Atanan Römork"
                        disabled={dropdownLoading}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              width: 400,
                            },
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Seçiniz</em>
                        </MenuItem>
                        {dropdownLoading ? (
                          <MenuItem disabled>
                            <em>Yükleniyor...</em>
                          </MenuItem>
                        ) : trailers.length === 0 ? (
                          <MenuItem disabled>
                            <em>Römork bulunamadı</em>
                          </MenuItem>
                        ) : (
                          trailers
                            .filter(trailer => trailer && trailer.id)
                            .map(trailer => (
                              <MenuItem key={trailer.id} value={trailer.id}>
                                {trailer.trailerNo || 'Römork No Yok'} - {trailer.trailerType || 'Tip Yok'}
                              </MenuItem>
                            ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ minWidth: 300 }}>
                      <InputLabel>Gümrük Personeli</InputLabel>
                      <Select
                        value={order.customsPersonId || ''}
                        onChange={e => handleInputChange('customsPersonId', e.target.value)}
                        label="Gümrük Personeli"
                        disabled={dropdownLoading}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              width: 350,
                            },
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Seçiniz</em>
                        </MenuItem>
                        {dropdownLoading ? (
                          <MenuItem disabled>
                            <em>Yükleniyor...</em>
                          </MenuItem>
                        ) : users.length === 0 ? (
                          <MenuItem disabled>
                            <em>Gümrük personeli bulunamadı</em>
                          </MenuItem>
                        ) : (
                          users
                            .filter(user => user && user.role === 'CUSTOMS')
                            .map(user => (
                              <MenuItem key={user.id} value={user.id}>
                                {user.fullName || user.username || user.name || `User ${user.id}`} ({user.role})
                              </MenuItem>
                            ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Gümrük Adresi"
                      value={order.customsAddress || ''}
                      onChange={e => handleInputChange('customsAddress', e.target.value)}
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

export default OperatorOrderEdit;
