// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Users, Search, Plus, Loader2, ArrowLeft, Edit, MapPin, Phone, Mail, Trash2, RotateCcw, Eye } from 'lucide-react';

export default function ClientesList() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<{id: string, nombre: string} | null>(null);
  const [softDeletePrompt, setSoftDeletePrompt] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .neq('tipo_cliente', 'socio')
        .order('nombre_razon_social');

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, nombre: string) => {
    setClientToDelete({ id, nombre });
    setSoftDeletePrompt(false);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    try {
      const { error } = await supabase.from('clientes').delete().eq('id', clientToDelete.id);
      if (error) {
        if (error.code === '23503') {
           setSoftDeletePrompt(true);
        } else {
           alert('Error al eliminar: ' + error.message);
           setDeleteModalOpen(false);
        }
      } else {
        fetchClientes();
        setDeleteModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error inesperado al intentar eliminar el cliente.');
      setDeleteModalOpen(false);
    }
  };

  const confirmSoftDelete = async () => {
    if (!clientToDelete) return;
    try {
       const { error: updErr } = await supabase.from('clientes').update({ estado: 'inactivo' }).eq('id', clientToDelete.id);
       if (updErr) alert('Error al desactivar: ' + updErr.message);
       else fetchClientes();
    } finally {
       setDeleteModalOpen(false);
       setSoftDeletePrompt(false);
    }
  };

  const handleRestore = async (id: string, nombre: string) => {
    try {
      const { error } = await supabase.from('clientes').update({ estado: 'activo' }).eq('id', id);
      if (error) {
        alert('Error al reactivar cliente: ' + error.message);
      } else {
        fetchClientes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredClientes = clientes.filter(c => 
    c.nombre_razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.identificacion && c.identificacion.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-amber-500" />
              Directorio de Clientes
            </h1>
            <p className="text-neutral-400 mt-1">Gestión de distribuidores, tiendas, exportadores y clientes finales.</p>
          </div>
          <Link 
            to="/ventas/clientes/nuevo"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nuevo Cliente
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
                placeholder="Buscar por nombre o RUC/CI..."
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
          ) : filteredClientes.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">
              <p>No se encontraron clientes.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-900/50 text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nombre / Razón Social</th>
                    <th className="px-6 py-4 font-medium">Tipo</th>
                    <th className="px-6 py-4 font-medium">Contacto</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {filteredClientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-neutral-700/20">
                      <td className="px-6 py-4">
                        <Link to={`/ventas/clientes/ver/${cliente.id}`} className="font-bold text-white hover:text-amber-500 transition-colors block">
                          {cliente.nombre_razon_social}
                        </Link>
                        <div className="text-xs text-neutral-500">{cliente.identificacion || 'Sin ID'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-amber-400 font-medium px-2 py-1 bg-amber-500/10 rounded-md border border-amber-500/20">
                          {cliente.tipo_cliente}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-y-1 text-xs">
                        {cliente.telefono && <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {cliente.telefono}</div>}
                        {cliente.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {cliente.email}</div>}
                        {cliente.direccion && <div className="flex items-center gap-2 text-neutral-500"><MapPin className="h-3 w-3" /> {cliente.direccion}</div>}
                        {!cliente.telefono && !cliente.email && <span className="text-neutral-600">Sin datos de contacto</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${cliente.estado === 'activo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {cliente.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <Link to={`/ventas/clientes/ver/${cliente.id}`} className="text-neutral-400 hover:text-emerald-500 transition-colors p-2 inline-block" title="Ver Perfil">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link to={`/ventas/clientes/editar/${cliente.id}`} className="text-neutral-400 hover:text-amber-500 transition-colors p-2 inline-block" title="Editar Cliente">
                          <Edit className="h-4 w-4" />
                        </Link>
                        {cliente.estado === 'activo' ? (
                          <button 
                            onClick={() => handleDeleteClick(cliente.id, cliente.nombre_razon_social)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-2 inline-block"
                            title="Eliminar / Desactivar Cliente"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRestore(cliente.id, cliente.nombre_razon_social)}
                            className="text-neutral-400 hover:text-emerald-500 transition-colors p-2 inline-block"
                            title="Restaurar / Activar Cliente"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Custom Delete Modal */}
      {deleteModalOpen && clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {!softDeletePrompt ? (
              <>
                <div className="flex items-center gap-3 mb-4 text-red-500">
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <Trash2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Eliminar Cliente</h3>
                </div>
                <p className="text-neutral-400 mb-6">
                  ¿Estás seguro de que deseas eliminar permanentemente a <strong className="text-white">{clientToDelete.nombre}</strong>? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 text-neutral-400 hover:text-white font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors"
                  >
                    Eliminar Permanentemente
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4 text-amber-500">
                  <div className="p-3 bg-amber-500/10 rounded-full">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Ventas Asociadas</h3>
                </div>
                <p className="text-neutral-300 mb-6">
                  El cliente <strong className="text-white">{clientToDelete.nombre}</strong> tiene ventas u operaciones previas. Para proteger el historial contable, el sistema no permite borrarlo.
                  <br/><br/>
                  ¿Deseas marcarlo como <strong className="text-amber-400">Inactivo</strong> para ocultarlo de tu directorio?
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 text-neutral-400 hover:text-white font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={confirmSoftDelete}
                    className="px-4 py-2 bg-amber-500 text-black rounded-md font-medium hover:bg-amber-600 transition-colors"
                  >
                    Desactivar Cliente
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
