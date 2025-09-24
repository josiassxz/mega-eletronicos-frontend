
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    box-shadow: ${theme.shadows.medium};
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const CardTitle = styled.h3`
  color: ${theme.colors.neutral.white};
  font-size: ${theme.typography.sizes.h3};
  font-weight: ${theme.typography.weights.semiBold};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

export const CardContent = styled.div`
  color: ${theme.colors.neutral.lightGray};
`;

export const CardActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.sm};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;
