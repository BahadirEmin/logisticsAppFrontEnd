/**
 * Global number formatting utilities
 * Provides consistent number formatting across the entire application
 */

// Format number with thousands separator (100000 -> 100.000)
export const formatNumber = (num) => {
  if (!num) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Parse formatted number back to plain number (100.000 -> 100000)
export const parseNumber = (str) => {
  if (!str) return '';
  return str.replace(/\./g, '');
};



// Handle input change with automatic number formatting
export const handleNumberInput = (value, shouldFormat = true) => {
  if (!shouldFormat) return value;
  
  const numericValue = value.replace(/[^0-9]/g, '');
  if (numericValue) {
    return formatNumber(numericValue);
  }
  return '';
};



// Check if field should be formatted as price/money
export const shouldFormatField = (fieldName) => {
  const priceFields = [
    'price', 'cost', 'amount', 'value', 'fiyat', 'tutar',
    'estimatedPrice', 'totalPrice', 'purchasePrice', 'currentValue',
    'satinAlmaFiyati', 'guncelDeger', 'deger'
  ];
  
  return priceFields.some(field => 
    fieldName.toLowerCase().includes(field.toLowerCase())
  );
};

// Format currency display
export const formatCurrency = (amount, currency = 'TRY', showSymbol = true) => {
  if (!amount) return showSymbol ? '0 ₺' : '0';
  
  const formatted = formatNumber(amount);
  
  if (!showSymbol) return formatted;
  
  const symbols = {
    'TRY': '₺',
    'EUR': '€', 
    'USD': '$',
    'GBP': '£'
  };
  
  const symbol = symbols[currency] || '₺';
  return `${formatted} ${symbol}`;
};

// Create enhanced TextField component props for number fields
export const getNumberFieldProps = (value, onChange, fieldName) => {
  const shouldFormat = shouldFormatField(fieldName);
  
  return {
    value: shouldFormat ? (value ? formatNumber(value.toString()) : '') : value,
    onChange: (e) => {
      const inputValue = e.target.value;
      if (shouldFormat) {
        const formatted = handleNumberInput(inputValue, true);
        onChange(formatted);
      } else {
        onChange(inputValue);
      }
    },
    inputProps: shouldFormat ? {
      inputMode: 'numeric',
      pattern: '[0-9.]*'
    } : {}
  };
};
