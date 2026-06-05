import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2, Briefcase } from 'lucide-react';

export default function ProyectoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    presupuesto_asignado: 0,
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'planificacion'
  });

  useEffect(() => {
    if (isEdit) {
      loadProyecto();
    }
  }, [id]);

  const loadProyecto = async () => {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData({
          nombre: data.nombre,
          descripcion: data.descripcion || '',
          presupuesto_asignado: data.presupuesto_asignado || 0,
          fecha_inicio: data.fecha_inicio || '',
          fecha_fin: data.fecha_fin || '',
          estado: data.estado
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        presupuesto_asignado: formData.presupuesto_asignado,
        fecha_inicio: formData.fecha_inicio || null,
        fecha_fin: formData.fecha_fin || null,
        estado: formData.estado
      };

      if (isEdit) {
        await supabase.from('proyectos').update(payload).eq('id', id);
      } else {
        await supabase.from('proyectos').insert([payload]);
      }
      
      navigate('/proyectos');
    } catch (error: any) {
      console.error(error);
      alert('Error guardando el proyecto.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-white">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-3xl mx-auto">
        <Link to="/proyectos" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Proyectos
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-amber-500" />
            {isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-300 block mb-2">Nombre del Proyecto *</label>
              <input
                required
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-300 block mb-2">Descripción Corta</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                rows={3}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Presupuesto ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.presupuesto_asignado}
                onChange={(e) => setFormData({...formData, presupuesto_asignado: parseFloat(e.target.value)})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="planificacion">En Planificación</option>
                <option value="activo">Activo (Ejecución)</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Fecha de Inicio</label>
              <input
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Fecha de Fin (Estimada/Real)</label>
              <input
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-700">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Guardar Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
