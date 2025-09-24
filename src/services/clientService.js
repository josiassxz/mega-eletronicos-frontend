
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

  // Atualizar cliente
  updateClient: (id, clientData) => {
    return api.put(`/clientes/${id}`, clientData);
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
  }
};
