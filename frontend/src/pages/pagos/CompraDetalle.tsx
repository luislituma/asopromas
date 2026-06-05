import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Loader2, CheckCircle2, Factory } from 'lucide-react';

export default function CompraDetalle() {
  const { id } = useParams();
  const [compra, setCompra] = useState<any>(null);
  const [detalles, setDetalles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado contable
  const [facturaInput, setFacturaInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchCompraData();
  }, [id]);

  const fetchCompraData = async () => {
    try {
      const { data: compraData, error: compraError } = await supabase
        .from('compras')
        .select('*')
        .eq('id', id)
        .single();
      if (compraError) throw compraError;
      setCompra(compraData);
      setFacturaInput(compraData.numero_factura_externa || '');

      const { data: detallesData, error: detallesError } = await supabase
        .from('compra_detalles')
        .select(`
          *,
          insumos (
            nombre,
            unidad_medida
          )
        `)
        .eq('compra_id', id);
      if (detallesError) throw detallesError;
      setDetalles(detallesData || []);

    } catch (error) {
      console.error('Error fetching compra:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncContabilidad = async () => {
    if (!facturaInput) {
      alert('Ingresa el número de la factura antes de sincronizar.');
      return;
    }
    
    setIsSyncing(true);
    try {
      const { error } = await supabase
        .from('compras')
        .update({ 
          numero_factura_externa: facturaInput,
          sincronizado_contabilidad: true 
        })
        .eq('id', id);

      if (error) throw error;
      await fetchCompraData();
    } catch (error: any) {
      alert('Error al guardar la factura: ' + error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const confirmarCompra = async () => {
    if (!window.confirm(`¿Seguro que deseas COMPLETAR la compra? Esto sumará el stock de los insumos en bodega y no se puede deshacer.`)) return;
    
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('compras').update({ estado: 'completado' }).eq('id', id);
      if (error) throw error;
      await fetchCompraData();
      alert('Compra completada y stock ingresado exitosamente.');
    } catch (error: any) {
      alert('Error al completar la compra: ' + error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!compra) {
    return (
      <div className="min-h-screen bg-neutral-900 p-6 text-white text-center">
        <h2 className="text-xl">Compra no encontrada</h2>
        <Link to="/compras" className="text-blue-500 hover:underline mt-4 inline-block">Volver a compras</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/compras" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Compras
        </Link>

        {/* Cabecera de Compra */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingBag className="h-8 w-8 text-blue-500" />
                Compra {compra.codigo_compra}
              </h1>
              <p className="text-neutral-400 mt-1">
                Registrada el {new Date(compra.fecha).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 items-end">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                compra.estado === 'completado' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                compra.estado === 'cancelado' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                ESTADO: {(compra.estado || 'borrador').toUpperCase()}
              </span>
              
              {compra.sincronizado_contabilidad ? (
                <span className="px-4 py-1.5 rounded-full text-sm font-bold border bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> FACTURADO: {compra.numero_factura_externa}
                </span>
              ) : (
                <span className="px-4 py-1.5 rounded-full text-sm font-bold border bg-amber-500/20 text-amber-400 border-amber-500/30">
                  PENDIENTE DE FACTURA
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-1">Proveedor</h3>
              <p className="font-bold text-lg">{compra.proveedor_nombre}</p>
              {compra.proveedor_identificacion && (
                <p className="text-sm text-neutral-500">RUC: {compra.proveedor_identificacion}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-1">Total Pagado</h3>
              <p className="font-bold text-2xl text-emerald-400">${Number(compra.monto_total || 0).toFixed(2)}</p>
            </div>
            {compra.notas && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-neutral-400 mb-1">Notas</h3>
                <p className="text-neutral-300">{compra.notas}</p>
              </div>
            )}
          </div>
        </div>

        {/* Acciones Rápidas (Logisticas / Contables) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Panel Logístico */}
          {compra.estado === 'borrador' && (
             <div className="bg-neutral-800 rounded-xl border border-amber-500/30 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2 mb-2">
                  <Factory className="h-5 w-5" /> Ingreso a Inventario Pendiente
                </h3>
                <p className="text-neutral-400 text-sm mb-4">
                  Esta compra está en borrador. Revisa los items abajo. Al hacer clic en Completar, el stock de estos insumos se sumará a tus bodegas.
                </p>
              </div>
              <button
                onClick={confirmarCompra}
                disabled={isSyncing}
                className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Completar e Ingresar Stock
              </button>
            </div>
          )}

          {/* Panel Contable */}
          {!compra.sincronizado_contabilidad && (
            <div className="bg-neutral-800 rounded-xl border border-blue-500/30 p-6">
              <h3 className="text-lg font-bold text-blue-400 mb-2">Sincronización Contable</h3>
              <p className="text-neutral-400 text-sm mb-4">
                Ingresa el número de factura que te dio el proveedor para marcar esta compra como registrada en el sistema oficial.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={facturaInput}
                  onChange={e => setFacturaInput(e.target.value)}
                  placeholder="Ej: 001-002-000456"
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-white"
                />
                <button
                  onClick={handleSyncContabilidad}
                  disabled={isSyncing || !facturaInput}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sincronizar'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detalles / Items Comprados */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            Insumos Recibidos
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900/50 border-b border-neutral-700">
                  <th className="p-4 font-medium text-neutral-400">Insumo</th>
                  <th className="p-4 font-medium text-neutral-400">Cantidad</th>
                  <th className="p-4 font-medium text-neutral-400">Precio Unit.</th>
                  <th className="p-4 font-medium text-neutral-400 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {detalles.map((detalle) => (
                  <tr key={detalle.id} className="hover:bg-neutral-800/50">
                    <td className="p-4 font-medium">{detalle.insumos?.nombre}</td>
                    <td className="p-4">{detalle.cantidad} <span className="text-neutral-500 text-sm">{detalle.insumos?.unidad_medida}</span></td>
                    <td className="p-4">${Number(detalle.precio_unitario || 0).toFixed(2)}</td>
                    <td className="p-4 text-right font-bold text-emerald-400">${Number(detalle.subtotal || 0).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-neutral-900/50 border-t-2 border-neutral-600">
                  <td colSpan={3} className="p-4 text-right font-bold text-neutral-300">Total:</td>
                  <td className="p-4 text-right font-bold text-emerald-400 text-xl">${Number(compra.monto_total || 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
