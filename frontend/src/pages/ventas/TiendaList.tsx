import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Sprout, ShoppingBag, Loader2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TiendaList() {
  const [productos, setProductos] = useState<any[]>([]);
  const [cacaoSeco, setCacaoSeco] = useState<any[]>([]);
  const [insumos, setInsumos] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTiendaData();
  }, []);

  const fetchTiendaData = async () => {
    setLoading(true);
    try {
      const [resProd, resInsumos] = await Promise.all([
        supabase.from('productos_catalogo').select('*, lotes(codigo_lote)').gt('stock_actual', 0).order('nombre'),
        supabase.from('insumos').select('*').in('categoria', ['fertilizante', 'herramienta', 'semilla', 'quimico']).gt('stock_disponible', 0).order('nombre')
      ]);

      if (resProd.data) {
        // Separar productos terminados (chocolate) de cacao en grano transferido
        const terminados = resProd.data.filter(p => p.lote_id == null);
        const cacaoEnGrano = resProd.data.filter(p => p.lote_id != null);
        
        setProductos(terminados);
        setCacaoSeco(cacaoEnGrano);
      }
      if (resInsumos.data) setInsumos(resInsumos.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = productos.filter(p => p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCacao = cacaoSeco.filter(c => c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || c.lotes?.codigo_lote?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredInsumos = insumos.filter(i => i.nombre?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-amber-500" /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-amber-500" />
            Tienda / Stock de Ventas
          </h1>
          <p className="text-neutral-400">Todo el inventario disponible para la venta agrupado en un solo lugar.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar disponibles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <Link 
            to="/ventas/nueva" 
            className="px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
          >
            Realizar Venta
          </Link>
        </div>
      </div>

      <div className="space-y-10">
        
        {/* SECCIÓN 1: PRODUCTOS TERMINADOS */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-neutral-700 pb-2">
            <Package className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white">Productos Terminados (Chocolate y Derivados)</h2>
            <span className="ml-2 px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-full text-xs font-medium">
              {filteredProductos.length}
            </span>
          </div>
          
          {filteredProductos.length === 0 ? (
            <p className="text-neutral-500 italic">No hay productos terminados disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProductos.map(p => (
                <div key={p.id} className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 hover:border-amber-500/50 transition-colors relative overflow-hidden">
                  {p.precio_venta != null && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">
                      ${p.precio_venta?.toFixed(2)}
                    </div>
                  )}
                  <h3 className="font-bold text-white pr-10 truncate" title={p.nombre}>{p.nombre}</h3>
                  <p className="text-xs text-neutral-400 capitalize mb-3 truncate">{p.descripcion || 'Producto'}</p>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-3xl font-black text-amber-500">{p.stock_actual}</span>
                    <span className="text-sm text-neutral-500 mb-1">{p.unidad_medida}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECCIÓN 2: CACAO SECO */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-neutral-700 pb-2">
            <Sprout className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-white">Cacao Seco (Lotes en Bodega)</h2>
            <span className="ml-2 px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-full text-xs font-medium">
              {filteredCacao.length}
            </span>
          </div>
          
          {filteredCacao.length === 0 ? (
            <p className="text-neutral-500 italic">No hay lotes de cacao seco transferidos a bodega.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCacao.map(c => (
                <div key={c.id} className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 hover:border-emerald-500/50 transition-colors relative overflow-hidden">
                  {c.precio_venta != null && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">
                      ${c.precio_venta?.toFixed(2)}
                    </div>
                  )}
                  <h3 className="font-bold text-white pr-10 truncate" title={c.nombre}>{c.nombre}</h3>
                  <p className="text-xs text-neutral-400 mb-3 truncate">Ref: {c.lotes?.codigo_lote || 'Lote de Acopio'}</p>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-3xl font-black text-emerald-500">{c.stock_actual}</span>
                    <span className="text-sm text-neutral-500 mb-1">{c.unidad_medida}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECCIÓN 3: INSUMOS AGRÍCOLAS */}
        <section>
          <div className="flex items-center gap-2 mb-4 border-b border-neutral-700 pb-2">
            <ShoppingBag className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Insumos Agrícolas (Para Socios / Público)</h2>
            <span className="ml-2 px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-full text-xs font-medium">
              {filteredInsumos.length}
            </span>
          </div>
          
          {filteredInsumos.length === 0 ? (
            <p className="text-neutral-500 italic">No hay insumos agrícolas disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredInsumos.map(i => (
                <div key={i.id} className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    ${i.precio_unitario?.toFixed(2)}
                  </div>
                  <h3 className="font-bold text-white pr-10">{i.nombre}</h3>
                  <p className="text-xs text-neutral-400 capitalize mb-3">{i.categoria}</p>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-3xl font-black text-blue-400">{i.stock_disponible}</span>
                    <span className="text-sm text-neutral-500 mb-1">{i.unidad_medida}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
