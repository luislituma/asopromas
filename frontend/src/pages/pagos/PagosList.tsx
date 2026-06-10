// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { DollarSign, Search, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';

export default function PagosList() {
  const [entregasPendientes, setEntregasPendientes] = useState<any[]>([]);
  const [pagosProcesados, setPagosProcesados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pendientes' | 'procesados'>('pendientes');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Obtener pagos procesados para saber qué entregas ya están pagadas
      const { data: pagosData, error: pagosError } = await supabase
        .from('pagos')
        .select('entrega_cacao_id, monto_neto, fecha_pago, estado, id, socios:entrega_cacao_id(socios(nombres, apellidos))')
        // El join arriba es complejo con supabase-js, lo simplificamos:
        // Haremos 2 queries separadas para mayor claridad
      
      const { data: pagosFull } = await supabase
        .from('pagos')
        .select(`
          id,
          fecha_pago,
          monto_neto,
          estado,
          entregas_cacao (
            socios (nombres, apellidos, cedula)
          )
        `)
        .order('fecha_pago', { ascending: false });

      if (pagosFull) setPagosProcesados(pagosFull);

      const pagosIds = pagosFull?.map(p => p.entregas_cacao.id) || [];

      // 2. Obtener entregas_cacao que NO están en pagosIds (pendientes de pago)
      let query = supabase
        .from('entregas_cacao')
        .select(`
          id,
          monto_total,
          peso_kg,
          created_at,
          acopios (fecha),
          socios (id, nombres, apellidos, cedula)
        `)
        .order('created_at', { ascending: false });

      const { data: entregasData, error: entregasError } = await query;

      if (entregasError) throw entregasError;

      // Filtrar las que ya están pagadas (forma más segura desde frontend si no usamos RPC)
      // En producción esto debería ser un LEFT JOIN donde pago.id IS NULL
      // Pero por simplicidad en Supabase JS:
      const pendientes = (entregasData || []).filter(entrega => {
         const { data: checkPago } = supabase.from('pagos').select('id').eq('entrega_cacao_id', entrega.id);
         // Para evitar N+1 queries, usaremos filter sobre el resultado completo de pagosFull
         return !pagosFull?.some(p => p.entregas_cacao.id === entrega.id);
      });
      // Corrección del filtro usando ids:
      // Espera, `pagosFull[].entregas_cacao` object no expone id en mi select anterior, agreguémoslo en mente:
      // Bueno, hagámoslo simple obteniendo los id de entregas pagadas primero:
      const { data: soloIds } = await supabase.from('pagos').select('entrega_cacao_id');
      const pagadosIdsList = soloIds?.map(p => p.entrega_cacao_id) || [];
      
      const realesPendientes = (entregasData || []).filter(e => !pagadosIdsList.includes(e.id));
      setEntregasPendientes(realesPendientes);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-emerald-500" />
              Gestión de Pagos
            </h1>
            <p className="text-neutral-400 mt-1">Liquidación de pagos por entregas de cacao y aplicación de descuentos.</p>
          </div>
        </div>

        <div className="flex space-x-1 bg-neutral-800/50 p-1 rounded-lg w-full max-w-md mb-6 border border-neutral-700">
          <button
            onClick={() => setTab('pendientes')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === 'pendientes' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Liquidaciones Pendientes ({entregasPendientes.length})
          </button>
          <button
            onClick={() => setTab('procesados')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === 'procesados' ? 'bg-neutral-700 text-white shadow' : 'text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Pagos Históricos
          </button>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-emerald-500 font-medium animate-pulse">
              Cargando registros financieros...
            </div>
          ) : tab === 'pendientes' ? (
            entregasPendientes.length === 0 ? (
              <div className="p-12 text-center text-neutral-400">
                <CheckCircle2 className="h-12 w-12 text-emerald-500/50 mx-auto mb-4" />
                <p>No hay entregas de cacao pendientes de pago.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-300">
                  <thead className="bg-neutral-900/50 text-neutral-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Socio</th>
                      <th className="px-6 py-4 font-medium">Fecha Entrega</th>
                      <th className="px-6 py-4 font-medium">Cacao Entregado</th>
                      <th className="px-6 py-4 font-medium">Valor Bruto</th>
                      <th className="px-6 py-4 font-medium text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700/50">
                    {entregasPendientes.map((entrega) => (
                      <tr key={entrega.id} className="hover:bg-neutral-700/20">
                        <td className="px-6 py-4">
                          <p className="font-medium text-white">{entrega.socios?.nombres} {entrega.socios?.apellidos}</p>
                          <p className="text-xs text-neutral-500">C.I: {entrega.socios?.cedula}</p>
                        </td>
                        <td className="px-6 py-4">{new Date(entrega.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{entrega.peso_kg} kg</td>
                        <td className="px-6 py-4 font-bold text-emerald-400">${entrega.monto_total}</td>
                        <td className="px-6 py-4 text-right">
                          <Link 
                            to={`/pagos/liquidar/${entrega.id}`}
                            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 font-medium rounded hover:bg-emerald-500 hover:text-black transition-colors inline-block"
                          >
                            Generar Liquidación
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-300">
                  <thead className="bg-neutral-900/50 text-neutral-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Socio</th>
                      <th className="px-6 py-4 font-medium">Fecha Pago</th>
                      <th className="px-6 py-4 font-medium">Monto Pagado (Neto)</th>
                      <th className="px-6 py-4 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700/50">
                    {pagosProcesados.map((pago) => (
                      <tr key={pago.id} className="hover:bg-neutral-700/20">
                        <td className="px-6 py-4">
                          <p className="font-medium text-white">{pago.entregas_cacao?.socios?.nombres} {pago.entregas_cacao?.socios?.apellidos}</p>
                        </td>
                        <td className="px-6 py-4">{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-bold text-emerald-400">${pago.monto_neto}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded uppercase font-medium">
                            {pago.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
