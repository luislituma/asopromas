import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2, User } from 'lucide-react';

export default function ClienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [socios, setSocios] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    nombre_razon_social: '',
    identificacion: '',
    tipo_cliente: 'nacional',
    socio_id: '',
    contacto_principal: '',
    telefono: '',
    email: '',
    direccion: '',
    estado: 'activo'
  });

  useEffect(() => {
    loadSocios();
    if (isEdit) {
      loadCliente();
    }
  }, [id]);

  const loadSocios = async () => {
    try {
      const { data, error } = await supabase.from('socios').select('id, nombres, apellidos, cedula').eq('estado', 'activo');
      if (error) console.error('Error cargando socios:', error);
      if (data) setSocios(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCliente = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData({
          nombre_razon_social: data.nombre_razon_social,
          identificacion: data.identificacion || '',
          tipo_cliente: data.tipo_cliente,
          socio_id: data.socio_id || '',
          contacto_principal: data.contacto_principal || '',
          telefono: data.telefono || '',
          email: data.email || '',
          direccion: data.direccion || '',
          estado: data.estado
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const handleSocioSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    if (sId) {
      const socio = socios.find(s => s.id === sId);
      if (socio) {
        setFormData(prev => ({
          ...prev,
          socio_id: sId,
          nombre_razon_social: `${socio.nombres} ${socio.apellidos}`,
          identificacion: socio.cedula || prev.identificacion
        }));
      }
    } else {
      setFormData(prev => ({...prev, socio_id: ''}));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nombre_razon_social: formData.nombre_razon_social,
        identificacion: formData.identificacion || null,
        tipo_cliente: formData.tipo_cliente,
        socio_id: formData.tipo_cliente === 'socio' && formData.socio_id ? formData.socio_id : null,
        contacto_principal: formData.contacto_principal || null,
        telefono: formData.telefono || null,
        email: formData.email || null,
        direccion: formData.direccion || null,
        estado: formData.estado
      };

      if (isEdit) {
        await supabase.from('clientes').update(payload).eq('id', id);
      } else {
        await supabase.from('clientes').insert([payload]);
      }
      
      navigate('/ventas/clientes');
    } catch (error: any) {
      console.error(error);
      alert('Error guardando el cliente.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-white">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-3xl mx-auto">
        <Link to="/ventas/clientes" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Directorio
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="h-8 w-8 text-amber-500" />
            {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Tipo de Cliente *</label>
              <select
                required
                value={formData.tipo_cliente}
                onChange={(e) => setFormData({...formData, tipo_cliente: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="nacional">Nacional (Empresa/Persona)</option>
                <option value="exportacion">Exportación (Internacional)</option>
                <option value="distribuidor">Distribuidor / Mayorista</option>
                <option value="tienda">Tienda / Local Comercial</option>
                <option value="socio">Socio de ASOPROMAS</option>
              </select>
            </div>

            {formData.tipo_cliente === 'socio' ? (
              <div>
                <label className="text-sm font-medium text-amber-400 block mb-2">Seleccionar Socio de la Base de Datos</label>
                <input
                  type="text"
                  list="socios-list"
                  placeholder="Escribe el nombre o cédula del socio..."
                  onChange={(e) => {
                    const val = e.target.value;
                    const socio = socios.find(s => `${s.nombres} ${s.apellidos} (${s.cedula})` === val);
                    if (socio) {
                      setFormData(prev => ({
                        ...prev,
                        socio_id: socio.id,
                        nombre_razon_social: `${socio.nombres} ${socio.apellidos}`,
                        identificacion: socio.cedula || prev.identificacion
                      }));
                    } else if (val === '') {
                      setFormData(prev => ({...prev, socio_id: ''}));
                    }
                  }}
                  className="w-full bg-neutral-900 border border-amber-500/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
                <datalist id="socios-list">
                  {socios.map(s => (
                    <option key={s.id} value={`${s.nombres} ${s.apellidos} (${s.cedula})`} />
                  ))}
                </datalist>
              </div>
            ) : (
              <div></div>
            )}

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-300 block mb-2">Nombre o Razón Social *</label>
              <input
                required
                type="text"
                value={formData.nombre_razon_social}
                onChange={(e) => setFormData({...formData, nombre_razon_social: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Identificación (RUC/CI)</label>
              <input
                type="text"
                value={formData.identificacion}
                onChange={(e) => setFormData({...formData, identificacion: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Persona de Contacto</label>
              <input
                type="text"
                value={formData.contacto_principal}
                onChange={(e) => setFormData({...formData, contacto_principal: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Teléfono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-300 block mb-2">Dirección Completa</label>
              <textarea
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                rows={2}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {isEdit && (
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
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-700">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
