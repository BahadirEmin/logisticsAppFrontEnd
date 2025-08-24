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
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Gavel as LawsuitIcon
} from '@mui/icons-material';
import { customerAPI } from '../api/customers';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [riskStatuses, setRiskStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRiskStatus, setFilterRiskStatus] = useState('');
  const [filterBlacklisted, setFilterBlacklisted] = useState('');
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    taxNo: '',
    contactName: '',
    phoneNumber: '',
    address: '',
    riskStatusId: '',
    isBlacklisted: false,
    isInLawsuit: false,
    creditLimit: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false); // kayıt/güncelleme durumu
  const [deletingInline, setDeletingInline] = useState(false); // edit dialog içinden silme

  // Load customers and risk statuses
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load customers and risk statuses separately to debug
      const customersData = await customerAPI.getAll();
      
      const riskStatusesData = await customerAPI.getRiskStatuses();
      
      setCustomers(customersData);
      setRiskStatuses(riskStatusesData);
      
    } catch (error) {
      setError('Müşteri listesi yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.taxNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contactName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRiskStatus = !filterRiskStatus || customer.riskStatusId === parseInt(filterRiskStatus);
    
    const matchesBlacklisted = filterBlacklisted === '' || 
                              (filterBlacklisted === 'true' && customer.isBlacklisted) ||
                              (filterBlacklisted === 'false' && !customer.isBlacklisted);
    
    return matchesSearch && matchesRiskStatus && matchesBlacklisted;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Müşteri adı zorunludur';
    }
    if (!formData.riskStatusId) {
      errors.riskStatusId = 'Risk durumu zorunludur';
    }
    return errors;
  };

  // Open add customer dialog
  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      taxNo: '',
      contactName: '',
      phoneNumber: '',
      address: '',
      riskStatusId: '',
      isBlacklisted: false,
      isInLawsuit: false,
      creditLimit: ''
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  // Open edit customer dialog
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      taxNo: customer.taxNo || '',
      contactName: customer.contactName || '',
      phoneNumber: customer.phoneNumber || '',
      address: customer.address || '',
      riskStatusId: customer.riskStatusId,
      isBlacklisted: customer.isBlacklisted || false,
      isInLawsuit: customer.isInLawsuit || false,
      creditLimit: customer.creditLimit || ''
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
      const customerData = {
        ...formData,
        riskStatusId: formData.riskStatusId ? Number(formData.riskStatusId) : null,
        creditLimit: formData.creditLimit !== '' ? Number(formData.creditLimit) : null,
      };

      //console.log('[CustomerList] submitting', editingCustomer ? 'UPDATE' : 'CREATE', customerData);

      if (editingCustomer) {
        await customerAPI.update(editingCustomer.id, customerData);
        //console.log('[CustomerList] Update request sent to /v1/customers/' + editingCustomer.id);
      } else {
        await customerAPI.create(customerData);
        //console.log('[CustomerList] Create request sent to /v1/customers');
      }

      setDialogOpen(false);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Save customer error:', error);
      const backendMessage = error?.response?.data?.message || error?.response?.data?.error || 'Müşteri kaydedilirken hata oluştu';
      setError(backendMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await customerAPI.delete(customerToDelete.id);
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
      loadData(); // Reload data
    } catch (error) {
      setError('Müşteri silinirken hata oluştu');
      console.error('Delete customer error:', error);
    }
  };

  // Inline delete confirmation
  const confirmDeleteInline = async () => {
    if (!editingCustomer) return;
    try {
      setDeletingInline(true);
      await customerAPI.delete(editingCustomer.id);
      setDialogOpen(false);
      setEditingCustomer(null);
      await loadData();
    } catch (error) {
      console.error('Inline delete error:', error);
      const backendMessage = error?.response?.data?.message || error?.response?.data?.error || 'Müşteri silinirken hata oluştu';
      setError(backendMessage);
    } finally {
      setDeletingInline(false);
    }
  };

  // Get risk status name by ID
  const getRiskStatusName = (riskStatusId) => {
    const riskStatus = riskStatuses.find(rs => rs.id === riskStatusId);
    return riskStatus ? riskStatus.name : 'Bilinmiyor';
  };

  // Get risk status color by ID
  const getRiskStatusColor = (riskStatusId) => {
    switch (riskStatusId) {
      case 1: // Düşük Risk
        return 'success';
      case 2: // Orta Risk
        return 'warning';
      case 3: // Yüksek Risk
        return 'error';
      case 4: // Kara Liste
        return 'error';
      default:
        return 'default';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
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
            Müşteri Listesi
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCustomer}
            sx={{ px: 3 }}
          >
            Yeni Müşteri Ekle
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
                  label="Ara"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Müşteri adı, vergi no, iletişim kişisi..."
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Risk Durumu</InputLabel>
                  <Select
                    value={filterRiskStatus}
                    onChange={(e) => setFilterRiskStatus(e.target.value)}
                    label="Risk Durumu"
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    {riskStatuses.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={status.name}
                            color={getRiskStatusColor(status.id)}
                            size="small"
                            variant={status.id === 4 ? "filled" : "outlined"}
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Kara Liste Durumu</InputLabel>
                  <Select
                    value={filterBlacklisted}
                    onChange={(e) => setFilterBlacklisted(e.target.value)}
                    label="Kara Liste Durumu"
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    <MenuItem value="true">Kara Listede</MenuItem>
                    <MenuItem value="false">Kara Listede Değil</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {filteredCustomers.length} müşteri bulundu
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Customer Table */}
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Müşteri Adı</strong></TableCell>
                <TableCell><strong>Vergi No</strong></TableCell>
                <TableCell><strong>İletişim Kişisi</strong></TableCell>
                <TableCell><strong>Telefon</strong></TableCell>
                <TableCell><strong>Risk Durumu</strong></TableCell>
                <TableCell><strong>Kredi Limiti</strong></TableCell>
                <TableCell><strong>Durum</strong></TableCell>
                <TableCell><strong>Kayıt Tarihi</strong></TableCell>
                <TableCell><strong>İşlemler</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {customer.name}
                      </Typography>
                      {customer.address && (
                        <Typography variant="caption" color="text.secondary">
                          {customer.address}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{customer.taxNo || '-'}</TableCell>
                  <TableCell>{customer.contactName || '-'}</TableCell>
                  <TableCell>{customer.phoneNumber || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getRiskStatusName(customer.riskStatusId)}
                      color={getRiskStatusColor(customer.riskStatusId)}
                      size="small"
                      variant={customer.riskStatusId === 4 ? "filled" : "outlined"}
                    />
                  </TableCell>
                  <TableCell>
                    {customer.creditLimit ? 
                      `${customer.creditLimit.toLocaleString('tr-TR')} ₺` : 
                      '-'
                    }
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {customer.isBlacklisted && (
                        <Chip 
                          icon={<WarningIcon />}
                          label="Kara Liste"
                          color="error"
                          size="small"
                        />
                      )}
                      {customer.isInLawsuit && (
                        <Chip 
                          icon={<LawsuitIcon />}
                          label="Dava"
                          color="warning"
                          size="small"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(customer.createdAt)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditCustomer(customer)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCustomer(customer)}
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

        {/* Add/Edit Customer Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingCustomer ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Müşteri Adı *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vergi No"
                  name="taxNo"
                  value={formData.taxNo}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="İletişim Kişisi"
                  name="contactName"
                  value={formData.contactName}
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!formErrors.riskStatusId}>
                  <InputLabel>Risk Durumu *</InputLabel>
                  <Select
                    name="riskStatusId"
                    value={formData.riskStatusId}
                    onChange={handleInputChange}
                    label="Risk Durumu *"
                  >
                    {console.log('Risk statuses in form:', riskStatuses)}
                    {riskStatuses.length > 0 ? (
                      riskStatuses.map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={status.name}
                              color={getRiskStatusColor(status.id)}
                              size="small"
                              variant={status.id === 4 ? "filled" : "outlined"}
                            />
                          </Box>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Risk durumları yükleniyor...</MenuItem>
                    )}
                  </Select>
                  {formErrors.riskStatusId && (
                    <Typography variant="caption" color="error">
                      {formErrors.riskStatusId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kredi Limiti (₺)"
                  name="creditLimit"
                  type="number"
                  value={formData.creditLimit}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isBlacklisted"
                      checked={formData.isBlacklisted}
                      onChange={handleInputChange}
                      color="error"
                    />
                  }
                  label="Kara Listede"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isInLawsuit"
                      checked={formData.isInLawsuit}
                      onChange={handleInputChange}
                      color="warning"
                    />
                  }
                  label="Davada"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {editingCustomer && (
              <Button
                onClick={confirmDeleteInline}
                color="error"
                disabled={saving || deletingInline}
                sx={{ mr: 'auto' }}
              >
                {deletingInline ? 'Siliniyor...' : 'Sil'}
              </Button>
            )}
            <Button onClick={() => setDialogOpen(false)} disabled={saving || deletingInline}>İptal</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={saving || deletingInline}>
              {saving ? (editingCustomer ? 'Güncelleniyor...' : 'Kaydediliyor...') : (editingCustomer ? 'Güncelle' : 'Kaydet')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Müşteri Sil</DialogTitle>
          <DialogContent>
            <Typography>
              "{customerToDelete?.name}" müşterisini silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
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

export default CustomerList;