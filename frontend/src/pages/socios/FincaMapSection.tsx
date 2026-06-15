import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import proj4 from 'proj4';
import { Edit, Trash2, MapPin, Leaf, Plus, ChevronDown, ChevronUp, Layers, AlertCircle, Image as ImageIcon } from 'lucide-react';

const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';
const utm17s = '+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs';

const PALETTE = ['#f97316', '#3b82f6', '#ec4899', '#a855f7', '#eab308', '#ef4444', '#14b8a6', '#f43f5e', '#6366f1'];
const FINCA_COLOR = '#10b981'; // Verde Esmeralda

const createColoredMarker = (color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.3));"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`;
  return new L.DivIcon({
    html: svg,
    className: 'bg-transparent',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

function MapBounds({ markers, polygons }: { markers: any[], polygons: any[] }) {
  const map = useMap();
  useEffect(() => {
    try {
      const validPoints: L.LatLngTuple[] = [];
      
      markers.forEach(m => {
        if (m.lat != null && m.lng != null) {
          validPoints.push([m.lat, m.lng]);
        }
      });
      
      let bounds: L.LatLngBounds | null = null;
      if (validPoints.length > 0) {
        bounds = L.latLngBounds(validPoints);
      }

      polygons.forEach(p => {
        if (p) {
          try {
            const layer = L.geoJSON(p);
            const pb = layer.getBounds();
            if (pb && pb.isValid()) {
              if (!bounds) {
                bounds = pb;
              } else {
                bounds.extend(pb);
              }
            }
          } catch (e) {
            console.error("Invalid polygon passed to bounds:", e);
          }
        }
      });

      if (bounds && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    } catch(e) {
      console.error("Map bounds error:", e);
    }
  }, [markers, polygons, map]);
  return null;
}

class ErrorBoundary extends React.Component<{children: any}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("FincaMapSection Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <h3 className="font-bold">Error renderizando este mapa</h3>
          <p className="text-sm font-mono mt-2">{this.state.error?.toString()}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function FincaMapSection(props: any) {
  return (
    <ErrorBoundary>
      <FincaMapSectionInner {...props} />
    </ErrorBoundary>
  );
}

function FincaMapSectionInner({ 
  finca, 
  expanded, 
  onToggle, 
  onEditFinca, 
  onDeleteFinca, 
  onExportFinca,
  onEditLote, 
  onDeleteLote,
  onAddLote
}: any) {
  const [showFinca, setShowFinca] = useState(true);
  const [showLotes, setShowLotes] = useState<Record<string, boolean>>({});

  // Initialize lotes visibility
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    finca.lotes_finca?.forEach((lote: any) => {
      initial[lote.id] = true;
    });
    setShowLotes(initial);
  }, [finca]);

  // Assign colors to lotes
  const loteColors = useMemo(() => {
    const colors: Record<string, string> = {};
    finca.lotes_finca?.forEach((lote: any, index: number) => {
      colors[lote.id] = PALETTE[index % PALETTE.length];
    });
    return colors;
  }, [finca.lotes_finca]);

  // Convert coords
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
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (parsed && typeof parsed === 'object' && parsed.type) {
        return parsed;
      }
    } catch(e) {
      console.error("Invalid GeoJSON:", e);
    }
    return null;
  };

  const fincaCoords = useMemo(() => processCoords(finca.coord_x, finca.coord_y), [finca.coord_x, finca.coord_y]);
  const parsedFincaPoligono = useMemo(() => parseGeoJSON(finca.poligono), [finca.poligono]);
  
  const activeMarkers = useMemo(() => {
    const markers = [];
    if (showFinca && fincaCoords) {
      markers.push({ ...fincaCoords, name: finca.nombre, color: FINCA_COLOR, isFinca: true });
    }
    finca.lotes_finca?.forEach((lote: any) => {
      if (showLotes[lote.id]) {
        const coords = processCoords(lote.coord_x, lote.coord_y);
        if (coords) {
          markers.push({ ...coords, name: lote.nombre_lote, variedad: lote.variedad_cacao, color: loteColors[lote.id] });
        }
      }
    });
    return markers;
  }, [finca, showFinca, showLotes, fincaCoords, loteColors]);

  const activePolygons = useMemo(() => {
    const polys = [];
    if (showFinca && parsedFincaPoligono) {
      polys.push(parsedFincaPoligono);
    }
    finca.lotes_finca?.forEach((lote: any) => {
      if (showLotes[lote.id]) {
        const poly = parseGeoJSON(lote.poligono);
        if (poly) polys.push(poly);
      }
    });
    return polys;
  }, [finca, showFinca, showLotes, parsedFincaPoligono]);

  const toggleAllLotes = () => {
    const allVisible = Object.values(showLotes).every(v => v);
    const nextState: Record<string, boolean> = {};
    finca.lotes_finca?.forEach((l: any) => {
      nextState[l.id] = !allVisible;
    });
    setShowLotes(nextState);
  };

  const hasAnyMapData = fincaCoords || parsedFincaPoligono || finca.lotes_finca?.some((l: any) => l.coord_x || parseGeoJSON(l.poligono));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-6 transition-all duration-300">
      {/* HEADER ACORDEON */}
      <div 
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            {finca.nombre}
          </h3>
          <p className="text-sm text-slate-500 mt-1 flex gap-3">
            <span>{finca.hectareas_totales ? `${finca.hectareas_totales} Has` : 'Sin Has registradas'}</span>
            <span>•</span>
            <span>{finca.ubicacion_sector || 'Sin sector'}</span>
            <span>•</span>
            <span>{finca.lotes_finca?.length || 0} Lotes</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => onExportFinca && onExportFinca()} 
              className="p-2 text-slate-400 hover:text-emerald-600 bg-white hover:bg-emerald-50 border border-slate-200 rounded-lg transition-colors"
              title="Exportar Mapa a Imagen"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <button onClick={() => onEditFinca(finca)} className="p-2 text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors" title="Editar Finca">
              <Edit className="h-4 w-4" />
            </button>
            <button onClick={() => onDeleteFinca(finca.id)} className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 rounded-lg transition-colors" title="Eliminar Finca">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-slate-100 p-2 rounded-full">
            {expanded ? <ChevronUp className="h-5 w-5 text-slate-600" /> : <ChevronDown className="h-5 w-5 text-slate-600" />}
          </div>
        </div>
      </div>

      {/* CONTENIDO (MAPA Y LOTES) */}
      {expanded && (
        <div className="border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
          
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-6">
            {/* CONTROLES DEL MAPA */}
            <div className="w-full md:w-64 flex-shrink-0">
              <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Layers className="h-5 w-5 text-slate-400" />
                Capas del Mapa
              </h4>
              
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                {/* Finca Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={showFinca} onChange={() => setShowFinca(!showFinca)} className="w-4 h-4 text-emerald-600 rounded border-slate-300" />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: FINCA_COLOR }}></div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Ver Finca</span>
                </label>

                {finca.lotes_finca && finca.lotes_finca.length > 0 && (
                  <div className="pt-3 border-t border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer group mb-2">
                      <input 
                        type="checkbox" 
                        checked={Object.values(showLotes).every(v => v)} 
                        onChange={toggleAllLotes} 
                        className="w-4 h-4 text-orange-600 rounded border-slate-300" 
                      />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Ver Todos los Lotes</span>
                    </label>

                    <div className="space-y-2 pl-7 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {finca.lotes_finca.map((lote: any) => (
                        <label key={lote.id} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={showLotes[lote.id] || false} 
                            onChange={() => setShowLotes(prev => ({...prev, [lote.id]: !prev[lote.id]}))} 
                            className="w-3.5 h-3.5 rounded border-slate-300" 
                            style={{ accentColor: loteColors[lote.id] }}
                          />
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: loteColors[lote.id] }}></div>
                          <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 truncate">{lote.nombre_lote}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MAPA VISUAL */}
            <div className="flex-grow">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner relative z-0 h-[400px]">
                
                {!hasAnyMapData && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm border border-orange-200 px-4 py-2 rounded-full shadow-md flex items-center gap-2 text-sm text-orange-700 font-bold">
                    <AlertCircle className="h-4 w-4" />
                    Sin datos geográficos (Finca y lotes sin polígonos/coordenadas)
                  </div>
                )}

                <MapContainer center={[-1.4700, -79.4600]} zoom={hasAnyMapData ? 13 : 6} className="w-full h-full">
                  <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Satélite">
                      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Callejero">
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    </LayersControl.BaseLayer>
                  </LayersControl>
                  
                  {hasAnyMapData && <MapBounds markers={activeMarkers} polygons={activePolygons} />}
                  
                  {activeMarkers.map((m: any, idx: number) => (
                    <Marker key={`marker-${idx}`} position={[m.lat, m.lng]} icon={createColoredMarker(m.color)}>
                      <Popup>
                        <div className="text-sm font-sans">
                          <p className="font-bold border-b pb-1 mb-1" style={{ color: m.color, borderColor: m.color }}>
                            {m.isFinca ? 'Finca: ' : 'Lote: '} {m.name}
                          </p>
                          {m.variedad && <p><strong>Variedad:</strong> {m.variedad}</p>}
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {showFinca && parsedFincaPoligono && (
                    <GeoJSON 
                      data={parsedFincaPoligono} 
                      style={{ color: FINCA_COLOR, weight: 3, fillColor: FINCA_COLOR, fillOpacity: 0.2 }} 
                      key={`poly-finca-${finca.id}`} 
                    />
                  )}

                  {finca.lotes_finca?.map((lote: any) => {
                    const parsed = parseGeoJSON(lote.poligono);
                    if (showLotes[lote.id] && parsed) {
                      return (
                        <GeoJSON 
                          data={parsed} 
                          style={{ color: loteColors[lote.id], weight: 3, fillColor: loteColors[lote.id], fillOpacity: 0.4 }} 
                          key={`poly-lote-${lote.id}`} 
                        />
                      );
                    }
                    return null;
                  })}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* LISTA DE LOTES EN TARJETAS */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-700 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-orange-500" />
                Lotes de Producción
              </h4>
              <button 
                onClick={() => onAddLote(finca.id)}
                className="flex items-center gap-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
              >
                <Plus className="h-4 w-4" /> Agregar Lote
              </button>
            </div>

            {finca.lotes_finca && finca.lotes_finca.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {finca.lotes_finca.map((lote: any) => (
                  <div key={lote.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-colors">
                    {/* Borde superior de color */}
                    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: loteColors[lote.id] }}></div>
                    
                    <div className="flex justify-between items-start mb-3 mt-1">
                      <div>
                        <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: loteColors[lote.id] }}></div>
                          {lote.nombre_lote}
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">{lote.variedad_cacao || 'Sin variedad especificada'}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 rounded-lg p-0.5">
                        <button onClick={() => onEditLote(lote, finca.id)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors" title="Editar Lote">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => onDeleteLote(lote.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors" title="Eliminar Lote">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-2.5 rounded-lg">
                      <div>
                        <span className="block text-[10px] uppercase text-slate-400 font-bold">Hectáreas</span>
                        <span className="font-medium text-slate-700">{lote.hectareas_lote ? `${lote.hectareas_lote} ha` : '-'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-slate-400 font-bold">Año Siembra</span>
                        <span className="font-medium text-slate-700">{lote.ano_siembra || '-'}</span>
                      </div>
                      <div className="col-span-2 mt-1 pt-2 border-t border-slate-200/50">
                        <span className="block text-[10px] uppercase text-slate-400 font-bold mb-0.5 flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" /> Georreferencia
                        </span>
                        <span className="text-xs font-mono text-slate-600">
                          {lote.coord_x ? `${lote.coord_x}, ${lote.coord_y}` : 'No configurada'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <Leaf className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium">Esta finca no tiene lotes registrados.</p>
                <button onClick={() => onAddLote(finca.id)} className="mt-3 text-orange-600 hover:underline text-sm font-bold">
                  Crear primer lote
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
