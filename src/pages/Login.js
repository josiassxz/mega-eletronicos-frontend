
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input, FormGroup, Label, InputGroup, ErrorMessage } from '../components/ui/Input';
import { Logo } from '../components/ui/Typography';
import { theme } from '../styles/theme';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.gradient.background};
  padding: ${theme.spacing.md};
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xl};
  width: 100%;
  max-width: 400px;
  box-shadow: ${theme.shadows.large};
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const LoginTitle = styled.h1`
  font-size: ${theme.typography.sizes.h1};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.sm};
`;

const LoginSubtitle = styled.p`
  color: ${theme.colors.neutral.lightGray};
  font-size: ${theme.typography.sizes.body};
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: ${theme.colors.neutral.mediumGray};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  
  &:hover {
    color: ${theme.colors.neutral.lightGray};
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.username)) {
      newErrors.username = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: 'Erro interno. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
        <LoginCard>
          <LoginHeader>
            <Logo>
              MEGA ELETRÔNICOS <span>GO</span>
            </Logo>
            <LoginTitle>Entrar</LoginTitle>
            <LoginSubtitle>Acesse sua conta para continuar</LoginSubtitle>
          </LoginHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Email</Label>
              <InputGroup>
                <Mail size={20} />
                <Input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Digite seu email"
                  $hasError={!!errors.username}
                />
              </InputGroup>
              {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Senha</Label>
              <InputGroup>
                <Lock size={20} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                  $hasError={!!errors.password}
                />
                <TogglePasswordButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </TogglePasswordButton>
              </InputGroup>
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormGroup>

            {errors.submit && (
              <ErrorMessage style={{ marginBottom: theme.spacing.md }}>
                {errors.submit}
              </ErrorMessage>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              style={{ width: '100%' }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </LoginCard>
      </LoginContainer>
  );
};

export default Login;
