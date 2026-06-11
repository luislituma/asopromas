import type { ReporteOptions } from './ReporteModal';
import { MapContainer, TileLayer, GeoJSON, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import React, { useEffect, useMemo } from 'react';
import { MapPin } from 'lucide-react';

interface SocioPrintViewProps {
  socio: any;
  fincas: any[];
  options: ReporteOptions;
  isPreparing?: boolean;
}

const FINCA_COLOR = '#10b981'; // Verde Esmeralda
const PALETTE = [
  '#f97316', // Orange 500
  '#3b82f6', // Blue 500
  '#ec4899', // Pink 500
  '#8b5cf6', // Violet 500
  '#ef4444', // Red 500
  '#14b8a6', // Teal 500
  '#eab308'  // Yellow 500
];

// Utility to parse GeoJSON defensively
const parseGeoJSON = (data: any) => {
  if (!data) return null;
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    if (parsed && typeof parsed === 'object' && parsed.type) {
      return parsed;
    }
  } catch(e) {}
  return null;
};

// Map Bounds component for Print
function PrintMapBounds({ fincas }: { fincas: any[] }) {
  const map = useMap();
  useEffect(() => {
    try {
      let bounds: L.LatLngBounds | null = null;
      fincas.forEach(f => {
        const p = parseGeoJSON(f.poligono);
        if (p) {
          const layer = L.geoJSON(p);
          const pb = layer.getBounds();
          if (pb && pb.isValid()) {
            if (!bounds) bounds = pb; else bounds.extend(pb);
          }
        }
        f.lotes_finca?.forEach((l: any) => {
          const lp = parseGeoJSON(l.poligono);
          if (lp) {
            const layer = L.geoJSON(lp);
            const pb = layer.getBounds();
            if (pb && pb.isValid()) {
              if (!bounds) bounds = pb; else bounds.extend(pb);
            }
          }
        });
      });

      const finalBounds = bounds as L.LatLngBounds | null;
      if (finalBounds && finalBounds.isValid()) {
        // Reducido a [20, 20] para que los lotes ocupen casi toda la imagen
        map.fitBounds(finalBounds, { padding: [20, 20], maxZoom: 18 });
      }
    } catch(e) {}
  }, [fincas, map]);
  return null;
}

// Force map to recalculate size when preparing for print
function MapResizer({ isPreparing }: { isPreparing?: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (isPreparing) {
      // Small delay to ensure DOM is updated before recalculating
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }
  }, [isPreparing, map]);
  return null;
}

