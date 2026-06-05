import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROLES } from "./modelos/types/layout.types";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./router/protectedRoute";

import { Login }         from "./vistas/pages/Login";
import { Registro }      from "./vistas/pages/Registro";
import { Dashboard }     from "./vistas/components/layout/Dashboard";
import { Estadisticas }      from "./vistas/pages/Estadisticas";
import { Proveedores }   from "./vistas/pages/Proveedores";
import { Pedidos }      from "./vistas/pages/Pedidos";
import { Usuarios }      from "./vistas/pages/Usuarios";
import { Configuracion } from "./vistas/pages/Configuracion";

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
              <Route path="estadisticas"    element={<Estadisticas />} />
              <Route path="proveedores" element={<Proveedores />} />
              <Route path="pedidos"    element={<Pedidos />} />

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