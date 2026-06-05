import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Save, Loader2, Map, Sprout, CheckSquare, AlertTriangle } from 'lucide-react';

export default function VisitaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isEjecucion = Boolean(id); // Si hay ID, estamos ejecutando un checklist de una visita ya creada
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [socios, setSocios] = useState<any[]>([]);
  const [fincas, setFincas] = useState<any[]>([]);
  const [visitaOriginal, setVisitaOriginal] = useState<any>(null);

  const [formData, setFormData] = useState({
    socio_id: '',
    finca_id: '',
    fecha_programada: new Date().toISOString().split('T')[0],
    estado: 'programada',
    observaciones: '',
    nivel_plagas: 'bajo',
    estado_cultivo: 'bueno',
    cumple_organico: true,
    recomendaciones_tecnicas: ''
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      if (isEjecucion) {
        // Cargar detalles de la visita para ejecutarla
        const { data, error } = await supabase
          .from('visitas_campo')
          .select('*, socios(nombres, apellidos), fincas(nombre)')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setVisitaOriginal(data);
        setFormData({
          ...formData,
          socio_id: data.socio_id,
          finca_id: data.finca_id,
          fecha_programada: data.fecha_programada,
          estado: data.estado,
          observaciones: data.observaciones || '',
          nivel_plagas: data.nivel_plagas || 'bajo',
          estado_cultivo: data.estado_cultivo || 'bueno',
          cumple_organico: data.cumple_organico ?? true,
          recomendaciones_tecnicas: data.recomendaciones_tecnicas || ''
        });
      } else {
        // Cargar listas para programar visita
        const { data: sData } = await supabase.from('socios').select('id, nombres, apellidos').eq('estado', 'activo');
        if (sData) setSocios(sData);
        
        const { data: fData } = await supabase.from('fincas').select('id, socio_id, nombre');
        if (fData) setFincas(fData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEjecucion) {
        // Actualizar con datos del checklist
        const payload = {
          estado: formData.estado,
          observaciones: formData.observaciones,
          nivel_plagas: formData.nivel_plagas,
          estado_cultivo: formData.estado_cultivo,
          cumple_organico: formData.cumple_organico,
          recomendaciones_tecnicas: formData.recomendaciones_tecnicas
        };
        await supabase.from('visitas_campo').update(payload).eq('id', id);
      } else {
        // Programar nueva visita
        const payload = {
          tecnico_id: user?.id,
          socio_id: formData.socio_id,
          finca_id: formData.finca_id,
          fecha_programada: formData.fecha_programada,
          estado: 'programada'
        };
        await supabase.from('visitas_campo').insert([payload]);
      }
      
      navigate('/campo/visitas');
    } catch (error: any) {
      console.error(error);
      alert('Error guardando la visita.');
    } finally {
      setLoading(false);
    }
  };

  const fincasFiltradas = fincas.filter(f => f.socio_id === formData.socio_id);

  if (fetching) return <div className="p-10 text-center text-white">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-3xl mx-auto">
        <Link to="/campo/visitas" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Visitas
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {isEjecucion ? <CheckSquare className="h-8 w-8 text-amber-500" /> : <Map className="h-8 w-8 text-amber-500" />}
            {isEjecucion ? 'Ejecutar Checklist de Inspección' : 'Programar Nueva Visita'}
          </h1>
          {isEjecucion && visitaOriginal && (
            <p className="text-neutral-400 mt-2">
              Socio: <span className="text-white font-medium">{visitaOriginal.socios.nombres} {visitaOriginal.socios.apellidos}</span> | 
              Finca: <span className="text-white font-medium">{visitaOriginal.fincas.nombre}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isEjecucion && (
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Socio Productor *</label>
                <select
                  required
                  value={formData.socio_id}
                  onChange={(e) => setFormData({...formData, socio_id: e.target.value, finca_id: ''})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Seleccionar Socio --</option>
                  {socios.map(s => <option key={s.id} value={s.id}>{s.nombres} {s.apellidos}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Finca a Visitar *</label>
                <select
                  required
                  value={formData.finca_id}
                  onChange={(e) => setFormData({...formData, finca_id: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  disabled={!formData.socio_id}
                >
                  <option value="">-- Seleccionar Finca --</option>
                  {fincasFiltradas.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Fecha Programada *</label>
                <input
                  required
                  type="date"
                  value={formData.fecha_programada}
                  onChange={(e) => setFormData({...formData, fecha_programada: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {isEjecucion && (
            <>
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8 space-y-6">
                <h3 className="text-lg font-bold text-amber-500 flex items-center gap-2 mb-4">
                  <Sprout className="h-5 w-5" /> Evaluación Técnica
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-300 block mb-2">Estado General del Cultivo</label>
                    <select
                      value={formData.estado_cultivo}
                      onChange={(e) => setFormData({...formData, estado_cultivo: e.target.value})}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="excelente">Excelente</option>
                      <option value="bueno">Bueno</option>
                      <option value="regular">Regular</option>
                      <option value="malo">Malo</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-300 block mb-2">Nivel de Plagas/Enfermedades</label>
                    <select
                      value={formData.nivel_plagas}
                      onChange={(e) => setFormData({...formData, nivel_plagas: e.target.value})}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="bajo">Bajo (Controlado)</option>
                      <option value="medio">Medio (Requiere atención)</option>
                      <option value="alto">Alto (Crítico)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-700 mt-4 flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="cumple_organico"
                    checked={formData.cumple_organico}
                    onChange={(e) => setFormData({...formData, cumple_organico: e.target.checked})}
                    className="w-5 h-5 accent-amber-500"
                  />
                  <label htmlFor="cumple_organico" className="text-sm font-medium text-white flex-1 cursor-pointer">
                    ¿Cumple con las normativas de certificación orgánica?
                  </label>
                  {!formData.cumple_organico && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-300 block mb-2">Recomendaciones Técnicas al Productor</label>
                  <textarea
                    value={formData.recomendaciones_tecnicas}
                    onChange={(e) => setFormData({...formData, recomendaciones_tecnicas: e.target.value})}
                    rows={3}
                    placeholder="Ej. Podar ramas secas, aplicar bioabono..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-neutral-300 block mb-2">Observaciones Internas de la Visita</label>
                  <textarea
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    rows={2}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <label className="text-sm font-medium text-neutral-300 block mb-2">Estado Final de la Visita</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="w-full bg-neutral-900 border border-amber-500/50 rounded-lg px-4 py-3 text-white font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="programada">Programada (Pendiente)</option>
                  <option value="completada">Completada (Ejecutada)</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {isEjecucion ? 'Guardar Checklist' : 'Programar Visita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
