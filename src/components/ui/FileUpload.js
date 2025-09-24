
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Upload, FileText, X } from 'lucide-react';
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

export const FileUpload = ({ 
  label, 
  accept = "image/*,.pdf", 
  maxSize = 5, // MB
  onFileSelect,
  fileName,
  onRemove
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

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

  return (
    <div>
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
