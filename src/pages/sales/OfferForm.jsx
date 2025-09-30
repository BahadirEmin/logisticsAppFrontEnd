import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Divider,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward, ArrowBack, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { customerAPI } from '../../api/customers';
import { countriesAPI } from '../../api/countries';
import { ordersAPI } from '../../api/orders';
import { parseNumber } from '../../utils/numberFormatter';
import { useFormattedInput, useCargoFormattedInput } from '../../hooks/useFormattedInput';

const steps = ['Rota ve Yük Bilgileri', 'Bilgileri Onayla', 'Teklif Fiyatı ve Gönder'];

const cargoTypes = [
  'Genel Kargo',
  'Soğuk Zincir',
  'Tehlikeli Madde',
  'Konteyner',
  'Proje Yükü',
  'Ağır Nakliye',
  'Ekspres Kargo',
  'Parça Eşya'
];

const currencies = [
  { value: 'TRY', label: 'TL (Türk Lirası)', symbol: '₺' },
  { value: 'EUR', label: 'EURO', symbol: '€' },
  { value: 'USD', label: 'DOLAR', symbol: '$' },
  { value: 'GBP', label: 'STERLİN', symbol: '£' }
];

const OfferForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Customer selection
    customerId: '',
    
    // Step 1: Route and Cargo Info
    fromAddress: {
      country: 'Türkiye',
      city: '',
      district: '',
      address: '',
      zipCode: '',
      contactPerson: '',
      phone: '',
      email: ''
    },
    toAddress: {
      country: 'Türkiye',
      city: '',
      district: '',
      address: '',
      zipCode: '',
      contactPerson: '',
      phone: '',
      email: ''
    },
    // Cargo items array for multiple cargo support
    cargoItems: [
      {
        id: 1,
        dimensions: {
          length: '',
          width: '',
          height: ''
        },
        cargoType: '',
        weight: '',
        description: ''
      }
    ],
    transferable: false,
    
    // Step 2: Additional Info (will be added)
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    specialRequirements: '',
    
    // Step 3: Pricing
    quotePrice: ''
  });

  const [errors, setErrors] = useState({});

  // Use custom hooks for formatted input handling
  const { handleInputChange } = useFormattedInput(setFormData, setErrors);
  const { handleCargoItemChange } = useCargoFormattedInput(setFormData);

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
    loadCountries();
  }, []);

  // Reload customers when page becomes visible (user returns from customer list page)
  useEffect(() => {
    const handleFocus = () => {
      loadCustomers();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        loadCustomers();
      }
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const customersData = await customerAPI.getAll();
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCountries = async () => {
    try {
      const countriesData = await countriesAPI.getActive();
      
      // Ülkeleri Türkçe isme göre alfabetik sıraya koy
      const sortedCountries = countriesData
        .filter(country => country.isActive && country.countryNameTr && country.countryNameTr !== 'DİĞER')
        .sort((a, b) => a.countryNameTr.localeCompare(b.countryNameTr, 'tr', { sensitivity: 'base' }));
      
      // "DİĞER" seçeneğini en sona ekle (varsa)
      const otherCountry = countriesData.find(country => country.countryNameTr === 'DİĞER');
      if (otherCountry) {
        sortedCountries.push(otherCountry);
      }
      
      setCountries(sortedCountries);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    setFormData(prev => ({
      ...prev,
      customerId
    }));

    // Auto-fill customer information if customer is selected
    if (customerId) {
      const selectedCustomer = customers.find(c => c.id === customerId);
      if (selectedCustomer) {
        setFormData(prev => ({
          ...prev,
          customerId,
          customerName: selectedCustomer.name,
          customerPhone: selectedCustomer.phoneNumber || '',
          customerEmail: selectedCustomer.email || ''
        }));
      }
    }

    // Clear error when user selects
    if (errors.customerId) {
      setErrors(prev => ({
        ...prev,
        customerId: ''
      }));
    }
  };



  // Add new cargo item
  const addCargoItem = () => {
    setFormData(prev => ({
      ...prev,
      cargoItems: [
        ...prev.cargoItems,
        {
          id: Date.now(),
          dimensions: { length: '', width: '', height: '' },
          cargoType: '',
          weight: '',
          description: ''
        }
      ]
    }));
  };

  // Remove cargo item
  const removeCargoItem = (index) => {
    if (formData.cargoItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        cargoItems: prev.cargoItems.filter((_, i) => i !== index)
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    // Validate customer selection
    if (!formData.customerId) {
      newErrors.customerId = 'Müşteri seçimi zorunludur';
    }
    
    // Validate from address - Zorunlu alanlar: Ülke, Şehir, Posta kodu
    if (!formData.fromAddress.country.trim()) {
      newErrors['fromAddress.country'] = 'Kalkış ülkesi seçimi zorunludur';
    }
    if (!formData.fromAddress.city.trim()) {
      newErrors['fromAddress.city'] = 'Kalkış şehri zorunludur';
    }
    if (!formData.fromAddress.zipCode.trim()) {
      newErrors['fromAddress.zipCode'] = 'Kalkış posta kodu zorunludur';
    }
    
    // Validate to address - Zorunlu alanlar: Ülke, Şehir, Posta kodu
    if (!formData.toAddress.country.trim()) {
      newErrors['toAddress.country'] = 'Varış ülkesi seçimi zorunludur';
    }
    if (!formData.toAddress.city.trim()) {
      newErrors['toAddress.city'] = 'Varış şehri zorunludur';
    }
    if (!formData.toAddress.zipCode.trim()) {
      newErrors['toAddress.zipCode'] = 'Varış posta kodu zorunludur';
    }
    
    // Validate cargo items - Zorunlu alanlar: Ölçüler, Yük tipi, Ağırlık
    formData.cargoItems.forEach((item, index) => {
      if (!item.dimensions.length || !item.dimensions.width || !item.dimensions.height) {
        newErrors[`cargoItems.${index}.dimensions`] = 'Tüm ölçü alanları zorunludur (uzunluk, genişlik, yükseklik)';
      }
      if (!item.cargoType) {
        newErrors[`cargoItems.${index}.cargoType`] = 'Yük tipi seçimi zorunludur';
      }
      if (!item.weight || parseFloat(parseNumber(item.weight)) <= 0) {
        newErrors[`cargoItems.${index}.weight`] = 'Geçerli bir ağırlık giriniz';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateStep1()) {
      return;
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Calculate total weight from all cargo items
      const totalWeight = formData.cargoItems.reduce((sum, item) => {
        return sum + parseFloat(parseNumber(item.weight) || 0);
      }, 0);
      
      // Prepare order data with cargo items
      const orderData = {
        customerId: parseInt(formData.customerId),
        
        // Departure address details
        departureCountry: formData.fromAddress.country,
        departureCity: formData.fromAddress.city,
        departureDistrict: formData.fromAddress.district || null,
        departurePostalCode: formData.fromAddress.zipCode || null,
        departureAddress: formData.fromAddress.address,
        departureZipCode: formData.fromAddress.zipCode,
        arrivalCountry: formData.toAddress.country,
        arrivalCity: formData.toAddress.city,
        arrivalDistrict: formData.toAddress.district || null,
        arrivalPostalCode: formData.toAddress.zipCode || null,
        arrivalAddress: formData.toAddress.address,
        arrivalZipCode: formData.toAddress.zipCode,
        cargoWeightKg: totalWeight,
        cargoType: formData.cargoItems[0]?.cargoType || '',
        canTransfer: formData.transferable,
        cargoItems: formData.cargoItems.map(item => ({
          dimensions: {
            length: parseFloat(item.dimensions.length || 0),
            width: parseFloat(item.dimensions.width || 0),
            height: parseFloat(item.dimensions.height || 0)
          },
          cargoType: item.cargoType,
          weight: parseFloat(parseNumber(item.weight) || 0),
          description: item.description
        })),
        estimatedPrice: parseFloat(parseNumber(formData.estimatedPrice) || 0),
        currency: formData.currency
      };
      
      console.log('Order data being sent:', orderData);
      
      // Create order
      const response = await ordersAPI.create(orderData);
      console.log('Order created successfully:', response);
      
      // Success - redirect to offers list
      navigate('/sales/tekliflerim');
    } catch (error) {
      console.error('Teklif gönderme hatası:', error);
      // You can add error handling here (show error message to user)
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Rota ve Yük Bilgileri
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <strong>Önemli:</strong> Ülke, şehir, posta kodu ve yük ölçüleri (uzunluk, genişlik, yükseklik) ile yük tipi ve ağırlığı zorunlu alanlardir. 
        Bu bilgiler diğer satışçıların benzer işler için fiyat referansı görebilmesi açısından gereklidir.
      </Typography>
      
      {/* Customer Selection */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#1976d2' }}>
            Müşteri Seçimi
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate('/sales/musteriler')}
            sx={{ minWidth: 'auto' }}
          >
            Müşteri Ekle
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.customerId} size="small">
              <InputLabel>Müşteri Seçin</InputLabel>
              <Select
                name="customerId"
                value={formData.customerId}
                onChange={handleCustomerChange}
                label="Müşteri Seçin"
                disabled={loading}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    <Box>
                      <Typography variant="body1">
                        {customer.name}
                      </Typography>
                      {customer.taxNo && (
                        <Typography variant="caption" color="text.secondary">
                          Vergi No: {customer.taxNo}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.customerId && (
                <Typography variant="caption" color="error">
                  {errors.customerId}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          {formData.customerId && (
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#fafafa' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Seçilen Müşteri Bilgileri:
                </Typography>
                {(() => {
                  const selectedCustomer = customers.find(c => c.id === formData.customerId);
                  return selectedCustomer ? (
                    <Box>
                      <Typography variant="body2">
                        <strong>Ad:</strong> {selectedCustomer.name}
                      </Typography>
                      {selectedCustomer.contactName && (
                        <Typography variant="body2">
                          <strong>İletişim:</strong> {selectedCustomer.contactName}
                        </Typography>
                      )}
                      {selectedCustomer.phoneNumber && (
                        <Typography variant="body2">
                          <strong>Telefon:</strong> {selectedCustomer.phoneNumber}
                        </Typography>
                      )}
                      {selectedCustomer.address && (
                        <Typography variant="body2">
                          <strong>Adres:</strong> {selectedCustomer.address}
                        </Typography>
                      )}
                    </Box>
                  ) : null;
                })()}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      {/* From Address */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1976d2' }}>
          Nereden (Alış Adresi) - Ülke, Şehir, Posta Kodu Zorunlu
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth error={!!errors['fromAddress.country']} size="small">
              <InputLabel>Ülke</InputLabel>
              <Select
                name="fromAddress.country"
                value={formData.fromAddress.country}
                onChange={handleInputChange}
                label="Ülke"
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.countryNameTr}>
                    {country.countryNameTr}
                  </MenuItem>
                ))}
              </Select>
              {errors['fromAddress.country'] && (
                <Typography variant="caption" color="error">
                  {errors['fromAddress.country']}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Şehir"
              name="fromAddress.city"
              value={formData.fromAddress.city}
              onChange={handleInputChange}
              required
              error={!!errors['fromAddress.city']}
              helperText={errors['fromAddress.city']}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="İlçe"
              name="fromAddress.district"
              value={formData.fromAddress.district}
              onChange={handleInputChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Posta Kodu"
              name="fromAddress.zipCode"
              value={formData.fromAddress.zipCode}
              onChange={handleInputChange}
              required
              error={!!errors['fromAddress.zipCode']}
              helperText={errors['fromAddress.zipCode']}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Açık Adres"
              name="fromAddress.address"
              value={formData.fromAddress.address}
              onChange={handleInputChange}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="İletişim Kişisi"
              name="fromAddress.contactPerson"
              value={formData.fromAddress.contactPerson}
              onChange={handleInputChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Telefon"
              name="fromAddress.phone"
              value={formData.fromAddress.phone}
              onChange={handleInputChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="E-posta"
              name="fromAddress.email"
              type="email"
              value={formData.fromAddress.email}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      {/* To Address */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1976d2' }}>
          Nereye (Teslimat Adresi) - Ülke, Şehir, Posta Kodu Zorunlu
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth error={!!errors['toAddress.country']} size="small">
              <InputLabel>Ülke</InputLabel>
              <Select
                name="toAddress.country"
                value={formData.toAddress.country}
                onChange={handleInputChange}
                label="Ülke"
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.countryNameTr}>
                    {country.countryNameTr}
                  </MenuItem>
                ))}
              </Select>
              {errors['toAddress.country'] && (
                <Typography variant="caption" color="error">
                  {errors['toAddress.country']}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Şehir"
              name="toAddress.city"
              value={formData.toAddress.city}
              onChange={handleInputChange}
              required
              error={!!errors['toAddress.city']}
              helperText={errors['toAddress.city']}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="İlçe"
              name="toAddress.district"
              value={formData.toAddress.district}
              onChange={handleInputChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Posta Kodu"
              name="toAddress.zipCode"
              value={formData.toAddress.zipCode}
              onChange={handleInputChange}
              required
              error={!!errors['toAddress.zipCode']}
              helperText={errors['toAddress.zipCode']}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Açık Adres"
              name="toAddress.address"
              value={formData.toAddress.address}
              onChange={handleInputChange}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="İletişim Kişisi"
              name="toAddress.contactPerson"
              value={formData.toAddress.contactPerson}
              onChange={handleInputChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Telefon"
              name="toAddress.phone"
              value={formData.toAddress.phone}
              onChange={handleInputChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="E-posta"
              name="toAddress.email"
              type="email"
              value={formData.toAddress.email}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Cargo Items */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
            Yük Bilgileri - Ölçüler, Tip ve Ağırlık Zorunlu
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={addCargoItem}
            startIcon={<AddIcon />}
          >
            Yük Ekle
          </Button>
        </Box>
        
        {formData.cargoItems.map((item, index) => (
          <Paper key={item.id} elevation={1} sx={{ p: 3, mb: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" color="primary">
                Yük {index + 1}
              </Typography>
              {formData.cargoItems.length > 1 && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeCargoItem(index)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            {/* Cargo Dimensions - Zorunlu Alanlar */}
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Yük Ölçüleri *
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Uzunluk (cm)"
                  type="number"
                  value={item.dimensions.length}
                  onChange={(e) => handleCargoItemChange(index, 'dimensions.length', e.target.value)}
                  required
                  error={!!errors[`cargoItems.${index}.dimensions`]}
                  helperText={errors[`cargoItems.${index}.dimensions`] && "Uzunluk gerekli"}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Genişlik (cm)"
                  type="number"
                  value={item.dimensions.width}
                  onChange={(e) => handleCargoItemChange(index, 'dimensions.width', e.target.value)}
                  required
                  error={!!errors[`cargoItems.${index}.dimensions`]}
                  helperText={errors[`cargoItems.${index}.dimensions`] && "Genişlik gerekli"}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Yükseklik (cm)"
                  type="number"
                  value={item.dimensions.height}
                  onChange={(e) => handleCargoItemChange(index, 'dimensions.height', e.target.value)}
                  required
                  error={!!errors[`cargoItems.${index}.dimensions`]}
                  helperText={errors[`cargoItems.${index}.dimensions`] && "Yükseklik gerekli"}
                />
              </Grid>
            </Grid>

            {/* Cargo Type and Weight - Zorunlu Alanlar */}
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Yük Detayları *
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormControl fullWidth size="small" error={!!errors[`cargoItems.${index}.cargoType`]} required>
                  <InputLabel>Yük Tipi *</InputLabel>
                  <Select
                    value={item.cargoType}
                    onChange={(e) => handleCargoItemChange(index, 'cargoType', e.target.value)}
                    label="Yük Tipi *"
                  >
                    {cargoTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors[`cargoItems.${index}.cargoType`] && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors[`cargoItems.${index}.cargoType`]}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Ağırlık (kg)"
                  value={item.weight}
                  onChange={(e) => handleCargoItemChange(index, 'weight', e.target.value)}
                  required
                  error={!!errors[`cargoItems.${index}.weight`]}
                  helperText={errors[`cargoItems.${index}.weight`]}
                />
              </Grid>
            </Grid>

            {/* Cargo Description - Opsiyonel */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Yük Açıklaması"
                  multiline
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleCargoItemChange(index, 'description', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
      
      {/* Transfer Option */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1976d2' }}>
          Aktarma Seçenekleri
        </Typography>
        <FormControlLabel
          control={
            <Switch
              name="transferable"
              checked={formData.transferable}
              onChange={handleInputChange}
              color="primary"
            />
          }
          label="Aktarma Yapılabilir mi?"
        />
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
          Yük aktarma noktalarında başka araçlara aktarılabilir mi?
        </Typography>
      </Box>
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Bilgileri Onayla
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Müşteri Bilgileri
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {(() => {
            const selectedCustomer = customers.find(c => c.id === formData.customerId);
            return selectedCustomer ? (
              <>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Müşteri Adı:</Typography>
                  <Typography variant="body1">{selectedCustomer.name}</Typography>
                </Grid>
                {selectedCustomer.taxNo && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Vergi No:</Typography>
                    <Typography variant="body1">{selectedCustomer.taxNo}</Typography>
                  </Grid>
                )}
                {selectedCustomer.contactName && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">İletişim Kişisi:</Typography>
                    <Typography variant="body1">{selectedCustomer.contactName}</Typography>
                  </Grid>
                )}
                {selectedCustomer.phoneNumber && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Telefon:</Typography>
                    <Typography variant="body1">{selectedCustomer.phoneNumber}</Typography>
                  </Grid>
                )}
                {selectedCustomer.address && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Adres:</Typography>
                    <Typography variant="body1">{selectedCustomer.address}</Typography>
                  </Grid>
                )}
              </>
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary">Müşteri seçilmedi</Typography>
              </Grid>
            );
          })()}
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom color="primary">
          Alış Adresi (Nereden)
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Ülke:</Typography>
            <Typography variant="body1">{formData.fromAddress.country}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Şehir:</Typography>
            <Typography variant="body1">{formData.fromAddress.city}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">İlçe:</Typography>
            <Typography variant="body1">{formData.fromAddress.district || '-'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Posta Kodu:</Typography>
            <Typography variant="body1">{formData.fromAddress.zipCode || '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Açık Adres:</Typography>
            <Typography variant="body1">{formData.fromAddress.address}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">İletişim Kişisi:</Typography>
            <Typography variant="body1">{formData.fromAddress.contactPerson}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Telefon:</Typography>
            <Typography variant="body1">{formData.fromAddress.phone}</Typography>
          </Grid>
          {formData.fromAddress.email && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">E-posta:</Typography>
              <Typography variant="body1">{formData.fromAddress.email}</Typography>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom color="primary">
          Teslimat Adresi (Nereye)
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Ülke:</Typography>
            <Typography variant="body1">{formData.toAddress.country}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Şehir:</Typography>
            <Typography variant="body1">{formData.toAddress.city}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">İlçe:</Typography>
            <Typography variant="body1">{formData.toAddress.district || '-'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Posta Kodu:</Typography>
            <Typography variant="body1">{formData.toAddress.zipCode || '-'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Açık Adres:</Typography>
            <Typography variant="body1">{formData.toAddress.address}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">İletişim Kişisi:</Typography>
            <Typography variant="body1">{formData.toAddress.contactPerson}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Telefon:</Typography>
            <Typography variant="body1">{formData.toAddress.phone}</Typography>
          </Grid>
          {formData.toAddress.email && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">E-posta:</Typography>
              <Typography variant="body1">{formData.toAddress.email}</Typography>
            </Grid>
          )}
        </Grid>
        
        <Typography variant="h6" gutterBottom color="primary">
          Yük Bilgileri
        </Typography>
        {formData.cargoItems.map((item, index) => (
          <Box key={item.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Yük {index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Ölçüler:</Typography>
                <Typography variant="body1">
                  {item.dimensions.length} x {item.dimensions.width} x {item.dimensions.height} cm
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Ağırlık:</Typography>
                <Typography variant="body1">{item.weight} kg</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Yük Tipi:</Typography>
                <Typography variant="body1">{item.cargoType}</Typography>
              </Grid>
              {item.description && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Açıklama:</Typography>
                  <Typography variant="body1">{item.description}</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        ))}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Toplam Ağırlık:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {formData.cargoItems.reduce((sum, item) => sum + parseFloat(parseNumber(item.weight) || 0), 0)} kg
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Aktarma:</Typography>
            <Typography variant="body1">
              {formData.transferable ? 'Evet' : 'Hayır'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Bilgileri kontrol edin. Bir sonraki adımda teklif gönderilecektir.
      </Alert>
    </Box>
  );

  const renderStep3 = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Teklif Fiyatı ve Gönder
        Teklif Fiyatı ve Gönder
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Fiyat Bilgileri
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label="Teklif Fiyatı"
              value={formData.estimatedPrice}
              onChange={handleInputChange}
              name="estimatedPrice"
              InputProps={{
                endAdornment: (
                  <Box sx={{ ml: 1 }}>
                    {currencies.find(c => c.value === formData.currency)?.symbol || '₺'}
                  </Box>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Para Birimi</InputLabel>
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                label="Para Birimi"
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.value} value={currency.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ mr: 1 }}>
                        {currency.symbol}
                      </Typography>
                      {currency.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Bilgi:</strong> Boş bıraktığınız alanları teklif gönderildikten sonra da doldurabilirsiniz. 
          Fiyat bilgisini girmezseniz, operasyon ekibi daha sonra fiyat belirleyebilir.
        </Typography>
      </Alert>
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Önemli:</strong> Teklif gönderildikten sonra durumunu sadece görüntüleyebilecek, değiştiremeyeceksiniz. 
          Durum değişiklikleri operasyon ekibi tarafından yapılacaktır.
        </Typography>
      </Alert>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, ml: 0 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2', mb: 4 }}>
          Yeni Teklif Oluştur
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 4, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            Geri
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                endIcon={submitting ? <CircularProgress size={20} /> : <ArrowForward />}
              >
                {submitting ? 'Gönderiliyor...' : 'Teklifi Gönder'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
              >
                İleri
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OfferForm;