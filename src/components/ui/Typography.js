
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Title = styled.h1`
  font-size: ${theme.typography.sizes.hero};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.h1};
  }
`;

export const Subtitle = styled.h2`
  font-size: ${theme.typography.sizes.h1};
  font-weight: ${theme.typography.weights.semiBold};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.h2};
  }
`;

export const SectionTitle = styled.h3`
  font-size: ${theme.typography.sizes.h2};
  font-weight: ${theme.typography.weights.semiBold};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  svg {
    color: ${theme.colors.accent.red};
  }
`;

export const Text = styled.p`
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.neutral.lightGray};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SmallText = styled.span`
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.neutral.mediumGray};
`;

export const Logo = styled.div`
  font-size: ${theme.typography.sizes.h2};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  text-transform: uppercase;
  letter-spacing: 1px;

  span {
    color: ${theme.colors.accent.red};
  }
`;
