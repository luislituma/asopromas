import { useState } from 'react';
import { X, Droplets } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StartFermentacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  loteId: string;
  loteCodigo: string;
  onSuccess: () => void;
}

export default function StartFermentacionModal({ isOpen, onClose, loteId, loteCodigo, onSuccess }: StartFermentacionModalProps) {
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStart = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('lotes_acopio')
        .update({
          estado: 'Fermentacion',
          fecha_inicio_fermentacion: fechaInicio
        })
        .eq('id', loteId);

      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar fermentación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Iniciar Fermentación</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <p className="text-sm text-slate-500">
            El lote <strong className="text-slate-800">{loteCodigo}</strong> pasará a los cajones de fermentación. Al hacer esto, <strong>ya no se podrán añadir más entregas de cacao</strong> a este lote.
          </p>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Fecha de Inicio <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          <button
            onClick={handleStart}
            disabled={isSubmitting || !fechaInicio}
            className="w-full py-4 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Confirmar Inicio'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
