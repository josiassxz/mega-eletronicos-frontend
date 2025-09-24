import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInfinite = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${theme.colors.primary.dark} 0%, 
    ${theme.colors.primary.main} 50%, 
    ${theme.colors.accent.red} 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(254, 66, 46, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 2;
  animation: ${fadeIn} 1s ease-out;
  max-width: 800px;
`;

const Logo = styled.img`
  width: 300px;
  height: auto;
  margin-bottom: ${theme.spacing.xl};
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 250px;
    margin-bottom: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 200px;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.md};
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2.8rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${theme.spacing.xl};
  max-width: 600px;
  line-height: 1.6;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 1.1rem;
    margin-bottom: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const StartButton = styled.button`
  background: linear-gradient(45deg, ${theme.colors.accent.red}, #ff6b4a);
  color: ${theme.colors.neutral.white};
  border: none;
  padding: 18px 48px;
  font-size: 1.2rem;
  font-weight: ${theme.typography.weights.semibold};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(254, 66, 46, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: ${theme.spacing.xxl};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(254, 66, 46, 0.6);
    background: linear-gradient(45deg, #ff6b4a, ${theme.colors.accent.red});
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 16px 36px;
    font-size: 1.1rem;
  }
`;

const CarouselSection = styled.div`
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
  overflow: hidden;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.mobile}) {
    bottom: 40px;
  }
`;

const CarouselTitle = styled.h3`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: ${theme.spacing.lg};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: ${theme.typography.weights.medium};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 0.9rem;
    margin-bottom: ${theme.spacing.md};
  }
`;

const CarouselTrack = styled.div`
  display: flex;
  animation: ${slideInfinite} 20s linear infinite;
  width: calc(200% + 100px);
`;

const CarouselItem = styled.div`
  flex: 0 0 auto;
  margin: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin: 0 20px;
  }
`;

const BrandLogo = styled.img`
  height: 60px;
  width: auto;
  filter: brightness(0) invert(1);
  opacity: 0.7;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 45px;
  }
`;

const Home = () => {
  const navigate = useNavigate();

  const brands = [
    { name: 'Samsung', logo: '/assets/Samsung.png' },
    { name: 'LG', logo: '/assets/lg.png' },
    { name: 'Motorola', logo: '/assets/motorola.png' },
    { name: 'Realme', logo: '/assets/realme.png' },
    { name: 'Xiaomi', logo: '/assets/xiaomi.png' }
  ];

  // Duplicar as marcas para efeito infinito
  const duplicatedBrands = [...brands, ...brands];

  const handleStartClick = () => {
    navigate('/cadastro-cliente');
  };

  return (
    <Container>
      <MainContent>
        <Logo src="/assets/image.png" alt="Mega Eletrônicos" />
        <Title>Bem-vindo à Mega Eletrônicos</Title>
        <Subtitle>
          Sua loja de confiança para smartphones e eletrônicos das melhores marcas. 
          Cadastre-se agora e descubra nossas ofertas exclusivas!
        </Subtitle>
        <StartButton onClick={handleStartClick}>
          Vamos Começar
        </StartButton>
      </MainContent>

      <CarouselSection>
        <CarouselTitle>Trabalhamos com as melhores marcas</CarouselTitle>
        <CarouselTrack>
          {duplicatedBrands.map((brand, index) => (
            <CarouselItem key={`${brand.name}-${index}`}>
              <BrandLogo src={brand.logo} alt={brand.name} />
            </CarouselItem>
          ))}
        </CarouselTrack>
      </CarouselSection>
    </Container>
  );
};

export default Home;