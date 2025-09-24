import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.white};
  font-size: ${theme.typography.sizes.body};
  transition: all 0.3s ease;

  &::placeholder {
    color: ${theme.colors.neutral.mediumGray};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.red};
    box-shadow: 0 0 0 2px rgba(254, 66, 46, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const masks = {
  phone: '(99) 99999-9999',
  cpf: '999.999.999-99',
  cep: '99999-999',
  cnpj: '99.999.999/9999-99'
};

const applyMask = (value, mask) => {
  if (!value || !mask) return '';
  
  const cleanValue = value.replace(/\D/g, '');
  if (!cleanValue) return '';
  
  let maskedValue = '';
  let valueIndex = 0;
  
  for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
    if (mask[i] === '9') {
      maskedValue += cleanValue[valueIndex];
      valueIndex++;
    } else {
      maskedValue += mask[i];
    }
  }
  
  return maskedValue;
};

const removeMask = (value) => {
  return value ? value.replace(/\D/g, '') : '';
};

export const MaskedInput = ({ 
  mask, 
  value = '', 
  onChange, 
  placeholder,
  type = 'text',
  ...props 
}) => {
  const inputRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(() => {
    const maskPattern = typeof mask === 'string' ? mask : masks[mask];
    return value ? applyMask(value, maskPattern) : '';
  });

  useEffect(() => {
    const maskPattern = typeof mask === 'string' ? mask : masks[mask];
    setDisplayValue(value ? applyMask(value, maskPattern) : '');
  }, [value, mask]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const maskPattern = typeof mask === 'string' ? mask : masks[mask];
    
    // Remove caracteres não numéricos
    const cleanValue = removeMask(inputValue);
    
    // Aplica a máscara apenas se houver valor
    const maskedValue = cleanValue ? applyMask(cleanValue, maskPattern) : '';
    
    setDisplayValue(maskedValue);
    
    // Chama o onChange com o valor limpo
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: cleanValue,
          maskedValue: maskedValue
        }
      };
      onChange(syntheticEvent);
    }
  };

  const handleKeyDown = (e) => {
    // Permite teclas de controle
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Permite Ctrl+A, Ctrl+C, Ctrl+V, etc.
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    // Permite apenas números
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <StyledInput
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default MaskedInput;