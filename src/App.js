
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CadastroCliente from './pages/CadastroCliente';
import EditarCliente from './pages/EditarCliente';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/cadastro-cliente" 
        element={isAuthenticated ? <CadastroCliente /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/editar-cliente/:id" 
        element={isAuthenticated ? <EditarCliente /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
      />
    </Routes>
  );
}

export default App;
