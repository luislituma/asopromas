import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegistroSocio() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [grupos, setGrupos] = useState<any[]>([]);

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

  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    try {
      const { data } = await supabase.from('grupos_base').select('id, nombre').eq('estado', 'activo').order('nombre');
      if (data) setGrupos(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const { data, error: insertError } = await supabase
        .from('socios')
        .insert([{
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
        }]).select();

      if (insertError) throw insertError;

      setSuccess(true);
      
      // Si todo sale bien, lo mandamos a editar para que le agregue su Finca.
      if (data && data[0]) {
        setTimeout(() => {
          navigate(`/socios/editar/${data[0].id}`);
        }, 1500);
      } else {
        setTimeout(() => {
          navigate('/socios');
        }, 2000);
      }
      
    } catch (err: any) {
      console.error('Error guardando socio:', err);
      // Validaciones básicas de errores de BD
      if (err.code === '23505') {
        if (err.message.includes('codigo_socio')) {
          setError('Ya existe un socio registrado con ese Código de Socio.');
        } else {
          setError('Ya existe un socio registrado con esa cédula.');
        }
      } else {
        setError(err.message || 'Error al guardar los datos del socio.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <main className="max-w-3xl mx-auto p-6">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/socios" className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">Registrar Nuevo Socio</h1>
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
              <p className="ml-3 text-sm text-green-300">Socio guardado correctamente. Redirigiendo...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Código de Socio (Opcional)</label>
                <input
                  type="text"
                  name="codigo_socio"
                  value={formData.codigo_socio}
                  onChange={handleChange}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-amber-500 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ej. ASO-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Cédula o RUC *</label>
                <input
                  required
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ej. 1101234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Nombres *</label>
                <input
                  required
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Apellidos *</label>
                <input
                  required
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ej. 0991234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-300 mb-2">Dirección de Residencia</label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Nuevos campos: Documentos */}
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

              {/* Campos: Demografía y Banca */}
              <div className="pt-4 border-t border-neutral-700 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Género</label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- Seleccionar --</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Etnia o Pueblo (Opcional)</label>
                  <input
                    type="text"
                    name="etnia"
                    value={formData.etnia}
                    onChange={handleChange}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Ej. Shuar, Saraguro, Mestizo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Banco para Pagos</label>
                  <input
                    type="text"
                    name="banco_nombre"
                    value={formData.banco_nombre}
                    onChange={handleChange}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Ej. Banco de Loja, Pichincha..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Número de Cuenta</label>
                  <input
                    type="text"
                    name="banco_cuenta"
                    value={formData.banco_cuenta}
                    onChange={handleChange}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Tipo de Cacao Principal (Perfil)</label>
                  <select
                    name="tipo_cacao"
                    value={formData.tipo_cacao}
                    onChange={handleChange}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- Seleccionar --</option>
                    <option value="CCN-51">CCN-51</option>
                    <option value="Nacional">Nacional (Fino de Aroma)</option>
                    <option value="Super Árbol">Super Árbol</option>
                    <option value="Híbrido/Mezcla">Híbrido / Mezcla</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Grupo Base (Sector) *</label>
                  <select required name="grupo_id" value={formData.grupo_id} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">-- Seleccionar Grupo --</option>
                    {grupos.map(g => (
                      <option key={g.id} value={g.id}>{g.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-700">
              <button
                type="button"
                onClick={() => navigate('/socios')}
                className="px-6 py-2 border border-neutral-600 text-neutral-300 rounded-md hover:bg-neutral-700 transition-colors mr-4"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                {loading ? 'Guardando...' : 'Guardar Socio'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
