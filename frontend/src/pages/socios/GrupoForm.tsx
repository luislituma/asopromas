// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2, Search, AlertCircle } from 'lucide-react';

export default function GrupoForm() {
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
    estado: 'activo',
    presidente_id: ''
  });

  // Búsqueda de socio para presidente
  const [searchQuery, setSearchQuery] = useState('');
  const [sociosResult, setSociosResult] = useState<any[]>([]);
  const [presidenteSeleccionado, setPresidenteSeleccionado] = useState<any>(null);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadGrupo();
    }
  }, [id]);

  const loadGrupo = async () => {
    try {
      const { data, error } = await supabase
        .from('grupos_base')
        .select('*, presidente:presidente_id(*)')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (data) {
        setFormData({
          nombre: data.nombre,
          estado: data.estado,
          presidente_id: data.presidente_id || ''
        });
        if (data.presidente) {
          setPresidenteSeleccionado(data.presidente);
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

  const seleccionarPresidente = (s: any) => {
    setPresidenteSeleccionado(s);
    setFormData({ ...formData, presidente_id: s.id });
    setSociosResult([]);
    setSearchQuery('');
  };

  const removerPresidente = () => {
    setPresidenteSeleccionado(null);
    setFormData({ ...formData, presidente_id: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nombre: formData.nombre,
        estado: formData.estado,
        presidente_id: formData.presidente_id || null
      };

      if (isEdit) {
        const { error } = await supabase.from('grupos_base').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('grupos_base').insert([payload]);
        if (error) throw error;
      }
      
      navigate('/grupos');
    } catch (error: any) {
      console.error(error);
      alert('Error guardando el grupo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      alert('Debes ingresar un motivo para eliminar el grupo.');
      return;
    }
    setDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from('grupos_base')
        .update({
          estado: 'eliminado',
          motivo_eliminacion: deleteReason
        })
        .eq('id', id);

      if (deleteError) throw deleteError;
      navigate('/grupos');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error al eliminar el grupo.');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-white">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-2xl mx-auto">
        <Link to="/grupos" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a Grupos
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{isEdit ? 'Editar Grupo Base' : 'Nuevo Grupo Base'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 space-y-6">
          
          <div>
            <label className="text-sm font-medium text-neutral-300 block mb-2">Nombre del Grupo / Sector *</label>
            <input
              required
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              placeholder="Ej. Grupo Base San Juan"
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
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="pt-4 border-t border-neutral-700">
            <label className="text-sm font-medium text-neutral-300 block mb-2">Presidente o Líder de Grupo (Opcional)</label>
            
            {presidenteSeleccionado ? (
              <div className="flex items-center justify-between bg-neutral-900 border border-amber-500/50 p-4 rounded-lg">
                <div>
                  <p className="font-medium text-white">{presidenteSeleccionado.nombres} {presidenteSeleccionado.apellidos}</p>
                  <p className="text-sm text-neutral-400">C.I: {presidenteSeleccionado.cedula}</p>
                </div>
                <button type="button" onClick={removerPresidente} className="text-red-400 hover:text-red-300 text-sm font-medium">
                  Quitar
                </button>
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
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
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
                            onClick={() => seleccionarPresidente(s)}
                            className="w-full text-left p-3 hover:bg-neutral-800 transition-colors flex justify-between items-center"
                          >
                            <span><span className="font-medium text-white">{s.nombres} {s.apellidos}</span> - <span className="text-neutral-400 text-sm">{s.cedula}</span></span>
                            <span className="text-amber-500 text-xs font-medium">Asignar</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Guardar Grupo
            </button>
          </div>
        </form>

        {/* Zona de Peligro */}
        {isEdit && (
          <div className="mt-8 bg-red-900/10 border border-red-900/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-500 mb-2">Zona de Peligro</h2>
            <p className="text-neutral-400 text-sm mb-4">
              Al eliminar este grupo, se ocultará de los directorios activos. Los socios asignados a este grupo mantendrán su asociación temporalmente.
            </p>
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600/20 text-red-500 border border-red-600/50 rounded-md hover:bg-red-600 hover:text-white transition-colors"
            >
              Eliminar Grupo
            </button>
          </div>
        )}

      </div>

      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Eliminar Grupo</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Por favor, indica el motivo por el cual estás eliminando este grupo.
            </p>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows={3}
              placeholder="Ej: Grupo inactivo, Disolución..."
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