export default function SocioPrintView({ socio, fincas, options, isPreparing }: SocioPrintViewProps) {
  if (!socio) return null;

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const selectedLoteId = options.selectedLoteId || 'all';
  const showMapLabels = options.showMapLabels !== false;

  const filteredFincas = useMemo(() => {
    if (selectedLoteId === 'all') return fincas;
    
    return fincas.map(f => {
      const loteFound = f.lotes_finca?.find((l: any) => l.id === selectedLoteId);
      if (loteFound) {
        return { ...f, lotes_finca: [loteFound] };
      }
      return null;
    }).filter(Boolean);
  }, [fincas, selectedLoteId]);

  const isCertificada = filteredFincas.some(f => 
    f.lotes_finca && f.lotes_finca.some((l: any) => l.coord_x || l.coord_y)
  );

  const hasMapData = filteredFincas.some(f => 
    parseGeoJSON(f.poligono) || 
    (f.lotes_finca && f.lotes_finca.some((l: any) => parseGeoJSON(l.poligono)))
  );

  return (
    <div className={`
      bg-white font-sans text-black w-full
      ${isPreparing ? 'fixed inset-0 z-[9999] overflow-y-auto px-8 py-10 block' : 'hidden'}
      print:block print:static print:w-full print:px-0 print:py-0
    `}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b-2 border-black pb-6 mb-6">
        <div className="flex items-center gap-4">
          <img src="/logo-asopromas.svg" alt="ASOPROMAS" className="h-20 object-contain" />
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider">ASOPROMAS</h1>
            <p className="text-sm text-gray-600">Asociación de Productores de Cacao</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold uppercase">Ficha Técnica de Socio</h2>
          <p className="text-sm">Código: <strong>{socio.codigo_socio || 'S/N'}</strong></p>
          <p className="text-sm">Fecha Impresión: {getTodayDate()}</p>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* SECCIÓN 1: DATOS PERSONALES */}
        {options.datosPersonales && (
          <section>
            <h3 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4">I. Datos Personales y de Contacto</h3>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="text-gray-500 mb-0.5">Nombres y Apellidos</p>
                <p className="font-bold text-base">{socio.nombres} {socio.apellidos}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">Cédula de Identidad</p>
                <p className="font-bold text-base">{socio.cedula || 'No registrada'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">Celular / Teléfono</p>
                <p className="font-bold">{socio.telefono || 'No registrado'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">Fecha de Nacimiento</p>
                <p className="font-bold">{socio.fecha_nacimiento ? new Date(socio.fecha_nacimiento).toLocaleDateString() : 'No registrada'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">Comunidad / Grupo</p>
                <p className="font-bold">{socio.grupos_base?.nombre || 'No asignada'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">Dirección</p>
                <p className="font-bold">{socio.direccion || 'No especificada'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">Estado Civil</p>
                <p className="font-bold">{socio.estado_civil || 'No especificado'}</p>
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 2: FINCAS Y LOTES */}
        {options.fincasYLotes && (
          <section>
            <h3 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4">II. Patrimonio Agrícola</h3>
            
            {filteredFincas.length === 0 ? (
              <p className="text-sm italic text-gray-500">El socio no tiene fincas registradas o no se encontró el lote seleccionado.</p>
            ) : (
              <div className="space-y-6">
                {filteredFincas.map((finca, index) => (
                  <div key={finca.id} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-start border-b border-gray-200 pb-3 mb-3">
                      <div>
                        <h4 className="font-bold text-base">Finca {index + 1}: {finca.nombre}</h4>
                        <p className="text-sm text-gray-600">Ubicación: {finca.ubicacion_sector || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold bg-gray-100 px-2 py-1 rounded">{finca.hectareas_totales || 0} ha. Totales</p>
                        {finca.altitud_msnm && <p className="text-xs text-gray-500 mt-1">Altitud: {finca.altitud_msnm} msnm</p>}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-bold mb-2">Lotes y Parcelas:</h5>
                      {(!finca.lotes_finca || finca.lotes_finca.length === 0) ? (
                        <p className="text-xs italic text-gray-500">Sin lotes registrados.</p>
                      ) : (
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-2 py-1.5">Nombre Lote</th>
                              <th className="border border-gray-300 px-2 py-1.5">Variedad</th>
                              <th className="border border-gray-300 px-2 py-1.5">Hectáreas</th>
                              <th className="border border-gray-300 px-2 py-1.5">Año Siembra</th>
                              <th className="border border-gray-300 px-2 py-1.5">Coordenadas (X, Y, Z)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {finca.lotes_finca.map((lote: any) => (
                              <tr key={lote.id}>
                                <td className="border border-gray-300 px-2 py-1.5 font-bold">{lote.nombre_lote}</td>
                                <td className="border border-gray-300 px-2 py-1.5">{lote.variedad_cacao || '-'}</td>
                                <td className="border border-gray-300 px-2 py-1.5">{lote.hectareas_lote ? `${lote.hectareas_lote} ha` : '-'}</td>
                                <td className="border border-gray-300 px-2 py-1.5">{lote.ano_siembra || '-'}</td>
                                <td className="border border-gray-300 px-2 py-1.5 font-mono text-[10px]">
                                  {lote.coord_x ? `${lote.coord_x}, ${lote.coord_y}` : 'S/C'}
                                  {lote.coord_z ? ` (${lote.coord_z}m)` : ''}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MAPA DE POLÍGONOS (MOVIDO A PATRIMONIO AGRÍCOLA) */}
            <div className="mt-8 border border-gray-300 rounded-lg overflow-hidden">
              <h4 className="font-bold text-sm bg-gray-100 px-4 py-2 border-b border-gray-300">Evidencia Cartográfica de Fincas y Lotes</h4>
              {/* pointer-events-none bloquea interacciones (arrastrar, hacer zoom) para que la captura sea limpia */}
              <div className="h-[400px] w-full bg-gray-50 relative pointer-events-none">
                {(isPreparing || typeof window !== 'undefined') && hasMapData ? (
                  <MapContainer 
                    center={[-1.47, -79.46]} 
                    zoom={10} 
                    className="w-full h-full" 
                    zoomControl={false} 
                    attributionControl={false}
                    dragging={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                    touchZoom={false}
                  >
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                    <MapResizer isPreparing={isPreparing} />
                    <PrintMapBounds fincas={filteredFincas} />
                    {filteredFincas.map(f => {
                      const fp = parseGeoJSON(f.poligono);
                      return (
                        <React.Fragment key={`f-${f.id}`}>
                          {fp && (
                            <GeoJSON data={fp} style={{ color: FINCA_COLOR, weight: 3, fillColor: FINCA_COLOR, fillOpacity: 0.2 }}>
                              {showMapLabels && (
                                <Tooltip direction="center" permanent className="bg-transparent border-none shadow-none p-0">
                                  <div className="bg-white border border-slate-200 shadow-sm rounded-md px-2 py-1.5 flex flex-col items-center justify-center min-w-[90px]" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" style={{ color: FINCA_COLOR }} />
                                      <span className="font-bold text-[10px] text-slate-800 leading-none truncate max-w-[80px]">
                                        {f.nombre}
                                      </span>
                                    </div>
                                    {f.hectareas_totales && (
                                      <span className="text-[9px] text-slate-500 font-medium mt-0.5">
                                        Finca • {f.hectareas_totales} ha
                                      </span>
                                    )}
                                  </div>
                                </Tooltip>
                              )}
                            </GeoJSON>
                          )}
                          {f.lotes_finca?.map((l: any, index: number) => {
                            const lp = parseGeoJSON(l.poligono);
                            const loteColor = PALETTE[index % PALETTE.length];
                            return lp ? (
                              <GeoJSON key={`l-${l.id}`} data={lp} style={{ color: loteColor, weight: 3, fillColor: loteColor, fillOpacity: 0.4 }}>
                                {showMapLabels && (
                                  <Tooltip direction="center" permanent className="bg-transparent border-none shadow-none p-0">
                                    <div className="bg-white border shadow-sm rounded-md px-2 py-1 flex flex-col items-center justify-center min-w-[90px]" style={{ borderColor: loteColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                                      <div className="flex items-center gap-1 mb-0.5">
                                        <MapPin className="w-3 h-3" style={{ color: loteColor }} />
                                        <span className="font-bold text-[10px] text-slate-800 leading-none truncate max-w-[80px]">
                                          {l.nombre_lote}
                                        </span>
                                      </div>
                                      <div className="flex flex-col items-center text-[9px] text-slate-500 leading-tight">
                                        {l.variedad_cacao && <span>{l.variedad_cacao}</span>}
                                        {l.hectareas_lote && <span>{l.hectareas_lote} ha</span>}
                                      </div>
                                    </div>
                                  </Tooltip>
                                )}
                              </GeoJSON>
                            ) : null;
                          })}
                        </React.Fragment>
                      );
                    })}
                  </MapContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 italic text-sm">
                    No hay polígonos registrados para mostrar el mapa en el reporte.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 3: FINANCIERO Y CERTIFICACIONES */}
        {options.financiero && (
          <section>
            <h3 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4">III. Información Financiera y Certificaciones</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <h4 className="font-bold text-sm mb-3">Estado de Cuenta</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-gray-200 pb-1">
                    <span className="text-gray-600">Límite Autorizado (Tienda):</span>
                    <span className="font-bold">${socio.cupo_tienda || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saldo Pendiente (Deuda):</span>
                    <span className="font-bold">${socio.saldo_tienda || '0.00'}</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <h4 className="font-bold text-sm mb-3">Certificación Orgánica y Trazabilidad EUDR</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado de Certificación:</span>
                    <span className={`font-bold ${isCertificada ? 'text-black' : 'text-gray-500'}`}>
                      {isCertificada ? 'Certificación Orgánica' : 'No Certificado'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 mt-2 pt-2">
                    <span className="text-gray-600">Trazabilidad EUDR (Polígonos):</span>
                    <span className={`font-bold ${hasMapData ? 'text-emerald-700' : 'text-red-600'}`}>
                      {hasMapData ? 'Validado (Ver Mapa)' : 'Faltan Datos Geo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN 4: ACOPIO */}
        {options.acopio && (
          <section>
            <h3 className="text-lg font-bold uppercase border-b border-gray-300 pb-2 mb-4">IV. Historial de Acopio (Próximamente)</h3>
            <div className="border border-gray-200 border-dashed rounded-lg p-8 text-center text-sm text-gray-500 italic">
              Esta sección estará disponible cuando se habilite el módulo de registro de entregas.
            </div>
          </section>
        )}

      </div>

      {/* FOOTER PARA FIRMAS */}
      <div className="mt-20 pt-10 grid grid-cols-2 gap-12 text-center break-inside-avoid">
        <div>
          <div className="border-t border-black w-3/4 mx-auto pt-2">
            <p className="font-bold text-sm">Firma del Socio</p>
            <p className="text-xs text-gray-500 mt-1">C.I. {socio.cedula}</p>
          </div>
        </div>
        <div>
          <div className="border-t border-black w-3/4 mx-auto pt-2">
            <p className="font-bold text-sm">Representante ASOPROMAS</p>
            <p className="text-xs text-gray-500 mt-1">Sello y Firma</p>
          </div>
        </div>
      </div>

    </div>
  );
}
