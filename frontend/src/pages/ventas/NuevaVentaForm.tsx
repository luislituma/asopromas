import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Save, Loader2, ShoppingCart, Plus, Trash2 } from 'lucide-react';

export default function NuevaVentaForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [clientes, setClientes] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [lotes, setLotes] = useState<any[]>([]);
  const [insumos, setInsumos] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    codigo_venta: `VEN-${Date.now().toString().slice(-6)}`,
    cliente_id: '',
    descuento: '0',
    notas: '',
    numero_factura_externa: ''
  });

  const [items, setItems] = useState<any[]>([
    { id: '1', tipo_item: 'producto_derivado', item_id: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }
  ]);

  useEffect(() => {
    fetchCatalogos();
  }, []);

  const fetchCatalogos = async () => {
    try {
      const [resClientes, resProd, resLotes, resInsumos] = await Promise.all([
        supabase.from('clientes').select('*').eq('estado', 'activo'),
        supabase.from('productos_catalogo').select('*, lotes(codigo_lote)').gt('stock_actual', 0).order('nombre'),
        supabase.from('lotes').select('*').eq('estado', 'en_bodega').order('codigo_lote'),
        supabase.from('insumos').select('*').in('categoria', ['fertilizante', 'herramienta', 'semilla', 'quimico']).gt('stock_disponible', 0).order('nombre')
      ]);
      
      if (resClientes.data) setClientes(resClientes.data);
      if (resProd.data) {
        setProductos(resProd.data);
      }
      if (resLotes.data) {
        // Filtrar solo los lotes que aún tienen peso disponible (Cacao en Acopio)
        const lotesDisponibles = resLotes.data.filter(l => l.peso_total - (l.peso_utilizado || 0) > 0);
        setLotes(lotesDisponibles);
      }
      if (resInsumos.data) setInsumos(resInsumos.data);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const addItem = () => {
    setItems([
      ...items, 
      { id: Date.now().toString(), tipo_item: 'producto_derivado', item_id: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }
    ]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Si cambia el tipo, resetear el id
    if (field === 'tipo_item') {
      newItems[index].item_id = '';
      newItems[index].precio_unitario = 0;
      newItems[index].subtotal = 0;
    }
    
    // Auto calculate subtotal
    if (field === 'cantidad' || field === 'precio_unitario' || field === 'item_id') {
      
      // Auto-completar precio unitario base si selecciona un insumo o producto (opcional, pero útil)
      if (field === 'item_id' && value) {
        if (newItems[index].tipo_item === 'producto_derivado') {
          const p = productos.find(x => x.id === value);
          if (p && p.precio_venta_sugerido) newItems[index].precio_unitario = p.precio_venta_sugerido;
        } else if (newItems[index].tipo_item === 'insumo') {
          const i = insumos.find(x => x.id === value);
          if (i && i.precio_unitario) newItems[index].precio_unitario = i.precio_unitario;
        }
      }

      const cant = field === 'cantidad' ? parseFloat(value || '0') : newItems[index].cantidad;
      const precio = field === 'precio_unitario' ? parseFloat(value || '0') : newItems[index].precio_unitario;
      newItems[index].subtotal = cant * precio;
    }
    
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const subtotalTotal = items.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
  const descuentoNum = parseFloat(formData.descuento || '0');
  const montoTotal = subtotalTotal - descuentoNum;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert("Debes agregar al menos un ítem para vender.");
      return;
    }

    const hasInvalid = items.some(i => !i.item_id || i.cantidad <= 0 || i.precio_unitario <= 0);
    if (hasInvalid) {
      alert("Asegúrate de haber seleccionado el ítem y puesto cantidades/precios válidos.");
      return;
    }

    setLoading(true);

    try {
      // 1. Crear cabecera de venta
      const { data: nuevaVenta, error: errVenta } = await supabase
        .from('ventas')
        .insert([{
          codigo_venta: formData.codigo_venta,
          cliente_id: formData.cliente_id,
          subtotal: subtotalTotal,
          descuento: descuentoNum,
          monto_total: montoTotal,
          estado: 'borrador', // Debe completarse desde la lista para descontar inventario
          responsable_id: user?.id,
          notas: formData.notas || null,
          numero_factura_externa: formData.numero_factura_externa || null,
          sincronizado_contabilidad: formData.numero_factura_externa ? true : false
        }])
        .select()
        .single();
      if (errVenta) throw errVenta;

      // 2. Crear detalles
      const detallesToInsert = items.map(item => {
        const det: any = {
          venta_id: nuevaVenta.id,
          cantidad: parseFloat(item.cantidad),
          precio_unitario: parseFloat(item.precio_unitario),
          subtotal: item.subtotal,
          tipo_item: item.tipo_item === 'cacao_transferido' ? 'producto_derivado' : item.tipo_item,
          producto_id: null,
          lote_id: null,
          insumo_id: null
        };

        if (item.tipo_item === 'producto_derivado' || item.tipo_item === 'cacao_transferido') {
          det.producto_id = item.item_id;
        } else if (item.tipo_item === 'cacao_grano') {
          det.lote_id = item.item_id;
        } else if (item.tipo_item === 'insumo') {
          det.insumo_id = item.item_id;
        }

        return det;
      });

      const { error: errDetalles } = await supabase.from('venta_detalles').insert(detallesToInsert);
      if (errDetalles) throw errDetalles;
      
      navigate('/ventas');
    } catch (error: any) {
      console.error(error);
      alert(`Error registrando la venta: ${error.message || JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-white">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <Link to="/ventas" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Ventas
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-amber-500" />
            Nueva Venta / Factura
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Código de Venta</label>
              <input
                required
                readOnly
                type="text"
                value={formData.codigo_venta}
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-neutral-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Nº Factura Oficial (Opcional)</label>
              <input
                type="text"
                placeholder="Ej. 001-001-12345678"
                value={formData.numero_factura_externa}
                onChange={(e) => setFormData({...formData, numero_factura_externa: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-amber-400 block mb-2">Cliente *</label>
              <select
                required
                value={formData.cliente_id}
                onChange={(e) => setFormData({...formData, cliente_id: e.target.value})}
                className="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-white font-medium focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Seleccionar Cliente --</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre_razon_social} ({c.tipo_cliente})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-700">
              <h2 className="text-lg font-bold text-white">Ítems a Vender</h2>
              <button
                type="button"
                onClick={addItem}
                className="px-3 py-1.5 bg-neutral-700 text-white text-xs font-medium rounded-md hover:bg-neutral-600 transition-colors flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Añadir Fila
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-neutral-900/50 p-4 rounded-lg border border-neutral-700">
                  <div className="col-span-12 md:col-span-3">
                    <label className="text-xs text-neutral-500 block mb-1">Tipo de Ítem</label>
                    <select
                      value={item.tipo_item}
                      onChange={(e) => updateItem(idx, 'tipo_item', e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="producto_derivado">Producto (Chocolate/Derivado)</option>
                      <option value="cacao_transferido">Cacao Seco (Bodega Comercial)</option>
                      <option value="cacao_grano">Cacao Crudo (Directo de Acopio)</option>
                      <option value="insumo">Insumo Agrícola</option>
                    </select>
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <label className="text-xs text-neutral-500 block mb-1">
                      {item.tipo_item === 'producto_derivado' ? 'Producto Terminado' : 
                       item.tipo_item === 'cacao_transferido' ? 'Lote de Cacao en Bodega' :
                       item.tipo_item === 'cacao_grano' ? 'Lote de Acopio' : 'Insumo Disponible'}
                    </label>
                    <select
                      required
                      value={item.item_id}
                      onChange={(e) => updateItem(idx, 'item_id', e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Seleccionar --</option>
                      {item.tipo_item === 'producto_derivado' && productos.filter(p => !p.lote_id).map(p => (
                        <option key={p.id} value={p.id}>{p.nombre} (Disp: {p.stock_actual} {p.unidad_medida})</option>
                      ))}
                      {item.tipo_item === 'cacao_transferido' && productos.filter(p => p.lote_id).map(p => (
                        <option key={p.id} value={p.id}>{p.nombre} - Ref: {p.lotes?.codigo_lote} (Disp: {p.stock_actual} {p.unidad_medida})</option>
                      ))}
                      {item.tipo_item === 'cacao_grano' && lotes.map(l => (
                        <option key={l.id} value={l.id}>{l.codigo_lote} (Disp: {l.peso_total - (l.peso_utilizado || 0)} kg)</option>
                      ))}
                      {item.tipo_item === 'insumo' && insumos.map(i => (
                        <option key={i.id} value={i.id}>{i.nombre} (Disp: {i.stock_disponible} {i.unidad_medida})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-4 md:col-span-1">
                    <label className="text-xs text-neutral-500 block mb-1">Cant.</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={item.cantidad}
                      onChange={(e) => updateItem(idx, 'cantidad', e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <label className="text-xs text-neutral-500 block mb-1">Precio Unit. ($)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.precio_unitario}
                      onChange={(e) => updateItem(idx, 'precio_unitario', e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="col-span-3 md:col-span-1">
                    <label className="text-xs text-neutral-500 block mb-1">Subtotal</label>
                    <div className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm text-amber-500 font-bold">
                      ${item.subtotal.toFixed(2)}
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-1 text-right mt-4 md:mt-0">
                    <button 
                      type="button" 
                      onClick={() => removeItem(idx)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-medium text-neutral-300 block mb-2">Notas Adicionales</label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({...formData, notas: e.target.value})}
                rows={4}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-neutral-700">
                <span className="text-neutral-400">Subtotal</span>
                <span className="text-white font-medium">${subtotalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-700">
                <span className="text-neutral-400">Descuento Global ($)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.descuento}
                  onChange={(e) => setFormData({...formData, descuento: e.target.value})}
                  className="w-24 bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1 text-sm text-right text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-xl font-bold text-white">Total a Pagar</span>
                <span className="text-3xl font-bold text-amber-500">${montoTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-neutral-500 text-right">* Precios incluyen impuestos.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Guardar Venta (Borrador)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
