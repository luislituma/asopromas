import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Save, Loader2, Factory, PackageOpen } from 'lucide-react';

export default function EjecutarOrdenForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [recetas, setRecetas] = useState<any[]>([]);
  const [lotes, setLotes] = useState<any[]>([]);
  const [insumosList, setInsumosList] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    codigo_orden: `OP-${Date.now().toString().slice(-6)}`,
    receta_id: '',
    lote_id: '',
    cantidad_a_producir: '',
    notas: ''
  });

  const [selectedRecetaInfo, setSelectedRecetaInfo] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resRecetas, resLotes, resInsumos] = await Promise.all([
        supabase.from('recetas').select('*, productos_catalogo(*), receta_ingredientes(*, insumos(nombre, unidad_medida, stock_disponible))'),
        supabase.from('lotes').select('*').in('estado', ['cerrado', 'procesado', 'abierto']).order('created_at', { ascending: false }),
        supabase.from('insumos').select('*').eq('estado', 'activo').in('categoria', ['ingrediente', 'empaque'])
      ]);
      
      if (resRecetas.data) setRecetas(resRecetas.data);
      if (resLotes.data) setLotes(resLotes.data);
      if (resInsumos.data) setInsumosList(resInsumos.data);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  // Pre-llenado desde Ventas (URL params)
  useEffect(() => {
    if (recetas.length > 0 && !formData.receta_id) {
      const params = new URLSearchParams(location.search);
      const prodId = params.get('producto_id');
      const faltante = params.get('faltante');
      
      if (prodId) {
        // Buscar receta vinculada al producto
        const rec = recetas.find(r => r.producto_id === prodId || r.productos_catalogo?.id === prodId);
        if (rec) {
          setFormData(prev => ({
            ...prev,
            receta_id: rec.id,
            cantidad_a_producir: faltante || prev.cantidad_a_producir,
            notas: faltante ? `Orden auto-generada para cubrir faltante de ventas.` : prev.notas
          }));
        }
      }
    }
  }, [recetas, location.search]);

  // Preview de materiales a utilizar
  useEffect(() => {
    if (formData.receta_id) {
      const rec = recetas.find(r => r.id === formData.receta_id);
      setSelectedRecetaInfo(rec);
    } else {
      setSelectedRecetaInfo(null);
    }
  }, [formData.receta_id, recetas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        codigo_orden: formData.codigo_orden,
        receta_id: formData.receta_id,
        lote_id: formData.lote_id,
        cantidad_a_producir: parseFloat(formData.cantidad_a_producir),
        estado: 'en_proceso',
        responsable_id: user?.id,
        notas: formData.notas
      };

      const { error } = await supabase.from('ordenes_procesamiento').insert([payload]);
      if (error) throw error;
      
      navigate('/procesamiento/ordenes');
    } catch (error: any) {
      console.error(error);
      alert('Error guardando la orden de procesamiento.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-white">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/procesamiento/ordenes" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Órdenes
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Factory className="h-8 w-8 text-amber-500" />
            Nueva Orden de Procesamiento
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Código de Orden</label>
              <input
                required
                readOnly
                type="text"
                value={formData.codigo_orden}
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-neutral-500 focus:outline-none"
              />
            </div>
            <div></div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-amber-400 block mb-2">Producto a Elaborar (Receta) *</label>
              <select
                required
                value={formData.receta_id}
                onChange={(e) => setFormData({...formData, receta_id: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-white font-medium focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Seleccionar Receta --</option>
                {recetas.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.productos_catalogo?.nombre} ({r.nombre_receta})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-emerald-400 block mb-2">Lote de Cacao Origen (Trazabilidad) *</label>
              <select
                required
                value={formData.lote_id}
                onChange={(e) => setFormData({...formData, lote_id: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Seleccionar Lote --</option>
                {lotes.map(l => {
                  const disponible = l.peso_total - (l.peso_utilizado || 0);
                  return (
                    <option key={l.id} value={l.id}>
                      {l.codigo_lote} (Disponible: {disponible.toFixed(2)} kg)
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-white block mb-2">Cantidad a Producir *</label>
              <div className="relative">
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.cantidad_a_producir}
                  onChange={(e) => setFormData({...formData, cantidad_a_producir: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-4 pr-20 py-3 text-white text-lg font-bold focus:outline-none focus:border-amber-500"
                  placeholder="Ej. 100"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-neutral-400 font-medium">
                  {selectedRecetaInfo?.productos_catalogo?.unidad_medida || 'unidades'}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-300 block mb-2">Notas / Lote de Producción Interno</label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({...formData, notas: e.target.value})}
                rows={2}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* PREVIEW DE MATERIALES REQUERIDOS */}
          {selectedRecetaInfo && formData.cantidad_a_producir && parseFloat(formData.cantidad_a_producir) > 0 && (
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <h3 className="text-amber-400 font-medium mb-4 flex items-center gap-2">
                <PackageOpen className="h-5 w-5" /> Análisis de Requerimientos de Materiales (MRP)
              </h3>
              <ul className="space-y-3">
                {selectedRecetaInfo.receta_ingredientes.map((ing: any) => {
                  const rendimientoEstandar = selectedRecetaInfo.rendimiento_estandar || 1;
                  const factorEscala = parseFloat(formData.cantidad_a_producir) / rendimientoEstandar;
                  const cantTotal = factorEscala * ing.cantidad_requerida;
                  
                  // Verificar disponibilidad
                  let disponible = 0;
                  let suficiente = false;
                  let msgDisponibilidad = '';

                  if (ing.tipo_ingrediente === 'cacao_grano') {
                    if (formData.lote_id) {
                      const lote = lotes.find(l => l.id === formData.lote_id);
                      if (lote) {
                        disponible = lote.peso_total - (lote.peso_utilizado || 0);
                        suficiente = cantTotal <= disponible;
                        msgDisponibilidad = `Lote disp: ${disponible.toFixed(2)} kg`;
                      } else {
                        msgDisponibilidad = `Lote no seleccionado`;
                      }
                    } else {
                      msgDisponibilidad = `Lote no seleccionado`;
                    }
                  } else {
                    const insumo = insumosList.find(i => i.id === ing.insumo_id);
                    if (insumo) {
                      disponible = insumo.stock_disponible;
                      suficiente = cantTotal <= disponible;
                      msgDisponibilidad = `Bodega disp: ${disponible} ${ing.insumos?.unidad_medida}`;
                    }
                  }

                  return (
                    <li key={ing.id} className={`flex flex-col md:flex-row md:justify-between md:items-center p-3 rounded-lg border ${suficiente ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                      <div className="mb-2 md:mb-0">
                        <span className="text-neutral-300 font-medium block">
                          {ing.tipo_ingrediente === 'cacao_grano' ? 'Cacao en Grano (Lote)' : ing.insumos?.nombre}
                        </span>
                        <span className={`text-xs ${suficiente ? 'text-emerald-400' : 'text-red-400'}`}>
                          {msgDisponibilidad}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white bg-neutral-800 px-3 py-1 rounded border border-neutral-700">
                          Requiere: {cantTotal.toFixed(2)} {ing.tipo_ingrediente === 'cacao_grano' ? 'kg' : ing.insumos?.unidad_medida}
                        </span>
                        <span className="text-xl">
                          {suficiente ? '✅' : '❌'}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              
              {(() => {
                const faltantesCacao: any[] = [];
                const faltantesInsumos: any[] = [];
                
                selectedRecetaInfo.receta_ingredientes.forEach((ing: any) => {
                  const rendimientoEstandar = selectedRecetaInfo.rendimiento_estandar || 1;
                  const factorEscala = parseFloat(formData.cantidad_a_producir) / rendimientoEstandar;
                  const cantTotal = factorEscala * ing.cantidad_requerida;
                  
                  if (ing.tipo_ingrediente === 'cacao_grano') {
                    const l = lotes.find(l => l.id === formData.lote_id);
                    if (!l || cantTotal > (l.peso_total - (l.peso_utilizado || 0))) {
                      faltantesCacao.push(ing);
                    }
                  } else {
                    const insumo = insumosList.find(i => i.id === ing.insumo_id);
                    if (!insumo || cantTotal > insumo.stock_disponible) {
                      faltantesInsumos.push(ing);
                    }
                  }
                });

                if (faltantesCacao.length > 0 || faltantesInsumos.length > 0) {
                  return (
                    <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 font-bold mb-2">⚠️ Stock Físico Insuficiente</p>
                      <p className="text-neutral-300 text-sm mb-4">No hay suficiente inventario para completar la orden. Debes solicitar la materia prima faltante:</p>
                      <div className="flex flex-wrap gap-3">
                        {faltantesCacao.length > 0 && (
                          <Link 
                            to="/acopio/nuevo" 
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-bold px-4 py-2 rounded-lg border border-red-500/30 transition-colors"
                          >
                            Ir a Solicitar Cacao (Acopio)
                          </Link>
                        )}
                        {faltantesInsumos.length > 0 && (
                          <Link 
                            to="/inventario/insumos/nuevo" 
                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 text-sm font-bold px-4 py-2 rounded-lg border border-amber-500/30 transition-colors"
                          >
                            Ir a Comprar/Asignar Insumos
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={
                loading || 
                (selectedRecetaInfo && parseFloat(formData.cantidad_a_producir) > 0 && selectedRecetaInfo.receta_ingredientes.some((ing: any) => {
                  const rendimientoEstandar = selectedRecetaInfo.rendimiento_estandar || 1;
                  const factorEscala = parseFloat(formData.cantidad_a_producir) / rendimientoEstandar;
                  const cantTotal = factorEscala * ing.cantidad_requerida;
                  if (ing.tipo_ingrediente === 'cacao_grano') {
                    const l = lotes.find(l => l.id === formData.lote_id);
                    return !l || cantTotal > (l.peso_total - (l.peso_utilizado || 0));
                  } else {
                    const insumo = insumosList.find(i => i.id === ing.insumo_id);
                    return !insumo || cantTotal > insumo.stock_disponible;
                  }
                }))
              }
              className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Crear Orden (En Proceso)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
