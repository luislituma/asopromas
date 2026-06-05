import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Plus, Trash2, Save, Factory } from 'lucide-react';

interface Insumo {
  id: string;
  codigo: string;
  nombre: string;
  precio_unitario: number;
  stock_disponible: number;
  unidad_medida: string;
}

interface ItemCarrito {
  insumo_id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  unidad_medida: string;
}

export default function NuevaCompraForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  
  // Datos de Cabecera
  const [proveedorNombre, setProveedorNombre] = useState('');
  const [proveedorId, setProveedorId] = useState(''); // Opcional RUC
  const [numeroFactura, setNumeroFactura] = useState('');
  const [notas, setNotas] = useState('');
  
  // Detalles
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState('');
  const [cantidadInput, setCantidadInput] = useState('');
  const [precioInput, setPrecioInput] = useState('');

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    try {
      const { data, error } = await supabase
        .from('insumos')
        .select('*')
        .eq('estado', 'activo')
        .order('nombre');
      if (error) throw error;
      setInsumos(data || []);
    } catch (error) {
      console.error('Error fetching insumos:', error);
    }
  };

  const handleInsumoSelect = (id: string) => {
    setInsumoSeleccionado(id);
    const insumo = insumos.find(i => i.id === id);
    if (insumo) {
      setPrecioInput(insumo.precio_unitario.toString());
      setCantidadInput('1');
    }
  };

  const agregarAlCarrito = () => {
    if (!insumoSeleccionado || !cantidadInput || !precioInput) return;
    
    const insumo = insumos.find(i => i.id === insumoSeleccionado);
    if (!insumo) return;

    const cantidad = parseFloat(cantidadInput);
    const precio = parseFloat(precioInput);
    
    if (cantidad <= 0 || precio < 0) return;

    const nuevoItem: ItemCarrito = {
      insumo_id: insumo.id,
      nombre: insumo.nombre,
      unidad_medida: insumo.unidad_medida,
      cantidad,
      precio_unitario: precio,
      subtotal: cantidad * precio
    };

    setCarrito([...carrito, nuevoItem]);
    
    // Resetear form de agregar
    setInsumoSeleccionado('');
    setCantidadInput('');
    setPrecioInput('');
  };

  const removerDelCarrito = (index: number) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  const subtotalTotal = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  // Asumiendo 0% de IVA para insumos agrícolas, se puede ajustar
  const iva = 0; 
  const total = subtotalTotal + iva;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (carrito.length === 0) {
      alert('Debes agregar al menos un insumo a la compra');
      return;
    }
    
    if (!proveedorNombre) {
      alert('Ingresa el nombre del proveedor');
      return;
    }

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const codigoCompra = `COM-${Date.now().toString().slice(-6)}`;

      // 1. Insertar Cabecera (estado = borrador para que puedan revisarlo luego)
      const { data: compra, error: compraError } = await supabase
        .from('compras')
        .insert([{
          codigo_compra: codigoCompra,
          proveedor_nombre: proveedorNombre,
          proveedor_identificacion: proveedorId,
          numero_factura_externa: numeroFactura || null,
          sincronizado_contabilidad: !!numeroFactura,
          subtotal: subtotalTotal,
          iva,
          monto_total: total,
          estado: 'borrador', // Inicia en borrador, al confirmar ingresa al stock
          notas,
          responsable_id: user.user?.id
        }])
        .select()
        .single();

      if (compraError) throw compraError;

      // 2. Insertar Detalles
      const detalles = carrito.map(item => ({
        compra_id: compra.id,
        insumo_id: item.insumo_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal
      }));

      const { error: detallesError } = await supabase
        .from('compra_detalles')
        .insert(detalles);

      if (detallesError) throw detallesError;

      alert(`Compra guardada como Borrador exitosamente.\n\nIMPORTANTE: Para que los insumos ingresen a inventario debes ir a la lista de compras y marcarla como COMPLETADA.`);
      navigate('/compras');
    } catch (error: any) {
      console.error(error);
      alert('Error al guardar la compra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-5xl mx-auto">
        <Link to="/compras" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Compras
        </Link>

        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
          <ShoppingBag className="h-8 w-8 text-blue-500" />
          Registrar Nueva Compra
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cabecera */}
            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
                1. Datos del Proveedor
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Nombre del Proveedor *</label>
                  <input
                    type="text"
                    required
                    value={proveedorNombre}
                    onChange={e => setProveedorNombre(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Ej. Agripac S.A."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">RUC / Identificación (Opcional)</label>
                  <input
                    type="text"
                    value={proveedorId}
                    onChange={e => setProveedorId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="0912345678001"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-700">
                  <label className="block text-sm font-medium text-amber-400 mb-1">Nº Factura Oficial (Opcional)</label>
                  <input
                    type="text"
                    value={numeroFactura}
                    onChange={e => setNumeroFactura(e.target.value)}
                    className="w-full bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500 text-amber-100"
                    placeholder="001-001-0000123"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Si dejas esto vacío, se guardará como PENDIENTE de facturar contablemente.
                  </p>
                </div>
              </div>
            </div>

            {/* Resumen */}
            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
                Resumen de Compra
              </h2>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span>${subtotalTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>IVA (0%):</span>
                  <span>${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-neutral-700">
                  <span>Total:</span>
                  <span className="text-emerald-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Notas de la compra</label>
                <textarea
                  value={notas}
                  onChange={e => setNotas(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-24 resize-none"
                  placeholder="Detalles adicionales, número de guía de remisión..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || carrito.length === 0}
                className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Guardar Borrador de Compra
              </button>
            </div>
          </div>

          {/* Carrito de Insumos */}
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-400">
              2. Insumos Comprados
            </h2>

            <div className="flex flex-wrap items-end gap-4 mb-6 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-neutral-400 mb-1">Insumo</label>
                <select
                  value={insumoSeleccionado}
                  onChange={e => handleInsumoSelect(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-white"
                >
                  <option value="">Seleccione un insumo...</option>
                  {insumos.map(i => (
                    <option key={i.id} value={i.id}>{i.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-neutral-400 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={cantidadInput}
                  onChange={e => setCantidadInput(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-white"
                />
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-neutral-400 mb-1">Precio Unit. ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioInput}
                  onChange={e => setPrecioInput(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-white"
                />
              </div>

              <button
                type="button"
                onClick={agregarAlCarrito}
                disabled={!insumoSeleccionado || !cantidadInput || !precioInput}
                className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 h-[42px] px-4 font-bold flex items-center gap-2"
              >
                <Plus className="h-5 w-5" /> Agregar
              </button>
            </div>

            {carrito.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-700 text-neutral-400">
                      <th className="py-3 px-4 font-medium">Insumo</th>
                      <th className="py-3 px-4 font-medium">Cantidad</th>
                      <th className="py-3 px-4 font-medium">Unidad</th>
                      <th className="py-3 px-4 font-medium">Precio Unit.</th>
                      <th className="py-3 px-4 font-medium text-right">Subtotal</th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {carrito.map((item, idx) => (
                      <tr key={idx} className="hover:bg-neutral-900/50">
                        <td className="py-3 px-4">{item.nombre}</td>
                        <td className="py-3 px-4">{item.cantidad}</td>
                        <td className="py-3 px-4 text-neutral-500">{item.unidad_medida}</td>
                        <td className="py-3 px-4">${item.precio_unitario.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-medium">${item.subtotal.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => removerDelCarrito(idx)}
                            className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500 border-2 border-dashed border-neutral-700 rounded-lg">
                <Factory className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Agrega los insumos que llegaron en esta compra.</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
