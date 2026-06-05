import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Package, Search, Plus, Loader2, ArrowLeft, Edit } from 'lucide-react';

export default function ProductosList() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const { data, error } = await supabase
        .from('productos_catalogo')
        .select(`
          *,
          recetas ( id, nombre_receta, rendimiento_estandar )
        `)
        .order('nombre');

      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      console.error('Error fetching productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = productos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Package className="h-8 w-8 text-amber-500" />
              Recetas
            </h1>
            <p className="text-neutral-400 mt-1">Catálogo de recetas y fórmulas de elaboración de productos.</p>
          </div>
          <Link 
            to="/procesamiento/producto/nuevo"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nuevo Producto
          </Link>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 bg-neutral-900 border border-neutral-700 rounded-md py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-amber-500" />
            </div>
          ) : filteredProductos.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">
              <p>No se encontraron productos en el catálogo.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-900/50 text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nombre del Producto</th>
                    <th className="px-6 py-4 font-medium">Unidad</th>
                    <th className="px-6 py-4 font-medium">Stock Final</th>
                    <th className="px-6 py-4 font-medium">Fórmula / Receta Activa</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {filteredProductos.map((prod) => (
                    <tr key={prod.id} className="hover:bg-neutral-700/20">
                      <td className="px-6 py-4 font-medium text-white">{prod.nombre}</td>
                      <td className="px-6 py-4 text-neutral-400 capitalize">{prod.unidad_medida}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full font-bold">
                          {prod.stock_actual}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {prod.recetas && prod.recetas.length > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-emerald-400 font-medium">
                              {prod.recetas[0].nombre_receta}
                            </span>
                            <span className="text-xs text-neutral-500">
                              Rinde: {prod.recetas[0].rendimiento_estandar} {prod.unidad_medida}s
                            </span>
                          </div>
                        ) : (
                          <span className="text-neutral-500 text-xs italic">Sin receta definida</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/procesamiento/producto/editar/${prod.id}`} className="text-neutral-400 hover:text-amber-500 transition-colors p-2">
                          <Edit className="h-4 w-4 inline" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
