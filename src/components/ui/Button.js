
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Button = styled.button`
  background: ${theme.colors.accent.red};
  color: ${theme.colors.neutral.white};
  border: none;
  border-radius: ${theme.borderRadius.pill};
  padding: 12px 32px;
  font-size: ${theme.typography.sizes.body};
  font-weight: ${theme.typography.weights.semiBold};
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  text-decoration: none;

  &:hover {
    background: ${theme.colors.accent.redHover};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${theme.colors.neutral.darkGray};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  ${props => props.variant === 'secondary' && `
    background: transparent;
    border: 2px solid ${theme.colors.neutral.lightGray};
    color: ${theme.colors.neutral.lightGray};
    
    &:hover {
      background: ${theme.colors.neutral.lightGray};
      color: ${theme.colors.primary.dark};
      transform: translateY(-2px);
    }
  `}

  ${props => props.size === 'large' && `
    padding: 16px 40px;
    font-size: ${theme.typography.sizes.h3};
  `}

  ${props => props.size === 'small' && `
    padding: 8px 16px;
    font-size: ${theme.typography.sizes.small};
  `}
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.neutral.lightGray};
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${theme.colors.neutral.white};
  }
`;
