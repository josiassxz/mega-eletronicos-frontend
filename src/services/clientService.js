
import api from './api';

export const clientService = {
  // Listar todos os clientes
  getAllClients: () => {
    return api.get('/clientes');
  },

  // Obter cliente por ID
  getClientById: (id) => {
    return api.get(`/clientes/${id}`);
  },

  // Criar novo cliente
  createClient: (clientData) => {
    return api.post('/clientes', clientData);
  },

  // Criar cliente com fotos (multipart/form-data)
  createClientWithPhotos: (clientData, documentFile, selfieFile) => {
    const formData = new FormData();
    
    // Adicionar todos os campos do cliente
    Object.keys(clientData).forEach(key => {
      if (clientData[key] !== null && clientData[key] !== undefined && clientData[key] !== '') {
        formData.append(key, clientData[key]);
      }
    });
    
    // Adicionar arquivos se existirem
    if (documentFile) {
      formData.append('fotoDocumento', documentFile);
    }
    
    if (selfieFile) {
      formData.append('fotoSelfie', selfieFile);
    }
    
    return api.post('/clientes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Atualizar cliente
  updateClient: (id, clientData) => {
    return api.put(`/clientes/${id}`, clientData);
  },

  // Atualizar cliente com fotos (condicional: JSON ou multipart)
  updateClientWithPhotos: (id, clientData, documentFile = null, selfieFile = null) => {
    // Se não há fotos novas, usar JSON
    if (!documentFile && !selfieFile) {
      return api.put(`/clientes/${id}`, clientData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Se há fotos, usar multipart/form-data
    const formData = new FormData();
    
    // Adicionar todos os campos do cliente
    Object.keys(clientData).forEach(key => {
      if (clientData[key] !== null && clientData[key] !== undefined && clientData[key] !== '') {
        formData.append(key, clientData[key]);
      }
    });
    
    // Adicionar arquivos se existirem
    if (documentFile) {
      formData.append('fotoDocumento', documentFile);
    }
    
    if (selfieFile) {
      formData.append('fotoSelfie', selfieFile);
    }
    
    return api.put(`/clientes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Deletar cliente
  deleteClient: (id) => {
    return api.delete(`/clientes/${id}`);
  },

  // Upload de foto
  uploadPhoto: (clientId, type, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(`/clientes/${clientId}/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Buscar fotos do cliente
  getClientPhotos: (clientId) => {
    return api.get(`/clientes/${clientId}/fotos`);
  }
};
