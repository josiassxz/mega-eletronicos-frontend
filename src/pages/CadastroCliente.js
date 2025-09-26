
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Camera, 
  ArrowLeft,
  Save
} from 'lucide-react';
import { clientService } from '../services/clientService';
import { Container, Grid, Section } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Input, Select, FormGroup, Label, ErrorMessage } from '../components/ui/Input';
import { SectionTitle } from '../components/ui/Typography';
import { FileUpload } from '../components/ui/FileUpload';
import { CameraCapture } from '../components/ui/CameraCapture';
import { MaskedInput } from '../components/ui/MaskedInput';
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

const PageTitle = styled.h1`
  font-size: ${theme.typography.sizes.h1};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  margin: 0;
`;

const MainContent = styled.main`
  padding: ${theme.spacing.xl} 0;
  min-height: calc(100vh - 200px);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled(Section)`
  h3 {
    margin-bottom: ${theme.spacing.md};
  }
`;

const UploadSection = styled(Section)`
  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-top: ${theme.spacing.lg};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;



const CadastroCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Para casos de edição
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [documentFile, setDocumentFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState({
    fotoDocumento: null,
    fotoSelfie: null
  });
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    rg: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    nomeMae: '',
    dataNascimento: '',
    sexo: '',
    estadoCivil: '',
    naturezaOcupacao: '',
    profissao: '',
    nomeEmpresa: '',
    rendaMensal: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Carregar fotos existentes se houver um ID (modo edição)
  useEffect(() => {
    const loadExistingPhotos = async () => {
      if (id) {
        try {
          const photos = await clientService.getClientPhotos(id);
          setExistingPhotos({
            fotoDocumento: photos.fotos.fotoDocumento,
            fotoSelfie: photos.fotos.fotoSelfie
          });
        } catch (error) {
          console.error('Erro ao carregar fotos existentes:', error);
        }
      }
    };

    loadExistingPhotos();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    // Campos obrigatórios
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';

    // Validação de email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação de CPF (básica)
    if (formData.cpf && formData.cpf.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Criar cliente com fotos em uma única requisição
      const response = await clientService.createClientWithPhotos(formData, documentFile, selfieFile);

      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        // Para usuários não logados, mostrar mensagem de sucesso e redirecionar para login
        alert('Cliente cadastrado com sucesso! Faça login para gerenciar seus clientes.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      setErrors({ submit: 'Erro ao cadastrar cliente. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header>
        <Container>
          <HeaderContent>
            <PageTitle>Cadastro do Cliente</PageTitle>
            <Button variant="secondary" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
              <ArrowLeft size={20} />
              Voltar
            </Button>
          </HeaderContent>
        </Container>
      </Header>

      <MainContent>
        <Container>
          <form onSubmit={handleSubmit}>
            <Grid>
              <div>
                {/* Dados Pessoais */}
                <FormSection>
                  <SectionTitle>
                    <User size={24} />
                    Dados Pessoais
                  </SectionTitle>
                  
                  <FormGrid>
                    <FormGroup>
                      <Label>Nome Completo *</Label>
                      <Input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Digite o nome completo"
                        $hasError={!!errors.nome}
                      />
                      {errors.nome && <ErrorMessage>{errors.nome}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Digite o email"
                        $hasError={!!errors.email}
                      />
                      {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>CPF *</Label>
                      <MaskedInput
                        mask="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        $hasError={!!errors.cpf}
                      />
                      {errors.cpf && <ErrorMessage>{errors.cpf}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                      <Label>RG</Label>
                      <Input
                        type="text"
                        name="rg"
                        value={formData.rg}
                        onChange={handleChange}
                        placeholder="Digite o RG"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Telefone *</Label>
                      <MaskedInput
                        mask="phone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        $hasError={!!errors.telefone}
                      />
                      {errors.telefone && <ErrorMessage>{errors.telefone}</ErrorMessage>}
                    </FormGroup>
                  </FormGrid>
                </FormSection>

                {/* Endereço */}
                <FormSection>
                  <SectionTitle>
                    <MapPin size={24} />
                    Endereço
                  </SectionTitle>
                  
                  <FormGrid>
                    <FormGroup>
                      <Label>CEP</Label>
                      <MaskedInput
                        mask="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        placeholder="00000-000"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Rua</Label>
                      <Input
                        type="text"
                        name="rua"
                        value={formData.rua}
                        onChange={handleChange}
                        placeholder="Digite a rua"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Número</Label>
                      <Input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        placeholder="Digite o número"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Bairro</Label>
                      <Input
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        placeholder="Digite o bairro"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Cidade</Label>
                      <Input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="Digite a cidade"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Estado</Label>
                      <Select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                      >
                        <option value="">Selecione o estado</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </Select>
                    </FormGroup>
                  </FormGrid>
                </FormSection>

                {/* Dados Adicionais */}
                <FormSection>
                  <SectionTitle>
                    <FileText size={24} />
                    Dados Adicionais
                  </SectionTitle>
                  
                  <FormGrid>
                    <FormGroup>
                      <Label>Nome da Mãe</Label>
                      <Input
                        type="text"
                        name="nomeMae"
                        value={formData.nomeMae}
                        onChange={handleChange}
                        placeholder="Digite o nome da mãe"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Data de Nascimento</Label>
                      <Input
                        type="date"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Sexo</Label>
                      <Select
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleChange}
                      >
                        <option value="">Selecione</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>Estado Civil</Label>
                      <Select
                        name="estadoCivil"
                        value={formData.estadoCivil}
                        onChange={handleChange}
                      >
                        <option value="">Selecione</option>
                        <option value="solteiro">Solteiro(a)</option>
                        <option value="casado">Casado(a)</option>
                        <option value="divorciado">Divorciado(a)</option>
                        <option value="viuvo">Viúvo(a)</option>
                        <option value="uniao_estavel">União Estável</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>Natureza da Ocupação</Label>
                      <Input
                        type="text"
                        name="naturezaOcupacao"
                        value={formData.naturezaOcupacao}
                        onChange={handleChange}
                        placeholder="Digite a natureza da ocupação"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Profissão</Label>
                      <Input
                        type="text"
                        name="profissao"
                        value={formData.profissao}
                        onChange={handleChange}
                        placeholder="Digite a profissão"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Nome da Empresa</Label>
                      <Input
                        type="text"
                        name="nomeEmpresa"
                        value={formData.nomeEmpresa}
                        onChange={handleChange}
                        placeholder="Digite o nome da empresa"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Renda Mensal</Label>
                      <Input
                        type="number"
                        name="rendaMensal"
                        value={formData.rendaMensal}
                        onChange={handleChange}
                        placeholder="Digite a renda mensal"
                        min="0"
                        step="0.01"
                      />
                    </FormGroup>
                  </FormGrid>
                </FormSection>
              </div>

              {/* Upload de Documentos */}
              <div>
                <UploadSection>
                  <SectionTitle>
                    <Camera size={24} />
                    Verificação de Identidade
                  </SectionTitle>
                  
                  <FormGroup>
                    <Label>Frente do Documento</Label>
                    <CameraCapture
                      label="a frente do documento"
                      onPhotoCapture={setDocumentFile}
                      photoFile={documentFile}
                      onRemove={() => {
                        setDocumentFile(null);
                        setExistingPhotos(prev => ({ ...prev, fotoDocumento: null }));
                      }}
                      existingPhotoBase64={existingPhotos.fotoDocumento}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Selfie</Label>
                    <CameraCapture
                      label="uma selfie"
                      onPhotoCapture={setSelfieFile}
                      photoFile={selfieFile}
                      onRemove={() => {
                        setSelfieFile(null);
                        setExistingPhotos(prev => ({ ...prev, fotoSelfie: null }));
                      }}
                      existingPhotoBase64={existingPhotos.fotoSelfie}
                    />
                  </FormGroup>
                </UploadSection>
              </div>
            </Grid>

            {errors.submit && (
              <div style={{ 
                color: theme.colors.accent.red, 
                marginTop: theme.spacing.md,
                textAlign: 'center' 
              }}>
                {errors.submit}
              </div>
            )}

            <ActionButtons>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                <Save size={20} />
                {loading ? 'Salvando...' : 'Salvar Cliente'}
              </Button>
            </ActionButtons>
          </form>
        </Container>
      </MainContent>
    </>
  );
};

export default CadastroCliente;
