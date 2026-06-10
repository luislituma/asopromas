// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, DollarSign, Receipt, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LiquidacionPago() {
  const { id } = useParams(); // ID de la entrega_cacao
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  
  const [entrega, setEntrega] = useState<any>(null);
  const [deudas, setDeudas] = useState<any[]>([]);
  
  // Estado para guardar cuánto se descuenta de cada deuda
  const [descuentosManuales, setDescuentosManuales] = useState<Record<string, number>>({});
  
  const [formData, setFormData] = useState({
    metodo_pago: 'efectivo',
    referencia_pago: '',
    notas: ''
  });

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        // 1. Cargar la entrega de cacao
        const { data: entregaData, error: entregaError } = await supabase
          .from('entregas_cacao')
          .select('*, socios(*)')
          .eq('id', id)
          .single();
          
        if (entregaError) throw entregaError;
        setEntrega(entregaData);

        // 2. Cargar deudas pendientes del socio
        const { data: deudasData, error: deudasError } = await supabase
          .from('entregas_insumos')
          .select('*, insumos(nombre)')
          .eq('socio_id', entregaData.socio_id)
          .gt('saldo_pendiente', 0)
          .order('fecha', { ascending: true });

        if (deudasError) throw deudasError;
        
        setDeudas(deudasData || []);
        
        // Inicializar descuentos recomendados (pagar todo lo posible)
        let valorCacao = Number(entregaData.monto_total);
        let descuentosInit: Record<string, number> = {};
        
        deudasData?.forEach(d => {
          const saldo = Number(d.saldo_pendiente);
          if (valorCacao >= saldo) {
            descuentosInit[d.id] = saldo;
            valorCacao -= saldo;
          } else if (valorCacao > 0) {
            descuentosInit[d.id] = valorCacao;
            valorCacao = 0;
          } else {
            descuentosInit[d.id] = 0;
          }
        });
        
        setDescuentosManuales(descuentosInit);

      } catch (error) {
        console.error('Error loading liquidacion:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleDescuentoChange = (deudaId: string, value: string) => {
    const num = parseFloat(value) || 0;
    setDescuentosManuales(prev => ({
      ...prev,
      [deudaId]: num
    }));
  };

  const montoBruto = entrega ? Number(entrega.monto_total) : 0;
  
  // Calcular total descuentos
  const totalDescuentos = Object.values(descuentosManuales).reduce((sum, val) => sum + val, 0);
  const montoNeto = montoBruto - totalDescuentos;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (montoNeto < 0) {
      alert('Error: Los descuentos no pueden superar el monto bruto a pagar.');
      return;
    }
    
    setProcesando(true);

    try {
      // 1. Crear el pago
      const { data: pagoData, error: pagoError } = await supabase
        .from('pagos')
        .insert([{
          entrega_cacao_id: id,
          contadora_id: user?.id,
          monto_bruto: montoBruto,
          monto_descuentos: totalDescuentos,
          monto_neto: montoNeto,
          metodo_pago: formData.metodo_pago,
          referencia_pago: formData.referencia_pago || null,
          notas: formData.notas
        }])
        .select()
        .single();

      if (pagoError) throw pagoError;

      // 2. Registrar los descuentos aplicados si existen
      const descuentosToInsert = Object.entries(descuentosManuales)
        .filter(([_, monto]) => monto > 0)
        .map(([deudaId, monto]) => ({
          pago_id: pagoData.id,
          entrega_insumo_id: deudaId,
          monto_descontado: monto
        }));

      if (descuentosToInsert.length > 0) {
        const { error: descError } = await supabase
          .from('descuentos_aplicados')
          .insert(descuentosToInsert);
          
        if (descError) throw descError;
        // Los Triggers actualizarán el saldo de las deudas automáticamente
      }
      
      navigate('/pagos');
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error al liquidar pago.');
    } finally {
      setProcesando(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-white">Cargando datos...</div>;
  if (!entrega) return <div className="p-10 text-center text-red-400">Entrega no encontrada</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/pagos" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a Liquidaciones
        </Link>
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Liquidación de Pago</h1>
            <p className="text-neutral-400 mt-1">Socio: {entrega.socios?.nombres} {entrega.socios?.apellidos}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg text-right">
            <p className="text-sm text-emerald-400/80 uppercase font-medium">Monto Bruto Cacao</p>
            <p className="text-2xl font-bold text-emerald-400">${montoBruto.toFixed(2)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECCIÓN DE DEUDAS (INSUMOS) */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-neutral-700 bg-neutral-800/80 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-medium text-white">Descuentos por Insumos (Créditos del Socio)</h2>
            </div>
            
            {deudas.length === 0 ? (
              <div className="p-6 text-center text-neutral-400">
                Este socio no tiene deudas pendientes por insumos. No se aplicarán descuentos.
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 p-3 rounded-md">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p>Puedes editar cuánto descontar en este pago según lo acordado con el socio.</p>
                </div>
                
                <div className="space-y-4">
                  {deudas.map(deuda => (
                    <div key={deuda.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-neutral-700 rounded-lg bg-neutral-900/50">
                      <div>
                        <p className="font-medium text-white">{deuda.insumos?.nombre}</p>
                        <p className="text-sm text-neutral-400 mt-1">Fecha: {new Date(deuda.fecha).toLocaleDateString()} | Saldo Actual: <span className="text-red-400 font-medium">${deuda.saldo_pendiente}</span></p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-neutral-400">Descontar ahora:</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-neutral-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={deuda.saldo_pendiente}
                            value={descuentosManuales[deuda.id] !== undefined ? descuentosManuales[deuda.id] : ''}
                            onChange={(e) => handleDescuentoChange(deuda.id, e.target.value)}
                            className="w-32 bg-neutral-900 border border-neutral-700 rounded-md py-2 pl-8 pr-3 text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* TOTALES INTERMEDIOS */}
            <div className="p-4 bg-neutral-900/80 border-t border-neutral-700 flex justify-end gap-8">
              <div className="text-right">
                <p className="text-sm text-neutral-400">Subtotal Descuentos</p>
                <p className="text-lg font-bold text-red-400">-${totalDescuentos.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-400">Total a Pagar al Socio</p>
                <p className={`text-2xl font-bold ${montoNeto < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  ${montoNeto.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* DETALLES DEL PAGO */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <h2 className="text-lg font-medium text-white mb-4">Detalles de Transferencia / Efectivo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Método de Pago</label>
                <select
                  value={formData.metodo_pago}
                  onChange={(e) => setFormData({...formData, metodo_pago: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Referencia / Comprobante (Opcional)</label>
                <input
                  type="text"
                  value={formData.referencia_pago}
                  onChange={(e) => setFormData({...formData, referencia_pago: e.target.value})}
                  placeholder="Nro de transferencia o cheque"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-300 mb-2">Notas del Pago</label>
                <textarea
                  rows={2}
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={procesando || montoNeto < 0}
              className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {procesando ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Procesar Liquidación Definitiva
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
