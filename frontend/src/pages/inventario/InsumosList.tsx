import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Search, Plus, Loader2, ArrowLeft, Edit, Trash2, ArrowDownToLine, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function InsumosList() {
  const { tipo } = useParams(); // 'agricolas' o 'industriales'
  const { user } = useAuth();
  const [insumos, setInsumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Kardex Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<any>(null);
  const [restockAmount, setRestockAmount] = useState('');
  const [restockNotes, setRestockNotes] = useState('');
  const [savingRestock, setSavingRestock] = useState(false);

  useEffect(() => {
    fetchInsumos();
  }, [tipo]);

  const fetchInsumos = async () => {
    setLoading(true);
    try {
      let query = supabase.from('insumos').select('*').order('nombre', { ascending: true });
      
      if (tipo === 'agricolas') {
        query = query.in('categoria', ['fertilizante', 'herramienta', 'semilla', 'quimico']);
      } else if (tipo === 'industriales') {
        query = query.in('categoria', ['ingrediente', 'empaque']);
      }

      const { data, error } = await query;

      if (error) throw error;
      setInsumos(data || []);
    } catch (error) {
      console.error('Error fetching insumos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInsumo || !user) return;
    setSavingRestock(true);
    
    try {
      const { error } = await supabase.from('transacciones_insumos').insert([{
        insumo_id: selectedInsumo.id,
        tipo_transaccion: 'entrada',
        cantidad: parseFloat(restockAmount),
        responsable_id: user.id,
        notas: restockNotes || 'Reabastecimiento manual'
      }]);
      
      if (error) throw error;
      
      alert('Inventario actualizado con éxito');
      setShowModal(false);
      setRestockAmount('');
      setRestockNotes('');
      fetchInsumos(); // Refresh table
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar inventario');
    } finally {
      setSavingRestock(false);
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'fertilizante': return 'bg-emerald-500/20 text-emerald-400';
      case 'herramienta': return 'bg-amber-500/20 text-amber-400';
      case 'semilla': return 'bg-green-500/20 text-green-400';
      case 'quimico': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-neutral-500/20 text-neutral-400';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Package className="h-8 w-8 text-amber-500" />
              {tipo === 'agricolas' ? 'Insumos Agrícolas' : tipo === 'industriales' ? 'Insumos Industriales' : 'Inventario de Insumos'}
            </h1>
            <p className="text-neutral-400 mt-1">
              {tipo === 'agricolas' 
                ? 'Suministros para entrega o crédito a productores.' 
                : 'Ingredientes y empaques para procesamiento de derivados.'}
            </p>
          </div>
          
          <div className="flex gap-3">
            {tipo === 'agricolas' && (
              <Link 
                to="/insumos/entregas"
                className="px-4 py-2 border border-amber-500 text-amber-500 font-medium rounded-md hover:bg-amber-500/10 transition-colors"
              >
                Entregar Insumo a Socio
              </Link>
            )}
            <Link 
              to={`/insumos/${tipo}/nuevo`}
              className="px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nuevo Insumo
            </Link>
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-neutral-700 flex justify-between items-center bg-neutral-800/50">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                className="block w-full pl-10 bg-neutral-900 border border-neutral-700 rounded-md py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-amber-500" />
            </div>
          ) : insumos.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">
              <Package className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
              <p>No hay insumos en esta categoría.</p>
              <Link to={`/insumos/${tipo}/nuevo`} className="text-amber-500 hover:underline mt-2 inline-block">Registrar el primer insumo</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="text-xs uppercase bg-neutral-900/50 text-neutral-400 border-b border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 font-medium">Código</th>
                    <th className="px-6 py-4 font-medium">Producto</th>
                    <th className="px-6 py-4 font-medium">Categoría</th>
                    <th className="px-6 py-4 font-medium">Stock Disp.</th>
                    <th className="px-6 py-4 font-medium">Precio Unit.</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {insumos.map((insumo) => (
                    <tr key={insumo.id} className="hover:bg-neutral-700/20 transition-colors">
                      <td className="px-6 py-4 text-neutral-500 font-mono">{insumo.codigo || 'S/C'}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{insumo.nombre}</p>
                        {insumo.descripcion && <p className="text-xs text-neutral-500 truncate max-w-xs">{insumo.descripcion}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getCategoriaColor(insumo.categoria)}`}>
                          {insumo.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${insumo.stock_disponible <= 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {insumo.stock_disponible}
                        </span> <span className="text-xs text-neutral-500">{insumo.unidad_medida}</span>
                      </td>
                      <td className="px-6 py-4 font-medium">${insumo.precio_unitario}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedInsumo(insumo);
                            setShowModal(true);
                          }}
                          className="text-neutral-400 hover:text-emerald-500 p-2 transition-colors bg-neutral-800 rounded-lg border border-neutral-700" 
                          title="Ingresar Stock (Compra)"
                        >
                          <ArrowDownToLine className="h-4 w-4" />
                        </button>
                        <button className="text-neutral-400 hover:text-amber-500 p-2 transition-colors bg-neutral-800 rounded-lg border border-neutral-700" title="Editar">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-neutral-400 hover:text-red-500 p-2 transition-colors bg-neutral-800 rounded-lg border border-neutral-700" title="Inactivar">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Reabastecimiento */}
      {showModal && selectedInsumo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full max-w-md relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-2">Ingresar Stock</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Producto: <span className="text-emerald-400 font-bold">{selectedInsumo.nombre}</span> 
              <br />Stock Actual: {selectedInsumo.stock_disponible} {selectedInsumo.unidad_medida}
            </p>
            
            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Cantidad Comprada / Ingresada *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="Ej. 50"
                  />
                  <span className="text-neutral-400">{selectedInsumo.unidad_medida}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-2 block">
                  Notas / Factura (Opcional)
                </label>
                <input
                  type="text"
                  value={restockNotes}
                  onChange={(e) => setRestockNotes(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Ej. Factura #1234 Proveedor XYZ"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingRestock}
                  className="flex-1 px-4 py-2.5 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                >
                  {savingRestock ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDownToLine className="h-4 w-4" />}
                  Confirmar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
