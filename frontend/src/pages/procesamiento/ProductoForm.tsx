// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2, Plus, Trash2, BookOpen } from 'lucide-react';

export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  
  // Producto Data
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    unidad_medida: 'unidades'
  });

  // Receta y sus Ingredientes
  const [recetaId, setRecetaId] = useState<string | null>(null);
  const [nombreReceta, setNombreReceta] = useState('Receta Estándar');
  const [rendimientoEstandar, setRendimientoEstandar] = useState('1');
  const [ingredientes, setIngredientes] = useState<any[]>([]);
  
  // Catálogo de insumos para el dropdown
  const [insumosList, setInsumosList] = useState<any[]>([]);

  useEffect(() => {
    loadInsumos();
    if (isEdit) {
      loadProducto();
    }
  }, [id]);

  const loadInsumos = async () => {
    const { data } = await supabase
      .from('insumos')
      .select('id, nombre, unidad_medida')
      .eq('estado', 'activo')
      .in('categoria', ['ingrediente', 'empaque']);
    if (data) setInsumosList(data);
  };

  const loadProducto = async () => {
    try {
      const { data: prod, error: errProd } = await supabase
        .from('productos_catalogo')
        .select('*')
        .eq('id', id)
        .single();
        
      if (errProd) throw errProd;
      
      if (prod) {
        setFormData({
          nombre: prod.nombre,
          descripcion: prod.descripcion || '',
          unidad_medida: prod.unidad_medida
        });

        // Buscar receta asociada
        const { data: rec, error: errRec } = await supabase
          .from('recetas')
          .select('*')
          .eq('producto_id', id)
          .single();
          
        if (rec) {
          setRecetaId(rec.id);
          setNombreReceta(rec.nombre_receta);
          setRendimientoEstandar(rec.rendimiento_estandar ? rec.rendimiento_estandar.toString() : '1');
          
          // Buscar ingredientes
          const { data: ings } = await supabase
            .from('receta_ingredientes')
            .select('*')
            .eq('receta_id', rec.id);
            
          if (ings) setIngredientes(ings);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const addIngrediente = (tipo: 'cacao_grano' | 'insumo') => {
    setIngredientes([
      ...ingredientes, 
      { id: Date.now().toString(), tipo_ingrediente: tipo, insumo_id: '', cantidad_requerida: '' }
    ]);
  };

  const updateIngrediente = (index: number, field: string, value: any) => {
    const newIngs = [...ingredientes];
    newIngs[index][field] = value;
    setIngredientes(newIngs);
  };

  const removeIngrediente = (index: number) => {
    const newIngs = [...ingredientes];
    // Si es un ingrediente que ya existía en BD, podríamos marcarlo para eliminar.
    // Por simplicidad en este MVP, borramos y re-insertamos en handleSubmit.
    newIngs.splice(index, 1);
    setIngredientes(newIngs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación ingredientes
    const hasInvalidIng = ingredientes.some(ing => 
      !ing.cantidad_requerida || parseFloat(ing.cantidad_requerida) <= 0 ||
      (ing.tipo_ingrediente === 'insumo' && !ing.insumo_id)
    );
    
    if (hasInvalidIng) {
      alert("Por favor, revisa que todos los ingredientes tengan cantidades válidas y el insumo seleccionado.");
      return;
    }

    setLoading(true);

    try {
      let currentProdId = id;

      // 1. Guardar Producto
      const prodPayload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        unidad_medida: formData.unidad_medida
      };

      if (isEdit) {
        await supabase.from('productos_catalogo').update(prodPayload).eq('id', id);
      } else {
        const { data: newProd, error: errP } = await supabase.from('productos_catalogo').insert([prodPayload]).select().single();
        if (errP) throw errP;
        currentProdId = newProd.id;
      }

      // 2. Guardar Receta
      let currentRecetaId = recetaId;
      if (!currentRecetaId) {
        const { data: newRec, error: errR } = await supabase.from('recetas').insert([{
          producto_id: currentProdId,
          nombre_receta: nombreReceta,
          rendimiento_estandar: parseFloat(rendimientoEstandar) || 1
        }]).select().single();
        if (errR) throw errR;
        currentRecetaId = newRec.id;
      } else {
        await supabase.from('recetas').update({ 
          nombre_receta: nombreReceta,
          rendimiento_estandar: parseFloat(rendimientoEstandar) || 1
        }).eq('id', currentRecetaId);
      }

      // 3. Guardar Ingredientes (Borrar viejos y re-insertar por simplicidad)
      if (currentRecetaId) {
        await supabase.from('receta_ingredientes').delete().eq('receta_id', currentRecetaId);
        
        if (ingredientes.length > 0) {
          const ingsToInsert = ingredientes.map(ing => ({
            receta_id: currentRecetaId,
            tipo_ingrediente: ing.tipo_ingrediente,
            insumo_id: ing.tipo_ingrediente === 'insumo' ? ing.insumo_id : null,
            cantidad_requerida: parseFloat(ing.cantidad_requerida)
          }));
          await supabase.from('receta_ingredientes').insert(ingsToInsert);
        }
      }
      
      navigate('/procesamiento/productos');
    } catch (error: any) {
      console.error(error);
      alert('Error guardando el producto y la receta.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-white">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/procesamiento/productos" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Catálogo
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-amber-500" />
            {isEdit ? 'Editar Producto y Receta' : 'Nuevo Producto / Derivado'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECCIÓN 1: DATOS DEL PRODUCTO */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8">
            <h2 className="text-lg font-medium text-amber-400 mb-4 border-b border-neutral-700 pb-2">Información del Producto Final</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-neutral-300 block mb-2">Nombre del Producto *</label>
                <input
                  required
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej. Barra de Chocolate al 70%"
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

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Unidad de Medida del Inventario Final *</label>
                <select
                  value={formData.unidad_medida}
                  onChange={(e) => setFormData({...formData, unidad_medida: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="unidades">Unidades (Ej. Barras, Cajas)</option>
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="litros">Litros (l)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-neutral-700 pb-2">
              <h2 className="text-lg font-medium text-amber-400">2. Formulación de la Receta</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-2 block">Nombre de la Receta / Fórmula</label>
                <input
                  required
                  type="text"
                  value={nombreReceta}
                  onChange={(e) => setNombreReceta(e.target.value)}
                  placeholder="Ej. Chocolate Dark 70% Base"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-2 block">Rendimiento Base (Unidades generadas) *</label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={rendimientoEstandar}
                  onChange={(e) => setRendimientoEstandar(e.target.value)}
                  placeholder="Ej. 360"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
                <p className="text-xs text-neutral-500 mt-1">¿Cuántas unidades rinde el lote total que vas a definir abajo?</p>
              </div>
            </div>

            <p className="text-sm text-neutral-400 mb-6">
              Añade los ingredientes totales que componen este <span className="text-white font-bold">Lote Base</span>. 
              El sistema multiplicará o dividirá estas cantidades automáticamente según cuánto decidas producir.
            </p>

            <div className="space-y-4 mb-6">
              {ingredientes.map((ing, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 bg-neutral-900/50 border border-neutral-700 rounded-lg items-end">
                  <div className="w-full md:w-1/3">
                    <label className="text-xs text-neutral-500 block mb-1">Tipo de Ingrediente</label>
                    <div className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-neutral-300">
                      {ing.tipo_ingrediente === 'cacao_grano' ? 'Cacao en Grano (Lotes)' : 'Insumo de Inventario'}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    {ing.tipo_ingrediente === 'insumo' ? (
                      <>
                        <label className="text-xs text-neutral-500 block mb-1">Insumo Específico</label>
                        <select
                          required
                          value={ing.insumo_id}
                          onChange={(e) => updateIngrediente(idx, 'insumo_id', e.target.value)}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        >
                          <option value="">-- Seleccionar Insumo --</option>
                          {insumosList.map(ins => (
                            <option key={ins.id} value={ins.id}>{ins.nombre} ({ins.unidad_medida})</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <div className="hidden md:block"></div>
                    )}
                  </div>

                  <div className="w-full md:w-1/4">
                        <label className="text-xs text-neutral-400 block mb-1">Cantidad para el lote ({ing.tipo_ingrediente === 'cacao_grano' ? 'kg' : (insumosList.find(i => i.id === ing.insumo_id)?.unidad_medida || 'u')})</label>
                    <input
                      required
                      type="number"
                      step="0.001"
                      min="0.001"
                      value={ing.cantidad_requerida}
                      onChange={(e) => updateIngrediente(idx, 'cantidad_requerida', e.target.value)}
                      placeholder="Ej. 0.25"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={() => removeIngrediente(idx)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}

              {ingredientes.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-neutral-700 rounded-lg text-neutral-500">
                  Aún no hay ingredientes. Este producto podría no requerir procesamiento con inventario.
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => addIngrediente('cacao_grano')}
                className="px-4 py-2 bg-neutral-800 border border-amber-500/30 text-amber-500 text-sm font-medium rounded-md hover:bg-neutral-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Agregar Cacao
              </button>
              <button
                type="button"
                onClick={() => addIngrediente('insumo')}
                className="px-4 py-2 bg-neutral-800 border border-neutral-600 text-neutral-300 text-sm font-medium rounded-md hover:bg-neutral-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Agregar Insumo Extra
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Guardar Producto y Receta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
