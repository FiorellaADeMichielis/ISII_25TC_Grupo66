import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROLES } from "./types/layout.types";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/router/protectedRoute";

import { Login }         from "./pages/Login";
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

          {/* Pública */}
          <Route path="/login" element={<Login />} />

          {/* Verifica sesión activa */}
          <Route element={<ProtectedRoute allowedRoles={TODOS} />}>

            {/* Dashboard como layout con path raíz */}
            <Route path="/" element={<Dashboard />}>

              {/* / → /proveedores */}
              <Route index element={<Navigate to="/proveedores" replace />} />

              {/* Todos los roles */}
              <Route path="tableros"    element={<Tableros />} />
              <Route path="proveedores" element={<Proveedores />} />
              <Route path="facturas"    element={<Facturas />} />

              {/* Administrador y Gerente */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.OPERADOR, ROLES.ADMINISTRADOR, ROLES.GERENTE]} />}>
                <Route path="configuracion" element={<Configuracion />} />
              </Route>

              {/* Solo Gerente */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.GERENTE]} />}>
                <Route path="usuarios" element={<Usuarios />} />
              </Route>

            </Route>
          </Route>

          {/* Cualquier ruta desconocida */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}