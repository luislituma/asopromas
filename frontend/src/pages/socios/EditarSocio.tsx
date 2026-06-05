import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2, Map, Link as LinkIcon } from 'lucide-react';

export default function EditarSocio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fincasSocio, setFincasSocio] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    codigo_socio: '',
    cedula: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    direccion: '',
    genero: '',
    etnia: '',
    banco_nombre: '',
    banco_cuenta: '',
    tipo_cacao: '',
    grupo_id: '',
    enlace_documentos: ''
  });

  const fetchGrupos = async () => {
    try {
      const { data } = await supabase.from('grupos_base').select('id, nombre').eq('estado', 'activo').order('nombre');
      if (data) setGrupos(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function loadSocio() {
      if (!id) return;
      try {
        await fetchGrupos();
        const { data, error } = await supabase.from('socios').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) {
          setFormData({
            codigo_socio: data.codigo_socio || '',
            cedula: data.cedula || '',
            nombres: data.nombres || '',
            apellidos: data.apellidos || '',
            telefono: data.telefono || '',
            email: data.email || '',
            direccion: data.direccion || '',
            genero: data.genero || '',
            etnia: data.etnia || '',
            banco_nombre: data.banco_nombre || '',
            banco_cuenta: data.banco_cuenta || '',
            tipo_cacao: data.tipo_cacao || '',
            grupo_id: data.grupo_id || '',
            enlace_documentos: data.enlace_documentos || ''
          });
          
          // Cargar fincas del socio
          const { data: fincasData } = await supabase.from('fincas').select('*').eq('socio_id', id);
          if (fincasData) setFincasSocio(fincasData);
        }
      } catch (err) {
        setError('No se pudo cargar la información del socio.');
      } finally {
        setFetching(false);
      }
    }
    loadSocio();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from('socios')
        .update({
          codigo_socio: formData.codigo_socio || null,
          cedula: formData.cedula,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          telefono: formData.telefono || null,
          email: formData.email || null,
          direccion: formData.direccion || null,
          genero: formData.genero || null,
          etnia: formData.etnia || null,
          banco_nombre: formData.banco_nombre || null,
          banco_cuenta: formData.banco_cuenta || null,
          tipo_cacao: formData.tipo_cacao || null,
          grupo_id: formData.grupo_id || null,
          enlace_documentos: formData.enlace_documentos || null
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => navigate('/socios'), 1500);
      
    } catch (err: any) {
      console.error(err);
      if (err.code === '23505') {
        if (err.message.includes('codigo_socio')) {
          setError('Ya existe otro socio registrado con ese Código de Socio.');
        } else {
          setError('Ya existe otro socio registrado con esa cédula.');
        }
      } else {
        setError(err.message || 'Error al actualizar los datos del socio.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      setError('Debes ingresar un motivo para eliminar al socio.');
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('socios')
        .update({
          estado: 'eliminado',
          motivo_eliminacion: deleteReason
        })
        .eq('id', id);

      if (deleteError) throw deleteError;
      navigate('/socios');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al eliminar el socio.');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-white">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <main className="max-w-3xl mx-auto p-6">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/socios" className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">Editar Socio</h1>
        </div>

        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 md:p-8">
          
          {error && (
            <div className="mb-6 bg-red-900/50 border border-red-500 rounded-md p-4 flex">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="ml-3 text-sm text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-900/50 border border-green-500 rounded-md p-4 flex">
              <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
              <p className="ml-3 text-sm text-green-300">Socio actualizado correctamente.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Código de Socio (Opcional)</label>
                <input type="text" name="codigo_socio" value={formData.codigo_socio} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-amber-500 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Ej. ASO-001" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Cédula o RUC *</label>
                <input required type="text" name="cedula" value={formData.cedula} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Teléfono</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Nombres *</label>
                <input required type="text" name="nombres" value={formData.nombres} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Apellidos *</label>
                <input required type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-300 mb-2">Correo Electrónico</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-300 mb-2">Dirección de Residencia</label>
                <textarea name="direccion" value={formData.direccion} onChange={handleChange} rows={2} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              {/* Documentos */}
              <div className="md:col-span-2 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <LinkIcon className="h-4 w-4 text-blue-400" />
                  Enlace a Carpeta de Documentos (Google Drive / OneDrive)
                </label>
                <input
                  type="url"
                  name="enlace_documentos"
                  value={formData.enlace_documentos}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded-md py-2 px-3 text-blue-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="https://drive.google.com/drive/folders/..."
                />
                <p className="text-xs text-neutral-500 mt-2">
                  Pega aquí el enlace público o compartido de la carpeta en la nube donde guardas la cédula, RUC, escrituras y otros documentos del socio.
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-700 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Género</label>
                  <select name="genero" value={formData.genero} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">-- Seleccionar --</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Etnia o Pueblo (Opcional)</label>
                  <input type="text" name="etnia" value={formData.etnia} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Banco para Pagos</label>
                  <input type="text" name="banco_nombre" value={formData.banco_nombre} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Número de Cuenta</label>
                  <input type="text" name="banco_cuenta" value={formData.banco_cuenta} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Tipo de Cacao Principal (Perfil)</label>
                  <select name="tipo_cacao" value={formData.tipo_cacao} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">-- Seleccionar --</option>
                    <option value="CCN-51">CCN-51</option>
                    <option value="Nacional">Nacional (Fino de Aroma)</option>
                    <option value="Super Árbol">Super Árbol</option>
                    <option value="Híbrido/Mezcla">Híbrido / Mezcla</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Grupo Base (Sector) *</label>
                  <select required name="grupo_id" value={formData.grupo_id} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">-- Seleccionar Grupo --</option>
                    {grupos.map(g => (
                      <option key={g.id} value={g.id}>{g.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-700">
              <button type="button" onClick={() => navigate('/socios')} className="px-6 py-2 border border-neutral-600 text-neutral-300 rounded-md hover:bg-neutral-700 transition-colors mr-4">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                Actualizar Socio
              </button>
            </div>
          </form>
        </div>
        
        {/* SECCIÓN FINCAS DEL SOCIO */}
        <div className="mt-8 bg-neutral-800 rounded-xl border border-neutral-700 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Map className="h-5 w-5 text-emerald-500" /> Fincas Registradas
            </h2>
            <Link to="/fincas/nuevo" className="text-sm px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors">
              Añadir Finca
            </Link>
          </div>
          
          {fincasSocio.length === 0 ? (
            <p className="text-neutral-400 text-sm">Este socio no tiene fincas registradas aún.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fincasSocio.map(finca => (
                <Link key={finca.id} to={`/fincas/editar/${finca.id}`} className="block p-4 border border-neutral-700 rounded-lg hover:border-emerald-500 transition-colors bg-neutral-900/50">
                  <h3 className="font-bold text-white">{finca.nombre}</h3>
                  <p className="text-sm text-neutral-400 mt-1">{finca.hectareas_totales || 0} hectáreas totales</p>
                  {finca.certificada && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                      Certificada
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Zona de Peligro */}
        <div className="mt-8 bg-red-900/10 border border-red-900/50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-red-500 mb-2">Zona de Peligro</h2>
          <p className="text-neutral-400 text-sm mb-4">
            Al eliminar este socio, se ocultará de los directorios activos, pero su historial de operaciones (entregas de cacao, fincas, pagos) se mantendrá en la base de datos por seguridad.
          </p>
          <button 
            type="button" 
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600/20 text-red-500 border border-red-600/50 rounded-md hover:bg-red-600 hover:text-white transition-colors"
          >
            Eliminar Socio
          </button>
        </div>

      </main>

      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Eliminar Socio</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Por favor, indica el motivo por el cual estás eliminando o dando de baja a este socio.
            </p>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows={3}
              placeholder="Ej: Retiro voluntario, Expulsión..."
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
