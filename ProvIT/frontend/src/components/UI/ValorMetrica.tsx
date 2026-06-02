interface ValorMetricaProps {
  valor: string;
  subtexto?: string;
}

export const ValorMetrica = ({ valor, subtexto }: ValorMetricaProps) => (
  <span>
    <span className="font-bold text-gray-900">{valor}</span>
    {subtexto && <span className="text-gray-600 ml-1">({subtexto})</span>}
  </span>
);