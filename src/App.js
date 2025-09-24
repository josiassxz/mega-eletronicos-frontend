
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CadastroCliente from './pages/CadastroCliente';
import EditarCliente from './pages/EditarCliente';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/cadastro-cliente" element={<CadastroCliente />} />
      
      {/* Rota de Login */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
      />
      
      {/* Rotas Protegidas (apenas para usuários logados) */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/editar-cliente/:id" 
        element={isAuthenticated ? <EditarCliente /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}

export default App;
