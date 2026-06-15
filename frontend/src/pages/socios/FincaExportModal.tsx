import { useRef, useState, useEffect } from 'react';
import { X, Download, Loader2, MapPin, Settings2 } from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import * as htmlToImage from 'html-to-image';
import proj4 from 'proj4';
import { useMap } from 'react-leaflet';

const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';
const utm17s = '+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs';

const PALETTE = ['#f97316', '#3b82f6', '#ec4899', '#a855f7', '#eab308', '#ef4444', '#14b8a6', '#f43f5e', '#6366f1'];
const FINCA_COLOR = '#10b981';

interface FincaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  finca: any;
  socioName: string;
}

function MapBoundsExport({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 16 });
    }
  }, [bounds, map]);
  return null;
}

export default function FincaExportModal({ isOpen, onClose, finca, socioName }: FincaExportModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Opciones de personalización
  const [showName, setShowName] = useState(false);
  const [showFincaName, setShowFincaName] = useState(false);
  const [showLoteName, setShowLoteName] = useState(false);
  const [showCoords, setShowCoords] = useState(true);
  const [showHectareas, setShowHectareas] = useState(false);
  const [showFincaPolygon, setShowFincaPolygon] = useState(false);
  const [visibleLotes, setVisibleLotes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && finca) {
      setMapReady(false);
      // Inicializar lotes visibles: Solo el primero marcado por defecto
      const initialLotes: Record<string, boolean> = {};
      finca.lotes_finca?.forEach((l: any, idx: number) => {
        initialLotes[l.id] = (idx === 0);
      });
      setVisibleLotes(initialLotes);

      // Reiniciar otras opciones a los valores por defecto solicitados
      setShowName(false);
      setShowFincaName(false);
      setShowLoteName(false);
      setShowCoords(true);
      setShowHectareas(false);
      setShowFincaPolygon(false);

      const timer = setTimeout(() => setMapReady(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, finca]);

  if (!isOpen || !finca) return null;

  const processCoords = (x: any, y: any) => {
    const nx = Number(x);
    const ny = Number(y);
    if (!nx || !ny) return null;
    if (Math.abs(ny) > 90) {
      try {
        const [lng, lat] = proj4(utm17s, wgs84, [nx, ny]);
        return { lat, lng };
      } catch(e) { return null; }
    }
    return { lat: nx, lng: ny };
  };

  const parseGeoJSON = (data: any) => {
    if (!data) return null;
    try {
      if (typeof data === 'string') return JSON.parse(data);
      if (typeof data === 'object') return data;
    } catch(e) { return null; }
    return null;
  };

  const getBounds = () => {
    const validPoints: L.LatLngTuple[] = [];
    const fc = processCoords(finca.coord_x, finca.coord_y);
    if (fc && showFincaPolygon) validPoints.push([fc.lat, fc.lng]);

    finca.lotes_finca?.forEach((lote: any) => {
      if (visibleLotes[lote.id]) {
        const lc = processCoords(lote.coord_x, lote.coord_y);
        if (lc) validPoints.push([lc.lat, lc.lng]);
      }
    });

    let bounds: L.LatLngBounds | null = null;
    if (validPoints.length > 0) {
      bounds = L.latLngBounds(validPoints);
    }

    const allPolygons: any[] = [];
    if (showFincaPolygon) allPolygons.push(parseGeoJSON(finca.poligono));
    
    finca.lotes_finca?.forEach((lote: any) => {
      if (visibleLotes[lote.id]) {
        allPolygons.push(parseGeoJSON(lote.poligono));
      }
    });

    allPolygons.forEach(p => {
      if (p) {
        try {
          const layer = L.geoJSON(p);
          const pb = layer.getBounds();
          if (pb && pb.isValid()) {
            if (!bounds) bounds = pb;
            else bounds.extend(pb);
          }
        } catch (e) {}
      }
    });

    return bounds;
  };

  const handleExport = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await htmlToImage.toJpeg(cardRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        style: { transform: 'scale(1)', margin: '0' },
        pixelRatio: 2
      });
      
      const link = document.createElement('a');
      link.download = `Mapa_${socioName}_${finca.nombre}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting image', err);
      alert('Hubo un error al exportar la imagen. Verifica tu conexión.');
    } finally {
      setIsExporting(false);
    }
  };

  const mapBounds = getBounds();

  const toggleLote = (id: string) => {
    setVisibleLotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtrar los lotes para la tabla según los visibles
  const lotesMostrados = finca.lotes_finca?.filter((lote: any) => visibleLotes[lote.id]) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-6xl shadow-xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Exportar Mapa a Imagen</h2>
            <p className="text-slate-500 text-sm">Personaliza qué datos mostrar antes de descargar.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* Panel Izquierdo: Opciones */}
          <div className="w-full lg:w-80 bg-slate-50 border-r border-slate-200 p-6 overflow-y-auto shrink-0 space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Settings2 className="w-5 h-5 text-emerald-600" /> Opciones de Visualización
              </h3>
              
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={showName} onChange={() => setShowName(!showName)} className="w-4 h-4 text-emerald-600 rounded border-slate-300" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Nombre del Socio</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={showFincaName} onChange={() => setShowFincaName(!showFincaName)} className="w-4 h-4 text-emerald-600 rounded border-slate-300" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Nombre de la Finca</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={showLoteName} onChange={() => setShowLoteName(!showLoteName)} className="w-4 h-4 text-emerald-600 rounded border-slate-300" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Nombre del Lote</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={showHectareas} onChange={() => setShowHectareas(!showHectareas)} className="w-4 h-4 text-emerald-600 rounded border-slate-300" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Hectáreas Totales</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={showCoords} onChange={() => setShowCoords(!showCoords)} className="w-4 h-4 text-emerald-600 rounded border-slate-300" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Coordenadas (Lat/Lng)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={showFincaPolygon} onChange={() => setShowFincaPolygon(!showFincaPolygon)} className="w-4 h-4 text-emerald-600 rounded border-slate-300" />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: FINCA_COLOR }}></div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Polígono de la Finca</span>
                </label>
              </div>
            </div>

            {finca.lotes_finca?.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide opacity-70">Lotes a mostrar</h3>
                <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  {finca.lotes_finca.map((lote: any, index: number) => {
                    const color = PALETTE[index % PALETTE.length];
                    return (
                      <label key={lote.id} className="flex items-center gap-3 cursor-pointer group py-1">
                        <input 
                          type="checkbox" 
                          checked={!!visibleLotes[lote.id]} 
                          onChange={() => toggleLote(lote.id)} 
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300" 
                        />
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 truncate" title={lote.nombre_lote}>
                          {lote.nombre_lote}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Panel Derecho: Vista Previa */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-200/50 flex justify-center items-start">
            <div 
              ref={cardRef} 
              className="bg-white border-2 border-emerald-600 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300"
              style={{ width: '800px' }}
            >
              {/* Cabecera Tarjeta */}
              {(showName || showFincaName) && (
                <div className="bg-emerald-600 text-white p-5 flex flex-col justify-center border-b-4 border-emerald-800/20">
                  {showName && <h1 className="text-xl font-bold mb-1">{socioName}</h1>}
                  {showFincaName && (
                    <h2 className="text-lg font-medium opacity-90 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Finca: {finca.nombre}
                    </h2>
                  )}
                </div>
              )}

              {/* Datos de los Lotes */}
              {(showFincaPolygon || lotesMostrados.length > 0) && (
                <div className="px-5 pt-4 pb-2 bg-white">
                  <div className="grid gap-2">
                    
                    {/* Datos Finca Principal */}
                    {showFincaPolygon && (
                      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: FINCA_COLOR }}></div>
                          {showFincaName && <span className="font-bold text-slate-700 text-sm">Finca Principal</span>}
                        </div>
                        <div className="flex gap-4 text-sm text-slate-600 items-center">
                          {showHectareas && <span className="font-medium">{finca.hectareas_totales || 0} ha</span>}
                          {showCoords && processCoords(finca.coord_x, finca.coord_y) && (
                            <span className="font-mono text-sm font-semibold text-slate-600 bg-white px-3 py-1.5 rounded border border-slate-200">
                              LAT: {processCoords(finca.coord_x, finca.coord_y)?.lat.toFixed(5)}, LNG: {processCoords(finca.coord_x, finca.coord_y)?.lng.toFixed(5)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Datos Lotes Visibles */}
                    {lotesMostrados.map((lote: any) => {
                      const c = processCoords(lote.coord_x, lote.coord_y);
                      // Encontrar el índice original para mantener el mismo color
                      const originalIndex = finca.lotes_finca.findIndex((l: any) => l.id === lote.id);
                      const color = PALETTE[originalIndex % PALETTE.length];
                      return (
                        <div key={lote.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></div>
                            {showLoteName && <span className="font-medium text-slate-700 text-sm">Lote: {lote.nombre_lote}</span>}
                          </div>
                          <div className="flex gap-4 text-sm text-slate-600 items-center">
                            {showHectareas && <span className="font-medium">{lote.hectareas_lote || 0} ha</span>}
                            {showCoords && c && (
                              <span className="font-mono text-sm font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
                                LAT: {c.lat.toFixed(5)}, LNG: {c.lng.toFixed(5)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mapa (Fijo en tamaño para la imagen) */}
              <div className="w-full h-[550px] border-t border-slate-200 bg-slate-100 relative">
                <MapContainer 
                  center={mapBounds?.getCenter() || [-1.4700, -79.4600]} 
                  zoom={14} 
                  className="w-full h-full"
                  zoomControl={false}
                  attributionControl={false}
                >
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    crossOrigin="anonymous"
                  />
                  
                  {mapBounds && <MapBoundsExport bounds={mapBounds} />}

                  {/* Polígono Finca */}
                  {showFincaPolygon && parseGeoJSON(finca.poligono) && (
                    <GeoJSON 
                      key={`finca-${showFincaPolygon}`}
                      data={parseGeoJSON(finca.poligono)} 
                      style={{ color: FINCA_COLOR, weight: 3, fillOpacity: 0.1 }}
                    />
                  )}

                  {/* Polígonos Lotes */}
                  {lotesMostrados.map((lote: any) => {
                    const originalIndex = finca.lotes_finca.findIndex((l: any) => l.id === lote.id);
                    const p = parseGeoJSON(lote.poligono);
                    if (!p) return null;
                    return (
                      <GeoJSON 
                        key={`lote-${lote.id}`}
                        data={p} 
                        style={{ color: PALETTE[originalIndex % PALETTE.length], weight: 2, fillOpacity: 0.4 }}
                      />
                    );
                  })}
                </MapContainer>
              </div>

              {/* Eliminamos el footer según solicitud del usuario */}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleExport}
            disabled={!mapReady || isExporting}
            className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {isExporting ? 'Procesando...' : (!mapReady ? 'Cargando Mapa...' : 'Descargar JPG')}
          </button>
        </div>

      </div>
    </div>
  );
}
