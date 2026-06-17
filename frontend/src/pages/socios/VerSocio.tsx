import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import FincaModal from './FincaModal';
import LoteModal from './LoteModal';
import FincaMapSection from './FincaMapSection';
import FincaExportModal from './FincaExportModal';
import ReporteModal, { type ReporteOptions } from './ReporteModal';
import SocioPrintView from './SocioPrintView';
import HistorialEntregas from './HistorialEntregas';
import { 
  ArrowLeft, User, Map, Leaf, ShoppingCart, Scale, 
  CreditCard, Building2, Phone, Mail, MapPin, Edit, 
  FileText, Plus, Loader2, AlertCircle, Trash2, Printer
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function VerSocio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [socio, setSocio] = useState<any>(null);
  const [fincas, setFincas] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'perfil' | 'fincas' | 'acopio' | 'tienda'>('perfil');

  // Finca & Lote Selection for Map interactivity
  const [expandedFincaId, setExpandedFincaId] = useState<string | null>(null);
  
  // Modals state
  const [isFincaModalOpen, setIsFincaModalOpen] = useState(false);
  const [fincaEdit, setFincaEdit] = useState<any>(null);
  
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);
  const [loteEdit, setLoteEdit] = useState<any>(null);
  const [fincaIdForLote, setFincaIdForLote] = useState<string | null>(null);

  // States for Finca Export
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [fincaToExport, setFincaToExport] = useState<any>(null);

  // Delete Finca Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fincaToDelete, setFincaToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete Lote Modal
  const [isDeleteLoteModalOpen, setIsDeleteLoteModalOpen] = useState(false);
  const [loteToDelete, setLoteToDelete] = useState<string | null>(null);
  const [isDeletingLote, setIsDeletingLote] = useState(false);

  // Print Report states
  const [isReporteModalOpen, setIsReporteModalOpen] = useState(false);
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);
  const [printOptions, setPrintOptions] = useState<ReporteOptions>({
    datosPersonales: true,
    fincasYLotes: true,
    financiero: true,
    acopio: true
  });

  const loadFincasData = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('fincas')
        .select(`
          *,
          lotes_finca (*)
        `)
        .eq('socio_id', id);

      if (error) throw error;
      setFincas(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        // Cargar datos del socio
        const { data: socioData, error: socioError } = await supabase
          .from('socios')
          .select(`
            *,
            grupos_base:grupo_id (nombre)
          `)
          .eq('id', id)
          .single();

        if (socioError) throw socioError;
        setSocio(socioData);

        // Cargar fincas y lotes
        await loadFincasData();

      } catch (error) {
        console.error('Error fetching socio details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleDeleteSocio = async () => {
    if (window.confirm('¿Está seguro de que desea eliminar este socio permanentemente? Esta acción no se puede deshacer.')) {
      try {
        const { error } = await supabase.from('socios').delete().eq('id', id);
        if (error) throw error;
        navigate('/socios');
      } catch (err) {
        console.error('Error al eliminar socio:', err);
        alert('Error: No se pudo eliminar el socio. Es probable que tenga registros (fincas, acopio, etc.) asociados.');
      }
    }
  };

  const confirmDeleteFinca = async () => {
    if (!fincaToDelete) return;
    setIsDeleting(true);
    try {
      // Primero eliminamos los lotes asociados para evitar errores de llave foránea
      const { error: lotesError } = await supabase.from('lotes_finca').delete().eq('finca_id', fincaToDelete);
      if (lotesError) throw lotesError;
      
      // Luego eliminamos la finca y seleccionamos el resultado para confirmar que se borró
      const { data, error } = await supabase.from('fincas').delete().eq('id', fincaToDelete).select();
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('La base de datos bloqueó la eliminación. No tienes permisos para borrar (Falta la política DELETE en RLS de Supabase).');
      }
      
      // Refresh data
      setIsDeleteModalOpen(false);
      setFincaToDelete(null);
      await loadFincasData();
    } catch (err: any) {
      console.error('Error al eliminar finca:', err);
      alert(`Error: No se pudo eliminar la finca.\nDetalle: ${err.message || 'Desconocido'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteLote = async () => {
    if (!loteToDelete) return;
    setIsDeletingLote(true);
    try {
      const { data, error } = await supabase.from('lotes_finca').delete().eq('id', loteToDelete).select();
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('La base de datos bloqueó la eliminación. No tienes permisos para borrar (Falta la política DELETE en RLS de Supabase).');
      }
      

      setIsDeleteLoteModalOpen(false);
      setLoteToDelete(null);
      await loadFincasData();
    } catch (err: any) {
      console.error('Error al eliminar lote:', err);
      alert(`Error: No se pudo eliminar el lote.\nDetalle: ${err.message || 'Desconocido'}`);
    } finally {
      setIsDeletingLote(false);
    }
  };

  const handlePrint = (options: ReporteOptions) => {
    setPrintOptions(options);
    setIsReporteModalOpen(false);
    setIsPreparingPrint(true);
    
    // Le damos a Leaflet tiempo suficiente (1.5s) para montar el mapa y descargar los tiles 
    // antes de abrir el dialogo de impresión.
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsPreparingPrint(false), 500); // Reset after print dialog closes/opens
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!socio) {
    return (
      <div className="min-h-screen bg-[#FDF9F3] p-10 flex flex-col items-center text-slate-600">
        <AlertCircle className="h-16 w-16 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold">No se encontró el socio</h2>
        <Link to="/socios" className="mt-4 text-orange-600 hover:underline">Volver al directorio</Link>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    const e = (estado || 'Activo').toLowerCase();
    if (e === 'activo') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (e === 'inactivo') return 'bg-slate-100 text-slate-800 border-slate-200';
    if (e === 'suspendido') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-orange-100 text-orange-800 border-orange-200';
  };



  return (
    <div className="min-h-screen bg-[#FDF9F3] text-slate-800 font-sans pb-12">
      
      {/* Print View Oculta (sólo visible al imprimir) */}

      {/* HEADER SUPERIOR */}
      <div className="bg-white border-b border-orange-100 px-6 py-6 shadow-sm sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link to="/socios" className="p-2.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                {socio.nombres} {socio.apellidos}
                <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${getEstadoColor(socio.estado_socio)} uppercase tracking-wider`}>
                  {socio.estado_socio || 'Activo'}
                </span>
              </h1>
              <div className="flex gap-4 mt-1 text-sm text-slate-500 font-medium">
                <span>Cédula: {socio.cedula}</span>
                <span>•</span>
                <span>Código: {socio.codigo_socio || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsReporteModalOpen(true)}
              disabled={isPreparingPrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-orange-600 transition-colors shadow-sm disabled:opacity-50"
            >
              {isPreparingPrint ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
              {isPreparingPrint ? 'Preparando...' : 'Reporte'}
            </button>
            {socio.enlace_documentos && (
              <a 
                href={socio.enlace_documentos} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-medium border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm"
              >
                <FileText className="h-4 w-4" /> Expediente
              </a>
            )}
            <Link 
              to={`/socios/editar/${socio.id}`}
              className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-xl font-medium border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Edit className="h-4 w-4" /> Editar
            </Link>
            <button 
              onClick={handleDeleteSocio}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-medium border border-red-100 hover:bg-red-100 transition-colors shadow-sm"
            >
              <Trash2 className="h-4 w-4" /> Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* TABS DE NAVEGACIÓN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 print:hidden">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 border-b border-slate-200 pb-px -mx-4 px-4 sm:mx-0 sm:px-0">
          <button 
            onClick={() => setActiveTab('perfil')}
            className={`shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'perfil' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <User className="h-4 w-4" /> Datos Personales
          </button>
          <button 
            onClick={() => setActiveTab('fincas')}
            className={`shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'fincas' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Map className="h-4 w-4" /> Fincas y Lotes
            <span className="bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs ml-1">{fincas.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('acopio')}
            className={`shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'acopio' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Scale className="h-4 w-4" /> Acopio y Entregas
          </button>
          <button 
            onClick={() => setActiveTab('tienda')}
            className={`shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'tienda' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <ShoppingCart className="h-4 w-4" /> Insumos y Créditos
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-8 print:hidden">
        
        {/* =========================================================
            TAB: DATOS PERSONALES
        ========================================================= */}
        {activeTab === 'perfil' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Col 1: Contacto */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" /> Contacto Principal
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Teléfono</p>
                    <p className="font-medium text-slate-800 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" /> {socio.telefono || 'No registrado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Email</p>
                    <p className="font-medium text-slate-800 flex items-center gap-2 break-all">
                      <Mail className="h-4 w-4 text-slate-400" /> {socio.email || 'No registrado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Dirección</p>
                    <p className="font-medium text-slate-800 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" /> {socio.direccion || 'No registrada'}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Grupo / Comunidad</p>
                    <p className="font-medium text-slate-800 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400" /> {socio.grupos_base?.nombre || 'No asignado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2 & 3: Detalles y Banco */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Detalles Demográficos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Género</p>
                    <p className="font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{socio.genero || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Etnia / Pueblo</p>
                    <p className="font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{socio.etnia || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Tipo de Cacao Principal</p>
                    <p className="font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-emerald-500" /> {socio.tipo_cacao || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Nivel de Estudio</p>
                    <p className="font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{socio.nivel_estudio || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Fecha de Ingreso</p>
                    <p className="font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      {socio.fecha_ingreso ? new Date(socio.fecha_ingreso).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-indigo-500" /> Información Financiera
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 grid grid-cols-2 gap-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <div>
                      <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Banco</p>
                      <p className="font-bold text-indigo-900">{socio.banco_nombre || 'No registrado'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Cuenta</p>
                      <p className="font-bold text-indigo-900">{socio.banco_cuenta || 'No registrada'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Tipo</p>
                      <p className="font-medium text-indigo-800">{socio.tipo_cuenta || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-center items-center text-center">
                    <p className="text-xs font-bold text-emerald-600 uppercase mb-2">Límite Autorizado</p>
                    <p className="text-2xl font-black text-emerald-700">${Number(socio.cupo_credito_tienda || 0).toFixed(2)}</p>
                    <p className="text-xs text-emerald-600/70 mt-1">Para insumos o productos</p>
                  </div>

                  <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex flex-col justify-center items-center text-center">
                    <p className="text-xs font-bold text-rose-600 uppercase mb-2">Saldo Pendiente</p>
                    <p className="text-2xl font-black text-rose-700">${Number(socio.saldo_pendiente || 0).toFixed(2)}</p>
                    <p className="text-xs text-rose-600/70 mt-1">Deuda por pagar</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================
            TAB: FINCAS Y LOTES
        ========================================================= */}
        {activeTab === 'fincas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Patrimonio Agrícola</h2>
                <p className="text-slate-500 text-sm">Gestiona las propiedades y parcelas productivas del socio.</p>
              </div>
              <button 
                onClick={() => { setFincaEdit(null); setIsFincaModalOpen(true); }}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all"
              >
                <Plus className="h-5 w-5" /> Nueva Finca
              </button>
            </div>

            {fincas.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <Map className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">Sin fincas registradas</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">Este socio aún no tiene propiedades registradas. Agrega una finca para empezar a trazar sus lotes y producciones.</p>
                <button 
                  onClick={() => { setFincaEdit(null); setIsFincaModalOpen(true); }}
                  className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-6 py-3 rounded-xl font-bold hover:bg-orange-200 transition-colors"
                >
                  <Plus className="h-5 w-5" /> Registrar la primera Finca
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {fincas.map((finca, index) => (
                  <FincaMapSection 
                    key={finca.id} 
                    finca={finca} 
                    expanded={expandedFincaId === null ? index === 0 : expandedFincaId === finca.id}
                    onToggle={() => setExpandedFincaId(expandedFincaId === finca.id ? null : finca.id)}
                    onEditFinca={() => { setFincaEdit(finca); setIsFincaModalOpen(true); }}
                    onDeleteFinca={() => { setFincaToDelete(finca.id); setIsDeleteModalOpen(true); }}
                    onExportFinca={() => { setFincaToExport(finca); setIsExportModalOpen(true); }}
                    onEditLote={(lote: any, fId: string) => { setFincaIdForLote(fId); setLoteEdit(lote); setIsLoteModalOpen(true); }}
                    onDeleteLote={(loteId: string) => { setLoteToDelete(loteId); setIsDeleteLoteModalOpen(true); }}
                    onAddLote={(fId: string) => { setFincaIdForLote(fId); setLoteEdit(null); setIsLoteModalOpen(true); }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB: ACOPIO (Próximamente)
        ========================================================= */}
        {activeTab === 'acopio' && (
          <HistorialEntregas socioId={id || ''} />
        )}

        {/* =========================================================
            TAB: TIENDA / CRÉDITO (Próximamente)
        ========================================================= */}
        {activeTab === 'tienda' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Estado de Cuenta - Tienda</h3>
            <p className="text-slate-500 max-w-md mx-auto">Aquí se reflejarán los despachos de insumos a crédito y los abonos realizados por el socio.</p>
          </div>
        )}

      </main>

      {/* MODALS */}
      <FincaModal 
        isOpen={isFincaModalOpen} 
        onClose={() => setIsFincaModalOpen(false)} 
        onSave={loadFincasData} 
        socioId={id || ''} 
        fincaEdit={fincaEdit} 
      />

      {isLoteModalOpen && fincaIdForLote && (
        <LoteModal
          isOpen={isLoteModalOpen}
          onClose={() => {
            setIsLoteModalOpen(false);
            setLoteEdit(null);
            setFincaIdForLote(null);
          }}
          onSave={loadFincasData}
          fincaId={fincaIdForLote}
          loteEdit={loteEdit}
        />
      )}

      {/* MODAL DE EXPORTACIÓN A IMAGEN */}
      {isExportModalOpen && fincaToExport && (
        <FincaExportModal
          isOpen={isExportModalOpen}
          onClose={() => {
            setIsExportModalOpen(false);
            setFincaToExport(null);
          }}
          finca={fincaToExport}
          socioName={`${socio.nombres} ${socio.apellidos}`}
        />
      )}

      {/* Delete Finca Confirmation Modal */}
      {/* Modal Confirmar Eliminación Finca */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Eliminar Finca</h3>
            <p className="text-slate-600 mb-6">
              ¿Estás seguro que deseas eliminar esta finca? Se perderán todos los datos y lotes asociados. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteFinca}
                disabled={isDeleting}
                className="px-4 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación Lote */}
      {isDeleteLoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Eliminar Lote</h3>
            <p className="text-slate-600 mb-6">
              ¿Estás seguro que deseas eliminar este lote? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteLoteModalOpen(false)}
                className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteLote}
                disabled={isDeletingLote}
                className="px-4 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeletingLote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <ReporteModal 
        isOpen={isReporteModalOpen}
        onClose={() => setIsReporteModalOpen(false)}
        options={printOptions}
        setOptions={setPrintOptions}
        onPrint={handlePrint}
        lotesDisponibles={fincas.flatMap((f: any) => f.lotes_finca || [])}
      />

      <SocioPrintView socio={socio} fincas={fincas} options={printOptions} isPreparing={isPreparingPrint} />
    </div>
  );
}
