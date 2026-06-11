import { useState, useEffect } from 'react';
import { X, Save, Loader2, Leaf, Map as MapIcon, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { parseKMLToGeoJSON } from '../../lib/kmlParser';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import proj4 from 'proj4';

const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';
const utm17s = '+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs';

interface LoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  fincaId: string;
  loteEdit?: any; // Si existe, es modo edición
}

const VARIEDADES = [
  'Nacional Fino de Aroma',
  'CCN-51',
  'Súper Árbol',
  'Trinitario',
  'Forastero',
  'Mezcla / Híbrido'
];

export default function LoteModal({ isOpen, onClose, onSave, fincaId, loteEdit }: LoteModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_lote: '',
    variedad_cacao: 'Nacional Fino de Aroma',
    hectareas_lote: '',
    ano_siembra: '',
    coord_x: '',
    coord_y: '',
    coord_z: '',
    poligono: null as any
  });
  
  const [parsingKML, setParsingKML] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-1.4700, -79.4600]);

  useEffect(() => {
    if (isOpen) {
      if (loteEdit) {
        setFormData({
          nombre_lote: loteEdit.nombre_lote || '',
          variedad_cacao: loteEdit.variedad_cacao || 'Nacional Fino de Aroma',
          hectareas_lote: loteEdit.hectareas_lote?.toString() || '',
          ano_siembra: loteEdit.ano_siembra?.toString() || '',
          coord_x: loteEdit.coord_x?.toString() || '',
          coord_y: loteEdit.coord_y?.toString() || '',
          coord_z: loteEdit.coord_z?.toString() || '',
          poligono: loteEdit.poligono || null
        });
        
        // Centrar mapa si hay polígono
        if (loteEdit.poligono && loteEdit.poligono.features && loteEdit.poligono.features.length > 0) {
           const layer = L.geoJSON(loteEdit.poligono);
           const bounds = layer.getBounds();
           if (bounds.isValid()) {
             setMapCenter([bounds.getCenter().lat, bounds.getCenter().lng]);
           } else if (loteEdit.coord_x && loteEdit.coord_y) {
             setMapCenter([parseFloat(loteEdit.coord_y), parseFloat(loteEdit.coord_x)]);
           }
        } else if (loteEdit.coord_x && loteEdit.coord_y) {
           setMapCenter([parseFloat(loteEdit.coord_y), parseFloat(loteEdit.coord_x)]);
        }
      } else {
        setFormData({
          nombre_lote: '',
          variedad_cacao: 'Nacional Fino de Aroma',
          hectareas_lote: '',
          ano_siembra: '',
          coord_x: '',
          coord_y: '',
          coord_z: '',
          poligono: null
        });
      }
    }
  }, [isOpen, loteEdit]);

  const handleKmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsingKML(true);
    try {
      const geojson = await parseKMLToGeoJSON(file);
      
      const layer = L.geoJSON(geojson);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        const centerLat = bounds.getCenter().lat;
        const centerLng = bounds.getCenter().lng;
        setMapCenter([centerLat, centerLng]);
        
        if (!formData.coord_x || !formData.coord_y) {
           const [x, y] = proj4(wgs84, utm17s, [centerLng, centerLat]);
           setFormData(prev => ({
              ...prev,
              poligono: geojson,
              coord_x: x.toFixed(2),
              coord_y: y.toFixed(2)
           }));
           return;
        }
      }
      
      setFormData(prev => ({ ...prev, poligono: geojson }));
    } catch (err: any) {
      alert("Error leyendo KML: " + err.message);
    } finally {
      setParsingKML(false);
      e.target.value = '';
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        finca_id: fincaId,
        nombre_lote: formData.nombre_lote,
        variedad_cacao: formData.variedad_cacao,
        hectareas_lote: formData.hectareas_lote ? parseFloat(formData.hectareas_lote) : null,
        ano_siembra: formData.ano_siembra ? parseInt(formData.ano_siembra) : null,
        coord_x: formData.coord_x ? parseFloat(formData.coord_x) : null,
        coord_y: formData.coord_y ? parseFloat(formData.coord_y) : null,
        coord_z: formData.coord_z ? parseFloat(formData.coord_z) : null,
        poligono: formData.poligono || null
      };

      if (loteEdit) {
        const { error } = await supabase.from('lotes_finca').update(payload).eq('id', loteEdit.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('lotes_finca').insert([payload]);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving lote:', error);
      alert('Error al guardar el lote: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
            {loteEdit ? 'Editar Lote' : 'Nuevo Lote'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="loteForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Lote *</label>
              <input
                required
                type="text"
                value={formData.nombre_lote}
                onChange={e => setFormData({...formData, nombre_lote: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Ej: Lote Norte"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Variedad de Cacao</label>
              <select
                value={formData.variedad_cacao}
                onChange={e => setFormData({...formData, variedad_cacao: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {VARIEDADES.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Año de Siembra</label>
                <input
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={formData.ano_siembra}
                  onChange={e => setFormData({...formData, ano_siembra: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Ej: 2015"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Hectáreas del Lote</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.hectareas_lote}
                  onChange={e => setFormData({...formData, hectareas_lote: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Ej: 2.5"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                <MapIcon className="h-5 w-5 text-indigo-500" />
                Georreferenciación y Polígono
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Longitud (X)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coord_x}
                    onChange={e => setFormData({...formData, coord_x: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-emerald-500"
                    placeholder="-79.123"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Latitud (Y)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coord_y}
                    onChange={e => setFormData({...formData, coord_y: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-emerald-500"
                    placeholder="-2.456"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Elevación (Z)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coord_z}
                    onChange={e => setFormData({...formData, coord_z: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-emerald-500"
                    placeholder="msnm"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-bold text-slate-700">Polígono KML</label>
                  {formData.poligono ? (
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, poligono: null }))}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 text-xs font-medium"
                    >
                      <Trash2 className="h-3 w-3" /> Quitar Polígono
                    </button>
                  ) : (
                    <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      {parsingKML ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapIcon className="w-4 h-4" />}
                      <span>{parsingKML ? 'Procesando...' : formData.poligono ? 'Cambiar KML/KMZ' : 'Subir Polígono (KML/KMZ)'}</span>
                      <input type="file" accept=".kml,.kmz" onChange={handleKmlUpload} className="hidden" />
                    </label>
                  )}
                </div>

                {formData.poligono ? (
                  <div className="h-48 w-full bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative z-0">
                    <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <GeoJSON data={formData.poligono} key={JSON.stringify(formData.poligono)} style={{ color: '#f97316', weight: 3, fillColor: '#f97316', fillOpacity: 0.3 }} />
                    </MapContainer>
                  </div>
                ) : (
                  <div className="h-32 w-full border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400">
                    <MapIcon className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-xs">Sin polígono cargado</p>
                    <p className="text-[10px]">Sube un archivo KML para visualizarlo</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="loteForm"
            disabled={loading}
            className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Guardar Lote
          </button>
        </div>
      </div>
    </div>
  );
}
