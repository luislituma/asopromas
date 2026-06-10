import type { ReporteOptions } from './ReporteModal';

interface SocioPrintViewProps {
  socio: any;
  fincas: any[];
  options: ReporteOptions;
}

export default function SocioPrintView({ socio, fincas, options }: SocioPrintViewProps) {
  if (!socio) return null;

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isCertificada = fincas.some(f => 
    f.lotes_finca && f.lotes_finca.some((l: any) => l.coord_x || l.coord_y)
  );

  return (
    <div className="hidden print:block absolute top-0 left-0 w-full min-h-screen bg-white z-[9999] px-8 py-10 font-sans text-black">
      
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
            
            {fincas.length === 0 ? (
              <p className="text-sm italic text-gray-500">El socio no tiene fincas registradas.</p>
            ) : (
              <div className="space-y-6">
                {fincas.map((finca, index) => (
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
                <h4 className="font-bold text-sm mb-3">Certificación Orgánica</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado de Certificación:</span>
                    <span className={`font-bold ${isCertificada ? 'text-black' : 'text-gray-500'}`}>
                      {isCertificada ? 'Certificación Orgánica' : 'No Certificado'}
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
