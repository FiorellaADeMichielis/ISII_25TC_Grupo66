import React from 'react';
import { useRegistroForm } from '../../modelos-vista/hooks/useRegistroFormulario';

export const Registro = () => {
  // Consume el ViewModel
  const { 
    formData, 
    erroresLocales, 
    handleChange, 
    handleSubmit, 
    loading, 
    errorGlobal, 
    exito 
  } = useRegistroForm();

  if (exito) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center border border-green-200">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Cuenta creada!</h2>
          <p className="text-slate-600 mb-6">Tu registro se ha completado con éxito. Ya podés iniciar sesión en el sistema.</p>
          <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Ir al Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Crear Cuenta</h1>
          <p className="text-sm text-slate-500 mt-1">Ingresá tus datos para registrarte en Provit.</p>
        </div>

        {errorGlobal && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
            {errorGlobal}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.apellido}
                onChange={(e) => handleChange('apellido', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">DNI</label>
            <input 
              type="text" inputMode="numeric" required
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors ${erroresLocales.dni ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500'}`}
              value={formData.dni}
              onChange={(e) => handleChange('dni', e.target.value.replace(/\D/g, ''))}
            />
            {erroresLocales.dni && <p className="text-xs text-red-500 mt-1">{erroresLocales.dni}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input 
              type="password" required
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors ${erroresLocales.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500'}`}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            {erroresLocales.password && <p className="text-xs text-red-500 mt-1">{erroresLocales.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Contraseña</label>
            <input 
              type="password" required
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors ${erroresLocales.confirmarPassword ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500'}`}
              value={formData.confirmarPassword}
              onChange={(e) => handleChange('confirmarPassword', e.target.value)}
            />
            {erroresLocales.confirmarPassword && <p className="text-xs text-red-500 mt-1">{erroresLocales.confirmarPassword}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-2 mt-4 text-white font-medium rounded-lg transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tenés una cuenta? <a href="/login" className="text-blue-600 font-medium hover:underline">Iniciá sesión</a>
        </p>
      </div>
    </div>
  );
};