import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { validarIdentificacionEcuador } from '../../utils/validations';
import { ArrowLeft, Save, Loader2, User } from 'lucide-react';

export default function ClienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [socios, setSocios] = useState<any[]>([]);
  const [tipoId, setTipoId] = useState<'cedula' | 'ruc' | 'pasaporte'>('cedula');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  
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
        let tipoLocal: 'cedula' | 'ruc' | 'pasaporte' = 'pasaporte';
        if (data.identificacion) {
          if (data.identificacion.length === 10) tipoLocal = 'cedula';
          else if (data.identificacion.length === 13) tipoLocal = 'ruc';
        }
        setTipoId(tipoLocal);

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

  // Validación en tiempo real para Identificación
  useEffect(() => {
    const checkIdentificacion = async () => {
      if (!formData.identificacion) {
        setErrors(prev => { const next = {...prev}; delete next.identificacion; return next; });
        return;
      }
      
      if (tipoId === 'cedula' || tipoId === 'ruc') {
        const validacion = validarIdentificacionEcuador(formData.identificacion, tipoId);
        if (!validacion.valido) {
          setErrors(prev => ({ ...prev, identificacion: validacion.error || 'Identificación inválida' }));
          return;
        }
      }
      
      let query = supabase.from('clientes').select('id').eq('identificacion', formData.identificacion);
      if (isEdit) query = query.neq('id', id);
      const { data: ext } = await query;
      if (ext && ext.length > 0) {
        setErrors(prev => ({ ...prev, identificacion: 'Esta identificación ya está registrada en otro cliente.' }));
      } else {
        setErrors(prev => { const next = {...prev}; delete next.identificacion; return next; });
      }
    };
    
    const timeoutId = setTimeout(checkIdentificacion, 600);
    return () => clearTimeout(timeoutId);
  }, [formData.identificacion, tipoId, isEdit, id]);

  // Validación en tiempo real para Email
  useEffect(() => {
    if (formData.email) {
      const isValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email);
      if (!isValid) {
        setErrors(prev => ({ ...prev, email: 'Formato de correo electrónico inválido.' }));
      } else {
        setErrors(prev => { const next = {...prev}; delete next.email; return next; });
      }
    } else {
      setErrors(prev => { const next = {...prev}; delete next.email; return next; });
    }
  }, [formData.email]);

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
    setFormError('');
    
    if (Object.keys(errors).length > 0) {
      setFormError('Por favor, corrige los errores marcados en rojo antes de continuar.');
      return;
    }
    
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

      let newId = id;
      if (isEdit) {
        await supabase.from('clientes').update(payload).eq('id', id);
      } else {
        const { data, error: insertErr } = await supabase.from('clientes').insert([payload]).select().single();
        if (insertErr) throw insertErr;
        newId = data.id;
      }
      
      const params = new URLSearchParams(location.search);
      if (params.get('returnTo') === 'venta') {
        navigate(`/ventas/nueva?cliente_id=${newId}`);
      } else {
        navigate('/ventas/clientes');
      }
    } catch (error: any) {
      console.error(error);
      setFormError(error.message || 'Error guardando el cliente. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-white">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-3xl mx-auto">
        <Link to={new URLSearchParams(location.search).get('returnTo') === 'venta' ? "/ventas/nueva" : "/ventas/clientes"} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> {new URLSearchParams(location.search).get('returnTo') === 'venta' ? 'Volver a Nueva Venta' : 'Volver al Directorio'}
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="h-8 w-8 text-amber-500" />
            {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8 space-y-6">
          {formError && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 font-medium">
              ⚠️ {formError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Tipo de Cliente *</label>
              <select
                required
                value={formData.tipo_cliente}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({...formData, tipo_cliente: val});
                  if (val === 'exportacion') {
                    setTipoId('pasaporte'); // Para omitir validación ecuatoriana por defecto
                  } else {
                    setTipoId('ruc'); // Por defecto a empresas/RUC nacional
                  }
                }}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="nacional">Nacional (Empresa/Persona)</option>
                <option value="distribuidor">Distribuidor / Mayorista</option>
                <option value="tienda">Tienda / Local Comercial</option>
                <option value="exportacion">Exportación (Internacional)</option>
              </select>
            </div>

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
              <label className="text-sm font-medium text-neutral-300 block mb-2">
                {formData.tipo_cliente === 'exportacion' ? 'Tax ID / Identificación Fiscal' : 'Identificación'}
              </label>
              <div className="flex gap-2">
                <select
                  value={tipoId}
                  onChange={(e) => setTipoId(e.target.value as any)}
                  className="w-1/3 bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  {formData.tipo_cliente !== 'exportacion' && (
                    <>
                      <option value="cedula">Cédula</option>
                      <option value="ruc">RUC</option>
                    </>
                  )}
                  <option value="pasaporte">
                    {formData.tipo_cliente === 'exportacion' ? 'Tax ID / Extranjero' : 'Otro (Pasaporte)'}
                  </option>
                </select>
                <input
                  type="text"
                  placeholder={tipoId === 'cedula' ? '10 dígitos' : tipoId === 'ruc' ? '13 dígitos (001)' : 'Pasaporte...'}
                  value={formData.identificacion}
                  onChange={(e) => setFormData({...formData, identificacion: e.target.value})}
                  className={`w-2/3 bg-neutral-900 border ${errors.identificacion ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-amber-500'} rounded-lg px-4 py-2.5 text-white focus:outline-none`}
                />
              </div>
              {errors.identificacion && <p className="text-red-400 text-xs mt-1">{errors.identificacion}</p>}
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
                className={`w-full bg-neutral-900 border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-amber-500'} rounded-lg px-4 py-2.5 text-white focus:outline-none`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-300 block mb-2">
                {formData.tipo_cliente === 'exportacion' ? 'País, Ciudad y Dirección de Destino' : 'Dirección Completa'}
              </label>
              <textarea
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                rows={2}
                placeholder={formData.tipo_cliente === 'exportacion' ? 'Ej: Miami, USA. 123 Export Ave...' : ''}
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
