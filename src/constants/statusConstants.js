import React from 'react';
import {
  Schedule,
  CheckCircle,
  LocalShipping,
  Assignment,
} from '@mui/icons-material';

// Status constants - Tüm kodda kullanılacak standart status yapısı
export const STATUS_OPTIONS = [
  { value: 'TEKLIF_ASAMASI', label: 'Teklif Aşaması', color: 'warning', icon: <Schedule /> },
  { value: 'ONAYLANAN_TEKLIF', label: 'Onaylanan Teklif', color: 'success', icon: <CheckCircle /> },
  { value: 'YOLA_CIKTI', label: 'Yola Çıktı', color: 'info', icon: <LocalShipping /> },
  { value: 'GUMRUKTE', label: 'Gümrükte', color: 'warning', icon: <Schedule /> },
  { value: 'TESLIM_EDILDI', label: 'Teslim Edildi', color: 'success', icon: <CheckCircle /> },
  { value: 'REDDEDILDI', label: 'Reddedildi', color: 'error', icon: <Schedule /> },
  { value: 'IPTAL_EDILDI', label: 'İptal Edildi', color: 'error', icon: <Schedule /> },
];

// Operator specific status options (bazı sayfalar için farklı status değerleri kullanıyor)
export const OPERATOR_STATUS_OPTIONS = [
  { value: 'BEKLEMEDE', label: 'Beklemede', color: 'default', icon: <Schedule /> },
  { value: 'ISLEME_ALINDI', label: 'İşleme Alındı', color: 'info', icon: <Assignment /> },
  { value: 'ONAYLANDI', label: 'Onaylandı', color: 'success', icon: <CheckCircle /> },
  { value: 'YOLA_CIKTI', label: 'Yola Çıktı', color: 'primary', icon: <LocalShipping /> },
  { value: 'GUMRUKTE', label: 'Gümrükte', color: 'warning', icon: <Schedule /> },
  { value: 'TAMAMLANDI', label: 'Tamamlandı', color: 'success', icon: <CheckCircle /> },
  { value: 'IPTAL_EDILDI', label: 'İptal Edildi', color: 'error', icon: <Schedule /> },
];

// Status enum values
export const STATUS_VALUES = {
  TEKLIF_ASAMASI: 'TEKLIF_ASAMASI',
  ONAYLANAN_TEKLIF: 'ONAYLANAN_TEKLIF', 
  YOLA_CIKTI: 'YOLA_CIKTI',
  GUMRUKTE: 'GUMRUKTE',
  TESLIM_EDILDI: 'TESLIM_EDILDI',
  REDDEDILDI: 'REDDEDILDI',
  IPTAL_EDILDI: 'IPTAL_EDILDI',
  // Operator specific values
  BEKLEMEDE: 'BEKLEMEDE',
  ISLEME_ALINDI: 'ISLEME_ALINDI',
  ONAYLANDI: 'ONAYLANDI',
  TAMAMLANDI: 'TAMAMLANDI',
};

// Helper functions
export const getStatusColor = (status) => {
  const statusOption = STATUS_OPTIONS.find(option => option.value === status) ||
                      OPERATOR_STATUS_OPTIONS.find(option => option.value === status);
  return statusOption ? statusOption.color : 'default';
};

export const getStatusLabel = (status) => {
  const statusOption = STATUS_OPTIONS.find(option => option.value === status) ||
                      OPERATOR_STATUS_OPTIONS.find(option => option.value === status);
  return statusOption ? statusOption.label : status;
};

export const getStatusIcon = (status) => {
  const statusOption = STATUS_OPTIONS.find(option => option.value === status) ||
                      OPERATOR_STATUS_OPTIONS.find(option => option.value === status);
  return statusOption ? statusOption.icon : <Schedule />;
};
