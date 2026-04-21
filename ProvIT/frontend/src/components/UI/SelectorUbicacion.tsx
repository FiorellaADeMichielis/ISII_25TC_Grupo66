import { useEffect } from 'react';
import { useUbicaciones } from '../../hooks/useUbicacion';

interface SelectorUbicacionProps {
  localidadSeleccionada: number | '';
  onChangeLocalidad: (idLocalidad: number) => void;
  // Opcional: para cuando estamos editando y ya sabemos la provincia
  provinciaInicial?: number; 
}

export const SelectorUbicacion = ({ 
  localidadSeleccionada, 
  onChangeLocalidad, 
  provinciaInicial 
}: SelectorUbicacionProps) => {
  
  const { 
    provincias, 
    localidades, 
    provinciaSeleccionada, 
    setProvinciaSeleccionada,
    loadingProvincias,
    loadingLocalidades
  } = useUbicaciones(provinciaInicial);

  // Si cambia la provincia, reseteamos la localidad en el formulario padre
  useEffect(() => {
    // reseteamos si hay una provincia seleccionada y la localidad actual 
    // no pertenece a la lista de localidades recién cargada.
    if (provinciaSeleccionada && localidades.length > 0) {
      const localidadValida = localidades.find(l => l.id_localidad === localidadSeleccionada);
      if (!localidadValida) {
        onChangeLocalidad(localidades[0].id_localidad); // Selecciona la primera por defecto
      }
    }
  }, [localidades, provinciaSeleccionada]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* SELECT DE PROVINCIA */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Provincia</label>
        <select 
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-slate-100"
          value={provinciaSeleccionada}
          onChange={(e) => setProvinciaSeleccionada(Number(e.target.value))}
          disabled={loadingProvincias}
        >
          <option value="" disabled>Seleccioná una provincia</option>
          {provincias.map(prov => (
            <option key={prov.id_provincia} value={prov.id_provincia}>
              {prov.nombre_provincia}
            </option>
          ))}
        </select>
      </div>

      {/* SELECT DE LOCALIDAD */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Localidad {loadingLocalidades && <span className="text-xs text-blue-500">(Cargando...)</span>}
        </label>
        <select 
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-slate-100"
          value={localidadSeleccionada}
          onChange={(e) => onChangeLocalidad(Number(e.target.value))}
          disabled={!provinciaSeleccionada || loadingLocalidades || localidades.length === 0}
        >
          <option value="" disabled>
            {!provinciaSeleccionada ? 'Primero elegí provincia' : 'Seleccioná una localidad'}
          </option>
          {localidades.map(loc => (
            <option key={loc.id_localidad} value={loc.id_localidad}>
              {loc.nombre_localidad} ({loc.codigo_postal})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};