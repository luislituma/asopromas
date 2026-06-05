import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2, Monitor } from 'lucide-react';

export default function EquipoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: 'maquinaria',
    marca: '',
    modelo: '',
    numero_serie: '',
    fecha_adquisicion: '',
    valor_adquisicion: '',
    estado: 'operativo',
    ubicacion: '',
    notas: ''
  });

  useEffect(() => {
    if (isEdit) {
      loadEquipo();
    } else {
      generateCodigo();
    }
  }, [id]);

  const generateCodigo = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, codigo: `ACT-${random}` }));
  };

  const loadEquipo = async () => {
    try {
      const { data, error } = await supabase
        .from('inventario_equipos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData({
          codigo: data.codigo || '',
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          categoria: data.categoria || 'maquinaria',
          marca: data.marca || '',
          modelo: data.modelo || '',
          numero_serie: data.numero_serie || '',
          fecha_adquisicion: data.fecha_adquisicion || '',
          valor_adquisicion: data.valor_adquisicion ? data.valor_adquisicion.toString() : '',
          estado: data.estado || 'operativo',
          ubicacion: data.ubicacion || '',
          notas: data.notas || ''
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
        codigo: formData.codigo,
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        categoria: formData.categoria,
        marca: formData.marca || null,
        modelo: formData.modelo || null,
        numero_serie: formData.numero_serie || null,
        fecha_adquisicion: formData.fecha_adquisicion || null,
        valor_adquisicion: formData.valor_adquisicion ? parseFloat(formData.valor_adquisicion) : null,
        estado: formData.estado,
        ubicacion: formData.ubicacion || null,
        notas: formData.notas || null
      };

      if (isEdit) {
        const { error } = await supabase.from('inventario_equipos').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('inventario_equipos').insert([payload]);
        if (error) throw error;
      }
      
      navigate('/inventario/equipos');
    } catch (error: any) {
      console.error(error);
      alert(`Error guardando el equipo: ${error.message || ''}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-amber-500" /></div>;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/inventario/equipos" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Activos
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Monitor className="h-8 w-8 text-amber-500" />
            {isEdit ? 'Editar Activo Fijo' : 'Registrar Nuevo Activo'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8 space-y-8">
          
          <div>
            <h2 className="text-lg font-bold text-white mb-4 border-b border-neutral-700 pb-2">Información Principal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Código de Activo *</label>
                <input
                  required
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Categoría *</label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="maquinaria">Maquinaria y Equipos</option>
                  <option value="computacion">Computación y Sistemas</option>
                  <option value="mobiliario">Mobiliario y Oficina</option>
                  <option value="herramientas">Herramientas Varias</option>
                  <option value="vehiculos">Vehículos</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-neutral-300 block mb-2">Nombre del Activo *</label>
                <input
                  required
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej. Computadora Portátil Dell, Conchonadora 50Kg..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-neutral-300 block mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows={2}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-4 border-b border-neutral-700 pb-2">Especificaciones y Adquisición</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Marca</label>
                <input
                  type="text"
                  value={formData.marca}
                  onChange={(e) => setFormData({...formData, marca: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Modelo</label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Número de Serie</label>
                <input
                  type="text"
                  value={formData.numero_serie}
                  onChange={(e) => setFormData({...formData, numero_serie: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Fecha Adquisición</label>
                <input
                  type="date"
                  value={formData.fecha_adquisicion}
                  onChange={(e) => setFormData({...formData, fecha_adquisicion: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Valor Adquisición ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor_adquisicion}
                  onChange={(e) => setFormData({...formData, valor_adquisicion: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Ubicación Asignada</label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                  placeholder="Ej. Oficina Contabilidad"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-4 border-b border-neutral-700 pb-2">Estado y Observaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Estado Actual</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="operativo">Operativo / En Uso</option>
                  <option value="mantenimiento">En Mantenimiento / Reparación</option>
                  <option value="dado_de_baja">Dado de Baja / Descartado</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-neutral-300 block mb-2">Notas u Observaciones</label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-neutral-700">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Guardar Activo Fijo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
