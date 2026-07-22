import { ValorMetrica } from './ValorMetrica';

interface FilaMetricaProps {
  etiqueta: string;
  valor: string;
  subtexto?: string;
}

export const FilaMetrica = ({ etiqueta, valor, subtexto }: FilaMetricaProps) => (
  <li className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
    <span className="text-gray-600">{etiqueta}:</span> 
    <ValorMetrica valor={valor} subtexto={subtexto} />
  </li>
); 