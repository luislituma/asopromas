import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Search, Plus, Loader2, ArrowLeft, Edit, Filter, Link as LinkIcon, Eye, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ListaSocios() {
  const [socios, setSocios] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState<string>('todos');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener Socios con su grupo base
      const { data: sociosData, error: sociosError } = await supabase
        .from('socios')
        .select(`
          *,
          grupos_base:grupo_id (nombre)
        `)
        .neq('estado', 'eliminado')
        .order('nombres', { ascending: true });

      if (sociosError) throw sociosError;
      
      // Obtener Grupos Base para el filtro
      const { data: gruposData, error: gruposError } = await supabase
        .from('grupos_base')
        .select('id, nombre')
        .order('nombre', { ascending: true });

      if (gruposError) throw gruposError;

      setSocios(sociosData || []);
      setGrupos(gruposData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSocios = socios.filter((socio) => {
    // Filtro por término de búsqueda (nombre, apellido o cédula)
    const matchesSearch = 
      socio.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.cedula.includes(searchTerm) ||
      (socio.codigo_socio && socio.codigo_socio.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // Filtro por grupo base
    const matchesGrupo = selectedGrupo === 'todos' || socio.grupo_id === selectedGrupo;

    return matchesSearch && matchesGrupo;
  });

  const totalActivos = filteredSocios.filter(s => s.estado === 'activo').length;
  const totalInactivos = filteredSocios.filter(s => s.estado === 'inactivo').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-900 print:bg-white text-white print:text-black">
      <main className="max-w-7xl mx-auto p-6 print:p-0">
        
        {/* Print Header (Only visible when printing) */}
        <div className="hidden print:block mb-8 text-center border-b border-gray-300 pb-4">
          <div className="flex justify-center mb-4">
            <img src="/logo-asopromas.svg" alt="Logo ASOPROMAS" className="h-16 w-auto grayscale" 
                 onError={(e) => { e.currentTarget.src = "/Logo-Asopromas-Completo.jpg"; }} />
          </div>
          <h1 className="text-2xl font-bold uppercase mb-2">Directorio de Socios</h1>
          <p className="text-gray-600">Asociación de Productores ASOPROMAS</p>
          <div className="mt-4 flex justify-center gap-8 text-sm font-medium">
            <span>Total: {filteredSocios.length}</span>
            <span>Activos: {totalActivos}</span>
            <span>Inactivos: {totalInactivos}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 print:hidden">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-amber-500" />
            Directorio de Socios
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-md font-medium border border-neutral-700 hover:bg-neutral-700 transition-colors"
            >
              <Printer className="h-5 w-5" />
              Imprimir
            </button>
            <Link 
              to="/socios/nuevo"
              className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-md font-medium hover:bg-amber-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nuevo Socio
            </Link>
          </div>
        </div>

        {/* Summary Cards (Web only) */}
        <div className="grid grid-cols-3 gap-4 mb-6 print:hidden">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
            <p className="text-neutral-400 text-sm">Total Filtrados</p>
            <p className="text-2xl font-bold text-white">{filteredSocios.length}</p>
          </div>
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
            <p className="text-neutral-400 text-sm">Activos</p>
            <p className="text-2xl font-bold text-emerald-400">{totalActivos}</p>
          </div>
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
            <p className="text-neutral-400 text-sm">Inactivos</p>
            <p className="text-2xl font-bold text-red-400">{totalInactivos}</p>
          </div>
        </div>

        <div className="bg-neutral-800 print:bg-transparent rounded-xl border border-neutral-700 print:border-none print:shadow-none overflow-hidden">
          <div className="p-4 border-b border-neutral-700 print:hidden flex flex-col md:flex-row gap-4">
            
            {/* Buscador de texto */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código, cédula o nombres..."
                className="block w-full pl-10 bg-neutral-900 border border-neutral-600 rounded-md py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            {/* Filtro por Grupo Base */}
            <div className="relative min-w-[250px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-neutral-500" />
              </div>
              <select
                value={selectedGrupo}
                onChange={(e) => setSelectedGrupo(e.target.value)}
                className="block w-full pl-10 bg-neutral-900 border border-neutral-600 rounded-md py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none"
              >
                <option value="todos">Todos los grupos base</option>
                {grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.nombre}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-amber-500" />
            </div>
          ) : filteredSocios.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">
              {socios.length === 0 
                ? 'No hay socios registrados todavía.' 
                : 'No se encontraron socios que coincidan con la búsqueda.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-900/50 print:bg-gray-100 text-neutral-400 print:text-black text-sm uppercase">
                  <tr>
                    <th className="px-6 py-3 print:px-2 print:py-2 font-medium print:hidden">Código</th>
                    <th className="px-6 py-3 print:px-2 print:py-2 font-medium">Cédula</th>
                    <th className="px-6 py-3 print:px-2 print:py-2 font-medium">Nombres Completos</th>
                    <th className="px-6 py-3 print:px-2 print:py-2 font-medium">Grupo Base</th>
                    <th className="px-6 py-3 print:px-2 print:py-2 font-medium">Teléfono</th>
                    {/* Nuevas columnas solo para impresión */}
                    <th className="hidden print:table-cell px-2 py-2 font-medium">Dirección</th>
                    <th className="hidden print:table-cell px-2 py-2 font-medium">Correo</th>
                    <th className="hidden print:table-cell px-2 py-2 font-medium">Género</th>
                    <th className="hidden print:table-cell px-2 py-2 font-medium">Etnia</th>
                    
                    <th className="px-6 py-3 print:px-2 print:py-2 font-medium">Estado</th>
                    <th className="px-6 py-3 print:px-2 print:py-2 font-medium text-right print:hidden">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700 print:divide-gray-300">
                  {filteredSocios.map((socio) => (
                    <tr key={socio.id} className="hover:bg-neutral-750 print:hover:bg-transparent transition-colors">
                      <td className="px-6 py-4 print:px-2 print:py-2 print:hidden">
                        {socio.codigo_socio ? (
                          <span className="font-medium text-amber-500 print:text-black">{socio.codigo_socio}</span>
                        ) : (
                          <span className="text-neutral-500 print:text-gray-500 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 print:px-2 print:py-2">{socio.cedula}</td>
                      <td className="px-6 py-4 print:px-2 print:py-2 font-medium text-white print:text-black">
                        <div className="flex items-center gap-2">
                          {socio.nombres} {socio.apellidos}
                          {socio.enlace_documentos && (
                            <a 
                              href={socio.enlace_documentos} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 print:hidden transition-colors"
                              title="Ver Documentos"
                            >
                              <LinkIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 print:px-2 print:py-2 text-neutral-300 print:text-black">
                        {socio.grupos_base?.nombre ? (
                          <span className="px-2.5 py-1 bg-neutral-900 print:bg-transparent print:border-none print:p-0 text-neutral-300 print:text-black rounded-md text-sm border border-neutral-700">
                            {socio.grupos_base.nombre}
                          </span>
                        ) : (
                          <span className="text-neutral-500 print:text-gray-500 italic text-sm">Sin asignar</span>
                        )}
                      </td>
                      <td className="px-6 py-4 print:px-2 print:py-2 text-neutral-300 print:text-black">{socio.telefono || 'N/A'}</td>
                      
                      {/* Celdas nuevas solo para impresión */}
                      <td className="hidden print:table-cell px-2 py-2 text-black text-sm">{socio.direccion || 'N/A'}</td>
                      <td className="hidden print:table-cell px-2 py-2 text-black text-sm">{socio.email || 'N/A'}</td>
                      <td className="hidden print:table-cell px-2 py-2 text-black text-sm">{socio.genero || 'N/A'}</td>
                      <td className="hidden print:table-cell px-2 py-2 text-black text-sm">{socio.etnia || 'N/A'}</td>

                      <td className="px-6 py-4 print:px-2 print:py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider print:border print:bg-transparent ${
                          socio.estado === 'activo' ? 'bg-emerald-500/20 text-emerald-400 print:text-emerald-700 print:border-emerald-500' : 'bg-red-500/20 text-red-400 print:text-red-700 print:border-red-500'
                        }`}>
                          {socio.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 print:hidden text-right">
                        <div className="flex justify-end gap-3">
                          <Link to={`/socios/ver/${socio.id}`} className="text-neutral-400 hover:text-emerald-500 transition-colors" title="Ver Perfil">
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link to={`/socios/editar/${socio.id}`} className="text-neutral-400 hover:text-amber-500 transition-colors" title="Editar">
                            <Edit className="h-5 w-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
