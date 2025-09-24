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
  name,
  ...props 
}) => {
  const inputRef = useRef(null);
  const maskPattern = typeof mask === 'string' ? mask : masks[mask] || '';
  
  const [internalValue, setInternalValue] = useState(() => {
    if (!value) return '';
    const cleanValue = removeMask(value);
    return applyMask(cleanValue, maskPattern);
  });

  useEffect(() => {
    if (!value) {
      setInternalValue('');
      return;
    }
    const cleanValue = removeMask(value);
    const maskedValue = applyMask(cleanValue, maskPattern);
    setInternalValue(maskedValue);
  }, [value, maskPattern]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    // Remove todos os caracteres não numéricos
    const numbersOnly = inputValue.replace(/\D/g, '');
    
    // Aplica a máscara
    const maskedValue = numbersOnly ? applyMask(numbersOnly, maskPattern) : '';
    
    // Atualiza o valor interno
    setInternalValue(maskedValue);
    
    // Chama o onChange do pai com o valor limpo
    if (onChange) {
      const event = {
        target: {
          name: name,
          value: numbersOnly
        }
      };
      onChange(event);
    }
  };

  const handleKeyDown = (e) => {
    // Permite teclas de controle
    const controlKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];
    
    if (controlKeys.includes(e.key)) {
      return;
    }
    
    // Permite Ctrl+A, Ctrl+C, Ctrl+V, etc.
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    // Bloqueia tudo que não seja número
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <StyledInput
      ref={inputRef}
      type="text"
      name={name}
      value={internalValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default MaskedInput;