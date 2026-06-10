// @ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Loader2, Printer, CheckCircle2, X, Save } from 'lucide-react';

export default function VentaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceInput, setInvoiceInput] = useState('');

  useEffect(() => {
    fetchVenta();
  }, [id]);

  const fetchVenta = async () => {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .select(`
          *,
          clientes ( nombre_razon_social, identificacion, tipo_cliente, email, telefono, direccion ),
          perfiles ( nombre_completo ),
          venta_detalles (
            id,
            tipo_item,
            cantidad,
            precio_unitario,
            subtotal,
            productos_catalogo ( nombre, unidad_medida ),
            lotes ( codigo_lote ),
            insumos ( nombre, unidad_medida )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setVenta(data);
    } catch (error: any) {
      console.error('Fetch Venta Error:', error);
      alert(`Error cargando la venta: ${error.message || JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmarVenta = async () => {
    if (!window.confirm(`¿Seguro que deseas COMPLETAR la venta ${venta.codigo_venta}? Esto descontará automáticamente el inventario de las bodegas correspondientes.`)) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('ventas').update({ estado: 'completado' }).eq('id', id);
      if (error) throw error;
      await fetchVenta();
    } catch (error) {
      console.error(error);
      alert('Error al completar la venta.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInvoiceModal = () => {
    setInvoiceInput(venta.numero_factura_externa || '');
    setIsInvoiceModalOpen(true);
  };

  const handleSaveInvoice = async () => {
    try {
      const { error } = await supabase.from('ventas').update({ 
        sincronizado_contabilidad: true,
        numero_factura_externa: invoiceInput.trim() || null
      }).eq('id', id);
      
      if (error) throw error;
      setIsInvoiceModalOpen(false);
      fetchVenta();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar estado contable.');
    }
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-amber-500" /></div>;
  }

  if (!venta) return <div className="p-12 text-center text-white">Venta no encontrada</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Link to="/ventas" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver a Ventas
          </Link>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-700 transition-colors flex items-center gap-2"
            >
              <Printer className="h-4 w-4" /> Imprimir Recibo
            </button>
            {venta.estado === 'borrador' && (
              <button 
                onClick={confirmarVenta}
                className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                Completar y Descontar Inventario
              </button>
            )}
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden print:bg-white print:text-black">
          {/* Header */}
          <div className="p-8 border-b border-neutral-700 print:border-neutral-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-amber-500 print:text-amber-600">ASOPROMAS</h1>
                <p className="text-neutral-400 mt-1 print:text-neutral-500">Asociación de Productores</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-white print:text-black">Recibo de Venta</h2>
                <p className="text-neutral-400 print:text-neutral-500 font-mono mt-1">Código: {venta.codigo_venta}</p>
                {venta.numero_factura_externa && (
                  <p className="text-amber-500 print:text-black font-mono mt-1 text-sm font-bold">
                    Factura N°: {venta.numero_factura_externa}
                  </p>
                )}
                <div className="mt-2 flex flex-col items-end gap-2 print:hidden">
                  {venta.estado === 'completado' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">
                      <CheckCircle2 className="h-4 w-4" /> COMPLETADO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-500/20 text-neutral-400 rounded-full text-xs font-bold border border-neutral-500/30">
                      BORRADOR
                    </span>
                  )}

                  {venta.sincronizado_contabilidad ? (
                    <button 
                      onClick={handleOpenInvoiceModal}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                      title="Haz clic para editar el número de factura"
                    >
                      <CheckCircle2 className="h-4 w-4" /> FACTURADO: {venta.numero_factura_externa || 'S/N'}
                    </button>
                  ) : (
                    <button 
                      onClick={handleOpenInvoiceModal}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                    >
                      PENDIENTE FACTURAR
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2 print:text-neutral-400">Cliente</h3>
                <p className="font-medium text-white print:text-black">{venta.clientes?.nombre_razon_social || 'Consumidor Final'}</p>
                {venta.clientes?.identificacion && <p className="text-neutral-400 text-sm mt-1 print:text-neutral-600">ID: {venta.clientes.identificacion}</p>}
                {venta.clientes?.direccion && <p className="text-neutral-400 text-sm mt-1 print:text-neutral-600">{venta.clientes.direccion}</p>}
                {venta.clientes?.email && <p className="text-neutral-400 text-sm mt-1 print:text-neutral-600">{venta.clientes.email}</p>}
                {!venta.clientes && <p className="text-neutral-500 text-sm mt-1 italic print:text-neutral-500">Venta rápida sin datos asignados</p>}
              </div>
              <div className="text-right">
                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2 print:text-neutral-400">Detalles</h3>
                <p className="text-neutral-300 print:text-neutral-700">Fecha: <span className="text-white font-medium print:text-black">{new Date(venta.fecha).toLocaleDateString()}</span></p>
                <p className="text-neutral-300 mt-1 print:text-neutral-700">Atendido por: <span className="text-white font-medium print:text-black">{venta.perfiles?.nombre_completo}</span></p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-8">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-700 print:border-neutral-300">
                <tr>
                  <th className="py-3 text-neutral-400 font-medium">Descripción</th>
                  <th className="py-3 text-neutral-400 font-medium text-center">Cant.</th>
                  <th className="py-3 text-neutral-400 font-medium text-right">Precio Unit.</th>
                  <th className="py-3 text-neutral-400 font-medium text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700/50 print:divide-neutral-200">
                {venta.venta_detalles?.map((det: any) => {
                  let nombre = 'Ítem desconocido';
                  if (det.tipo_item === 'producto_derivado' && det.productos_catalogo) nombre = det.productos_catalogo.nombre;
                  if (det.tipo_item === 'cacao_grano' && det.lotes) nombre = `Lote de Cacao: ${det.lotes.codigo_lote}`;
                  if (det.tipo_item === 'insumo' && det.insumos) nombre = `Insumo: ${det.insumos.nombre}`;

                  return (
                    <tr key={det.id}>
                      <td className="py-4">
                        <p className="font-medium text-white print:text-black">{nombre}</p>
                        <p className="text-xs text-neutral-500 capitalize">{det.tipo_item.replace('_', ' ')}</p>
                      </td>
                      <td className="py-4 text-center text-neutral-300 print:text-neutral-800">{det.cantidad}</td>
                      <td className="py-4 text-right text-neutral-300 print:text-neutral-800">${det.precio_unitario.toFixed(2)}</td>
                      <td className="py-4 text-right font-medium text-white print:text-black">${det.subtotal.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="p-8 bg-neutral-900/50 border-t border-neutral-700 flex justify-end print:bg-neutral-50 print:border-neutral-300">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                <span>Subtotal</span>
                <span>${venta.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400 print:text-neutral-600">
                <span>Descuento</span>
                <span>-${venta.descuento.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-neutral-700 print:text-black print:border-neutral-300">
                <span>Total</span>
                <span className="text-amber-500 print:text-amber-600">${venta.monto_total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {venta.notas && (
            <div className="p-8 border-t border-neutral-700 bg-neutral-800 print:bg-white print:border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2 print:text-neutral-400">Notas Adicionales</h3>
              <p className="text-neutral-300 print:text-neutral-700 whitespace-pre-wrap">{venta.notas}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Ingresar Factura */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-white">Número de Factura Oficial</h2>
              <button 
                onClick={() => setIsInvoiceModalOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-neutral-400 text-sm mb-4">
                Ingresa el número de factura física o electrónica (ej. 001-001-12345678). Si solo deseas marcar la venta como sincronizada sin número, déjalo en blanco.
              </p>
              
              <input
                type="text"
                autoFocus
                placeholder="001-001-0000000"
                value={invoiceInput}
                onChange={(e) => setInvoiceInput(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-lg font-mono text-center tracking-widest placeholder-neutral-600"
              />
            </div>
            
            <div className="p-4 bg-neutral-800 border-t border-neutral-700 flex justify-end gap-3">
              <button 
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-4 py-2 text-neutral-400 hover:text-white font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveInvoice}
                className="px-5 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
