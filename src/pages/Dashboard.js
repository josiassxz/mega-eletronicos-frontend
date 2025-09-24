
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  LogOut, 
  Mail, 
  Phone,
  MapPin,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { clientService } from '../services/clientService';
import { Container } from '../components/ui/Container';
import { Button, IconButton } from '../components/ui/Button';
import { Input, InputGroup } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardActions } from '../components/ui/Card';
import { Logo, SectionTitle } from '../components/ui/Typography';
import { theme } from '../styles/theme';

const Header = styled.header`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${theme.spacing.md} 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.neutral.lightGray};
  font-size: ${theme.typography.sizes.small};

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const MainContent = styled.main`
  padding: ${theme.spacing.xl} 0;
  min-height: calc(100vh - 200px);
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  max-width: 400px;
  width: 100%;

  @media (max-width: ${theme.breakpoints.tablet}) {
    max-width: none;
  }
`;

const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ClientCard = styled(Card)`
  &:hover {
    transform: translateY(-4px);
  }
`;

const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const ClientDetail = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.neutral.lightGray};
  font-size: ${theme.typography.sizes.small};

  svg {
    color: ${theme.colors.neutral.mediumGray};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: ${theme.colors.neutral.lightGray};
  padding: ${theme.spacing.xl};
  font-size: ${theme.typography.sizes.body};
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: ${theme.colors.neutral.lightGray};
  padding: ${theme.spacing.xl};

  svg {
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.neutral.mediumGray};
  }
`;

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [searchTerm, clients]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getAllClients();
      setClients(response.data);
    } catch (error) {
      setError('Erro ao carregar clientes');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter(client => 
      client.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefone?.includes(searchTerm) ||
      client.cpf?.includes(searchTerm)
    );

    setFilteredClients(filtered);
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await clientService.deleteClient(clientId);
      setClients(prev => prev.filter(client => client.id !== clientId));
    } catch (error) {
      alert('Erro ao excluir cliente');
      console.error('Erro:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <LoadingMessage>Carregando...</LoadingMessage>
    );
  }

  return (
    <>
      <Header>
        <Container>
          <HeaderContent>
            <Logo>
              MEGA ELETRÔNICOS <span>GO</span>
            </Logo>
            <HeaderActions>
              <UserInfo>
                <Users size={16} />
                Olá, {user?.username || 'Usuário'}
              </UserInfo>
              <IconButton onClick={handleLogout} title="Sair">
                <LogOut size={20} />
              </IconButton>
            </HeaderActions>
          </HeaderContent>
        </Container>
      </Header>

      <MainContent>
        <Container>
          <DashboardHeader>
            <SectionTitle>
              <Users size={24} />
              Clientes Cadastrados
            </SectionTitle>
            <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
              <SearchContainer>
                <InputGroup>
                  <Search size={20} />
                  <Input
                    type="text"
                    placeholder="Buscar por nome, email, telefone ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </SearchContainer>
              <Button onClick={() => navigate('/cadastro-cliente')}>
                <Plus size={20} />
                Novo Cliente
              </Button>
            </div>
          </DashboardHeader>

          {error && (
            <div style={{ color: theme.colors.accent.red, marginBottom: theme.spacing.md }}>
              {error}
            </div>
          )}

          {filteredClients.length === 0 ? (
            <EmptyMessage>
              <Users size={48} />
              <h3>Nenhum cliente encontrado</h3>
              <p>
                {searchTerm ? 'Tente ajustar sua busca.' : 'Comece cadastrando seu primeiro cliente.'}
              </p>
            </EmptyMessage>
          ) : (
            <ClientsGrid>
              {filteredClients.map((client) => (
                <ClientCard key={client.id}>
                  <CardHeader>
                    <CardTitle>
                      <Users size={20} />
                      {client.nome || 'Nome não informado'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ClientInfo>
                      {client.email && (
                        <ClientDetail>
                          <Mail size={16} />
                          {client.email}
                        </ClientDetail>
                      )}
                      {client.telefone && (
                        <ClientDetail>
                          <Phone size={16} />
                          {client.telefone}
                        </ClientDetail>
                      )}
                      {client.cidade && (
                        <ClientDetail>
                          <MapPin size={16} />
                          {client.cidade}, {client.estado}
                        </ClientDetail>
                      )}
                      {client.cpf && (
                        <ClientDetail>
                          <FileText size={16} />
                          CPF: {client.cpf}
                        </ClientDetail>
                      )}
                    </ClientInfo>
                  </CardContent>
                  <CardActions>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => navigate(`/editar-cliente/${client.id}`)}
                    >
                      <Edit size={16} />
                      Editar
                    </Button>
                    <IconButton
                      onClick={() => handleDeleteClient(client.id)}
                      style={{ color: theme.colors.accent.red }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </CardActions>
                </ClientCard>
              ))}
            </ClientsGrid>
          )}
        </Container>
      </MainContent>
    </>
  );
};

export default Dashboard;
