import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, User, Plus, Search, Map, Scale, DollarSign, Leaf, Edit, Trash2 } from 'lucide-react';

export default function AcopioDetalle() {
  const { id } = useParams();
  const [lote, setLote] = useState<any>(null);
  const [entregas, setEntregas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para el Modal de Eliminar
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entregaToDelete, setEntregaToDelete] = useState<{ id: string, kg: number } | null>(null);
  // Estados para el Modal de Trazabilidad
  const [isTrazabilidadOpen, setIsTrazabilidadOpen] = useState(false);
  const [selectedTrazabilidad, setSelectedTrazabilidad] = useState<any>(null);

  useEffect(() => {
    fetchAcopioData();
  }, [id]);

  async function fetchAcopioData() {
    try {
      setLoading(true);

      // 1. Obtener datos del Lote principal
      const { data: loteData, error: loteError } = await supabase
        .from('lotes_acopio')
        .select(`
          *,
          responsable:perfiles(nombre_completo)
        `)
        .eq('id', id)
        .single();

      if (loteError) throw loteError;
      setLote(loteData);

      // 2. Obtener las Entregas asociadas a este Lote
      const { data: entregasData, error: entregasError } = await supabase
        .from('entregas_acopio')
        .select(`
          *,
          socio:socios(nombres, apellidos, cedula),
          trazabilidad:entregas_lotes_origen(
            porcentaje,
            finca:fincas(nombre),
            lote:lotes_finca(nombre_lote)
          )
        `)
        .eq('lote_acopio_id', id)
        .order('created_at', { ascending: false });

      if (entregasError) throw entregasError;
      setEntregas(entregasData || []);

    } catch (error) {
      console.error('Error fetching acopio data:', error);
    } finally {
      setLoading(false);
    }
  }

  const confirmDelete = async () => {
    if (!entregaToDelete) return;
    try {
      setIsDeleting(true);
      const { id: entregaId, kg } = entregaToDelete;
      
      // Borrar trazabilidad por si acaso
      await supabase.from('entregas_lotes_origen').delete().eq('entrega_id', entregaId);
      
      // Borrar entrega
      const { error } = await supabase.from('entregas_acopio').delete().eq('id', entregaId);
      if (error) throw error;

      // Restar totales del lote
      const lbs = kg * 2.20462;
      const { data: loteData } = await supabase.from('lotes_acopio').select('peso_total_kg, peso_total_lbs').eq('id', id).single();
      if (loteData) {
        await supabase.from('lotes_acopio').update({
          peso_total_kg: Math.max(0, Number(loteData.peso_total_kg) - kg),
          peso_total_lbs: Math.max(0, Number(loteData.peso_total_lbs) - lbs)
        }).eq('id', id);
      }
      
      // Refrescar
      setIsDeleteModalOpen(false);
      setEntregaToDelete(null);
      fetchAcopioData();
    } catch (err: any) {
      console.error(err);
      alert('Error al eliminar: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (entregaId: string, kg: number) => {
    setEntregaToDelete({ id: entregaId, kg });
    setIsDeleteModalOpen(true);
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Abierto':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Activo / Abierto</span>;
      case 'Cerrado':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Cerrado en Bodega</span>;
      case 'Enviado a Planta':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Enviado a Planta</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{estado}</span>;
    }
  };

  const filteredEntregas = entregas.filter(e => {
    const fullName = `${e.socio?.nombres} ${e.socio?.apellidos}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || e.socio?.cedula.includes(searchTerm);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!lote) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Lote no encontrado</h2>
        <Link to="/acopio" className="text-emerald-600 hover:underline">Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header con Info del Lote */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <Link to="/acopio" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-4 transition-colors font-medium text-sm">
                <ArrowLeft className="h-4 w-4" />
                Volver a Acopios
              </Link>
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <Package className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{lote.codigo}</h1>
                  <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(lote.fecha_inicio).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> {lote.responsable?.nombre_completo || 'Sin Encargado'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {getStatusBadge(lote.estado)}
              {lote.estado === 'Abierto' && (
                <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold text-sm transition-colors border border-slate-200">
                  Cerrar Lote
                </button>
              )}
            </div>
          </div>

          {/* Estadísticas Rápidas del Lote */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Scale className="w-4 h-4" />
                <span className="text-sm font-bold">Total Kilos</span>
              </div>
              <div className="text-2xl font-black text-slate-800">{Number(lote.peso_total_kg || 0).toFixed(2)} <span className="text-sm font-medium text-slate-500">kg</span></div>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Scale className="w-4 h-4" />
                <span className="text-sm font-bold">Total Libras</span>
              </div>
              <div className="text-2xl font-black text-slate-800">{Number(lote.peso_total_lbs || 0).toFixed(2)} <span className="text-sm font-medium text-slate-500">lbs</span></div>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Leaf className="w-4 h-4" />
                <span className="text-sm font-bold">Entregas Hoy</span>
              </div>
              <div className="text-2xl font-black text-slate-800">{entregas.length} <span className="text-sm font-medium text-slate-500">recibos</span></div>
            </div>
            <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-bold">Pagos Pendientes</span>
              </div>
              <div className="text-2xl font-black text-slate-800">
                ${entregas.filter(e => e.estado_pago === 'Pendiente').reduce((acc, curr) => acc + Number(curr.total_pagar), 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Entregas */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-800">Registro de Entregas</h2>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar socio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-black text-sm w-64"
                />
              </div>
              
              {lote.estado === 'Abierto' && (
                <Link
                  to={`/acopio/${id}/entrega`}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-emerald-200"
                >
                  <Plus className="w-4 h-4" />
                  Nueva Entrega
                </Link>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-sm font-bold text-slate-500">Socio</th>
                  <th className="pb-3 text-sm font-bold text-slate-500">Hora</th>
                  <th className="pb-3 text-sm font-bold text-slate-500 text-right">Bruto</th>
                  <th className="pb-3 text-sm font-bold text-slate-500 text-right">Neto</th>
                  <th className="pb-3 text-sm font-bold text-slate-500 text-right">Unidad</th>
                  <th className="pb-3 text-sm font-bold text-slate-500 text-right">Total ($)</th>
                  <th className="pb-3 text-sm font-bold text-slate-500 text-center">Estado Pago</th>
                  <th className="pb-3 text-sm font-bold text-slate-500 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntregas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      No hay entregas registradas aún.
                    </td>
                  </tr>
                ) : (
                  filteredEntregas.map((entrega) => (
                    <tr key={entrega.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-slate-800">{entrega.socio?.nombres} {entrega.socio?.apellidos}</div>
                        {entrega.trazabilidad && entrega.trazabilidad.length > 0 ? (
                          <button 
                            onClick={() => {
                              setSelectedTrazabilidad({
                                socio: `${entrega.socio?.nombres} ${entrega.socio?.apellidos}`,
                                trazabilidad: entrega.trazabilidad
                              });
                              setIsTrazabilidadOpen(true);
                            }}
                            className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-0.5 hover:underline transition-all"
                          >
                            <Map className="w-3 h-3" />
                            Ver Trazabilidad
                          </button>
                        ) : (
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Map className="w-3 h-3" />
                            Sin origen registrado
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-sm text-slate-600">
                        {new Date(entrega.fecha_entrega).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="py-4 text-sm font-medium text-slate-700 text-right">
                        {Number(entrega.peso_bruto).toFixed(2)}
                      </td>
                      <td className="py-4 text-sm font-bold text-emerald-600 text-right">
                        {Number(entrega.peso_neto).toFixed(2)}
                      </td>
                      <td className="py-4 text-sm text-slate-500 text-right">
                        {entrega.unidad_medida.toUpperCase()}
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-800 text-right">
                        ${entrega.total_pagar.toFixed(2)}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                          entrega.estado_pago === 'Pagado' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {entrega.estado_pago}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center items-center gap-1">
                          <Link
                            to={`/acopio/${id}/entrega/${entrega.id}`}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Editar Entrega"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(entrega.id, Number(entrega.peso_neto_estandar_kg || 0))}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar Entrega"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal de Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">¿Eliminar Registro?</h3>
              <p className="text-slate-500 mb-8">
                Estás a punto de eliminar esta entrega de cacao. Su peso se restará automáticamente del total del lote del día para mantener las cuentas exactas. Esta acción no se puede deshacer.
              </p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isDeleting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sí, Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Trazabilidad */}
      {isTrazabilidadOpen && selectedTrazabilidad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">Trazabilidad de Origen</h3>
              <p className="text-slate-500 mb-6">Socio: <span className="font-bold text-slate-700">{selectedTrazabilidad.socio}</span></p>
              
              <div className="space-y-4 mb-8">
                {selectedTrazabilidad.trazabilidad.map((traz: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                      <Leaf className="w-5 h-5" />
                      <span className="font-bold">Datos de la Finca</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Finca principal:</span>
                        <span className="font-bold text-slate-800">{traz.finca?.nombre || 'No especificada'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Lote específico:</span>
                        <span className="font-bold text-slate-800">{traz.lote?.nombre_lote || 'General (Toda la finca)'}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500">Porcentaje de entrega:</span>
                        <span className="font-bold text-emerald-600">{traz.porcentaje}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setIsTrazabilidadOpen(false)}
                className="w-full px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cerrar Detalles
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
