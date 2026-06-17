import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Calendar, MapPin, Scale, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HistorialEntregas({ socioId }: { socioId: string }) {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntregas() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('entregas_acopio')
          .select(`
            *,
            lote_acopio:lotes_acopio(codigo, fecha_inicio)
          `)
          .eq('socio_id', socioId)
          .order('fecha_entrega', { ascending: false });

        if (error) throw error;
        setEntregas(data || []);
      } catch (error) {
        console.error('Error cargando historial de acopio:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (socioId) {
      loadEntregas();
    }
  }, [socioId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (entregas.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Sin Entregas Registradas</h3>
        <p className="text-slate-500 max-w-md mx-auto">Este socio aún no ha realizado ninguna entrega de cacao a los lotes de acopio de la asociación.</p>
      </div>
    );
  }

  // Cálculos rápidos
  const totalKilos = entregas.reduce((acc, curr) => acc + Number(curr.peso_neto_estandar_kg || 0), 0);
  const totalPagado = entregas.filter(e => e.estado_pago === 'Pagado').reduce((acc, curr) => acc + Number(curr.total_pagar || 0), 0);
  const totalPendiente = entregas.filter(e => e.estado_pago === 'Pendiente').reduce((acc, curr) => acc + Number(curr.total_pagar || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Scale className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500">Total Entregado</div>
            <div className="text-2xl font-black text-slate-800">{totalKilos.toFixed(2)} <span className="text-sm text-slate-500 font-medium">kg</span></div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500">Pagos Recibidos</div>
            <div className="text-2xl font-black text-slate-800">${totalPagado.toFixed(2)}</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <DollarSign className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500">Saldos Pendientes</div>
            <div className="text-2xl font-black text-slate-800">${totalPendiente.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Detalle de Entregas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-sm font-bold text-slate-500">Fecha</th>
                <th className="pb-3 text-sm font-bold text-slate-500">Lote de Acopio</th>
                <th className="pb-3 text-sm font-bold text-slate-500 text-right">Peso Neto</th>
                <th className="pb-3 text-sm font-bold text-slate-500 text-right">Precio/Unid.</th>
                <th className="pb-3 text-sm font-bold text-slate-500 text-right">Total</th>
                <th className="pb-3 text-sm font-bold text-slate-500 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {entregas.map((entrega) => (
                <tr key={entrega.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-sm font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(entrega.fecha_entrega).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4">
                    <Link to={`/acopio/${entrega.lote_acopio_id}`} className="text-sm font-bold text-emerald-600 hover:underline">
                      {entrega.lote_acopio?.codigo || 'Lote Desconocido'}
                    </Link>
                  </td>
                  <td className="py-4 text-sm font-bold text-slate-800 text-right">
                    {entrega.peso_neto} <span className="text-slate-400 font-medium">{entrega.unidad_medida}</span>
                  </td>
                  <td className="py-4 text-sm text-slate-600 text-right">
                    ${Number(entrega.precio_unidad).toFixed(2)}
                  </td>
                  <td className="py-4 text-sm font-black text-slate-800 text-right">
                    ${Number(entrega.total_pagar).toFixed(2)}
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      entrega.estado_pago === 'Pagado' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {entrega.estado_pago}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
