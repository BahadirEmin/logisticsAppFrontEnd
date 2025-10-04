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
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Chip,
  InputAdornment,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocalShipping as TruckIcon,
} from '@mui/icons-material';
import { vehicleAPI } from '../../api/vehicles';
import { toast } from 'react-toastify';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('');

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    plateNo: '',
    vin: '',
    make: '',
    model: '',
    modelYear: '',
    engineNo: '',
    chassisNo: '',
    color: '',
    fuelType: '',
    transmissionType: '',
    engineCapacity: '',
    horsepower: '',
    mileage: '',
    purchaseDate: '',
    purchasePrice: '',
    currentValue: '',
    insuranceExpiryDate: '',
    inspectionExpiryDate: '',
    ownershipTypeId: 1,
    isActive: true,
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingInline, setDeletingInline] = useState(false);

  // Load vehicles
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const vehiclesData = await vehicleAPI.getAll();
      setVehicles(vehiclesData);
    } catch (error) {
      setError('Araç listesi yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.plateNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive =
      filterActive === '' ||
      (filterActive === 'true' && vehicle.isActive) ||
      (filterActive === 'false' && !vehicle.isActive);

    return matchesSearch && matchesActive;
  });

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.plateNo.trim()) {
      errors.plateNo = 'Plaka numarası zorunludur';
    }
    if (!formData.make.trim()) {
      errors.make = 'Marka zorunludur';
    }
    if (!formData.model.trim()) {
      errors.model = 'Model zorunludur';
    }
    if (!formData.modelYear) {
      errors.modelYear = 'Model yılı zorunludur';
    }
    if (!formData.vin.trim()) {
      errors.vin = 'VIN numarası zorunludur';
    }
    return errors;
  };

  // Open add vehicle dialog
  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setFormData({
      plateNo: '',
      vin: '',
      make: '',
      model: '',
      modelYear: '',
      engineNo: '',
      chassisNo: '',
      color: '',
      fuelType: '',
      transmissionType: '',
      engineCapacity: '',
      horsepower: '',
      mileage: '',
      purchaseDate: '',
      purchasePrice: '',
      currentValue: '',
      insuranceExpiryDate: '',
      inspectionExpiryDate: '',
      ownershipTypeId: 1,
      isActive: true,
      notes: '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  // Open edit vehicle dialog
  const handleEditVehicle = vehicle => {
    setEditingVehicle(vehicle);
    setFormData({
      plateNo: vehicle.plateNo || '',
      vin: vehicle.vin || '',
      make: vehicle.make || '',
      model: vehicle.model || '',
      modelYear: vehicle.modelYear || '',
      engineNo: vehicle.engineNo || '',
      chassisNo: vehicle.chassisNo || '',
      color: vehicle.color || '',
      fuelType: vehicle.fuelType || '',
      transmissionType: vehicle.transmissionType || '',
      engineCapacity: vehicle.engineCapacity || '',
      horsepower: vehicle.horsepower || '',
      mileage: vehicle.mileage || '',
      purchaseDate: vehicle.purchaseDate ? vehicle.purchaseDate.split('T')[0] : '',
      purchasePrice: vehicle.purchasePrice || '',
      currentValue: vehicle.currentValue || '',
      insuranceExpiryDate: vehicle.insuranceExpiryDate
        ? vehicle.insuranceExpiryDate.split('T')[0]
        : '',
      inspectionExpiryDate: vehicle.inspectionExpiryDate
        ? vehicle.inspectionExpiryDate.split('T')[0]
        : '',
      ownershipTypeId: vehicle.ownershipTypeId || 1,
      isActive: vehicle.isActive !== undefined ? vehicle.isActive : true,
      notes: vehicle.notes || '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);
      const vehicleData = {
        ...formData,
        modelYear: formData.modelYear ? Number(formData.modelYear) : null,
        engineCapacity: formData.engineCapacity ? Number(formData.engineCapacity) : null,
        horsepower: formData.horsepower ? Number(formData.horsepower) : null,
        mileage: formData.mileage ? Number(formData.mileage) : null,
        purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : null,
        currentValue: formData.currentValue ? Number(formData.currentValue) : null,
        ownershipTypeId: Number(formData.ownershipTypeId),
        isActive: Boolean(formData.isActive),
      };

      if (editingVehicle) {
        await vehicleAPI.update(editingVehicle.id, vehicleData);
        
        toast.success('Araç başarıyla güncellendi!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      } else {
        await vehicleAPI.create(vehicleData);
        
        toast.success('Araç başarıyla eklendi!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      }

      setDialogOpen(false);
      await loadData();
    } catch (error) {
      console.error('Save vehicle error:', error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Araç kaydedilirken hata oluştu';
      setError(backendMessage);
      
      toast.error(backendMessage, {
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

  // Handle delete vehicle
  const handleDeleteVehicle = vehicle => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await vehicleAPI.delete(vehicleToDelete.id);
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
      loadData();
      
      toast.success('Araç başarıyla silindi!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } catch (error) {
      setError('Araç silinirken hata oluştu');
      console.error('Delete vehicle error:', error);
      
      toast.error('Araç silinirken hata oluştu', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    }
  };

  // Inline delete confirmation
  const confirmDeleteInline = async () => {
    if (!editingVehicle) return;
    try {
      setDeletingInline(true);
      await vehicleAPI.delete(editingVehicle.id);
      setDialogOpen(false);
      setEditingVehicle(null);
      await loadData();
      
      toast.success('Araç başarıyla silindi!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } catch (error) {
      console.error('Inline delete error:', error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Araç silinirken hata oluştu';
      setError(backendMessage);
      
      toast.error(backendMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setDeletingInline(false);
    }
  };

  // Format date
  const formatDate = dateString => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  // Format currency
  const formatCurrency = amount => {
    if (!amount) return '-';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, ml: 0 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#1976d2' }}>
            Araç Listesi (Admin)
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddVehicle}
            sx={{ px: 3 }}
          >
            Yeni Araç Ekle
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Ara"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                <InputLabel shrink>Durum</InputLabel>
                <Select
                  value={filterActive}
                  onChange={e => setFilterActive(e.target.value)}
                  label="Durum"
                  notched
                >
                  <MenuItem value="">Tümü</MenuItem>
                  <MenuItem value="true">Aktif</MenuItem>
                  <MenuItem value="false">Pasif</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Vehicles Table */}
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>
                  <strong>Plaka</strong>
                </TableCell>
                <TableCell>
                  <strong>Marka/Model</strong>
                </TableCell>
                <TableCell>
                  <strong>VIN</strong>
                </TableCell>
                <TableCell>
                  <strong>Model Yılı</strong>
                </TableCell>
                <TableCell>
                  <strong>Kilometre</strong>
                </TableCell>
                <TableCell>
                  <strong>Durum</strong>
                </TableCell>
                <TableCell>
                  <strong>Sigorta</strong>
                </TableCell>
                <TableCell>
                  <strong>Muayene</strong>
                </TableCell>
                <TableCell>
                  <strong>İşlemler</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVehicles.map(vehicle => (
                <TableRow key={vehicle.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {vehicle.plateNo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {vehicle.make} {vehicle.model}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {vehicle.color}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {vehicle.vin}
                    </Typography>
                  </TableCell>
                  <TableCell>{vehicle.modelYear}</TableCell>
                  <TableCell>
                    {vehicle.mileage ? `${vehicle.mileage.toLocaleString('tr-TR')} km` : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vehicle.isActive ? 'Aktif' : 'Pasif'}
                      color={vehicle.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={
                        new Date(vehicle.insuranceExpiryDate) < new Date() ? 'error' : 'textPrimary'
                      }
                    >
                      {formatDate(vehicle.insuranceExpiryDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={
                        new Date(vehicle.inspectionExpiryDate) < new Date()
                          ? 'error'
                          : 'textPrimary'
                      }
                    >
                      {formatDate(vehicle.inspectionExpiryDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditVehicle(vehicle)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteVehicle(vehicle)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredVehicles.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <TruckIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Araç bulunamadı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || filterActive !== ''
                ? 'Arama kriterlerinizi değiştirmeyi deneyin.'
                : 'Henüz araç eklenmemiş.'}
            </Typography>
          </Box>
        )}

        {/* Add/Edit Vehicle Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingVehicle ? 'Araç Düzenle' : 'Yeni Araç Ekle'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Temel Bilgiler
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Plaka No *"
                  name="plateNo"
                  value={formData.plateNo}
                  onChange={handleInputChange}
                  error={!!formErrors.plateNo}
                  helperText={formErrors.plateNo}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="VIN No *"
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
                  error={!!formErrors.vin}
                  helperText={formErrors.vin}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Marka *"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  error={!!formErrors.make}
                  helperText={formErrors.make}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Model *"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  error={!!formErrors.model}
                  helperText={formErrors.model}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Model Yılı *"
                  name="modelYear"
                  type="number"
                  value={formData.modelYear}
                  onChange={handleInputChange}
                  error={!!formErrors.modelYear}
                  helperText={formErrors.modelYear}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Motor No"
                  name="engineNo"
                  value={formData.engineNo}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Şasi No"
                  name="chassisNo"
                  value={formData.chassisNo}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Renk"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Yakıt Tipi"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Vites Tipi"
                  name="transmissionType"
                  value={formData.transmissionType}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Motor Hacmi (L)"
                  name="engineCapacity"
                  type="number"
                  value={formData.engineCapacity}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Beygir Gücü"
                  name="horsepower"
                  type="number"
                  value={formData.horsepower}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kilometre"
                  name="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                    />
                  }
                  label="Aktif"
                />
              </Grid>

              {/* Financial Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#1976d2' }}>
                  Finansal Bilgiler
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Satın Alma Tarihi"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Satın Alma Fiyatı (TL)"
                  name="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Güncel Değer (TL)"
                  name="currentValue"
                  type="number"
                  value={formData.currentValue}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mülkiyet Tipi ID"
                  name="ownershipTypeId"
                  type="number"
                  value={formData.ownershipTypeId}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Legal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#1976d2' }}>
                  Yasal Bilgiler
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Sigorta Bitiş Tarihi"
                  name="insuranceExpiryDate"
                  type="date"
                  value={formData.insuranceExpiryDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Muayene Bitiş Tarihi"
                  name="inspectionExpiryDate"
                  type="date"
                  value={formData.inspectionExpiryDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notlar"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {editingVehicle && (
              <Button
                onClick={confirmDeleteInline}
                color="error"
                disabled={deletingInline}
                startIcon={<DeleteIcon />}
              >
                {deletingInline ? 'Siliniyor...' : 'Sil'}
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={() => setDialogOpen(false)}>İptal</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={saving}>
              {saving ? 'Kaydediliyor...' : editingVehicle ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Silme Onayı</DialogTitle>
          <DialogContent>
            <Typography>
              "{vehicleToDelete?.plateNo}" plakalı aracı silmek istediğinizden emin misiniz?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Sil
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default VehicleList;
