import { useState } from 'react';
import { X, Lock, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CloseLoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  loteId: string;
  loteCodigo: string;
  hasUnpaidEntregas: boolean;
  onSuccess: () => void;
}

export default function CloseLoteModal({ isOpen, onClose, loteId, loteCodigo, hasUnpaidEntregas, onSuccess }: CloseLoteModalProps) {
  const [humedad, setHumedad] = useState('');
  const [fermentacion, setFermentacion] = useState('');
  const [pesoSecoKg, setPesoSecoKg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCloseLote = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('lotes_acopio')
        .update({
          estado: 'Cerrado',
          fecha_cierre: new Date().toISOString().split('T')[0],
          calidad_humedad_pct: Number(humedad),
          calidad_fermentacion_pct: Number(fermentacion),
          peso_neto_seco_kg: Number(pesoSecoKg),
          peso_neto_seco_lbs: Number(pesoSecoKg) * 2.20462
        })
        .eq('id', loteId);

      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error cerrando lote:', error);
      alert('Error al cerrar el lote');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Cerrar Lote {loteCodigo}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <p className="text-sm text-slate-500">
            Para cerrar este lote y prepararlo para procesamiento, debes registrar los parámetros finales de calidad.
          </p>

          {hasUnpaidEntregas && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-800 text-sm">Hay pagos pendientes</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Existen entregas en este lote marcadas como "Pendiente" de pago. Puedes cerrar el lote físicamente, pero asegúrate de que tesorería complete los pagos más adelante.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Humedad Promedio (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={humedad}
                onChange={(e) => setHumedad(e.target.value)}
                placeholder="Ej. 7.5"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Fermentación Promedio (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={fermentacion}
                onChange={(e) => setFermentacion(e.target.value)}
                placeholder="Ej. 85"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Peso Neto Seco Final (KG) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pesoSecoKg}
                onChange={(e) => setPesoSecoKg(e.target.value)}
                placeholder="Ej. 150"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleCloseLote}
            disabled={isSubmitting || !humedad || !fermentacion || !pesoSecoKg}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Confirmar Cierre de Lote
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
