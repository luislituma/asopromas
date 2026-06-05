import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Package, Calendar, Weight, X, Loader2, AlertCircle, Save, Droplets, Printer, Lock, Flame, HandCoins } from 'lucide-react';

export default function LoteDetalle() {
  const { id } = useParams();
  const [lote, setLote] = useState<any>(null);
  const [entregas, setEntregas] = useState<any[]>([]);
  const [tostados, setTostados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Asignar Entregas
  const [showModal, setShowModal] = useState(false);
  const [entregasSueltas, setEntregasSueltas] = useState<any[]>([]);
  const [selectedEntregas, setSelectedEntregas] = useState<Set<string>>(new Set());
  const [loadingModal, setLoadingModal] = useState(false);
  const [asignando, setAsignando] = useState(false);
  const [modalError, setModalError] = useState('');

  // Modal Secado
  const [showSecadoModal, setShowSecadoModal] = useState(false);
  const [secadoForm, setSecadoForm] = useState({
    peso_seco: ''
  });
  const [guardandoSecado, setGuardandoSecado] = useState(false);

  // Modal Transferir a Bodega
  const [showTransferirModal, setShowTransferirModal] = useState(false);
  const [transferirForm, setTransferirForm] = useState({
    cantidad: ''
  });
  const [guardandoTransferencia, setGuardandoTransferencia] = useState(false);

  // Modal Tostado
  const [showTostadoModal, setShowTostadoModal] = useState(false);
  const [tostadoForm, setTostadoForm] = useState({
    peso_seco_utilizado: '',
    peso_tostado_obtenido: '',
    tipo_resultado: 'nibs'
  });
  const [guardandoTostado, setGuardandoTostado] = useState(false);

  const loadLote = async () => {
    if (!id) return;
    try {
      const { data: loteData, error: loteError } = await supabase
        .from('lotes')
        .select('*')
        .eq('id', id)
        .single();
      if (loteError) throw loteError;
      setLote(loteData);

      const { data: entregasData, error: entregasError } = await supabase
        .from('entregas_cacao')
        .select(`
          *,
          socios (nombres, apellidos, cedula),
          fincas (nombre)
        `)
        .eq('lote_id', id)
        .order('created_at', { ascending: false });
      
      if (entregasError) throw entregasError;
      setEntregas(entregasData || []);

      const { data: tostadosData, error: tostadosError } = await supabase
        .from('registros_tostado')
        .select(`
          *,
          perfiles (nombre_completo)
        `)
        .eq('lote_id', id)
        .order('created_at', { ascending: false });
        
      if (tostadosError) throw tostadosError;
      setTostados(tostadosData || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLote();
  }, [id]);

  // --- Funciones Asignación de Entregas ---
  const abrirModalAsignacion = async () => {
    setShowModal(true);
    setLoadingModal(true);
    setModalError('');
    setSelectedEntregas(new Set());
    
    try {
      const { data, error } = await supabase
        .from('entregas_cacao')
        .select(`
          *,
          socios (nombres, apellidos, cedula),
          fincas (nombre)
        `)
        .is('lote_id', null)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setEntregasSueltas(data || []);
    } catch (err) {
      console.error(err);
      setModalError('Error al cargar las entregas sin lote.');
    } finally {
      setLoadingModal(false);
    }
  };

  const toggleSeleccion = (entregaId: string) => {
    const newSelection = new Set(selectedEntregas);
    if (newSelection.has(entregaId)) {
      newSelection.delete(entregaId);
    } else {
      newSelection.add(entregaId);
    }
    setSelectedEntregas(newSelection);
  };

  const seleccionarTodas = () => {
    if (selectedEntregas.size === entregasSueltas.length) {
      setSelectedEntregas(new Set());
    } else {
      setSelectedEntregas(new Set(entregasSueltas.map(e => e.id)));
    }
  };

  const guardarAsignacion = async () => {
    if (selectedEntregas.size === 0) return;
    setAsignando(true);
    
    try {
      const idsArray = Array.from(selectedEntregas);
      
      const { error } = await supabase
        .from('entregas_cacao')
        .update({ lote_id: id })
        .in('id', idsArray);
        
      if (error) throw error;
      
      setShowModal(false);
      setLoading(true);
      await loadLote();
    } catch (err) {
      console.error(err);
      setModalError('Error al asignar las entregas al lote.');
    } finally {
      setAsignando(false);
    }
  };

  // --- Funciones Secado ---
  const abrirModalSecado = () => {
    // Sugerimos el peso total / 3 (relación 3 a 1)
    const sugerido = (lote.peso_total / 3).toFixed(2);
    setPesoSeco(sugerido);
    setShowSecadoModal(true);
  };

  const registrarSecado = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoSecado(true);
    
    try {
      const { error } = await supabase
        .from('lotes')
        .update({
          peso_seco: parseFloat(pesoSeco),
          estado: 'procesado',
          fecha_procesado: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      setShowSecadoModal(false);
      setLoading(true);
      await loadLote();
    } catch (err) {
      console.error(err);
      alert('Error registrando el peso seco.');
    } finally {
      setGuardandoSecado(false);
    }
  };

  const cerrarLote = async () => {
    if (!window.confirm('¿Estás seguro de cerrar este lote? Ya no podrás asignarle más entregas de cacao.')) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('lotes')
        .update({ estado: 'cerrado' })
        .eq('id', id);
      if (error) throw error;
      await loadLote();
    } catch (err) {
      console.error(err);
      alert('Error al cerrar el lote.');
      setLoading(false);
    }
  };

  const guardarTostado = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoTostado(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      let responsable_id = null;
      if (user) {
        const { data: perfil } = await supabase.from('perfiles').select('id').eq('id', user.id).single();
        if (perfil) responsable_id = perfil.id;
      }

      const { error } = await supabase
        .from('registros_tostado')
        .insert([{
          lote_id: id,
          peso_seco_utilizado: parseFloat(tostadoForm.peso_seco_utilizado),
          peso_tostado_obtenido: parseFloat(tostadoForm.peso_tostado_obtenido),
          tipo_resultado: tostadoForm.tipo_resultado,
          responsable_id
        }]);

      if (error) throw error;
      
      setShowTostadoModal(false);
      setTostadoForm({ peso_seco_utilizado: '', peso_tostado_obtenido: '', tipo_resultado: 'nibs' });
      setLoading(true);
      await loadLote();
    } catch (err: any) {
      console.error(err);
      alert(`Error al registrar el tostado: ${err.message || 'Revisa los datos'}`);
    } finally {
      setGuardandoTostado(false);
    }
  };

  const transferirABodega = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoTransferencia(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      let responsable_id = null;
      if (user) {
        const { data: perfil } = await supabase.from('perfiles').select('id').eq('id', user.id).single();
        if (perfil) responsable_id = perfil.id;
      }

      const cantidad = parseFloat(transferirForm.cantidad);

      const { data, error } = await supabase.rpc('transferir_lote_a_bodega', {
        p_lote_id: id,
        p_cantidad: cantidad,
        p_responsable_id: responsable_id
      });

      if (error) throw error;
      
      setShowTransferirModal(false);
      setTransferirForm({ cantidad: '' });
      setLoading(true);
      await loadLote();
      alert('Se ha transferido el cacao a la Bodega Comercial exitosamente.');
    } catch (err: any) {
      console.error(err);
      alert(`Error al transferir: ${err.message || 'Revisa los datos'}`);
    } finally {
      setGuardandoTransferencia(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-neutral-900 p-6 flex justify-center text-neutral-400 print:hidden">Cargando detalles del lote...</div>;
  }

  if (!lote) {
    return <div className="min-h-screen bg-neutral-900 p-6 flex justify-center text-red-400 print:hidden">Lote no encontrado</div>;
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'abierto': return 'bg-emerald-500/20 text-emerald-400';
      case 'cerrado': return 'bg-amber-500/20 text-amber-400';
      case 'procesado': return 'bg-blue-500/20 text-blue-400';
      case 'exportado': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-neutral-500/20 text-neutral-400';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-neutral-900 p-6 print:hidden">
        <div className="max-w-7xl mx-auto">
          <Link to="/lotes" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver a Lotes
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Package className="h-8 w-8 text-amber-500" />
                  {lote.codigo_lote}
                </h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(lote.estado)}`}>
                  {lote.estado}
                </span>
              </div>
              <p className="text-neutral-400">Trazabilidad y composición del lote</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {lote.estado !== 'procesado' && lote.estado !== 'exportado' && (
                <button
                  onClick={abrirModalAsignacion}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white border border-neutral-700 font-medium rounded-md hover:bg-neutral-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Asignar Entregas
                </button>
              )}

              {lote.estado === 'abierto' && (
                <button
                  onClick={cerrarLote}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
                >
                  <Lock className="h-5 w-5" />
                  Cerrar Lote
                </button>
              )}
              
              {lote.estado === 'cerrado' && !lote.peso_seco && (
                <button
                  onClick={abrirModalSecado}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Droplets className="h-5 w-5" />
                  Registrar Secado y Entregar
                </button>
              )}

              {lote.peso_seco && (lote.peso_seco - (lote.peso_utilizado || 0)) > 0 && (
                <button
                  onClick={() => setShowTransferirModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
                >
                  <Package className="h-5 w-5" />
                  Transferir a Bodega Comercial
                </button>
              )}

              {lote.peso_seco && (lote.peso_seco - (lote.peso_utilizado || 0)) > 0 && (
                <button
                  onClick={() => setShowTostadoModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors"
                >
                  <Flame className="h-5 w-5" />
                  Registrar Tostado
                </button>
              )}

              {lote.peso_seco && (
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
                >
                  <Printer className="h-5 w-5" />
                  Imprimir Acta de Entrega
                </button>
              )}
            </div>
          </div>

          {/* Tarjetas de Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 flex items-start gap-4">
              <div className="p-3 bg-neutral-900 rounded-lg text-emerald-500">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Fecha de Creación</p>
                <p className="font-semibold text-white mt-1">{new Date(lote.fecha_creacion).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 flex items-start gap-4">
              <div className="p-3 bg-neutral-900 rounded-lg text-amber-500">
                <Weight className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Peso Húmedo (Baba)</p>
                <p className="font-semibold text-white mt-1 text-xl">{lote.peso_total} <span className="text-sm font-normal text-neutral-400">kg</span></p>
                <p className="text-xs text-neutral-500 mt-1">Acumulado de entregas</p>
              </div>
            </div>

            <div className={`bg-neutral-800 border rounded-xl p-5 flex flex-col justify-between ${lote.peso_seco ? 'border-blue-500/50' : 'border-neutral-700'}`}>
              <div className="flex items-start gap-4 mb-3">
                <div className={`p-3 bg-neutral-900 rounded-lg ${lote.peso_seco ? 'text-blue-500' : 'text-neutral-500'}`}>
                  <Droplets className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-400">Peso Seco / Fermentado</p>
                  {lote.peso_seco ? (
                    <>
                      <p className="font-semibold text-white mt-1 text-xl">{lote.peso_seco} <span className="text-sm font-normal text-neutral-400">kg</span></p>
                      <p className="text-xs text-blue-400 mt-1">Merma: {(((lote.peso_total - lote.peso_seco) / lote.peso_total) * 100).toFixed(1)}%</p>
                    </>
                  ) : (
                    <p className="text-neutral-500 mt-2 text-sm italic">Pendiente de secado</p>
                  )}
                </div>
              </div>
              
              {lote.peso_seco && (
                <div className="mt-2 pt-3 border-t border-neutral-700">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-orange-400 font-medium">Usado/Vendido: {lote.peso_utilizado || 0} kg</span>
                    <span className="text-emerald-400 font-medium">Disp: {lote.peso_seco - (lote.peso_utilizado || 0)} kg</span>
                  </div>
                  <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-700 flex">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-amber-400 h-2" 
                      style={{ width: `${Math.min(((lote.peso_utilizado || 0) / lote.peso_seco) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 flex items-start gap-4">
              <div className="p-3 bg-neutral-900 rounded-lg text-purple-500">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Entregas Asignadas</p>
                <p className="font-semibold text-white mt-1 text-xl">{entregas.length}</p>
                {lote.estado === 'abierto' && <p className="text-xs text-amber-500 mt-1">Recibiendo entregas</p>}
              </div>
            </div>
          </div>

          {/* Tabla de Entregas Asignadas */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden mb-8">
            <div className="p-5 border-b border-neutral-700">
              <h2 className="text-lg font-medium text-white">Composición del Lote (Entregas de Socios en Baba)</h2>
            </div>
            
            {entregas.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                Este lote está vacío. Asigna entregas de acopio para darle trazabilidad.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-300">
                  <thead className="text-xs uppercase bg-neutral-900/50 text-neutral-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Socio</th>
                      <th className="px-6 py-4 font-medium">Finca</th>
                      <th className="px-6 py-4 font-medium">Fecha Entrega</th>
                      <th className="px-6 py-4 font-medium">Calidad</th>
                      <th className="px-6 py-4 font-medium">Peso (kg)</th>
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
                        <td className="px-6 py-4">{new Date(entrega.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                            entrega.calidad === 'premium' ? 'bg-purple-500/20 text-purple-400' :
                            entrega.calidad === 'rechazado' ? 'bg-red-500/20 text-red-400' :
                            'bg-neutral-500/20 text-neutral-400'
                          }`}>
                            {entrega.calidad}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-amber-400">{entrega.peso_kg} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Tabla de Registros de Tostado */}
          {lote.peso_seco && (
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden mb-8">
              <div className="p-5 border-b border-neutral-700 flex justify-between items-center bg-orange-950/20">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" /> Historial de Tostados
                </h2>
              </div>
              
              {tostados.length === 0 ? (
                <div className="p-12 text-center text-neutral-500">
                  Aún no se ha tostado ninguna parte de este lote.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-neutral-300">
                    <thead className="text-xs uppercase bg-neutral-900/50 text-neutral-400">
                      <tr>
                        <th className="px-6 py-4 font-medium">Fecha</th>
                        <th className="px-6 py-4 font-medium">Responsable</th>
                        <th className="px-6 py-4 font-medium">Seco Utilizado</th>
                        <th className="px-6 py-4 font-medium">Resultado</th>
                        <th className="px-6 py-4 font-medium">Obtenido (Nibs/Tostado)</th>
                        <th className="px-6 py-4 font-medium text-orange-400">Merma (Cascarilla)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700/50">
                      {tostados.map((t) => (
                        <tr key={t.id} className="hover:bg-neutral-700/20 transition-colors">
                          <td className="px-6 py-4">{new Date(t.fecha).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-neutral-400">
                            {t.perfiles ? t.perfiles.nombre_completo : 'N/A'}
                          </td>
                          <td className="px-6 py-4 font-medium text-blue-400">{t.peso_seco_utilizado} kg</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ${t.tipo_resultado === 'nibs' ? 'bg-orange-500/20 text-orange-400' : 'bg-amber-800/40 text-amber-500'}`}>
                              {t.tipo_resultado === 'nibs' ? 'Nibs' : 'Con Cáscara'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-white">{t.peso_tostado_obtenido} kg</td>
                          <td className="px-6 py-4 text-orange-400 font-medium">
                            {(t.peso_seco_utilizado - t.peso_tostado_obtenido).toFixed(2)} kg
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- MODALES --- */}

      {/* Modal para Asignar Entregas Sueltas */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-neutral-700 flex justify-between items-center bg-neutral-950 rounded-t-xl">
              <div>
                <h3 className="text-xl font-bold text-white">Asignar Entregas al Lote</h3>
                <p className="text-sm text-neutral-400 mt-1">Selecciona las entregas que conforman este lote.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {modalError && (
                <div className="mb-4 bg-red-900/50 border border-red-500 rounded-md p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">{modalError}</p>
                </div>
              )}

              {loadingModal ? (
                <div className="py-12 flex justify-center items-center text-neutral-400 gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                  Buscando entregas en bodega...
                </div>
              ) : entregasSueltas.length === 0 ? (
                <div className="py-12 text-center text-neutral-400">
                  <Package className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                  No hay entregas "sueltas" en bodega. Todas las entregas registradas ya tienen un lote asignado.
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <button 
                      onClick={seleccionarTodas}
                      className="text-sm text-amber-500 hover:text-amber-400 font-medium"
                    >
                      {selectedEntregas.size === entregasSueltas.length ? 'Desmarcar todas' : 'Seleccionar todas'}
                    </button>
                    <span className="text-sm text-neutral-400">
                      {selectedEntregas.size} seleccionadas de {entregasSueltas.length}
                    </span>
                  </div>
                  
                  <div className="border border-neutral-700 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm text-neutral-300">
                      <thead className="text-xs uppercase bg-neutral-800 text-neutral-400">
                        <tr>
                          <th className="px-4 py-3 w-12 text-center"></th>
                          <th className="px-4 py-3 font-medium">Socio</th>
                          <th className="px-4 py-3 font-medium">Fecha</th>
                          <th className="px-4 py-3 font-medium">Calidad</th>
                          <th className="px-4 py-3 font-medium">Peso (kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-700 bg-neutral-900/50">
                        {entregasSueltas.map((entrega) => (
                          <tr 
                            key={entrega.id} 
                            onClick={() => toggleSeleccion(entrega.id)}
                            className={`cursor-pointer transition-colors hover:bg-neutral-800 ${selectedEntregas.has(entrega.id) ? 'bg-amber-500/10' : ''}`}
                          >
                            <td className="px-4 py-3 text-center">
                              <input 
                                type="checkbox" 
                                checked={selectedEntregas.has(entrega.id)}
                                onChange={() => toggleSeleccion(entrega.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 rounded border-neutral-600 text-amber-500 focus:ring-amber-500 bg-neutral-800"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-white">{entrega.socios?.nombres} {entrega.socios?.apellidos}</p>
                            </td>
                            <td className="px-4 py-3">{new Date(entrega.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-xs uppercase">{entrega.calidad}</td>
                            <td className="px-4 py-3 font-medium text-amber-500">{entrega.peso_kg} kg</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-neutral-700 flex justify-end gap-3 bg-neutral-950 rounded-b-xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border border-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-800 transition-colors"
                disabled={asignando}
              >
                Cancelar
              </button>
              <button
                onClick={guardarAsignacion}
                disabled={selectedEntregas.size === 0 || asignando}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {asignando ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Asignar al Lote ({selectedEntregas.size})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Secado */}
      {showSecadoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-neutral-700 flex justify-between items-center bg-neutral-950 rounded-t-xl">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" /> Registrar Secado
                </h3>
              </div>
              <button 
                onClick={() => setShowSecadoModal(false)}
                className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={registrarSecado} className="p-6">
              <p className="text-sm text-neutral-400 mb-6">
                El lote pasará a estado "Procesado" y estará listo para transformarse. Confirma el peso final luego de fermentación y secado.
              </p>

              <div className="bg-neutral-800 rounded-lg p-4 mb-6 border border-neutral-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-400">Peso en Baba (Original):</span>
                  <span className="font-bold text-white">{lote.peso_total} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Merma Esperada (2/3):</span>
                  <span className="font-medium text-neutral-500">~{(lote.peso_total * 2 / 3).toFixed(2)} kg</span>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="block text-sm font-medium text-neutral-300">
                  Peso Seco Real (kg) *
                </label>
                <input 
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={pesoSeco}
                  onChange={(e) => setPesoSeco(e.target.value)}
                  className="w-full bg-neutral-800 border border-blue-500/50 rounded-lg py-3 px-4 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                />
                <p className="text-xs text-neutral-500 mt-2 text-center">
                  Sugerimos una relación 3 a 1. Modifica si la balanza dio un número distinto.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSecadoModal(false)}
                  className="px-6 py-2.5 border border-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-800 transition-colors"
                  disabled={guardandoSecado}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!pesoSeco || guardandoSecado}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {guardandoSecado ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Guardar y Entregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Tostado */}
      {showTostadoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-neutral-700 flex justify-between items-center bg-neutral-950 rounded-t-xl">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" /> Registrar Tostado
                </h3>
              </div>
              <button 
                onClick={() => setShowTostadoModal(false)}
                className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={guardarTostado} className="p-6">
              <div className="bg-neutral-800 rounded-lg p-4 mb-6 border border-neutral-700 flex justify-between items-center">
                <span className="text-sm text-neutral-400">Cacao Seco Disponible:</span>
                <span className="font-bold text-emerald-400">{lote.peso_seco - (lote.peso_utilizado || 0)} kg</span>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Peso Seco a Tostar (kg) *
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={lote.peso_seco - (lote.peso_utilizado || 0)}
                    required
                    value={tostadoForm.peso_seco_utilizado}
                    onChange={(e) => setTostadoForm({...tostadoForm, peso_seco_utilizado: e.target.value})}
                    className="w-full bg-neutral-800 border border-neutral-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej. 20.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Tipo de Producto Obtenido *
                  </label>
                  <select 
                    value={tostadoForm.tipo_resultado}
                    onChange={(e) => setTostadoForm({...tostadoForm, tipo_resultado: e.target.value})}
                    className="w-full bg-neutral-800 border border-neutral-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="nibs">Nibs de Cacao (Sin cascarilla)</option>
                    <option value="entero_tostado">Cacao Tostado Entero (Con cáscara)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Peso Tostado Obtenido (kg) *
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={tostadoForm.peso_seco_utilizado || undefined}
                    required
                    value={tostadoForm.peso_tostado_obtenido}
                    onChange={(e) => setTostadoForm({...tostadoForm, peso_tostado_obtenido: e.target.value})}
                    className="w-full bg-neutral-800 border border-orange-500/50 rounded-lg py-2 px-3 text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej. 18.2"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    Debe ser menor al peso seco. La diferencia será registrada como cascarilla o evaporación.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTostadoModal(false)}
                  className="px-6 py-2.5 border border-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-800 transition-colors"
                  disabled={guardandoTostado}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoTostado}
                  className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {guardandoTostado ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Guardar Tostado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Transferir a Bodega */}
      {showTransferirModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-neutral-700 flex justify-between items-center bg-neutral-950 rounded-t-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-500" /> Transferir a Bodega
              </h3>
              <button 
                onClick={() => setShowTransferirModal(false)}
                className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={transferirABodega} className="p-6">
              <p className="text-neutral-400 text-sm mb-6">
                Envía Cacao Seco de este lote a la Bodega Comercial. Desde allí, Contabilidad/Ventas podrá facturarlo y descontarlo del inventario general.
              </p>
              
              <div className="bg-neutral-800 rounded-lg p-4 mb-6 border border-neutral-700 flex justify-between items-center">
                <span className="text-sm text-neutral-400">Disponible en Lote:</span>
                <span className="font-bold text-blue-400">{lote.peso_seco - (lote.peso_utilizado || 0)} kg</span>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Cantidad a Transferir (kg) *
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={lote.peso_seco - (lote.peso_utilizado || 0)}
                    required
                    value={transferirForm.cantidad}
                    onChange={(e) => setTransferirForm({...transferirForm, cantidad: e.target.value})}
                    className="w-full bg-neutral-800 border border-neutral-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ej. 100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTransferirModal(false)}
                  className="px-6 py-2.5 border border-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-800 transition-colors"
                  disabled={guardandoTransferencia}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoTransferencia}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {guardandoTransferencia ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Confirmar Transferencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- FORMATO IMPRIMIBLE (ACTA DE ENTREGA) --- */}
      <div className="hidden print:block bg-white text-black p-8 max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
          <div>
            <img src="/logo-asopromas.svg" alt="ASOPROMAS" className="h-16 w-auto mb-2" />
            <h1 className="text-2xl font-bold uppercase tracking-widest text-black">Acta de Entrega de Cacao Seco</h1>
            <p className="text-sm text-gray-600">Asociación de Productores Orgánicos</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl">LOTE: {lote.codigo_lote}</p>
            <p className="text-sm">Fecha: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Resumen del Lote */}
        <div className="mb-10">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4 uppercase">Datos del Acopio y Secado</h2>
          <table className="w-full text-left mb-6 border-collapse">
            <tbody>
              <tr>
                <td className="py-2 border-b border-gray-200 font-semibold w-1/3">Fecha de Creación Lote:</td>
                <td className="py-2 border-b border-gray-200">{new Date(lote.fecha_creacion).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="py-2 border-b border-gray-200 font-semibold">Peso Inicial en Baba (kg):</td>
                <td className="py-2 border-b border-gray-200">{lote.peso_total} kg</td>
              </tr>
              <tr>
                <td className="py-2 border-b border-gray-200 font-semibold">Peso Final Seco (kg):</td>
                <td className="py-2 border-b border-gray-200 font-bold text-lg">{lote.peso_seco} kg</td>
              </tr>
              <tr>
                <td className="py-2 border-b border-gray-200 font-semibold">Porcentaje de Merma:</td>
                <td className="py-2 border-b border-gray-200">
                  {lote.peso_seco ? (((lote.peso_total - lote.peso_seco) / lote.peso_total) * 100).toFixed(2) : 0}%
                </td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm text-gray-600 text-justify">
            Por medio del presente documento, el Área de Acopio hace formal entrega del cacao seco detallado 
            anteriormente al Área de Procesamiento/Administración, confirmando los pesos luego de su debido 
            proceso de fermentación y secado.
          </p>
        </div>

        {/* Firmas */}
        <div className="mt-24 pt-16 grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="font-bold text-sm">Entregado por:</p>
              <p className="text-xs text-gray-600 mt-1">Responsable de Acopio</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="font-bold text-sm">Recibido por:</p>
              <p className="text-xs text-gray-600 mt-1">Responsable de Procesamiento</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="font-bold text-sm">Visto Bueno:</p>
              <p className="text-xs text-gray-600 mt-1">Administración</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
          Documento generado automáticamente por el Sistema ASOPROMAS - {new Date().toLocaleString()}
        </div>
      </div>
    </>
  );
}
