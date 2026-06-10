import { useState, useEffect } from 'react';
import { X, Save, Loader2, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FincaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  socioId: string;
  fincaEdit?: any; // Si existe, es modo edición
}

export default function FincaModal({ isOpen, onClose, onSave, socioId, fincaEdit }: FincaModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion_sector: '',
    altitud_msnm: '',
    hectareas_totales: '',
    hectareas_cacao: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (fincaEdit) {
        setFormData({
          nombre: fincaEdit.nombre || '',
          ubicacion_sector: fincaEdit.ubicacion_sector || '',
          altitud_msnm: fincaEdit.altitud_msnm?.toString() || '',
          hectareas_totales: fincaEdit.hectareas_totales?.toString() || '',
          hectareas_cacao: fincaEdit.hectareas_cacao?.toString() || ''
        });
      } else {
        setFormData({
          nombre: '',
          ubicacion_sector: '',
          altitud_msnm: '',
          hectareas_totales: '',
          hectareas_cacao: ''
        });
      }
    }
  }, [isOpen, fincaEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        socio_id: socioId,
        nombre: formData.nombre,
        ubicacion_sector: formData.ubicacion_sector || null,
        altitud_msnm: formData.altitud_msnm ? parseInt(formData.altitud_msnm) : null,
        hectareas_totales: formData.hectareas_totales ? parseFloat(formData.hectareas_totales) : null,
        hectareas_cacao: formData.hectareas_cacao ? parseFloat(formData.hectareas_cacao) : null
      };

      if (fincaEdit) {
        const { error } = await supabase.from('fincas').update(payload).eq('id', fincaEdit.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('fincas').insert([payload]);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving finca:', error);
      alert('Error al guardar la finca: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            {fincaEdit ? 'Editar Finca' : 'Nueva Finca'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="fincaForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nombre de la Finca *</label>
              <input
                required
                type="text"
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Ej: Finca La Esperanza"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Sector / Ubicación</label>
              <input
                type="text"
                value={formData.ubicacion_sector}
                onChange={e => setFormData({...formData, ubicacion_sector: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Ej: Recinto Paraíso, Vía Principal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Altitud (msnm)</label>
                <input
                  type="number"
                  value={formData.altitud_msnm}
                  onChange={e => setFormData({...formData, altitud_msnm: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Ej: 300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Hectáreas Totales</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.hectareas_totales}
                  onChange={e => setFormData({...formData, hectareas_totales: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Ej: 10.5"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Hectáreas Cacao</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.hectareas_cacao}
                  onChange={e => setFormData({...formData, hectareas_cacao: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Ej: 8"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="fincaForm"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Guardar Finca
          </button>
        </div>
      </div>
    </div>
  );
}
