import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, MapPin, Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
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

// Proj4 definitions
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';
const utm17s = '+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs';

interface Lote {
  id: string;
  socio_codigo: string;
  nombre_finca: string;
  nombre_lote: string;
  coord_x: number;
  coord_y: number;
  coord_z: number;
  area_hectareas: number;
}

interface SocioLotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  socioId: string;
  socioCodigo: string;
  socioNombre: string;
  socioFinca?: string;
}

// Component to auto-center map
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

export default function SocioLotesModal({ isOpen, onClose, socioId, socioCodigo, socioNombre, socioFinca }: SocioLotesModalProps) {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [newLote, setNewLote] = useState({
    nombre_finca: '',
    nombre_lote: '',
    coord_x: '',
    coord_y: '',
    coord_z: ''
  });

  useEffect(() => {
    if (isOpen && socioId) {
      setNewLote(prev => ({ ...prev, nombre_finca: socioFinca || '' }));
      fetchLotes();
    }
  }, [isOpen, socioId, socioFinca]);

  const fetchLotes = async () => {
    setIsLoading(true);
    // Buscamos todas las fincas de este socio_id, y dentro sus lotes_finca
    const { data: fincasData, error } = await supabase
      .from('fincas')
      .select('id, nombre, lotes_finca(*)')
      .eq('socio_id', socioId);

    if (error) {
      console.error('Error fetching lotes:', error);
      setLotes([]);
    } else if (fincasData) {
      // Aplanamos los lotes de todas las fincas para mostrarlos juntos
      const allLotes: any[] = [];
      fincasData.forEach(f => {
        if (f.lotes_finca) {
          f.lotes_finca.forEach((l: any) => {
            allLotes.push({
              ...l,
              nombre_finca: f.nombre // Le adjuntamos el nombre de su finca padre
            });
          });
        }
      });
      setLotes(allLotes);
    }
    setIsLoading(false);
  };

  const handleAddLote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLote.nombre_lote || !newLote.coord_x || !newLote.coord_y) return;

    setIsSaving(true);
    
    // 1. Encontrar o crear la Finca primero (el lote debe pertenecer a una finca)
    let fincaId = null;
    const fincaNombre = newLote.nombre_finca || 'Finca Principal';
    
    const { data: existingFinca } = await supabase
      .from('fincas')
      .select('id')
      .eq('socio_id', socioId)
      .eq('nombre', fincaNombre)
      .limit(1)
      .maybeSingle();
      
    if (existingFinca) {
      fincaId = existingFinca.id;
    } else {
      const { data: newFinca, error: errFinca } = await supabase
        .from('fincas')
        .insert([{ socio_id: socioId, nombre: fincaNombre }])
        .select()
        .single();
        
      if (!errFinca && newFinca) fincaId = newFinca.id;
    }

    if (!fincaId) {
      alert("Error: No se pudo enlazar o crear la finca.");
      setIsSaving(false);
      return;
    }

    // 2. Insertar el lote asociado a esa Finca
    const insertData = {
      finca_id: fincaId,
      nombre_lote: newLote.nombre_lote,
      coord_x: parseFloat(newLote.coord_x),
      coord_y: parseFloat(newLote.coord_y),
      coord_z: newLote.coord_z ? parseFloat(newLote.coord_z) : null
    };

    const { data, error } = await supabase
      .from('lotes_finca')
      .insert([insertData])
      .select()
      .single();

    if (!error && data) {
      // Agregamos a la tabla de la interfaz
      setLotes([...lotes, { ...data, nombre_finca: fincaNombre }]);
      setNewLote({ nombre_finca: socioFinca || '', nombre_lote: '', coord_x: '', coord_y: '', coord_z: '' });
    } else if (error) {
      console.error("Error guardando lote:", error);
      alert("Error guardando lote");
    }
    setIsSaving(false);
  };

  const handleDeleteLote = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este lote?')) return;
    
    const { error } = await supabase
      .from('lotes_finca')
      .delete()
      .eq('id', id);

    if (!error) {
      setLotes(lotes.filter(l => l.id !== id));
    }
  };

  // Convert UTM to LatLng for the map
  const mapMarkers = lotes.map(lote => {
    try {
      const [lng, lat] = proj4(utm17s, wgs84, [lote.coord_x, lote.coord_y]);
      return { ...lote, lat, lng };
    } catch (e) {
      return null;
    }
  }).filter(Boolean);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="text-orange-500 h-6 w-6" />
              Lotes y Coordenadas
            </h2>
            <p className="text-slate-500 mt-1">Socio: <span className="font-semibold text-slate-700">{socioNombre} ({socioCodigo})</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Panel Izquierdo: Formulario y Lista */}
          <div className="w-full md:w-1/3 bg-white border-r border-slate-100 flex flex-col overflow-y-auto">
            <div className="p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-orange-500" />
                Registrar Nuevo Lote
              </h3>
              <form onSubmit={handleAddLote} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Finca</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Finca El Paraíso"
                    value={newLote.nombre_finca}
                    onChange={(e) => setNewLote({...newLote, nombre_finca: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Lote</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Lote Principal"
                    value={newLote.nombre_lote}
                    onChange={(e) => setNewLote({...newLote, nombre_lote: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">UTM X</label>
                    <input
                      type="number"
                      required
                      step="any"
                      placeholder="Ej. 749689"
                      value={newLote.coord_x}
                      onChange={(e) => setNewLote({...newLote, coord_x: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">UTM Y</label>
                    <input
                      type="number"
                      required
                      step="any"
                      placeholder="Ej. 9571486"
                      value={newLote.coord_y}
                      onChange={(e) => setNewLote({...newLote, coord_y: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Altitud Z (m.s.n.m)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Ej. 1044.7"
                    value={newLote.coord_z}
                    onChange={(e) => setNewLote({...newLote, coord_z: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
                >
                  {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Guardar Lote
                </button>
              </form>

              <h3 className="font-bold text-slate-800 mt-8 mb-4">Lotes Registrados ({lotes.length})</h3>
              
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                </div>
              ) : lotes.length === 0 ? (
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-sm">
                  No hay lotes registrados para este socio.
                </div>
              ) : (
                <div className="space-y-3">
                  {lotes.map((lote) => (
                    <div key={lote.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative group">
                      <button 
                        onClick={() => handleDeleteLote(lote.id)}
                        className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar lote"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <h4 className="font-bold text-slate-800 pr-6">
                        {lote.nombre_finca ? `${lote.nombre_finca} - ` : ''}{lote.nombre_lote}
                      </h4>
                      <div className="text-sm text-slate-500 mt-2 grid grid-cols-2 gap-2">
                        <div><span className="font-medium text-slate-600">X:</span> {lote.coord_x}</div>
                        <div><span className="font-medium text-slate-600">Y:</span> {lote.coord_y}</div>
                        <div className="col-span-2"><span className="font-medium text-slate-600">Z (Altitud):</span> {lote.coord_z} m</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Panel Derecho: Mapa */}
          <div className="w-full md:w-2/3 bg-slate-100 relative min-h-[400px]">
            {mapMarkers.length > 0 ? (
              <MapContainer 
                center={[mapMarkers[0]?.lat || -1.8312, mapMarkers[0]?.lng || -78.1834]} 
                zoom={13} 
                className="w-full h-full z-0"
              >
                <LayersControl position="topright">
                  <LayersControl.BaseLayer name="Mapa de Calles (OSM)">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </LayersControl.BaseLayer>
                  
                  <LayersControl.BaseLayer checked name="Satelital (Esri)">
                    <TileLayer
                      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>

                <MapBounds lotes={mapMarkers} />
                {mapMarkers.map((marker: any) => (
                  <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={customMarkerIcon}>
                    <Popup>
                      <div className="font-sans min-w-[200px]">
                        <h4 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-1.5 mb-2">
                          {marker.nombre_finca ? `${marker.nombre_finca} - ` : ''}{marker.nombre_lote}
                        </h4>
                        <div className="space-y-1 text-xs text-slate-600">
                          <p><span className="font-semibold text-slate-700">Socio:</span> {socioNombre}</p>
                          <p><span className="font-semibold text-slate-700">UTM X:</span> {marker.coord_x}</p>
                          <p><span className="font-semibold text-slate-700">UTM Y:</span> {marker.coord_y}</p>
                          <p><span className="font-semibold text-slate-700">Altitud:</span> {marker.coord_z} m</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <MapPin className="h-16 w-16 mb-4 opacity-50" />
                <p>Agrega un lote para visualizarlo en el mapa</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
