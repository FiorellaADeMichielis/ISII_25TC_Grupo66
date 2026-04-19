import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './components/layout/Dashboard';
import { Tableros } from './pages/Tableros';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas Privadas (Envueltas en el Layout con Sidebar) */}
        <Route path="/" element={<Dashboard />}>
          {/* Redirección por defecto al entrar a la raíz */}
          <Route index element={<Navigate to="/tableros" replace />} />
          
          <Route path="tableros" element={<Tableros />} />
          {/* Aquí agregaremos las rutas de Proveedores y Órdenes luego */}
          {/* <Route path="proveedores" element={<Proveedores />} /> */}
        </Route>

        {/* Capturar rutas no encontradas (404) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}