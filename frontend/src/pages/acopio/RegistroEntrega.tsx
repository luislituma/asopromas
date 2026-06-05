import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Weight, Search, AlertCircle } from 'lucide-react';

export default function RegistroEntrega() {
  const { id } = useParams(); // ID del acopio
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [acopio, setAcopio] = useState<any>(null);
  
  // Para buscar socios
  const [searchQuery, setSearchQuery] = useState('');
  const [sociosResult, setSociosResult] = useState<any[]>([]);
  const [socio, setSocio] = useState<any>(null);
  const [fincas, setFincas] = useState<any[]>([]);
  const [searchError, setSearchError] = useState('');
  const [creandoFinca, setCreandoFinca] = useState(false);

  const [formData, setFormData] = useState({
    finca_id: '',
    peso_kg: '',
    calidad: 'estandar',
    notas: ''
  });

  useEffect(() => {
    async function loadAcopio() {
      if (!id) return;
      const { data } = await supabase.from('acopios').select('*').eq('id', id).single();
      if (data) setAcopio(data);
    }
    loadAcopio();
  }, [id]);

  const handleSearchSocio = async () => {
    if (!searchQuery.trim()) return;
    setSearchError('');
    setSociosResult([]);
    setSocio(null);
    setFincas([]);

    try {
      const q = `%${searchQuery.trim()}%`;
      const { data, error } = await supabase
        .from('socios')
        .select('*')
        .or(`cedula.ilike.${q},nombres.ilike.${q},apellidos.ilike.${q}`)
        .limit(5);

      if (error) throw error;
      if (!data || data.length === 0) {
        setSearchError('No se encontró ningún socio con ese dato.');
        return;
      }
      
      if (data.length === 1) {
        seleccionarSocio(data[0]);
      } else {
        setSociosResult(data);
      }
    } catch (error) {
      console.error(error);
      setSearchError('Error al buscar el socio.');
    }
  };

  const seleccionarSocio = async (s: any) => {
    setSocio(s);
    setSociosResult([]);
    
    // Cargar sus fincas
    const { data: fincasData } = await supabase
      .from('fincas')
      .select('*')
      .eq('socio_id', s.id);
      
    if (fincasData) {
      setFincas(fincasData);
      if (fincasData.length === 1) {
        setFormData(prev => ({ ...prev, finca_id: fincasData[0].id }));
      }
    }
  };

  const handleCrearFincaRapida = async () => {
    if (!socio) return;
    setCreandoFinca(true);
    try {
      const { data, error } = await supabase
        .from('fincas')
        .insert([{ nombre: 'Finca Principal', socio_id: socio.id }])
        .select()
        .single();
      if (error) throw error;
      
      const newFincas = [...fincas, data];
      setFincas(newFincas);
      setFormData(prev => ({ ...prev, finca_id: data.id }));
    } catch (err) {
      alert('Error creando finca');
    } finally {
      setCreandoFinca(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socio || !formData.finca_id || !formData.peso_kg) return;
    setLoading(true);

    try {
      const peso = parseFloat(formData.peso_kg);
      const precioUnitario = Number(acopio.precio_dia_kg);
      
      // Bonus por calidad (simulación: +5% si es premium)
      const multiplicador = formData.calidad === 'premium' ? 1.05 : formData.calidad === 'rechazado' ? 0 : 1;
      const precioFinal = precioUnitario * multiplicador;
      const montoTotal = peso * precioFinal;

      const { error } = await supabase
        .from('entregas_cacao')
        .insert([{
          acopio_id: id,
          socio_id: socio.id,
          finca_id: formData.finca_id,
          peso_kg: peso,
          precio_por_kg: precioFinal,
          monto_total: montoTotal,
          calidad: formData.calidad,
          notas: formData.notas
        }]);

      if (error) throw error;
      
      // Volver al detalle del acopio
      navigate(`/acopio/${id}`);
    } catch (error) {
      console.error('Error guardando entrega:', error);
      alert('Error al registrar la entrega. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-2xl mx-auto">
        <Link to={`/acopio/${id}`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al Acopio
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Registrar Entrega de Cacao</h1>
          {acopio && (
            <p className="text-neutral-400 mt-1">Jornada: {new Date(acopio.fecha).toLocaleDateString()} | Precio Base: ${acopio.precio_dia_kg}</p>
          )}
        </div>

        {/* Búsqueda de Socio */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 mb-6">
          <label className="text-sm font-medium text-neutral-300 block mb-2">
            Buscar Socio (Cédula o Nombre)
          </label>
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
              <Search className="h-4 w-4" />
              Buscar
            </button>
          </div>
          {searchError && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {searchError}
            </p>
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

        {/* Formulario principal (solo visible si hay socio) */}
        {socio && (
          <form onSubmit={handleSubmit} className="bg-neutral-800 border border-amber-500/50 rounded-xl p-6 space-y-6">
            
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-neutral-400">Socio Identificado:</p>
              <p className="text-lg font-medium text-white">{socio.nombres} {socio.apellidos}</p>
            </div>

            <div className="space-y-4">
              {/* Selección de Finca */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">¿De qué finca proviene el cacao? *</label>
                <select
                  required
                  value={formData.finca_id}
                  onChange={(e) => setFormData({...formData, finca_id: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Seleccionar Finca --</option>
                  {fincas.map(f => (
                    <option key={f.id} value={f.id}>{f.nombre} ({f.ubicacion || 'Sin ubicación'})</option>
                  ))}
                </select>
                {fincas.length === 0 && (
                  <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Este socio no tiene fincas registradas.
                    </p>
                    <button
                      type="button"
                      onClick={handleCrearFincaRapida}
                      disabled={creandoFinca}
                      className="mt-2 px-3 py-1.5 bg-neutral-800 text-amber-500 text-sm rounded hover:bg-neutral-700 transition-colors"
                    >
                      {creandoFinca ? 'Creando...' : 'Crear Finca Principal automáticamente'}
                    </button>
                  </div>
                )}
              </div>

              {/* Peso en KG */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <Weight className="h-4 w-4 text-amber-500" />
                  Peso Neto Recibido (kg) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0.01"
                  placeholder="Ej: 150.5"
                  value={formData.peso_kg}
                  onChange={(e) => setFormData({...formData, peso_kg: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-xl font-bold focus:outline-none focus:border-amber-500 text-amber-500"
                />
              </div>

              {/* Calidad */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Calidad e Inspección *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['estandar', 'premium', 'rechazado'].map((cal) => (
                    <button
                      key={cal}
                      type="button"
                      onClick={() => setFormData({...formData, calidad: cal})}
                      className={`py-2 px-3 rounded-md text-sm font-medium uppercase border transition-all ${
                        formData.calidad === cal 
                          ? cal === 'premium' ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : cal === 'rechazado' ? 'bg-red-500/20 border-red-500 text-red-400'
                          : 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-500 hover:border-neutral-500'
                      }`}
                    >
                      {cal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Notas Adicionales</label>
                <textarea
                  rows={2}
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  placeholder="Humedad, tipo de fermentación..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-700 flex justify-end">
              <button
                type="submit"
                disabled={loading || fincas.length === 0}
                className="px-6 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Procesar Entrega
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
