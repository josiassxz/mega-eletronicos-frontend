import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: ${theme.spacing.xl};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.large};
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: ${theme.colors.accent.red};
  font-size: ${theme.typography.sizes.large};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.neutral.lightGray};
  font-size: ${theme.typography.sizes.body};
  margin-bottom: ${theme.spacing.lg};
  max-width: 500px;
  line-height: 1.6;
`;

const RetryButton = styled.button`
  background: ${theme.colors.accent.red};
  color: ${theme.colors.neutral.white};
  border: none;
  padding: 12px 24px;
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.sizes.body};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.accent.darkRed};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Oops! Algo deu errado</ErrorTitle>
          <ErrorMessage>
            Ocorreu um erro inesperado na aplicação. Tente recarregar a página ou entre em contato com o suporte se o problema persistir.
          </ErrorMessage>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              color: theme.colors.neutral.mediumGray, 
              fontSize: '12px', 
              marginBottom: theme.spacing.md,
              textAlign: 'left',
              maxWidth: '600px',
              overflow: 'auto'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                Detalhes do erro (desenvolvimento)
              </summary>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <RetryButton onClick={this.handleRetry}>
            Tentar Novamente
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;