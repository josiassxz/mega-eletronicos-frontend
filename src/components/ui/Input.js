
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  color: ${theme.colors.neutral.lightGray};
  font-size: ${theme.typography.sizes.small};
  font-weight: ${theme.typography.weights.medium};
`;

export const Input = styled.input`
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
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.1);
    color: ${theme.colors.neutral.darkGray};
    cursor: not-allowed;
  }

  ${props => props.$hasError && `
    border-color: ${theme.colors.accent.red};
    box-shadow: 0 0 0 2px rgba(254, 66, 46, 0.2);
  `}
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.white};
  font-size: ${theme.typography.sizes.body};
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.red};
    box-shadow: 0 0 0 2px rgba(254, 66, 46, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  option {
    background: ${theme.colors.primary.dark};
    color: ${theme.colors.neutral.white};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.white};
  font-size: ${theme.typography.sizes.body};
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
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
`;

export const ErrorMessage = styled.span`
  display: block;
  color: ${theme.colors.accent.red};
  font-size: ${theme.typography.sizes.small};
  margin-top: ${theme.spacing.xs};
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    color: ${theme.colors.neutral.mediumGray};
    z-index: 1;
  }

  ${Input} {
    padding-left: 40px;
  }
`;
