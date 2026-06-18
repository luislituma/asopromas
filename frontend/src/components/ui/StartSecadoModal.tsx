import { useState } from 'react';
import { X, Sun } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StartSecadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  loteId: string;
  loteCodigo: string;
  onSuccess: () => void;
}

export default function StartSecadoModal({ isOpen, onClose, loteId, loteCodigo, onSuccess }: StartSecadoModalProps) {
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [metodoSecado, setMetodoSecado] = useState('Marquesina Solar');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStart = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('lotes_acopio')
        .update({
          estado: 'Secado',
          fecha_inicio_secado: fechaInicio,
          metodo_secado: metodoSecado
        })
        .eq('id', loteId);

      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar secado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Pasar a Secado</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <p className="text-sm text-slate-500">
            El lote <strong className="text-slate-800">{loteCodigo}</strong> pasará a la etapa de secado. Por favor, selecciona el método y la fecha de inicio.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Fecha de Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Método de Secado <span className="text-red-500">*</span>
              </label>
              <select
                value={metodoSecado}
                onChange={(e) => setMetodoSecado(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none"
              >
                <option value="Marquesina Solar">Marquesina Solar</option>
                <option value="Secadora a Gas">Secadora a Gas</option>
                <option value="Mixto (Solar + Gas)">Mixto (Solar + Gas)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={isSubmitting || !fechaInicio || !metodoSecado}
            className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Comenzar Secado'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
