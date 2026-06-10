import { X, Printer, FileText, Map, DollarSign, Scale } from 'lucide-react';

export interface ReporteOptions {
  datosPersonales: boolean;
  fincasYLotes: boolean;
  financiero: boolean;
  acopio: boolean;
}

interface ReporteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (options: ReporteOptions) => void;
  options: ReporteOptions;
  setOptions: (options: ReporteOptions) => void;
}

export default function ReporteModal({ isOpen, onClose, onPrint, options, setOptions }: ReporteModalProps) {
  if (!isOpen) return null;

  const toggleOption = (key: keyof ReporteOptions) => {
    setOptions({ ...options, [key]: !options[key] });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:hidden">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Printer className="h-5 w-5 text-orange-600" />
            Generar Reporte del Socio
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-600 mb-6 text-sm">
            Selecciona las secciones que deseas incluir en el reporte impreso o en el archivo PDF.
          </p>

          <div className="space-y-3">
            {/* Opción: Datos Personales */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.datosPersonales}
                onChange={() => toggleOption('datosPersonales')}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 accent-orange-600"
              />
              <FileText className={`h-5 w-5 ${options.datosPersonales ? 'text-blue-500' : 'text-slate-400'}`} />
              <div className="flex-1">
                <span className={`font-bold block ${options.datosPersonales ? 'text-slate-800' : 'text-slate-500'}`}>Datos Personales y Contacto</span>
                <span className="text-xs text-slate-500">Información básica, ubicación y demografía.</span>
              </div>
            </label>

            {/* Opción: Fincas y Lotes */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.fincasYLotes}
                onChange={() => toggleOption('fincasYLotes')}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 accent-orange-600"
              />
              <Map className={`h-5 w-5 ${options.fincasYLotes ? 'text-emerald-500' : 'text-slate-400'}`} />
              <div className="flex-1">
                <span className={`font-bold block ${options.fincasYLotes ? 'text-slate-800' : 'text-slate-500'}`}>Patrimonio Agrícola</span>
                <span className="text-xs text-slate-500">Fincas, lotes, variedades y coordenadas.</span>
              </div>
            </label>

            {/* Opción: Financiero */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.financiero}
                onChange={() => toggleOption('financiero')}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 accent-orange-600"
              />
              <DollarSign className={`h-5 w-5 ${options.financiero ? 'text-yellow-500' : 'text-slate-400'}`} />
              <div className="flex-1">
                <span className={`font-bold block ${options.financiero ? 'text-slate-800' : 'text-slate-500'}`}>Estado Financiero</span>
                <span className="text-xs text-slate-500">Cupos autorizados y saldos pendientes.</span>
              </div>
            </label>

            {/* Opción: Acopio */}
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.acopio}
                onChange={() => toggleOption('acopio')}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 accent-orange-600"
              />
              <Scale className={`h-5 w-5 ${options.acopio ? 'text-purple-500' : 'text-slate-400'}`} />
              <div className="flex-1">
                <span className={`font-bold block ${options.acopio ? 'text-slate-800' : 'text-slate-500'}`}>Historial de Acopio</span>
                <span className="text-xs text-slate-500">Resumen de entregas de cacao (Próximamente).</span>
              </div>
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onPrint(options)}
            disabled={!options.datosPersonales && !options.fincasYLotes && !options.financiero && !options.acopio}
            className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="h-5 w-5" />
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
