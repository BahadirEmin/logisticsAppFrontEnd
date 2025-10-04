import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Chip,
} from '@mui/material';
import {
  LocalShipping as VehicleIcon,
  Person as DriverIcon,
  DirectionsCar as TrailerIcon,
} from '@mui/icons-material';
import { vehicleAPI } from '../api/vehicles';
import { driversAPI } from '../api/drivers';
import { trailerAPI } from '../api/trailers';
import { ordersAPI } from '../api/orders';
import { useAuth } from '../contexts/AuthContext';

const FleetResourceAssignment = ({ open, onClose, orderId, orderInfo, onSuccess }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Assignment state
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedTrailer, setSelectedTrailer] = useState('');

  // Load resources when dialog opens
  useEffect(() => {
    if (open) {
      loadResources();
      // Load current assignments from orderInfo using correct API field names
      if (orderInfo) {
        setSelectedVehicle(orderInfo.assignedTruckId || '');
        setSelectedDriver(orderInfo.assignedDriverId || '');
        setSelectedTrailer(orderInfo.assignedTrailerId || '');
      } else {
        // Reset form if no orderInfo
        setSelectedVehicle('');
        setSelectedDriver('');
        setSelectedTrailer('');
      }
      setError(null);
      setSuccess(null);
    }
  }, [open, orderInfo]);

  const loadResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const [vehiclesData, driversData, trailersData] = await Promise.all([
        vehicleAPI.getAll().catch(err => {
          console.warn('Vehicles API failed:', err);
          return [];
        }),
        driversAPI.getAll().catch(err => {
          console.warn('Drivers API failed:', err);
          return [];
        }),
        trailerAPI.getAll().catch(err => {
          console.warn('Trailers API failed:', err);
          return [];
        }),
      ]);

      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      setDrivers(Array.isArray(driversData) ? driversData : []);
      setTrailers(Array.isArray(trailersData) ? trailersData : []);
    } catch (err) {
      console.error('Error loading resources:', err);
      setError('Kaynaklar yüklenirken bir hata oluştu.');
      // Set empty arrays as fallback
      setVehicles([]);
      setDrivers([]);
      setTrailers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate that at least one resource is selected
    if (!selectedVehicle && !selectedDriver && !selectedTrailer) {
      setError('En az bir kaynak seçmelisiniz (araç, şoför veya römork).');
      return;
    }

    // Validate that user is available
    if (!user || !user.id) {
      setError('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const resources = {};
      if (selectedVehicle) resources.vehicleId = selectedVehicle;
      if (selectedDriver) resources.driverId = selectedDriver;
      if (selectedTrailer) resources.trailerId = selectedTrailer;

      const result = await ordersAPI.assignFleetResources(orderId, resources, user.id);
      
      setSuccess('Kaynaklar başarıyla atandı!');

      // Call success callback immediately to close dialog and show toast
      if (onSuccess) {
        try {
          await onSuccess(orderId);
        } catch (callbackError) {
          console.error('onSuccess callback failed:', callbackError);
        }
      }

      // No need for timeout - dialog will close immediately via callback
    } catch (err) {
      console.error('Error assigning resources:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      let errorMessage = 'Kaynaklar atanırken bir hata oluştu.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <VehicleIcon color="primary" />
          <Typography variant="h6">Fleet Kaynak Ataması</Typography>
        </Box>
        {orderInfo && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Sipariş #{orderInfo.id} - {orderInfo.customerName || orderInfo.customer?.name}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {!loading && (
          <Grid container spacing={3}>
            {/* Vehicle Selection */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="vehicle-select-label" shrink>
                  Araç Seçin
                </InputLabel>
                <Select
                  labelId="vehicle-select-label"
                  value={selectedVehicle}
                  onChange={e => setSelectedVehicle(e.target.value)}
                  label="Araç Seçin"
                  notched
                >
                  <MenuItem value="">
                    <em>Araç seçmeyin</em>
                  </MenuItem>
                  {vehicles.map(vehicle => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {vehicle.plateNumber || vehicle.licensePlate || `Araç #${vehicle.id}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {vehicle.brand} {vehicle.model} - {vehicle.year}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Driver Selection */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="driver-select-label" shrink>
                  Şoför Seçin
                </InputLabel>
                <Select
                  labelId="driver-select-label"
                  value={selectedDriver}
                  onChange={e => setSelectedDriver(e.target.value)}
                  label="Şoför Seçin"
                  notched
                >
                  <MenuItem value="">
                    <em>Şoför seçmeyin</em>
                  </MenuItem>
                  {drivers.map(driver => (
                    <MenuItem key={driver.id} value={driver.id}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {driver.firstName} {driver.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ehliyet: {driver.licenseNo || 'N/A'}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Trailer Selection */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="trailer-select-label" shrink>
                  Römork Seçin
                </InputLabel>
                <Select
                  labelId="trailer-select-label"
                  value={selectedTrailer}
                  onChange={e => setSelectedTrailer(e.target.value)}
                  label="Römork Seçin"
                  notched
                >
                  <MenuItem value="">
                    <em>Römork seçmeyin</em>
                  </MenuItem>
                  {trailers.map(trailer => (
                    <MenuItem key={trailer.id} value={trailer.id}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {trailer.plateNumber || trailer.licensePlate || `Römork #${trailer.id}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {trailer.type || 'N/A'} - {trailer.capacity || 'N/A'} kg
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {/* Selected Resources Summary */}
        {(selectedVehicle || selectedDriver || selectedTrailer) && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Seçilen Kaynaklar:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedVehicle && (
                <Chip
                  icon={<VehicleIcon />}
                  label={`Araç: ${vehicles.find(v => v.id === selectedVehicle)?.plateNumber || `#${selectedVehicle}`}`}
                  color="primary"
                  size="small"
                />
              )}
              {selectedDriver && (
                <Chip
                  icon={<DriverIcon />}
                  label={`Şoför: ${drivers.find(d => d.id === selectedDriver)?.firstName} ${drivers.find(d => d.id === selectedDriver)?.lastName}`}
                  color="secondary"
                  size="small"
                />
              )}
              {selectedTrailer && (
                <Chip
                  icon={<TrailerIcon />}
                  label={`Römork: ${trailers.find(t => t.id === selectedTrailer)?.plateNumber || `#${selectedTrailer}`}`}
                  color="info"
                  size="small"
                />
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          İptal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || (!selectedVehicle && !selectedDriver && !selectedTrailer)}
          startIcon={submitting ? <CircularProgress size={16} /> : null}
        >
          {submitting ? 'Atanıyor...' : 'Kaynakları Ata'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FleetResourceAssignment;
