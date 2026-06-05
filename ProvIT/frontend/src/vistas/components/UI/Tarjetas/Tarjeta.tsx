interface TarjetaProps {
  titulo: string;
  valor: string | number;
  claseBordeColor: string;
}

export const Tarjeta = ({ titulo, valor, claseBordeColor }: TarjetaProps) => (
  <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${claseBordeColor}`}>
    <h3 className="text-gray-500 text-sm font-medium">{titulo}</h3>
    <p className="text-3xl font-bold mt-1">{valor}</p>
  </div>
);
