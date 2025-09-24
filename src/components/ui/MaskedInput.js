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

const applyMask = (value, maskPattern) => {
  if (!value || !maskPattern) return '';
  
  const numbersOnly = String(value).replace(/\D/g, '');
  if (!numbersOnly) return '';
  
  let result = '';
  let numberIndex = 0;
  
  for (let i = 0; i < maskPattern.length && numberIndex < numbersOnly.length; i++) {
    if (maskPattern[i] === '9') {
      result += numbersOnly[numberIndex];
      numberIndex++;
    } else {
      result += maskPattern[i];
    }
  }
  
  return result;
};

const getOnlyNumbers = (value) => {
  return String(value || '').replace(/\D/g, '');
};

export const MaskedInput = ({ 
  mask, 
  value = '', 
  onChange, 
  placeholder,
  name,
  ...props 
}) => {
  // Obter o padrão da máscara
  const maskPattern = masks[mask] || '';
  
  // Estado para o valor exibido (com máscara)
  const [displayValue, setDisplayValue] = useState('');

  // Inicializar e sincronizar o valor exibido
  useEffect(() => {
    const numbersOnly = getOnlyNumbers(value);
    const formatted = numbersOnly ? applyMask(numbersOnly, maskPattern) : '';
    setDisplayValue(formatted);
  }, [value, maskPattern]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    
    // Extrair apenas números
    const numbersOnly = getOnlyNumbers(inputValue);
    
    // Aplicar máscara para exibição
    const formattedValue = numbersOnly ? applyMask(numbersOnly, maskPattern) : '';
    
    // Atualizar valor exibido
    setDisplayValue(formattedValue);
    
    // Notificar componente pai com números limpos
    if (onChange) {
      onChange({
        target: {
          name: name,
          value: numbersOnly
        }
      });
    }
  };

  const handleKeyDown = (e) => {
    // Teclas permitidas
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];
    
    // Permitir teclas de controle
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, etc.
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    // Permitir apenas dígitos
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <StyledInput
      type="text"
      name={name}
      value={displayValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default MaskedInput;