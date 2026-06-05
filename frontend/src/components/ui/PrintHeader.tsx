import { Leaf } from 'lucide-react';

interface PrintHeaderProps {
  title: string;
  subtitle?: string;
}

export function PrintHeader({ title, subtitle }: PrintHeaderProps) {
  return (
    <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Leaf className="h-10 w-10 text-black" />
          <div>
            <h1 className="text-2xl font-bold text-black m-0 p-0">ASOPROMAS</h1>
            <p className="text-sm text-black m-0 p-0">Asociación de Productores Ecosostenibles</p>
            <p className="text-xs text-black m-0 p-0">RUC: 1591708890001</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-black m-0 p-0">{title}</h2>
          {subtitle && <p className="text-sm text-black mt-1 m-0 p-0">{subtitle}</p>}
          <p className="text-xs text-black mt-2 m-0 p-0">
            Impreso el: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
