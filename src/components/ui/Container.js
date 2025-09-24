
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.md};
  width: 100%;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 ${theme.spacing.sm};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};
  align-items: start;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

export const Section = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transition: background-color 0.3s ease;
  }
`;
