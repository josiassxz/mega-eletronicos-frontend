
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Upload, FileText, X, Download, Trash2 } from 'lucide-react';
import { theme } from '../../styles/theme';

const UploadContainer = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.lg};
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: ${theme.colors.accent.red};
    background: rgba(254, 66, 46, 0.05);
  }

  ${props => props.isDragOver && `
    border-color: ${theme.colors.accent.red};
    background: rgba(254, 66, 46, 0.1);
  `}

  ${props => props.hasFile && `
    border-color: ${theme.colors.accent.red};
    border-style: solid;
  `}
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto ${theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(254, 66, 46, 0.1);
  color: ${theme.colors.accent.red};
`;

const UploadText = styled.div`
  color: ${theme.colors.neutral.lightGray};
  font-size: ${theme.typography.sizes.body};
  margin-bottom: ${theme.spacing.xs};
`;

const UploadSubtext = styled.div`
  color: ${theme.colors.neutral.mediumGray};
  font-size: ${theme.typography.sizes.small};
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-top: ${theme.spacing.sm};
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.neutral.lightGray};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.neutral.mediumGray};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.small};
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.colors.accent.red};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ExistingPhotoContainer = styled.div`
  margin-bottom: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
`;

const ExistingPhotoImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  display: block;
  margin: 0 auto;
`;

const ExistingPhotoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.neutral.lightGray};
  font-size: ${theme.typography.sizes.small};
`;

const DeleteButton = styled.button`
  background: rgba(254, 66, 46, 0.1);
  color: ${theme.colors.accent.red};
  border: 1px solid rgba(254, 66, 46, 0.3);
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(254, 66, 46, 0.2);
    border-color: ${theme.colors.accent.red};
    color: ${theme.colors.neutral.white};
  }
`;

const DownloadButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.neutral.lightGray};
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: ${theme.colors.neutral.white};
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  align-items: center;
`;

export const FileUpload = ({ 
  label, 
  accept = "image/*,.pdf", 
  maxSize = 5, // MB
  onFileSelect,
  fileName,
  onRemove,
  existingPhotoBase64,
  photoFileName = 'foto'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const [showUpload, setShowUpload] = useState(!existingPhotoBase64);
  const fileInputRef = useRef(null);

  const downloadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!existingPhotoBase64) return;
    
    // Criar um link temporário para download
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${existingPhotoBase64}`;
    link.download = `${photoFileName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateFile = (file) => {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo deve ter no máximo ${maxSize}MB`);
      return false;
    }
    
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileName.endsWith(type);
      }
      return fileType.startsWith(type.replace('*', ''));
    });
    
    if (!isValidType) {
      setError('Formato de arquivo não suportado');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteExisting = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowUpload(true);
    // Não chama onRemove aqui para não limpar a foto existente imediatamente
    // A foto existente só será removida quando o usuário salvar o formulário
  };

  return (
    <div>
      {/* Exibir foto existente se disponível, não há arquivo novo e upload não está sendo mostrado */}
      {existingPhotoBase64 && !fileName && !showUpload && (
        <ExistingPhotoContainer>
          <ExistingPhotoHeader>
            <span>Foto atual</span>
            <ButtonGroup>
              <DownloadButton 
                onClick={downloadPhoto}
                title="Baixar foto"
              >
                <Download size={16} />
              </DownloadButton>
              <DeleteButton 
                onClick={handleDeleteExisting}
                title="Remover foto"
              >
                <Trash2 size={16} />
              </DeleteButton>
            </ButtonGroup>
          </ExistingPhotoHeader>
          <ExistingPhotoImage 
            src={`data:image/jpeg;base64,${existingPhotoBase64}`}
            alt="Foto atual"
          />
        </ExistingPhotoContainer>
      )}

      {/* Mostrar upload apenas se não há foto existente OU se o usuário clicou para substituir */}
      {showUpload && (
        <UploadContainer
          isDragOver={isDragOver}
          hasFile={!!fileName}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
        <UploadIcon>
          <Upload size={24} />
        </UploadIcon>
        <UploadText>
          {fileName ? 'Arquivo selecionado' : `Clique ou arraste ${label}`}
        </UploadText>
        <UploadSubtext>
          Formatos aceitos: JPEG, PNG, PDF • Máximo {maxSize}MB
        </UploadSubtext>
        
        {fileName && (
          <FilePreview>
            <FileInfo>
              <FileText size={20} />
              <span>{fileName}</span>
            </FileInfo>
            <RemoveButton onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}>
              <X size={16} />
            </RemoveButton>
          </FilePreview>
        )}
        </UploadContainer>
      )}
      
      {error && (
        <div style={{ color: theme.colors.accent.red, fontSize: theme.typography.sizes.small, marginTop: theme.spacing.xs }}>
          {error}
        </div>
      )}
      
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
      />
    </div>
  );
};
