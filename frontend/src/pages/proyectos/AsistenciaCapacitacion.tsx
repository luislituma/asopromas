import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Search, UserCheck } from 'lucide-react';

export default function AsistenciaCapacitacion() {
  const { id } = useParams();
  
  const [capacitacion, setCapacitacion] = useState<any>(null);
  const [socios, setSocios] = useState<any[]>([]);
  const [asistencias, setAsistencias] = useState<Record<string, boolean>>({}); // socio_id -> asistio
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // 1. Info del taller
      const { data: capData } = await supabase.from('capacitaciones').select('*').eq('id', id).single();
      if (capData) setCapacitacion(capData);

      // 2. Todos los socios activos
      const { data: socData } = await supabase.from('socios').select('id, nombres, apellidos, cedula').eq('estado', 'activo');
      if (socData) setSocios(socData);

      // 3. Asistencias ya registradas
      const { data: asisData } = await supabase.from('capacitacion_asistencias').select('socio_id, asistio').eq('capacitacion_id', id);
      if (asisData) {
        const asisMap: Record<string, boolean> = {};
        asisData.forEach(a => { asisMap[a.socio_id] = a.asistio; });
        setAsistencias(asisMap);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleAsistencia = async (socioId: string) => {
    const isPresent = asistencias[socioId] ?? false; // Por defecto no está en BD
    const willBePresent = !isPresent;

    // Actualizar UI rápido
    setAsistencias(prev => ({...prev, [socioId]: willBePresent}));

    try {
      // Hacer upsert en BD
      const { error } = await supabase.from('capacitacion_asistencias').upsert({
        capacitacion_id: id,
        socio_id: socioId,
        asistio: willBePresent
      }, { onConflict: 'capacitacion_id, socio_id' });

      if (error) throw error;
    } catch (e) {
      console.error("Error toggling asistencia", e);
      // Revert UI on error
      setAsistencias(prev => ({...prev, [socioId]: isPresent}));
    }
  };

  const marcarTallerRealizado = async () => {
    if (!window.confirm("¿Seguro que deseas marcar este taller como REALIZADO?")) return;
    await supabase.from('capacitaciones').update({ estado: 'realizada' }).eq('id', id);
    setCapacitacion({...capacitacion, estado: 'realizada'});
  };

  const filteredSocios = socios.filter(s => 
    s.nombres.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cedula.includes(searchTerm)
  );

  const totalAsistentes = Object.values(asistencias).filter(v => v).length;

  if (loading) return <div className="p-10 text-center text-white"><Loader2 className="animate-spin h-8 w-8 mx-auto text-amber-500" /></div>;
  if (!capacitacion) return <div className="p-10 text-center text-white">Capacitación no encontrada.</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/capacitaciones" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Talleres
        </Link>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
              <UserCheck className="h-6 w-6" /> Toma de Asistencia
            </h1>
            <p className="text-white font-medium text-lg mt-1">{capacitacion.tema}</p>
            <p className="text-neutral-400 text-sm mt-1">
              Fecha: {new Date(capacitacion.fecha).toLocaleDateString()} | Lugar: {capacitacion.lugar}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-700">
              <span className="text-neutral-400 mr-2">Total Asistentes:</span>
              <span className="text-2xl font-bold text-emerald-500">{totalAsistentes}</span>
              <span className="text-neutral-500 ml-1">/ {socios.length}</span>
            </div>
            {capacitacion.estado === 'programada' && (
              <button onClick={marcarTallerRealizado} className="text-sm px-3 py-1.5 bg-emerald-500 text-black font-bold rounded hover:bg-emerald-600 transition-colors">
                Finalizar Taller
              </button>
            )}
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="text"
                placeholder="Buscar socio por nombre o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 bg-neutral-900 border border-neutral-700 rounded-md py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="divide-y divide-neutral-700/50 max-h-[600px] overflow-y-auto">
            {filteredSocios.map(socio => {
              const presente = asistencias[socio.id] ?? false;
              
              return (
                <div key={socio.id} className="flex items-center justify-between p-4 hover:bg-neutral-700/20 transition-colors">
                  <div>
                    <p className="font-bold text-white text-lg">{socio.nombres} {socio.apellidos}</p>
                    <p className="text-neutral-500 text-sm">{socio.cedula}</p>
                  </div>
                  
                  <button
                    onClick={() => toggleAsistencia(socio.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                      presente 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30' 
                        : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600 border border-transparent'
                    }`}
                  >
                    {presente ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" /> PRESENTE
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" /> AUSENTE
                      </>
                    )}
                  </button>
                </div>
              );
            })}
            
            {filteredSocios.length === 0 && (
              <div className="p-10 text-center text-neutral-500">
                Ningún socio coincide con la búsqueda.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
