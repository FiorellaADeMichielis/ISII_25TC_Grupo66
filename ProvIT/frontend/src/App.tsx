import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROLES } from "./types/layout.types";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/router/protectedRoute";

import { Login }         from "./pages/Login";
import { Registro }      from "./pages/Registro";
import { Dashboard }     from "./components/layout/Dashboard";
import { Tableros }      from "./pages/Tableros";
import { Proveedores }   from "./pages/Proveedores";
import { Facturas }      from "./pages/Facturas";
import { Usuarios }      from "./pages/Usuarios";
import { Configuracion } from "./pages/Configuracion";

const TODOS = [ROLES.OPERADOR, ROLES.ADMINISTRADOR, ROLES.GERENTE];

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} /> 

          {/* Verifica sesión activa para cualquier rol */}
          <Route element={<ProtectedRoute allowedRoles={TODOS} />}>

            {/* Dashboard como layout con path raíz */}
            <Route path="/" element={<Dashboard />}>

              {/* / → Redirige a /proveedores por defecto */}
              <Route index element={<Navigate to="/proveedores" replace />} />

              {/* Módulos accesibles por todos los roles */}
              <Route path="tableros"    element={<Tableros />} />
              <Route path="proveedores" element={<Proveedores />} />
              <Route path="facturas"    element={<Facturas />} />

              {/* Administrador y Gerente */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMINISTRADOR, ROLES.GERENTE]} />}>
                <Route path="configuracion" element={<Configuracion />} />
              </Route>

              {/* Solo Gerente */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.GERENTE]} />}>
                <Route path="usuarios" element={<Usuarios />} />
              </Route>

            </Route>
          </Route>

          {/* Fallback: Cualquier ruta desconocida manda al login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}