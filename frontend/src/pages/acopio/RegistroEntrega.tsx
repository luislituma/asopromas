import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserSearch, Scale, DollarSign, Map, Save, Loader2, PackageOpen } from 'lucide-react';
import ReceiptSuccessModal from '../../components/ui/ReceiptSuccessModal';
import PDFPreviewModal from '../../components/ui/PDFPreviewModal';
import { generateEntregaReceiptPDF } from '../../lib/pdfGenerator';

export default function RegistroEntrega() {
  const { id, entregaId } = useParams(); // ID del lote_acopio y opcionalmente de la entrega a editar
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [oldWeights, setOldWeights] = useState({ kg: 0, lbs: 0 });
  
  // Estado para el modal de éxito
  const [successData, setSuccessData] = useState<any>(null);
  const [previewPdfData, setPreviewPdfData] = useState<{ isOpen: boolean; url: string; filename: string } | null>(null);

  // Estados de carga de datos
  const [socios, setSocios] = useState<any[]>([]);
  const [fincas, setFincas] = useState<any[]>([]);
  const [lotesFinca, setLotesFinca] = useState<any[]>([]);

  // Búsqueda de socio
  const [searchSocio, setSearchSocio] = useState('');
  const [selectedSocio, setSelectedSocio] = useState<any>(null);

  // Formulario principal
  const [formData, setFormData] = useState({
    unidad_medida: 'lbs',
    peso_bruto: '',
    tara: '0',
    merma: '0',
    precio_unidad: '',
    estado_pago: 'Pendiente',
    finca_id: '',
    lote_finca_id: '',
    notas_calidad: ''
  });

  // Cálculos dinámicos
  const pesoNeto = Math.max(0, (Number(formData.peso_bruto) || 0) - (Number(formData.tara) || 0) - (Number(formData.merma) || 0));
  const totalPagar = pesoNeto * (Number(formData.precio_unidad) || 0);
  const pesoNetoKg = formData.unidad_medida === 'kg' ? pesoNeto : pesoNeto * 0.453592;
  const pesoNetoLbs = formData.unidad_medida === 'lbs' ? pesoNeto : pesoNeto * 2.20462;

  // Cargar Socios al iniciar
  useEffect(() => {
    async function loadSocios() {
      const { data } = await supabase.from('socios').select('id, nombres, apellidos, cedula, email').order('apellidos');
      if (data) setSocios(data);
    }
    loadSocios();
  }, []);

  // Cargar datos de la entrega si estamos editando
  useEffect(() => {
    async function loadEntregaToEdit() {
      if (!entregaId) return;
      setIsEditing(true);
      setLoading(true);
      try {
        const { data: entrega, error } = await supabase
          .from('entregas_acopio')
          .select(`
            *,
            socios (id, nombres, apellidos, cedula, email),
            entregas_lotes_origen (finca_id, lote_finca_id)
          `)
          .eq('id', entregaId)
          .single();

        if (error) throw error;
        if (entrega) {
          setSelectedSocio(entrega.socios);
          setFormData({
            unidad_medida: entrega.unidad_medida,
            peso_bruto: entrega.peso_bruto.toString(),
            tara: entrega.tara.toString(),
            merma: entrega.merma.toString(),
            precio_unidad: entrega.precio_unidad.toString(),
            estado_pago: entrega.estado_pago,
            notas_calidad: entrega.notas_calidad || '',
            finca_id: entrega.entregas_lotes_origen?.[0]?.finca_id || '',
            lote_finca_id: entrega.entregas_lotes_origen?.[0]?.lote_finca_id || ''
          });
          setOldWeights({
            kg: Number(entrega.peso_neto_estandar_kg || 0),
            lbs: Number(entrega.peso_neto_estandar_kg || 0) * 2.20462
          });
        }
      } catch (err) {
        console.error("Error loading entrega:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEntregaToEdit();
  }, [entregaId]);

  // Cargar Fincas cuando se selecciona un socio
  useEffect(() => {
    async function loadFincas() {
      if (!selectedSocio) {
        setFincas([]);
        setLotesFinca([]);
        return;
      }
      const { data } = await supabase.from('fincas').select('id, nombre, hectareas_totales').eq('socio_id', selectedSocio.id);
      setFincas(data || []);
    }
    loadFincas();
  }, [selectedSocio]);

  // Cargar Lotes cuando se selecciona una finca
  useEffect(() => {
    async function loadLotes() {
      if (!formData.finca_id) {
        setLotesFinca([]);
        return;
      }
      const { data } = await supabase.from('lotes_finca').select('id, nombre_lote, hectareas_lote').eq('finca_id', formData.finca_id);
      setLotesFinca(data || []);
    }
    loadLotes();
  }, [formData.finca_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSocio) {
      alert('Debes seleccionar un socio.');
      return;
    }
    if (pesoNeto <= 0) {
      alert('El peso neto debe ser mayor a 0.');
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        const { error: entregaError } = await supabase
          .from('entregas_acopio')
          .update({
            socio_id: selectedSocio.id,
            unidad_medida: formData.unidad_medida,
            peso_bruto: Number(formData.peso_bruto),
            tara: Number(formData.tara),
            merma: Number(formData.merma),
            peso_neto: pesoNeto,
            peso_neto_estandar_kg: pesoNetoKg,
            precio_unidad: Number(formData.precio_unidad),
            total_pagar: totalPagar,
            estado_pago: formData.estado_pago,
            notas_calidad: formData.notas_calidad
          })
          .eq('id', entregaId);

        if (entregaError) throw entregaError;

        await supabase.from('entregas_lotes_origen').delete().eq('entrega_id', entregaId);
        
        if (formData.finca_id || formData.lote_finca_id) {
          await supabase
            .from('entregas_lotes_origen')
            .insert([{
              entrega_id: entregaId,
              finca_id: formData.finca_id || null,
              lote_finca_id: formData.lote_finca_id || null,
              porcentaje: 100
            }]);
        }

        const diffKg = pesoNetoKg - oldWeights.kg;
        const diffLbs = pesoNetoLbs - oldWeights.lbs;
        
        const { data: loteData } = await supabase.from('lotes_acopio').select('peso_total_kg, peso_total_lbs').eq('id', id).single();
        if (loteData) {
          await supabase.from('lotes_acopio').update({
            peso_total_kg: Math.max(0, Number(loteData.peso_total_kg) + diffKg),
            peso_total_lbs: Math.max(0, Number(loteData.peso_total_lbs) + diffLbs)
          }).eq('id', id);
        }

      } else {
        const { data: entregaData, error: entregaError } = await supabase
          .from('entregas_acopio')
          .insert([{
            lote_acopio_id: id,
            socio_id: selectedSocio.id,
            unidad_medida: formData.unidad_medida,
            peso_bruto: Number(formData.peso_bruto),
            tara: Number(formData.tara),
            merma: Number(formData.merma),
            peso_neto: pesoNeto,
            peso_neto_estandar_kg: pesoNetoKg,
            precio_unidad: Number(formData.precio_unidad),
            total_pagar: totalPagar,
            estado_pago: formData.estado_pago,
            notas_calidad: formData.notas_calidad
          }])
          .select()
          .single();

        if (entregaError) throw entregaError;

        if (formData.finca_id || formData.lote_finca_id) {
          await supabase
            .from('entregas_lotes_origen')
            .insert([{
              entrega_id: entregaData.id,
              finca_id: formData.finca_id || null,
              lote_finca_id: formData.lote_finca_id || null,
              porcentaje: 100
            }]);
        }

        const { data: loteData } = await supabase.from('lotes_acopio').select('peso_total_kg, peso_total_lbs').eq('id', id).single();
        if (loteData) {
          await supabase.from('lotes_acopio').update({
            peso_total_kg: Number(loteData.peso_total_kg) + pesoNetoKg,
            peso_total_lbs: Number(loteData.peso_total_lbs) + pesoNetoLbs
          }).eq('id', id);
        }
      }

      const receiptData = {
        socioNombre: selectedSocio?.nombres ? `${selectedSocio.nombres} ${selectedSocio.apellidos || ''}` : '',
        socioIdentificacion: selectedSocio?.cedula || '',
        fincaNombre: fincas.find(f => f.id === formData.finca_id)?.nombre || '',
        fecha_entrega: new Date().toISOString(),
        variedad: 'Por definir',
        estado_cacao: 'Recibido',
        peso_bruto_kg: formData.unidad_medida === 'kg' ? Number(formData.peso_bruto) : Number(formData.peso_bruto) * 0.453592,
        merma_kg: formData.unidad_medida === 'kg' ? Number(formData.merma) : Number(formData.merma) * 0.453592,
        precio_base: Number(formData.precio_unidad),
        valor_total: totalPagar
      };

      setSuccessData(receiptData);

    } catch (error: any) {
      console.error('Error registrando entrega:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredSocios = socios.filter(s => 
    `${s.nombres} ${s.apellidos} ${s.cedula}`.toLowerCase().includes(searchSocio.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <Link to={`/acopio/${id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" />
          Volver al Lote
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <PackageOpen className="w-8 h-8 text-emerald-600" />
            {isEditing ? 'Editar Recepción' : 'Recepción de Cacao'}
          </h1>
          <p className="text-slate-500 mt-2">
            {isEditing ? 'Modifica los datos de la entrega seleccionada.' : 'Registra el pesaje, asocia el productor y genera el pago.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <UserSearch className="w-5 h-5 text-emerald-600" />
              1. Identificación del Socio
            </h2>
            
            {!selectedSocio ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, apellido o cédula..."
                  value={searchSocio}
                  onChange={(e) => setSearchSocio(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {searchSocio && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-10">
                    {filteredSocios.map(socio => (
                      <button
                        key={socio.id}
                        type="button"
                        onClick={() => { 
                          setSelectedSocio(socio); 
                          setSearchSocio(''); 
                          setFormData(prev => ({ ...prev, finca_id: '', lote_finca_id: '' }));
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                      >
                        <div className="font-bold text-slate-800">{socio.apellidos} {socio.nombres}</div>
                        <div className="text-xs text-slate-500">C.I: {socio.cedula}</div>
                      </button>
                    ))}
                    {filteredSocios.length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-500">No se encontraron socios.</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div>
                  <div className="text-xs font-bold text-emerald-600 mb-1">SOCIO SELECCIONADO</div>
                  <div className="font-bold text-slate-800 text-lg">{selectedSocio.apellidos} {selectedSocio.nombres}</div>
                  <div className="text-sm text-slate-500">C.I: {selectedSocio.cedula}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSocio(null);
                    setFormData(prev => ({ ...prev, finca_id: '', lote_finca_id: '' }));
                  }}
                  className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-bold"
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>

          {selectedSocio && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Map className="w-5 h-5 text-emerald-600" />
                  2. Origen del Cacao <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Opcional</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Finca de Origen</label>
                  <select
                    name="finca_id"
                    value={formData.finca_id}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 text-slate-800"
                  >
                    <option value="">-- No especificar finca --</option>
                    {fincas.map(f => (
                      <option key={f.id} value={f.id}>{f.nombre} ({f.hectareas_totales} ha)</option>
                    ))}
                  </select>
                </div>
                
                {formData.finca_id && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Lote Específico</label>
                    <select
                      name="lote_finca_id"
                      value={formData.lote_finca_id}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800"
                    >
                      <option value="">-- Todo el cacao de la finca --</option>
                      {lotesFinca.map(l => (
                        <option key={l.id} value={l.id}>{l.nombre_lote} ({l.hectareas_lote} ha)</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedSocio && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                <Scale className="w-5 h-5 text-emerald-600" />
                3. Pesaje y Liquidación
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="text-sm font-bold text-slate-700">Unidad de Medida</label>
                  <select
                    name="unidad_medida"
                    value={formData.unidad_medida}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-emerald-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="lbs">Libras (Lbs)</option>
                    <option value="kg">Kilos (Kg)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Peso Bruto</label>
                  <input
                    type="number" step="0.01" name="peso_bruto" required
                    value={formData.peso_bruto} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 text-right font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Tara (Sacos)</label>
                  <input
                    type="number" step="0.01" name="tara" required
                    value={formData.tara} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-right text-amber-600 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Merma (Hum/Imp)</label>
                  <input
                    type="number" step="0.01" name="merma" required
                    value={formData.merma} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-right text-amber-600 font-medium"
                  />
                </div>
              </div>

              <div className="bg-slate-800 text-white p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="text-center md:text-left">
                  <div className="text-slate-400 text-sm font-bold mb-1">PESO NETO ({formData.unidad_medida.toUpperCase()})</div>
                  <div className="text-4xl font-black text-emerald-400">{pesoNeto.toFixed(2)}</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 flex items-center justify-center md:justify-start gap-1">
                    <DollarSign className="w-4 h-4" /> Precio por {formData.unidad_medida}
                  </label>
                  <input
                    type="number" step="0.01" name="precio_unidad" required
                    value={formData.precio_unidad} onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-slate-700 border-none rounded-xl px-4 py-3 text-white text-center md:text-right font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="text-center md:text-right">
                  <div className="text-slate-400 text-sm font-bold mb-1">TOTAL A PAGAR</div>
                  <div className="text-4xl font-black text-white">${totalPagar.toFixed(2)}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Estado del Pago</label>
                  <select
                    name="estado_pago"
                    value={formData.estado_pago}
                    onChange={handleChange}
                    className={`w-full border rounded-xl px-4 py-3 font-bold focus:outline-none ${
                      formData.estado_pago === 'Pendiente' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}
                  >
                    <option value="Pendiente">Pendiente de Pago</option>
                    <option value="Pagado">Pagado en Efectivo</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Notas Adicionales</label>
                  <textarea
                    name="notas_calidad"
                    rows={2}
                    placeholder="Observaciones sobre la calidad, etc."
                    value={formData.notas_calidad}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              to={`/acopio/${id}`}
              className="px-8 py-4 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || !selectedSocio || pesoNeto <= 0 || !formData.precio_unidad}
              className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
              {isEditing ? 'Guardar Cambios' : 'Registrar Entrega'}
            </button>
          </div>
        </form>
      </div>
      
      {successData && !previewPdfData?.isOpen && (
        <ReceiptSuccessModal
          isOpen={true}
          onClose={() => navigate(`/acopio/${id}`)}
          onNavigateNext={() => navigate(`/acopio/${id}`)}
          onDownload={() => {
            const result = generateEntregaReceiptPDF(successData, true);
            if (result && result.url) {
              setPreviewPdfData({ isOpen: true, url: result.url, filename: result.filename });
            }
          }}
          title={isEditing ? '¡Entrega Actualizada!' : '¡Entrega Registrada!'}
          subtitle={`Se ha guardado correctamente la entrega de cacao de ${successData.socioNombre}.`}
          emailData={{
            recipientRole: 'Socio',
            defaultEmail: selectedSocio?.email || '',
            documentName: `Recibo_Entrega_${successData.socioNombre.replace(/\s+/g, '_')}.pdf`
          }}
        />
      )}

      {previewPdfData?.isOpen && (
        <PDFPreviewModal
          isOpen={true}
          onClose={() => setPreviewPdfData(null)}
          pdfUrl={previewPdfData.url}
          fileName={previewPdfData.filename}
          onSendEmail={() => {
            // Se asume que el modal de éxito sigue atrás, pero al cerrar este modal podríamos querer ir a inicio
          }}
        />
      )}
    </div>
  );
}
