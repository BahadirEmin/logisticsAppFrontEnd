import React from 'react';
import { TextField } from '@mui/material';
import { shouldFormatField, handleNumberInput } from '../utils/numberFormatter';

/**
 * Enhanced TextField component with automatic number formatting
 * Automatically detects and formats numeric fields based on field names
 */
const FormattedTextField = ({ name, value, onChange, forceFormat = null, ...otherProps }) => {
  const shouldFormat = forceFormat !== null ? forceFormat : shouldFormatField(name);

  const handleChange = e => {
    const inputValue = e.target.value;

    if (shouldFormat) {
      const formatted = handleNumberInput(inputValue);
      // Create a synthetic event with formatted value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
        },
      };
      onChange(syntheticEvent);
    } else {
      onChange(e);
    }
  };

  // Additional props for numeric fields
  const numericProps = shouldFormat
    ? {
        inputProps: {
          inputMode: 'numeric',
          pattern: '[0-9.]*',
          ...otherProps.inputProps,
        },
      }
    : {};

  return (
    <TextField
      {...otherProps}
      {...numericProps}
      name={name}
      value={value || ''}
      onChange={handleChange}
    />
  );
};

export default FormattedTextField;
