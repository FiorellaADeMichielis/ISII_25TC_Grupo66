import { FilaMetrica } from './FilaMetrica';

export const PanelMetricasProveedor = () => (
  <div className="border-t border-gray-100 pt-6">
    <ul className="space-y-3 text-sm">
      <FilaMetrica etiqueta="Precio" valor="5" subtexto="$3000" />
      <FilaMetrica etiqueta="Calidad" valor="5" subtexto="Excelente" />
      <FilaMetrica etiqueta="Velocidad de entrega" valor="5" subtexto="3 días" />
    </ul>
  </div>
);