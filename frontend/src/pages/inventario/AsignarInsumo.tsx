import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Search, AlertCircle, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AsignarInsumo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [insumos, setInsumos] = useState<any[]>([]);
  
  // Búsqueda de socio
  const [searchQuery, setSearchQuery] = useState('');
  const [sociosResult, setSociosResult] = useState<any[]>([]);
  const [socio, setSocio] = useState<any>(null);
  const [searchError, setSearchError] = useState('');

  const [formData, setFormData] = useState({
    insumo_id: '',
    cantidad: '',
    notas: ''
  });

  const insumoSeleccionado = insumos.find(i => i.id === formData.insumo_id);

  useEffect(() => {
    async function loadInsumos() {
      const { data } = await supabase
        .from('insumos')
        .select('*')
        .eq('estado', 'activo')
        .in('categoria', ['fertilizante', 'herramienta', 'semilla', 'quimico'])
        .gt('stock_disponible', 0);
      if (data) setInsumos(data);
    }
    loadInsumos();
  }, []);

  const handleSearchSocio = async () => {
    if (!searchQuery.trim()) return;
    setSearchError('');
    setSociosResult([]);
    setSocio(null);

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
      
      if (data.length === 1) {
        setSocio(data[0]);
      } else {
        setSociosResult(data);
      }
    } catch (error) {
      setSearchError('Error al buscar.');
    }
  };

  const seleccionarSocio = (s: any) => {
    setSocio(s);
    setSociosResult([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socio || !formData.insumo_id || !formData.cantidad || !insumoSeleccionado) return;
    
    const cantidad = parseFloat(formData.cantidad);
    if (cantidad > insumoSeleccionado.stock_disponible) {
      alert(`Error: La cantidad supera el stock disponible (${insumoSeleccionado.stock_disponible}).`);
      return;
    }

    setLoading(true);
    const montoTotal = cantidad * insumoSeleccionado.precio_unitario;

    try {
      // Registrar la entrega (deuda)
      const { error } = await supabase
        .from('entregas_insumos')
        .insert([{
          socio_id: socio.id,
          insumo_id: formData.insumo_id,
          responsable_id: user?.id,
          cantidad: cantidad,
          precio_unitario: insumoSeleccionado.precio_unitario,
          monto_total: montoTotal,
          saldo_pendiente: montoTotal, // Toda la deuda inicia pendiente
          notas: formData.notas
        }]);

      if (error) throw error;
      
      // Nota: El trigger actualizará automáticamente el stock en public.insumos
      
      navigate('/insumos/agricolas');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar la entrega.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-2xl mx-auto">
        <Link to="/insumos/agricolas" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a Inventario
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Entregar Insumo (Crédito)</h1>
          <p className="text-neutral-400 mt-1">Asigna herramientas o fertilizantes a un socio.</p>
        </div>

        {/* Búsqueda de Socio */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 mb-6">
          <label className="text-sm font-medium text-neutral-300 block mb-2">Buscar Socio (Cédula o Nombre)</label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ej: Juan Perez o 1101234567"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSocio()}
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSearchSocio}
              type="button"
              className="px-6 py-2.5 bg-neutral-700 text-white font-medium rounded-lg hover:bg-neutral-600 transition-colors flex items-center gap-2"
            >
              <Search className="h-4 w-4" /> Buscar
            </button>
          </div>
          {searchError && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {searchError}</p>
          )}

          {sociosResult.length > 0 && (
            <div className="mt-4 bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
              <p className="text-xs text-neutral-500 p-2 bg-neutral-800">Resultados ({sociosResult.length}):</p>
              <ul className="divide-y divide-neutral-700">
                {sociosResult.map(s => (
                  <li key={s.id}>
                    <button 
                      type="button" 
                      onClick={() => seleccionarSocio(s)}
                      className="w-full text-left p-3 hover:bg-neutral-800 transition-colors flex justify-between items-center"
                    >
                      <span><span className="font-medium text-white">{s.nombres} {s.apellidos}</span> - <span className="text-neutral-400 text-sm">{s.cedula}</span></span>
                      <span className="text-amber-500 text-xs">Seleccionar</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {socio && (
          <form onSubmit={handleSubmit} className="bg-neutral-800 border border-amber-500/50 rounded-xl p-6 space-y-6">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-neutral-400">Socio Identificado:</p>
              <p className="text-lg font-medium text-white">{socio.nombres} {socio.apellidos}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <Package className="h-4 w-4 text-amber-500" />
                  Seleccionar Producto *
                </label>
                <select
                  required
                  value={formData.insumo_id}
                  onChange={(e) => setFormData({...formData, insumo_id: e.target.value, cantidad: ''})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Elegir insumo --</option>
                  {insumos.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.nombre} - ${i.precio_unitario} ({i.stock_disponible} en stock)
                    </option>
                  ))}
                </select>
              </div>

              {insumoSeleccionado && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Cantidad ({insumoSeleccionado.unidad_medida}) *</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={insumoSeleccionado.stock_disponible}
                      value={formData.cantidad}
                      onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Costo Total (Deuda)</label>
                    <div className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-red-400 font-bold text-xl">
                      ${formData.cantidad ? (parseFloat(formData.cantidad) * insumoSeleccionado.precio_unitario).toFixed(2) : '0.00'}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Notas Adicionales</label>
                <textarea
                  rows={2}
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-700 flex justify-end">
              <button
                type="submit"
                disabled={loading || !formData.cantidad}
                className="px-6 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Registrar Entrega de Insumo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
