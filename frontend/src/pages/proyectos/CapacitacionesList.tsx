import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Loader2, ArrowLeft, Users, Calendar, MapPin, UserCheck } from 'lucide-react';

export default function CapacitacionesList() {
  const [capacitaciones, setCapacitaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulario rápido en modal o directo (lo haremos básico)
  const [showForm, setShowForm] = useState(false);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    proyecto_id: '',
    tema: '',
    fecha: new Date().toISOString().split('T')[0],
    lugar: '',
    expositor: '',
    estado: 'programada'
  });

  useEffect(() => {
    fetchCapacitaciones();
    fetchProyectos();
  }, []);

  const fetchCapacitaciones = async () => {
    try {
      const { data, error } = await supabase
        .from('capacitaciones')
        .select(`
          *,
          proyectos ( nombre )
        `)
        .order('fecha', { ascending: false });

      if (error) throw error;
      setCapacitaciones(data || []);
    } catch (error) {
      console.error('Error fetching capacitaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProyectos = async () => {
    const { data } = await supabase.from('proyectos').select('id, nombre').in('estado', ['activo', 'planificacion']);
    if (data) setProyectos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        proyecto_id: formData.proyecto_id || null,
        tema: formData.tema,
        fecha: formData.fecha,
        lugar: formData.lugar,
        expositor: formData.expositor,
        estado: formData.estado
      };

      await supabase.from('capacitaciones').insert([payload]);
      setShowForm(false);
      setFormData({...formData, tema: '', lugar: '', expositor: ''});
      fetchCapacitaciones();
    } catch (error) {
      console.error(error);
      alert('Error guardando la capacitación.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <Link to="/proyectos" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Proyectos
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-amber-500" />
              Capacitaciones y Talleres
            </h1>
            <p className="text-neutral-400 mt-1">Gestión de eventos formativos para socios y toma de asistencia.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Programar Taller
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-bold text-amber-500 mb-2">Programar Nuevo Taller</h3>
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-1">Tema Principal *</label>
              <input required type="text" value={formData.tema} onChange={e => setFormData({...formData, tema: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-1">Proyecto (Opcional)</label>
              <select value={formData.proyecto_id} onChange={e => setFormData({...formData, proyecto_id: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                <option value="">-- Sin Proyecto --</option>
                {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-1">Fecha *</label>
              <input required type="date" value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-1">Lugar</label>
              <input type="text" value={formData.lugar} onChange={e => setFormData({...formData, lugar: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-1">Expositor/Técnico</label>
              <input type="text" value={formData.expositor} onChange={e => setFormData({...formData, expositor: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
            </div>

            <div className="flex items-end">
              <button type="submit" className="w-full bg-amber-500 text-black font-bold py-2 rounded-lg hover:bg-amber-600 transition-colors">
                Guardar Taller
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full p-12 flex justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-amber-500" />
            </div>
          ) : capacitaciones.length === 0 ? (
            <div className="col-span-full p-12 text-center text-neutral-400 bg-neutral-800 rounded-xl border border-neutral-700">
              <p>No hay talleres programados.</p>
            </div>
          ) : (
            capacitaciones.map((cap) => (
              <div key={cap.id} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-amber-500/50 transition-colors flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${cap.estado === 'realizada' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {cap.estado.toUpperCase()}
                  </span>
                  <Link 
                    to={`/capacitaciones/${cap.id}/asistencia`}
                    className="text-amber-500 hover:text-amber-400 text-sm flex items-center gap-1 font-medium bg-amber-500/10 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <UserCheck className="h-4 w-4" /> Asistencia
                  </Link>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{cap.tema}</h3>
                
                {cap.proyectos?.nombre && (
                  <div className="inline-flex items-center gap-1 text-xs text-neutral-400 bg-neutral-900 px-2 py-1 rounded mb-4 w-fit">
                    Proyecto: {cap.proyectos.nombre}
                  </div>
                )}
                
                <div className="space-y-2 text-sm text-neutral-300 mt-auto">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    {new Date(cap.fecha).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    {cap.lugar || 'Por definir'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-amber-500" />
                    Expositor: {cap.expositor || 'Por definir'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
