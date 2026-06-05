import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Plus, Loader2, ArrowLeft, Eye, CheckCircle2 } from 'lucide-react';

export default function ComprasList() {
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroSincronizado, setFiltroSincronizado] = useState('todos');

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      const { data, error } = await supabase
        .from('compras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompras(data || []);
    } catch (error) {
      console.error('Error fetching compras:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmarCompra = async (id: string, codigo: string) => {
    if (!window.confirm(`¿Seguro que deseas COMPLETAR la compra ${codigo}? Esto agregará los insumos a tu inventario físico.`)) return;
    
    try {
      const { error } = await supabase.from('compras').update({ estado: 'completado' }).eq('id', id);
      if (error) throw error;
      fetchCompras();
    } catch (error) {
      console.error(error);
      alert('Error al completar la compra.');
    }
  };

  const filteredCompras = compras.filter(c => {
    const matchSearch = (c.codigo_compra?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                        (c.proveedor_nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchSync = filtroSincronizado === 'todos' ? true : 
                      filtroSincronizado === 'pendientes' ? !c.sincronizado_contabilidad :
                      c.sincronizado_contabilidad;
    return matchSearch && matchSync;
  });

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-blue-500" />
              Compras e Ingreso de Insumos
            </h1>
            <p className="text-neutral-400 mt-1">Registra las compras a proveedores para aumentar el stock de bodega.</p>
          </div>
          <Link 
            to="/compras/nueva"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5" /> Nueva Compra
          </Link>
        </div>

        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar por código de compra o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-400">Estado Contable:</span>
            <select
              value={filtroSincronizado}
              onChange={(e) => setFiltroSincronizado(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="pendientes">Pendientes de Facturar</option>
              <option value="sincronizados">Ya Facturados</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-900/50 border-b border-neutral-700">
                    <th className="p-4 font-medium text-neutral-400">Código</th>
                    <th className="p-4 font-medium text-neutral-400">Fecha</th>
                    <th className="p-4 font-medium text-neutral-400">Proveedor</th>
                    <th className="p-4 font-medium text-neutral-400">Total</th>
                    <th className="p-4 font-medium text-neutral-400">Estado Logístico</th>
                    <th className="p-4 font-medium text-neutral-400">Estado Contable</th>
                    <th className="p-4 font-medium text-neutral-400">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                  {filteredCompras.map((compra) => (
                    <tr key={compra.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="p-4 font-mono text-sm text-blue-400">{compra.codigo_compra}</td>
                      <td className="p-4">{new Date(compra.fecha).toLocaleDateString()}</td>
                      <td className="p-4 font-medium">{compra.proveedor_nombre}</td>
                      <td className="p-4 font-bold text-emerald-400">${Number(compra.monto_total || 0).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                          compra.estado === 'completado' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          compra.estado === 'cancelado' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}>
                          {(compra.estado || 'borrador').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        {compra.sincronizado_contabilidad ? (
                          <div className="flex flex-col">
                            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> FACTURADO
                            </span>
                            <span className="text-neutral-500 text-xs font-mono">{compra.numero_factura_externa}</span>
                          </div>
                        ) : (
                          <span className="text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded">
                            PENDIENTE
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Link 
                            to={`/compras/${compra.id}`}
                            className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 text-sm bg-neutral-700/50 px-3 py-1.5 rounded-lg"
                          >
                            <Eye className="h-4 w-4" /> Detalle
                          </Link>
                          {compra.estado === 'borrador' && (
                            <button
                              onClick={() => confirmarCompra(compra.id, compra.codigo_compra)}
                              className="text-emerald-400 hover:bg-emerald-400/10 transition-colors flex items-center gap-1 text-sm border border-emerald-400/30 px-3 py-1.5 rounded-lg"
                            >
                              <CheckCircle2 className="h-4 w-4" /> Completar e Ingresar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCompras.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-neutral-500">
                        No se encontraron compras con los filtros actuales.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
