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
  LocalShipping as TrailerIcon,
} from '@mui/icons-material';
import { trailerAPI } from '../../api/trailers';
import { toast } from 'react-toastify';

const TrailerList = () => {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrailer, setEditingTrailer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trailerToDelete, setTrailerToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    trailerNo: '',
    vin: '',
    make: '',
    model: '',
    modelYear: '',
    trailerType: '',
    capacity: '',
    length: '',
    width: '',
    height: '',
    purchaseDate: '',
    ownershipTypeId: 1,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingInline, setDeletingInline] = useState(false);

  // Load trailers
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const trailersData = await trailerAPI.getAll();
      setTrailers(Array.isArray(trailersData) ? trailersData : []);
    } catch (error) {
      console.error('Error loading trailers:', error);
      setError('Römork listesi yüklenirken hata oluştu');
      setTrailers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Filter trailers
  const filteredTrailers = trailers.filter(trailer => {
    const matchesSearch =
      trailer.trailerNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trailer.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trailer.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trailer.vin?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive =
      filterActive === 'all' || filterActive === '' ||
      (filterActive === 'true' && trailer.isActive) ||
      (filterActive === 'false' && !trailer.isActive);

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
    if (!formData.trailerNo.trim()) {
      errors.trailerNo = 'Römork numarası zorunludur';
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
    if (!formData.trailerType.trim()) {
      errors.trailerType = 'Römork tipi zorunludur';
    }
    return errors;
  };

  // Open add trailer dialog
  const handleAddTrailer = () => {
    setEditingTrailer(null);
    setFormData({
      trailerNo: '',
      vin: '',
      make: '',
      model: '',
      modelYear: '',
      trailerType: '',
      capacity: '',
      length: '',
      width: '',
      height: '',
      purchaseDate: '',
      ownershipTypeId: 1,
      isActive: true,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  // Open edit trailer dialog
  const handleEditTrailer = trailer => {
    setEditingTrailer(trailer);
    setFormData({
      trailerNo: trailer.trailerNo || '',
      vin: trailer.vin || '',
      make: trailer.make || '',
      model: trailer.model || '',
      modelYear: trailer.modelYear || '',
      trailerType: trailer.trailerType || '',
      capacity: trailer.capacity || '',
      length: trailer.length || '',
      width: trailer.width || '',
      height: trailer.height || '',
      purchaseDate: trailer.purchaseDate ? trailer.purchaseDate.split('T')[0] : '',
      ownershipTypeId: trailer.ownershipTypeId || 1,
      isActive: trailer.isActive !== undefined ? trailer.isActive : true,
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
      const trailerData = {
        ...formData,
        modelYear: formData.modelYear ? Number(formData.modelYear) : null,
        capacity: formData.capacity ? Number(formData.capacity) : null,
        length: formData.length ? Number(formData.length) : null,
        width: formData.width ? Number(formData.width) : null,
        height: formData.height ? Number(formData.height) : null,
        ownershipTypeId: Number(formData.ownershipTypeId),
        isActive: Boolean(formData.isActive),
      };

      if (editingTrailer) {
        await trailerAPI.update(editingTrailer.id, trailerData);
        
        toast.success('Römork başarıyla güncellendi!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      } else {
        await trailerAPI.create(trailerData);
        
        toast.success('Römork başarıyla eklendi!', {
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
      console.error('Save trailer error:', error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Römork kaydedilirken hata oluştu';
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

  // Handle delete trailer
  const handleDeleteTrailer = trailer => {
    setTrailerToDelete(trailer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await trailerAPI.delete(trailerToDelete.id);
      setDeleteDialogOpen(false);
      setTrailerToDelete(null);
      loadData();
      
      toast.success('Römork başarıyla silindi!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } catch (error) {
      setError('Römork silinirken hata oluştu');
      console.error('Delete trailer error:', error);
      
      toast.error('Römork silinirken hata oluştu', {
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
    if (!editingTrailer) return;
    try {
      setDeletingInline(true);
      await trailerAPI.delete(editingTrailer.id);
      setDialogOpen(false);
      setEditingTrailer(null);
      await loadData();
      
      toast.success('Römork başarıyla silindi!', {
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
        'Römork silinirken hata oluştu';
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

  // Format dimensions
  const formatDimension = (value, unit) => {
    if (!value) return '-';
    return `${value} ${unit}`;
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
            Römork Listesi
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTrailer}
            sx={{ px: 3 }}
          >
            Yeni Römork Ekle
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
                  <MenuItem value="all">
                    <Chip label="Tümü" size="small" sx={{ backgroundColor: 'white', color: 'black', border: '1px solid #ddd' }} />
                  </MenuItem>
                  <MenuItem value="true">
                    <Chip label="Aktif" size="small" color="success" />
                  </MenuItem>
                  <MenuItem value="false">
                    <Chip label="Pasif" size="small" color="error" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Trailers Table */}
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>
                  <strong>Römork No</strong>
                </TableCell>
                <TableCell>
                  <strong>Marka/Model</strong>
                </TableCell>
                <TableCell>
                  <strong>VIN</strong>
                </TableCell>
                <TableCell>
                  <strong>Tip</strong>
                </TableCell>
                <TableCell>
                  <strong>Kapasite</strong>
                </TableCell>
                <TableCell>
                  <strong>Boyutlar</strong>
                </TableCell>
                <TableCell>
                  <strong>Model Yılı</strong>
                </TableCell>
                <TableCell>
                  <strong>Durum</strong>
                </TableCell>
                <TableCell>
                  <strong>İşlemler</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTrailers.map(trailer => (
                <TableRow key={trailer.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {trailer.trailerNo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {trailer.make} {trailer.model}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {trailer.vin}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={trailer.trailerType}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{trailer.capacity ? `${trailer.capacity} ton` : '-'}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDimension(trailer.length, 'm')} × {formatDimension(trailer.width, 'm')}{' '}
                      × {formatDimension(trailer.height, 'm')}
                    </Typography>
                  </TableCell>
                  <TableCell>{trailer.modelYear}</TableCell>
                  <TableCell>
                    <Chip
                      label={trailer.isActive ? 'Aktif' : 'Pasif'}
                      color={trailer.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditTrailer(trailer)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTrailer(trailer)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredTrailers.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <TrailerIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Römork bulunamadı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || filterActive !== 'all'
                ? 'Arama kriterlerinizi değiştirmeyi deneyin.'
                : 'Henüz römork eklenmemiş.'}
            </Typography>
          </Box>
        )}

        {/* Add/Edit Trailer Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingTrailer ? 'Römork Düzenle' : 'Yeni Römork Ekle'}</DialogTitle>
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
                  label="Römork No *"
                  name="trailerNo"
                  value={formData.trailerNo}
                  onChange={handleInputChange}
                  error={!!formErrors.trailerNo}
                  helperText={formErrors.trailerNo}
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
                  label="Römork Tipi *"
                  name="trailerType"
                  value={formData.trailerType}
                  onChange={handleInputChange}
                  error={!!formErrors.trailerType}
                  helperText={formErrors.trailerType}
                  placeholder="Flatbed, Container, etc."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kapasite (ton)"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Dimensions */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#1976d2' }}>
                  Boyutlar
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Uzunluk (m)"
                  name="length"
                  type="number"
                  value={formData.length}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Genişlik (m)"
                  name="width"
                  type="number"
                  value={formData.width}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Yükseklik (m)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
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
                  label="Mülkiyet Tipi ID"
                  name="ownershipTypeId"
                  type="number"
                  value={formData.ownershipTypeId}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
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
            </Grid>
          </DialogContent>
          <DialogActions>
            {editingTrailer && (
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
              {saving ? 'Kaydediliyor...' : editingTrailer ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Silme Onayı</DialogTitle>
          <DialogContent>
            <Typography>
              "{trailerToDelete?.trailerNo}" numaralı römorku silmek istediğinizden emin misiniz?
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

export default TrailerList;
