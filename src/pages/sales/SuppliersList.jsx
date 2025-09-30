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
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { supplierAPI } from '../../api/suppliers';

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('');

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    taxNumber: '',
    taxOffice: '',
    tradeRegistryNumber: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    country: '',
    isActive: true,
    contractStartDate: '',
    contractEndDate: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingInline, setDeletingInline] = useState(false);

  // Load suppliers
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const suppliersData = await supplierAPI.getAll();
      setSuppliers(suppliersData);
    } catch (error) {
      setError('Tedarikçi listesi yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch =
      supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.taxNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive =
      filterActive === '' ||
      (filterActive === 'true' && supplier.isActive) ||
      (filterActive === 'false' && !supplier.isActive);

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
    if (!formData.companyName.trim()) {
      errors.companyName = 'Şirket adı zorunludur';
    }
    if (!formData.taxNumber.trim()) {
      errors.taxNumber = 'Vergi numarası zorunludur';
    }
    if (!formData.email.trim()) {
      errors.email = 'E-posta zorunludur';
    }
    return errors;
  };

  // Open add supplier dialog
  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setFormData({
      companyName: '',
      taxNumber: '',
      taxOffice: '',
      tradeRegistryNumber: '',
      phoneNumber: '',
      email: '',
      address: '',
      city: '',
      country: 'Turkey',
      isActive: true,
      contractStartDate: '',
      contractEndDate: '',
      notes: '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  // Open edit supplier dialog
  const handleEditSupplier = supplier => {
    setEditingSupplier(supplier);
    setFormData({
      companyName: supplier.companyName,
      taxNumber: supplier.taxNumber || '',
      taxOffice: supplier.taxOffice || '',
      tradeRegistryNumber: supplier.tradeRegistryNumber || '',
      phoneNumber: supplier.phoneNumber || '',
      email: supplier.email || '',
      address: supplier.address || '',
      city: supplier.city || '',
      country: supplier.country || 'Turkey',
      isActive: supplier.isActive !== undefined ? supplier.isActive : true,
      contractStartDate: supplier.contractStartDate ? supplier.contractStartDate.split('T')[0] : '',
      contractEndDate: supplier.contractEndDate ? supplier.contractEndDate.split('T')[0] : '',
      notes: supplier.notes || '',
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
      const supplierData = {
        ...formData,
        isActive: Boolean(formData.isActive),
      };

      if (editingSupplier) {
        await supplierAPI.update(editingSupplier.id, supplierData);
      } else {
        await supplierAPI.create(supplierData);
      }

      setDialogOpen(false);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Save supplier error:', error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Tedarikçi kaydedilirken hata oluştu';
      setError(backendMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete supplier
  const handleDeleteSupplier = supplier => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await supplierAPI.delete(supplierToDelete.id);
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
      loadData(); // Reload data
    } catch (error) {
      setError('Tedarikçi silinirken hata oluştu');
      console.error('Delete supplier error:', error);
    }
  };

  // Inline delete confirmation
  const confirmDeleteInline = async () => {
    if (!editingSupplier) return;
    try {
      setDeletingInline(true);
      await supplierAPI.delete(editingSupplier.id);
      setDialogOpen(false);
      setEditingSupplier(null);
      await loadData();
    } catch (error) {
      console.error('Inline delete error:', error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Tedarikçi silinirken hata oluştu';
      setError(backendMessage);
    } finally {
      setDeletingInline(false);
    }
  };

  // Format date
  const formatDate = dateString => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  // Check if contract is active
  const isContractActive = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
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
            Tedarikçi Listesi
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSupplier}
            sx={{ px: 3 }}
          >
            Yeni Tedarikçi Ekle
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
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
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {filteredSuppliers.length} tedarikçi bulundu
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Supplier Table */}
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>
                  <strong>Şirket Adı</strong>
                </TableCell>
                <TableCell>
                  <strong>Vergi No</strong>
                </TableCell>
                <TableCell>
                  <strong>E-posta</strong>
                </TableCell>
                <TableCell>
                  <strong>Telefon</strong>
                </TableCell>
                <TableCell>
                  <strong>Şehir</strong>
                </TableCell>
                <TableCell>
                  <strong>Sözleşme Durumu</strong>
                </TableCell>
                <TableCell>
                  <strong>Durum</strong>
                </TableCell>
                <TableCell>
                  <strong>Kayıt Tarihi</strong>
                </TableCell>
                <TableCell>
                  <strong>İşlemler</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.map(supplier => (
                <TableRow key={supplier.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {supplier.companyName}
                      </Typography>
                      {supplier.address && (
                        <Typography variant="caption" color="text.secondary">
                          {supplier.address}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{supplier.taxNumber || '-'}</TableCell>
                  <TableCell>{supplier.email || '-'}</TableCell>
                  <TableCell>{supplier.phoneNumber || '-'}</TableCell>
                  <TableCell>{supplier.city || '-'}</TableCell>
                  <TableCell>
                    {supplier.contractStartDate && supplier.contractEndDate ? (
                      <Chip
                        icon={
                          isContractActive(supplier.contractStartDate, supplier.contractEndDate) ? (
                            <CheckCircleIcon />
                          ) : (
                            <CancelIcon />
                          )
                        }
                        label={
                          isContractActive(supplier.contractStartDate, supplier.contractEndDate)
                            ? 'Aktif'
                            : 'Pasif'
                        }
                        color={
                          isContractActive(supplier.contractStartDate, supplier.contractEndDate)
                            ? 'success'
                            : 'error'
                        }
                        size="small"
                      />
                    ) : (
                      <Chip label="Sözleşme Yok" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<BusinessIcon />}
                      label={supplier.isActive ? 'Aktif' : 'Pasif'}
                      color={supplier.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(supplier.createdAt)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditSupplier(supplier)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSupplier(supplier)}
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

        {/* Add/Edit Supplier Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingSupplier ? 'Tedarikçi Düzenle' : 'Yeni Tedarikçi Ekle'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Şirket Adı *"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  error={!!formErrors.companyName}
                  helperText={formErrors.companyName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vergi Numarası *"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleInputChange}
                  error={!!formErrors.taxNumber}
                  helperText={formErrors.taxNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vergi Dairesi"
                  name="taxOffice"
                  value={formData.taxOffice}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ticaret Sicil No"
                  name="tradeRegistryNumber"
                  value={formData.tradeRegistryNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefon"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="E-posta *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adres"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Şehir"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Ülke"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label="Aktif"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Sözleşme Başlangıç Tarihi"
                  name="contractStartDate"
                  type="date"
                  value={formData.contractStartDate}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Sözleşme Bitiş Tarihi"
                  name="contractEndDate"
                  type="date"
                  value={formData.contractEndDate}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
            {editingSupplier && (
              <Button
                onClick={confirmDeleteInline}
                color="error"
                disabled={saving || deletingInline}
                sx={{ mr: 'auto' }}
              >
                {deletingInline ? 'Siliniyor...' : 'Sil'}
              </Button>
            )}
            <Button onClick={() => setDialogOpen(false)} disabled={saving || deletingInline}>
              İptal
            </Button>
            <Button onClick={handleSubmit} variant="contained" disabled={saving || deletingInline}>
              {saving
                ? editingSupplier
                  ? 'Güncelleniyor...'
                  : 'Kaydediliyor...'
                : editingSupplier
                  ? 'Güncelle'
                  : 'Kaydet'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Tedarikçi Sil</DialogTitle>
          <DialogContent>
            <Typography>
              "{supplierToDelete?.companyName}" tedarikçisini silmek istediğinizden emin misiniz? Bu
              işlem geri alınamaz.
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

export default SuppliersList;
