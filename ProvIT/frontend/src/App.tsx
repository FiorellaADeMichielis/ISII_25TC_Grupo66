import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './components/layout/Dashboard';
import { Tableros } from './pages/Tableros';
// 1. Importamos la vista de Proveedores
import { Proveedores } from './pages/Proveedores'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="/tableros" replace />} />
          <Route path="tableros" element={<Tableros />} />
          <Route path="proveedores" element={<Proveedores />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}