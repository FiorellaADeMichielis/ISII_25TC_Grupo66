// components/atoms/PuntoColor.tsx
export const PuntoColor = ({ claseColor }: { claseColor: string }) => (
  <span className={`w-3 h-3 rounded-full ${claseColor} block`}></span>
);
