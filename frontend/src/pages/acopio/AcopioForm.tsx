import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, ArrowLeft, Save, Loader2, Package, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AcopioForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [responsables, setResponsables] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    fecha_inicio: new Date().toISOString().split('T')[0],
    responsable_id: '',
    notas: ''
  });

  useEffect(() => {
    async function loadResponsables() {
      try {
        const { data, error } = await supabase
          .from('perfiles')
          .select('id, nombre_completo, roles(nombre)')
          .eq('activo', true);
          
        if (error) throw error;
        
        if (data) {
          const permitidos = data.filter(p => 
            ['admin', 'tecnico', 'acopio'].includes(p.roles?.nombre)
          );
          setResponsables(permitidos.length > 0 ? permitidos : data);
        }
      } catch (err) {
        console.error('Error cargando responsables:', err);
      }
    }
    loadResponsables();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generar código único basado en la fecha
      const dateStr = formData.fecha_inicio.split('-').reverse().join('-'); // DD-MM-YYYY
      const codigo = `ACOPIO-${dateStr}`;

      const { data, error } = await supabase
        .from('lotes_acopio')
        .insert([{
          codigo: codigo,
          fecha_inicio: formData.fecha_inicio,
          responsable_id: formData.responsable_id || null,
          notas: formData.notas,
          estado: 'Abierto'
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
            const codeAlt = `${codigo}-${Math.floor(Math.random() * 1000)}`;
            const { error: err2 } = await supabase.from('lotes_acopio').insert([{
                codigo: codeAlt,
                fecha_inicio: formData.fecha_inicio,
                responsable_id: formData.responsable_id || null,
                notas: formData.notas,
                estado: 'Abierto'
            }]);
            if(err2) throw err2;
        } else {
            throw error;
        }
      }
      
      navigate('/acopio');
    } catch (error: any) {
      console.error('Error guardando acopio:', error);
      alert('Error al abrir el lote de acopio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/acopio" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" />
          Volver a Acopios
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Package className="w-8 h-8 text-emerald-600" />
            Abrir Lote de Acopio
          </h1>
          <p className="text-slate-500 mt-2">Crea el contenedor principal donde se sumarán todas las entregas de cacao de la jornada.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 space-y-6">
          
          <div className="space-y-6">
            {/* Fecha */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Fecha del Lote (Jornada) *
              </label>
              <input
                type="date"
                name="fecha_inicio"
                required
                value={formData.fecha_inicio}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
              />
              <p className="text-xs text-slate-500 mt-1 ml-1">
                El código del lote será: <span className="font-bold text-slate-700">ACOPIO-{formData.fecha_inicio.split('-').reverse().join('-')}</span>
              </p>
            </div>

            {/* Responsable */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                Encargado de Bodega *
              </label>
              <select
                name="responsable_id"
                required
                value={formData.responsable_id}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              >
                <option value="">-- Seleccionar Encargado --</option>
                {responsables.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre_completo}</option>
                ))}
              </select>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                Observaciones iniciales (Opcional)
              </label>
              <textarea
                name="notas"
                rows={3}
                placeholder="Ej: Acopio principal de la quincena, se espera cacao del sector Norte..."
                value={formData.notas}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link 
              to="/acopio"
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Abrir Lote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
