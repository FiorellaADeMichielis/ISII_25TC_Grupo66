import { PuntoColor } from './PuntoColor';

interface ItemLeyendaProps {
  etiqueta: string;
  porcentaje: string;
  claseColor: string;
}

export const ItemLeyenda = ({ etiqueta, porcentaje, claseColor }: ItemLeyendaProps) => (
  <li className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      <PuntoColor claseColor={claseColor} />
      <span className="font-medium">{etiqueta}</span>
    </div>
    <span className="font-bold text-gray-600">{porcentaje}</span>
  </li>
);