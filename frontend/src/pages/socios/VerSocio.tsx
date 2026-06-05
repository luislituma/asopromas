import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Map, User, Mail, Phone, MapPin, Building2, Link as LinkIcon, CreditCard, Leaf } from 'lucide-react';

export default function VerSocio() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [socio, setSocio] = useState<any>(null);
  const [fincas, setFincas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        // Cargar datos del socio y su grupo base
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

        // Cargar fincas
        const { data: fincasData, error: fincasError } = await supabase
          .from('fincas')
          .select('*')
          .eq('socio_id', id);

        if (fincasError) throw fincasError;
        setFincas(fincasData || []);

      } catch (error) {
        console.error('Error fetching socio details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-white">Cargando datos del socio...</div>;
  }

  if (!socio) {
    return <div className="p-10 text-center text-white">No se encontró la información del socio.</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <main className="max-w-4xl mx-auto p-6">
        
        {/* Encabezado con Botones de Acción */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link to="/socios" className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold">Perfil del Socio</h1>
          </div>
          <div className="flex gap-3">
            {socio.enlace_documentos && (
              <a 
                href={socio.enlace_documentos} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-md font-medium hover:bg-blue-500/30 transition-colors"
              >
                <LinkIcon className="h-4 w-4" />
                Ver Documentos
              </a>
            )}
            <Link 
              to={`/socios/editar/${socio.id}`}
              className="flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-md font-medium border border-neutral-700 hover:bg-neutral-700 transition-colors"
            >
              Editar Perfil
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Tarjeta Principal */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
              <div className="h-24 w-24 bg-amber-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-black" />
              </div>
              <h2 className="text-2xl font-bold">{socio.nombres} {socio.apellidos}</h2>
              <p className="text-amber-500 font-medium mt-1">
                {socio.codigo_socio ? `Cód: ${socio.codigo_socio}` : 'Sin Código'}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 rounded-full text-sm text-neutral-300 border border-neutral-700">
                <Building2 className="h-4 w-4" />
                {socio.grupos_base?.nombre || 'Sin Grupo'}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-700 text-left">
                <p className="text-sm text-neutral-400 mb-1">Cédula / RUC</p>
                <p className="font-medium">{socio.cedula}</p>
              </div>
            </div>

            {/* Info de Contacto */}
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-bold text-lg mb-4">Contacto</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-400">Teléfono</p>
                    <p>{socio.telefono || 'No registrado'}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-400">Correo Electrónico</p>
                    <p className="break-all">{socio.email || 'No registrado'}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-400">Dirección</p>
                    <p>{socio.direccion || 'No registrada'}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Detalles Adicionales y Fincas */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Tarjeta de Información Adicional */}
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-bold text-lg mb-4">Información Adicional</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-sm text-neutral-400">Género</p>
                  <p className="font-medium">{socio.genero || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Etnia / Pueblo</p>
                  <p className="font-medium">{socio.etnia || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Tipo de Cacao Principal</p>
                  <p className="font-medium flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-emerald-500" />
                    {socio.tipo_cacao || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Estado en la Asociación</p>
                  <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                    socio.estado === 'activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {socio.estado}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-700">
                <h4 className="flex items-center gap-2 font-bold mb-4">
                  <CreditCard className="h-5 w-5 text-amber-500" /> 
                  Datos Bancarios
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-neutral-400">Banco</p>
                    <p className="font-medium">{socio.banco_nombre || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Número de Cuenta</p>
                    <p className="font-medium">{socio.banco_cuenta || 'No registrado'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Fincas */}
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Map className="h-5 w-5 text-emerald-500" />
                  Fincas Asociadas ({fincas.length})
                </h3>
              </div>
              
              {fincas.length === 0 ? (
                <div className="text-center py-6 text-neutral-400 border border-dashed border-neutral-700 rounded-lg">
                  Este socio aún no tiene fincas registradas.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fincas.map(finca => (
                    <div key={finca.id} className="p-4 bg-neutral-900 border border-neutral-700 rounded-lg">
                      <h4 className="font-bold text-white mb-1">{finca.nombre}</h4>
                      <p className="text-sm text-neutral-400 mb-2">Hectáreas: {finca.hectareas_totales || 0}</p>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-800">
                        {finca.certificada ? (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                            Certificada
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-700 text-neutral-400 text-xs rounded-full">
                            No certificada
                          </span>
                        )}
                        
                        <Link 
                          to={`/fincas/editar/${finca.id}`}
                          className="text-xs text-amber-500 hover:text-amber-400"
                        >
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
