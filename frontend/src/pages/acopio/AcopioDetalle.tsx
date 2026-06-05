import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, MapPin, DollarSign, Package, Printer, CheckCircle2 } from 'lucide-react';
import { PrintHeader } from '../../components/ui/PrintHeader';
import { SignatureBox } from '../../components/ui/SignatureBox';
import { sendOperationNotification } from '../../lib/email';

export default function AcopioDetalle() {
  const { id } = useParams();
  const [acopio, setAcopio] = useState<any>(null);
  const [entregas, setEntregas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        // Cargar detalles del acopio
        const { data: acopioData, error: acopioError } = await supabase
          .from('acopios')
          .select(`
            *,
            grupos_base (nombre),
            responsable:perfiles (nombre_completo)
          `)
          .eq('id', id)
          .single();

        if (acopioError) throw acopioError;
        setAcopio(acopioData);

        // Cargar entregas de este acopio
        const { data: entregasData, error: entregasError } = await supabase
          .from('entregas_cacao')
          .select(`
            *,
            socios (nombres, apellidos, cedula),
            fincas (nombre)
          `)
          .eq('acopio_id', id)
          .order('created_at', { ascending: false });

        if (entregasError) throw entregasError;
        setEntregas(entregasData || []);
      } catch (error) {
        console.error('Error loading acopio details:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [id]);

  const finalizarJornada = async () => {
    if (!window.confirm('¿Seguro que deseas FINALIZAR esta jornada de acopio? Ya no se podrán registrar más entregas.')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('acopios').update({ estado: 'finalizado' }).eq('id', id);
      if (error) throw error;
      
      const totalAcopiado = entregas.reduce((sum, entrega) => sum + Number(entrega.peso_kg), 0);
      
      sendOperationNotification({
        tipo_operacion: 'Jornada de Acopio Finalizada',
        codigo: `ACOP-${id?.slice(0,6).toUpperCase()}`,
        detalles: `Se acopió un total de ${totalAcopiado.toFixed(2)} kg de cacao en ${entregas.length} entregas.`,
        responsable: acopio?.responsable?.nombre_completo || 'Responsable',
        fecha: new Date().toLocaleString(),
        destinatarios_extra: 'procesamiento@asopromas.com'
      });
      
      setAcopio({ ...acopio, estado: 'finalizado' });
      alert('Jornada finalizada y notificaciones enviadas.');
    } catch (error) {
      console.error(error);
      alert('Error al finalizar la jornada.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-neutral-900 p-6 flex justify-center text-neutral-400">Cargando detalles...</div>;
  }

  if (!acopio) {
    return <div className="min-h-screen bg-neutral-900 p-6 flex justify-center text-red-400">Jornada no encontrada</div>;
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'programado': return 'bg-blue-500/20 text-blue-400';
      case 'en_curso': return 'bg-amber-500/20 text-amber-400';
      case 'finalizado': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-neutral-500/20 text-neutral-400';
    }
  };

  const totalAcopiado = entregas.reduce((sum, entrega) => sum + Number(entrega.peso_kg), 0);
  const totalPagos = entregas.reduce((sum, entrega) => sum + Number(entrega.monto_total), 0);

  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 no-print">
          <Link to="/acopio" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver a Jornadas
          </Link>
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Printer className="h-4 w-4" /> Imprimir Reporte
          </button>
        </div>

        <PrintHeader 
          title="Reporte de Jornada de Acopio" 
          subtitle={`Fecha: ${new Date(acopio.fecha).toLocaleDateString()}`} 
        />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">Detalle de Acopio</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(acopio.estado)}`}>
                {acopio.estado.replace('_', ' ')}
              </span>
            </div>
            <p className="text-neutral-400">Jornada del {new Date(acopio.fecha).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-3 no-print">
            {acopio.estado !== 'finalizado' ? (
              <>
                <Link
                  to={`/acopio/${id}/entrega`}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Registrar Entrega
                </Link>
                <button
                  onClick={finalizarJornada}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-medium rounded-md hover:bg-emerald-500/30 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Finalizar Jornada
                </button>
              </>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5" /> Jornada Cerrada
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-lg text-amber-500">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Grupo / Ubicación</p>
              <p className="font-semibold text-white mt-1">{acopio.grupos_base?.nombre || 'General'}</p>
              <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {acopio.ubicacion || 'No especificada'}</p>
            </div>
          </div>
          
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-lg text-emerald-500">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Precio Base</p>
              <p className="font-semibold text-white mt-1">${acopio.precio_dia_kg} / kg</p>
              <p className="text-xs text-neutral-500 mt-1">Precio fijado para hoy</p>
            </div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-lg text-blue-500">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Total Acopiado</p>
              <p className="font-semibold text-white mt-1">{totalAcopiado.toFixed(2)} kg</p>
              <p className="text-xs text-neutral-500 mt-1">En {entregas.length} entregas</p>
            </div>
          </div>
          
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-lg text-green-500">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Total en Pagos</p>
              <p className="font-semibold text-white mt-1">${totalPagos.toFixed(2)}</p>
              <p className="text-xs text-neutral-500 mt-1">Valor bruto a pagar</p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-neutral-700">
            <h2 className="text-lg font-medium text-white">Entregas de Cacao Registradas</h2>
          </div>
          
          {entregas.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              Aún no hay entregas registradas en esta jornada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="text-xs uppercase bg-neutral-900/50 text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Socio</th>
                    <th className="px-6 py-4 font-medium">Finca</th>
                    <th className="px-6 py-4 font-medium">Peso (kg)</th>
                    <th className="px-6 py-4 font-medium">Calidad</th>
                    <th className="px-6 py-4 font-medium">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {entregas.map((entrega) => (
                    <tr key={entrega.id} className="hover:bg-neutral-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{entrega.socios?.nombres} {entrega.socios?.apellidos}</p>
                        <p className="text-xs text-neutral-500">{entrega.socios?.cedula}</p>
                      </td>
                      <td className="px-6 py-4">{entrega.fincas?.nombre}</td>
                      <td className="px-6 py-4 font-medium text-amber-400">{entrega.peso_kg} kg</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                          entrega.calidad === 'premium' ? 'bg-purple-500/20 text-purple-400' :
                          entrega.calidad === 'rechazado' ? 'bg-red-500/20 text-red-400' :
                          'bg-neutral-500/20 text-neutral-400'
                        }`}>
                          {entrega.calidad}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-400">${entrega.monto_total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <SignatureBox 
          signatures={[
            { role: 'Responsable de Acopio', name: acopio.responsable?.nombre_completo },
            { role: 'Administración' },
            { role: 'Contabilidad' }
          ]} 
        />
      </div>
    </div>
  );
}
