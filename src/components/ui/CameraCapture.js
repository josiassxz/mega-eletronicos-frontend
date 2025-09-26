import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Camera, X, RotateCcw, Check, RotateCw } from 'lucide-react';
import { theme } from '../../styles/theme';

const CameraContainer = styled.div`
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

  ${props => props.hasPhoto && `
    border-color: ${theme.colors.accent.red};
    border-style: solid;
  `}
`;

const CameraIcon = styled.div`
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

const CameraText = styled.div`
  color: ${theme.colors.neutral.lightGray};
  font-size: ${theme.typography.sizes.body};
  margin-bottom: ${theme.spacing.xs};
`;

const CameraSubtext = styled.div`
  color: ${theme.colors.neutral.mediumGray};
  font-size: ${theme.typography.sizes.small};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

const VideoContainer = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 70vh;
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  background: #000;
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  display: block;
`;

const Canvas = styled.canvas`
  display: none;
`;

const PhotoPreview = styled.img`
  width: 100%;
  height: auto;
  border-radius: ${theme.borderRadius.medium};
`;

const Controls = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
  justify-content: center;
`;

const ControlButton = styled.button`
  background: ${props => props.primary ? theme.colors.accent.red : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral.white};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.primary ? theme.colors.accent.darkRed : 'rgba(255, 255, 255, 0.2)'};
    transform: scale(1.05);
  }
`;

const PhotoPreviewContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-top: ${theme.spacing.sm};
`;

const PhotoInfo = styled.div`
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

export const CameraCapture = ({ 
  label, 
  onPhotoCapture,
  photoFile,
  onRemove,
  existingPhotoBase64 = null
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [error, setError] = useState('');
  const [facingMode, setFacingMode] = useState('user'); // 'user' para frontal, 'environment' para traseira
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Erro ao acessar a câmera. Verifique as permissões.');
      console.error('Erro ao acessar câmera:', err);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setCapturedPhoto(canvas.toDataURL('image/jpeg'));
        onPhotoCapture(file);
      }, 'image/jpeg', 0.8);
    }
  }, [onPhotoCapture]);

  const handleOpenCamera = async () => {
    setIsModalOpen(true);
    setCapturedPhoto(null);
    await startCamera();
  };

  const handleCloseModal = () => {
    stopCamera();
    setIsModalOpen(false);
    setCapturedPhoto(null);
  };

  const handleConfirmPhoto = () => {
    stopCamera();
    setIsModalOpen(false);
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
  };

  const toggleCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    // Parar a câmera atual e reiniciar com a nova orientação
    if (stream) {
      stopCamera();
      // Pequeno delay para garantir que a câmera foi liberada
      setTimeout(async () => {
        await startCamera();
      }, 100);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div>
      <CameraContainer
        hasPhoto={!!photoFile || !!existingPhotoBase64}
        onClick={handleOpenCamera}
      >
        <CameraIcon>
          <Camera size={24} />
        </CameraIcon>
        <CameraText>
          {photoFile || existingPhotoBase64 ? 'Foto capturada' : `Clique para tirar ${label}`}
        </CameraText>
        <CameraSubtext>
          Use a câmera para capturar a foto
        </CameraSubtext>
        
        {(photoFile || existingPhotoBase64) && (
          <PhotoPreviewContainer>
            <PhotoInfo>
              <Camera size={20} />
              <span>{photoFile ? photoFile.name : 'Foto existente'}</span>
            </PhotoInfo>
            <RemoveButton onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}>
              <X size={16} />
            </RemoveButton>
          </PhotoPreviewContainer>
        )}
      </CameraContainer>
      
      {error && (
        <div style={{ color: theme.colors.accent.red, fontSize: theme.typography.sizes.small, marginTop: theme.spacing.xs }}>
          {error}
        </div>
      )}

      {isModalOpen && (
        <Modal>
          <VideoContainer>
            {capturedPhoto ? (
              <PhotoPreview src={capturedPhoto} alt="Foto capturada" />
            ) : (
              <Video
                ref={videoRef}
                autoPlay
                playsInline
                muted
              />
            )}
          </VideoContainer>
          
          <Controls>
            <ControlButton onClick={handleCloseModal}>
              <X size={24} />
            </ControlButton>
            
            {capturedPhoto ? (
              <>
                <ControlButton onClick={handleRetakePhoto}>
                  <RotateCcw size={24} />
                </ControlButton>
                <ControlButton primary onClick={handleConfirmPhoto}>
                  <Check size={24} />
                </ControlButton>
              </>
            ) : (
              <>
                <ControlButton onClick={toggleCamera}>
                  <RotateCw size={24} />
                </ControlButton>
                <ControlButton primary onClick={capturePhoto}>
                  <Camera size={24} />
                </ControlButton>
              </>
            )}
          </Controls>
          
          <Canvas ref={canvasRef} />
        </Modal>
      )}
    </div>
  );
};