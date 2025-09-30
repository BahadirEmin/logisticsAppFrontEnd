import { useCallback } from 'react';
import { shouldFormatField, handleNumberInput } from '../utils/numberFormatter';

/**
 * Custom hook for handling form inputs with automatic number formatting
 * Usage: const { handleInputChange } = useFormattedInput(setFormData, setErrors);
 */
export const useFormattedInput = (setFormData, setErrors = null) => {
  const handleInputChange = useCallback(
    e => {
      const { name, value, checked, type } = e.target;
      let processedValue = value;

      // Format numeric fields with thousands separator using global utility
      if (type !== 'checkbox' && shouldFormatField(name)) {
        processedValue = handleNumberInput(value);
      }

      // Handle nested object properties (e.g., "fromAddress.city")
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : processedValue,
          },
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : processedValue,
        }));
      }

      // Clear error when user types (if setErrors is provided)
      if (setErrors && name) {
        setErrors(prev => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [setFormData, setErrors]
  );

  return { handleInputChange };
};

/**
 * Custom hook for handling cargo item changes with automatic number formatting
 * Usage: const { handleCargoItemChange } = useCargoFormattedInput(setFormData);
 */
export const useCargoFormattedInput = setFormData => {
  const handleCargoItemChange = useCallback(
    (index, field, value) => {
      let processedValue = value;

      // Format numeric fields with thousands separator using global utility
      if (shouldFormatField(field)) {
        processedValue = handleNumberInput(value);
      }

      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        setFormData(prev => ({
          ...prev,
          cargoItems: prev.cargoItems.map((item, i) =>
            i === index ? { ...item, [parent]: { ...item[parent], [child]: processedValue } } : item
          ),
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          cargoItems: prev.cargoItems.map((item, i) =>
            i === index ? { ...item, [field]: processedValue } : item
          ),
        }));
      }
    },
    [setFormData]
  );

  return { handleCargoItemChange };
};
