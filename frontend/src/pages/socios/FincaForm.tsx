import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2, Search, MapPin, Award } from 'lucide-react';

export default function FincaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    socio_id: '',
    hectareas_totales: '',
    hectareas_cacao: '',
    latitud: '',
    longitud: '',
    certificada: false,
    certificaciones: [] as string[],
    variedades_cacao: [] as string[]
  });

  // Búsqueda de socio propietario
  const [searchQuery, setSearchQuery] = useState('');
  const [sociosResult, setSociosResult] = useState<any[]>([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState<any>(null);
  const [searchError, setSearchError] = useState('');

  const OPCIONES_VARIEDADES = ['CCN-51', 'Nacional Fino de Aroma', 'Súper Árbol', 'Híbrido/Mezcla'];
  const OPCIONES_CERTIFICACIONES = ['Cacao Nacional Fino de Aroma', 'Cacao Ancestral', 'Orgánico', 'Comercio Justo (FairTrade)'];

  useEffect(() => {
    if (isEdit) {
      loadFinca();
    }
  }, [id]);

  const loadFinca = async () => {
    try {
      const { data, error } = await supabase
        .from('fincas')
        .select('*, socios(*)')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (data) {
        setFormData({
          nombre: data.nombre || '',
          ubicacion: data.ubicacion || '',
          socio_id: data.socio_id || '',
          hectareas_totales: data.hectareas_totales || '',
          hectareas_cacao: data.hectareas_cacao || '',
          latitud: data.latitud || '',
          longitud: data.longitud || '',
          certificada: data.certificada || false,
          certificaciones: data.certificaciones || [],
          variedades_cacao: data.variedades_cacao || []
        });
        if (data.socios) {
          setSocioSeleccionado(data.socios);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const handleSearchSocio = async () => {
    if (!searchQuery.trim()) return;
    setSearchError('');
    setSociosResult([]);

    try {
      const q = `%${searchQuery.trim()}%`;
      const { data, error } = await supabase
        .from('socios')
        .select('*')
        .or(`cedula.ilike.${q},nombres.ilike.${q},apellidos.ilike.${q}`)
        .limit(5);

      if (error) throw error;
      if (!data || data.length === 0) {
        setSearchError('No se encontró ningún socio.');
        return;
      }
      setSociosResult(data);
    } catch (error) {
      setSearchError('Error al buscar.');
    }
  };

  const seleccionarSocio = (s: any) => {
    setSocioSeleccionado(s);
    setFormData({ ...formData, socio_id: s.id });
    setSociosResult([]);
    setSearchQuery('');
  };

  const removerSocio = () => {
    setSocioSeleccionado(null);
    setFormData({ ...formData, socio_id: '' });
  };

  const toggleArrayItem = (field: 'certificaciones' | 'variedades_cacao', value: string) => {
    setFormData(prev => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.socio_id) {
      alert("Debes asignar un socio propietario a esta finca.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nombre: formData.nombre,
        ubicacion: formData.ubicacion || null,
        socio_id: formData.socio_id,
        hectareas_totales: formData.hectareas_totales ? parseFloat(formData.hectareas_totales) : null,
        hectareas_cacao: formData.hectareas_cacao ? parseFloat(formData.hectareas_cacao) : null,
        latitud: formData.latitud ? parseFloat(formData.latitud) : null,
        longitud: formData.longitud ? parseFloat(formData.longitud) : null,
        certificada: formData.certificada,
        certificaciones: formData.certificaciones,
        variedades_cacao: formData.variedades_cacao
      };

      if (isEdit) {
        const { error } = await supabase.from('fincas').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('fincas').insert([payload]);
        if (error) throw error;
      }
      
      navigate('/fincas');
    } catch (error: any) {
      console.error(error);
      alert('Error guardando la finca.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      alert('Debes ingresar un motivo para eliminar la finca.');
      return;
    }
    setDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from('fincas')
        .update({
          estado: 'eliminado',
          motivo_eliminacion: deleteReason
        })
        .eq('id', id);

      if (deleteError) throw deleteError;
      navigate('/fincas');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error al eliminar la finca.');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-white">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-3xl mx-auto">
        <Link to="/fincas" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Fincas
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MapPin className="h-8 w-8 text-emerald-500" />
            {isEdit ? 'Editar Finca' : 'Registrar Nueva Finca'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8 space-y-8">
          
          {/* SECCIÓN PROPIETARIO */}
          <section>
            <h2 className="text-lg font-medium text-emerald-400 mb-4 border-b border-neutral-700 pb-2">Propietario de la Finca</h2>
            {socioSeleccionado ? (
              <div className="flex items-center justify-between bg-neutral-900 border border-emerald-500/30 p-4 rounded-lg">
                <div>
                  <p className="font-medium text-white">{socioSeleccionado.nombres} {socioSeleccionado.apellidos}</p>
                  <p className="text-sm text-neutral-400">C.I: {socioSeleccionado.cedula}</p>
                </div>
                {!isEdit && (
                  <button type="button" onClick={removerSocio} className="text-red-400 hover:text-red-300 text-sm font-medium">
                    Cambiar Socio
                  </button>
                )}
              </div>
            ) : (
              <div>
                <div className="flex gap-3 mb-2">
                  <input
                    type="text"
                    placeholder="Buscar socio por cédula o nombre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleSearchSocio(); } }}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleSearchSocio}
                    className="px-4 py-2.5 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" /> Buscar
                  </button>
                </div>
                {searchError && <p className="text-red-400 text-sm mb-2">{searchError}</p>}
                
                {sociosResult.length > 0 && (
                  <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
                    <ul className="divide-y divide-neutral-700">
                      {sociosResult.map(s => (
                        <li key={s.id}>
                          <button 
                            type="button" 
                            onClick={() => seleccionarSocio(s)}
                            className="w-full text-left p-3 hover:bg-neutral-800 transition-colors flex justify-between items-center"
                          >
                            <span><span className="font-medium text-white">{s.nombres} {s.apellidos}</span> - <span className="text-neutral-400 text-sm">{s.cedula}</span></span>
                            <span className="text-emerald-500 text-xs font-medium">Seleccionar</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* SECCIÓN DATOS GENERALES */}
          <section>
            <h2 className="text-lg font-medium text-emerald-400 mb-4 border-b border-neutral-700 pb-2">Datos Generales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-neutral-300 block mb-2">Nombre de la Finca *</label>
                <input
                  required
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-neutral-300 block mb-2">Dirección o Referencia Geográfica</label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                  placeholder="Ej. Recinto La Paz, a 5km de la vía principal"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Hectáreas Totales</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.hectareas_totales}
                  onChange={(e) => setFormData({...formData, hectareas_totales: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Hectáreas de Cacao</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.hectareas_cacao}
                  onChange={(e) => setFormData({...formData, hectareas_cacao: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Latitud (Coordenadas)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitud}
                  onChange={(e) => setFormData({...formData, latitud: e.target.value})}
                  placeholder="-1.234567"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Longitud (Coordenadas)</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitud}
                  onChange={(e) => setFormData({...formData, longitud: e.target.value})}
                  placeholder="-79.123456"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN PRODUCCIÓN Y CERTIFICACIONES */}
          <section>
            <h2 className="text-lg font-medium text-emerald-400 mb-4 border-b border-neutral-700 pb-2">Producción y Certificaciones</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-3">Variedades de Cacao Cultivadas</label>
                <div className="space-y-3 bg-neutral-900/50 p-4 rounded-lg border border-neutral-700">
                  {OPCIONES_VARIEDADES.map(variedad => (
                    <label key={variedad} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={formData.variedades_cacao.includes(variedad)}
                        onChange={() => toggleArrayItem('variedades_cacao', variedad)}
                        className="w-5 h-5 rounded bg-neutral-900 border-neutral-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900"
                      />
                      <span className="text-neutral-300 group-hover:text-white transition-colors">{variedad}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-500" />
                    Certificaciones Obtenidas
                  </label>
                  <label className="flex items-center gap-2 text-sm text-emerald-400 font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.certificada}
                      onChange={(e) => setFormData({...formData, certificada: e.target.checked})}
                      className="rounded bg-neutral-900 border-emerald-500 text-emerald-500"
                    />
                    Finca Certificada
                  </label>
                </div>
                
                <div className="space-y-3 bg-neutral-900/50 p-4 rounded-lg border border-neutral-700">
                  {OPCIONES_CERTIFICACIONES.map(cert => (
                    <label key={cert} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        disabled={!formData.certificada}
                        checked={formData.certificaciones.includes(cert)}
                        onChange={() => toggleArrayItem('certificaciones', cert)}
                        className="w-5 h-5 rounded bg-neutral-900 border-neutral-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900 disabled:opacity-50"
                      />
                      <span className={`text-neutral-300 group-hover:text-white transition-colors ${!formData.certificada && 'opacity-50'}`}>{cert}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="pt-6 flex justify-end border-t border-neutral-700">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Guardar Finca
            </button>
          </div>
        </form>

        {/* Zona de Peligro */}
        {isEdit && (
          <div className="mt-8 bg-red-900/10 border border-red-900/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-500 mb-2">Zona de Peligro</h2>
            <p className="text-neutral-400 text-sm mb-4">
              Al eliminar esta finca, se ocultará de los directorios activos. El historial de producción y entregas asociado a la finca se mantendrá para fines de auditoría.
            </p>
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600/20 text-red-500 border border-red-600/50 rounded-md hover:bg-red-600 hover:text-white transition-colors"
            >
              Eliminar Finca
            </button>
          </div>
        )}

      </div>

      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Eliminar Finca</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Por favor, indica el motivo por el cual estás eliminando esta finca.
            </p>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows={3}
              placeholder="Ej: Finca vendida, Finca abandonada..."
              required
            ></textarea>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-neutral-600 text-neutral-300 rounded-md hover:bg-neutral-800 transition-colors"
                disabled={deleting}
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                disabled={deleting || !deleteReason.trim()}
              >
                {deleting && <Loader2 className="animate-spin h-4 w-4" />}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
