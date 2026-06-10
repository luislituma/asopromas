import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import FincaModal from './FincaModal';
import LoteModal from './LoteModal';
import ReporteModal, { type ReporteOptions } from './ReporteModal';
import SocioPrintView from './SocioPrintView';
import { 
  ArrowLeft, User, Map, Leaf, ShoppingCart, Scale, 
  CreditCard, Building2, Phone, Mail, MapPin, Edit, 
  FileText, Plus, Loader2, AlertCircle, Trash2, Printer
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import proj4 from 'proj4';

const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';
const utm17s = '+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs';

function MapBounds({ lotes }: { lotes: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (lotes.length > 0) {
      const bounds = L.latLngBounds(lotes.map(l => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [lotes, map]);
  return null;
}

export default function VerSocio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [socio, setSocio] = useState<any>(null);
  const [fincas, setFincas] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'perfil' | 'fincas' | 'acopio' | 'tienda'>('perfil');

  // Finca & Lote Selection for Map interactivity
  const [selectedFincaId, setSelectedFincaId] = useState<string | null>(null);
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null);

  // Modals state
  const [isFincaModalOpen, setIsFincaModalOpen] = useState(false);
  const [fincaEdit, setFincaEdit] = useState<any>(null);
  
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);
  const [loteEdit, setLoteEdit] = useState<any>(null);
  const [fincaIdForLote, setFincaIdForLote] = useState<string>('');

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
      if (selectedFincaId === fincaToDelete) {
        setSelectedFincaId(null);
      }
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
      
      if (selectedLoteId === loteToDelete) {
        setSelectedLoteId(null);
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
    // Le damos a React unos ms para actualizar el DOM con las opciones seleccionadas
    setTimeout(() => {
      window.print();
    }, 100);
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

  const allLotes = fincas.flatMap(f => (f.lotes_finca || []).map((l: any) => ({...l, nombre_finca: f.nombre, finca_id: f.id})));
  
  const mapMarkers = allLotes.map(lote => {
    const x = Number(lote.coord_x);
    const y = Number(lote.coord_y);
    let lat = null;
    let lng = null;
    if (x && y) {
      if (Math.abs(y) > 90) { 
        try {
          const [lonConv, latConv] = proj4(utm17s, wgs84, [x, y]);
          lat = latConv;
          lng = lonConv;
        } catch(e) {}
      } else {
        lat = x;
        lng = y;
      }
    }
    return { ...lote, lat, lng };
  }).filter(l => l.lat !== null && l.lng !== null);

  let filteredMarkers = mapMarkers;
  if (selectedLoteId) {
    filteredMarkers = mapMarkers.filter(m => m.id === selectedLoteId);
  } else if (selectedFincaId) {
    filteredMarkers = mapMarkers.filter(m => m.finca_id === selectedFincaId);
  }

  return (
    <div className="min-h-screen bg-[#FDF9F3] text-slate-800 font-sans pb-12">
      
      {/* Print View Oculta (sólo visible al imprimir) */}
      <SocioPrintView socio={socio} fincas={fincas} options={printOptions} />

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
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Printer className="h-4 w-4" /> Reporte
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
      <div className="max-w-7xl mx-auto px-6 mt-6 print:hidden">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 border-b border-slate-200 pb-px">
          <button 
            onClick={() => setActiveTab('perfil')}
            className={`flex items-center gap-2 px-5 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'perfil' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <User className="h-4 w-4" /> Datos Personales
          </button>
          <button 
            onClick={() => setActiveTab('fincas')}
            className={`flex items-center gap-2 px-5 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'fincas' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Map className="h-4 w-4" /> Fincas y Lotes
            <span className="bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs ml-1">{fincas.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('acopio')}
            className={`flex items-center gap-2 px-5 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'acopio' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Scale className="h-4 w-4" /> Acopio y Entregas
          </button>
          <button 
            onClick={() => setActiveTab('tienda')}
            className={`flex items-center gap-2 px-5 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'tienda' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
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
                {fincas.map(finca => (
                  <div key={finca.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Header de la Finca */}
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <Map className="h-5 w-5 text-slate-400" /> {finca.nombre}
                        </h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5" /> {finca.ubicacion_sector || 'Ubicación no especificada'}
                          {finca.altitud_msnm && <span className="ml-2">• {finca.altitud_msnm} msnm</span>}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-sm font-bold border border-emerald-200">
                          {finca.hectareas_totales || 0} Ha. Totales
                        </span>
                        <button 
                          onClick={() => { setFincaEdit(finca); setIsFincaModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Editar Finca"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => { setFincaToDelete(finca.id); setIsDeleteModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar Finca"
                        >
                          <Trash2 className="h-5 w-5 pointer-events-none" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Lista de Lotes */}
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-700">Lotes / Parcelas</h4>
                        <button 
                          onClick={() => { setFincaIdForLote(finca.id); setLoteEdit(null); setIsLoteModalOpen(true); }}
                          className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4" /> Agregar Lote
                        </button>
                      </div>
                      
                      {(!finca.lotes_finca || finca.lotes_finca.length === 0) ? (
                        <p className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                          No hay lotes dibujados o registrados en esta finca.
                        </p>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {finca.lotes_finca.map((lote: any) => {
                              const isSelected = selectedLoteId === lote.id;
                              return (
                                <div 
                                  key={lote.id} 
                                  onClick={() => setSelectedLoteId(isSelected ? null : lote.id)}
                                  className={`bg-white border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all group relative overflow-hidden ${isSelected ? 'border-orange-500 shadow-sm ring-1 ring-orange-500 ring-offset-1' : 'border-slate-200 hover:border-emerald-300'}`}
                                >
                                  {/* Decoración superior */}
                                  <div className={`absolute top-0 left-0 w-full h-1 transition-colors ${isSelected ? 'bg-orange-500' : 'bg-emerald-500/20 group-hover:bg-emerald-500'}`}></div>
                                  
                                  <div className="flex justify-between items-start mb-3">
                                    <h5 className={`font-bold flex items-center gap-2 ${isSelected ? 'text-orange-700' : 'text-slate-800'}`}>
                                      <Leaf className={`h-4 w-4 ${isSelected ? 'text-orange-500' : 'text-emerald-500'}`} />
                                      {lote.nombre_lote}
                                    </h5>
                                    <div className="flex gap-1">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setFincaIdForLote(finca.id); setLoteEdit(lote); setIsLoteModalOpen(true); }}
                                        className="text-slate-400 hover:text-orange-600 bg-slate-50 hover:bg-orange-50 p-1.5 rounded-lg transition-colors"
                                        title="Editar lote"
                                      >
                                        <Edit className="h-3.5 w-3.5" />
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setLoteToDelete(lote.id); setIsDeleteLoteModalOpen(true); }}
                                        className="text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                        title="Eliminar lote"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="space-y-2 mb-4">
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-500">Variedad</span>
                                      <span className="font-medium text-slate-700">{lote.variedad_cacao || 'No definida'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-500">Hectáreas</span>
                                      <span className="font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                        {lote.hectareas_lote ? `${lote.hectareas_lote} ha` : '-'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-500">Altura</span>
                                      <span className="font-medium text-slate-700">{lote.coord_z ? `${lote.coord_z} msnm` : '-'}</span>
                                    </div>
                                  </div>

                                  <div className="pt-3 border-t border-slate-100 mt-auto">
                                    <p className={`text-xs flex items-center gap-1.5 font-mono p-1.5 rounded-lg justify-center border transition-colors ${isSelected ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200'}`}>
                                      <MapPin className="h-3 w-3" />
                                      {lote.coord_x && lote.coord_y 
                                        ? `${lote.coord_x}, ${lote.coord_y}` 
                                        : 'Sin coordenadas'}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Mapa en línea para esta finca si hay un lote seleccionado */}
                          {finca.lotes_finca.some((l: any) => l.id === selectedLoteId) && (
                            <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                              <h5 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-orange-500" />
                                Ubicación del lote seleccionado
                              </h5>
                              <div className="bg-slate-50 rounded-2xl shadow-inner border border-slate-200 overflow-hidden relative z-0" style={{ height: '350px' }}>
                                {filteredMarkers.length > 0 ? (
                                  <MapContainer center={[filteredMarkers[0].lat, filteredMarkers[0].lng]} zoom={15} className="w-full h-full">
                                    <LayersControl position="topright">
                                      <LayersControl.BaseLayer checked name="Satélite">
                                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                                      </LayersControl.BaseLayer>
                                      <LayersControl.BaseLayer name="Callejero">
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                      </LayersControl.BaseLayer>
                                    </LayersControl>
                                    <MapBounds lotes={filteredMarkers} />
                                    {filteredMarkers.map((m: any, idx: number) => (
                                      <Marker key={idx} position={[m.lat, m.lng]} icon={customMarkerIcon}>
                                        <Popup>
                                          <div className="text-sm font-sans">
                                            <p className="font-bold text-emerald-700 border-b border-emerald-100 pb-1 mb-1">{m.nombre_finca}</p>
                                            <p><strong>Lote:</strong> {m.nombre_lote}</p>
                                            <p><strong>Variedad:</strong> {m.variedad_cacao || 'N/A'}</p>
                                          </div>
                                        </Popup>
                                      </Marker>
                                    ))}
                                  </MapContainer>
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <p className="text-slate-500 italic">No hay coordenadas válidas para mostrar el mapa.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB: ACOPIO (Próximamente)
        ========================================================= */}
        {activeTab === 'acopio' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <Scale className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Historial de Acopio</h3>
            <p className="text-slate-500 max-w-md mx-auto">Próximamente verás aquí las gráficas de entrega de cacao de este socio por mes y año, vinculadas a la tabla de recepciones.</p>
          </div>
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

      <LoteModal 
        isOpen={isLoteModalOpen} 
        onClose={() => setIsLoteModalOpen(false)} 
        onSave={loadFincasData} 
        fincaId={fincaIdForLote} 
        loteEdit={loteEdit} 
      />

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
      />
    </div>
  );
}
