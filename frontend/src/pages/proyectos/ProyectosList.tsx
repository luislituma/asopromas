import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Loader2, ArrowLeft, Edit, DollarSign } from 'lucide-react';

export default function ProyectosList() {
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProyectos(data || []);
    } catch (error) {
      console.error('Error fetching proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-amber-500" />
              Gestión de Proyectos
            </h1>
            <p className="text-neutral-400 mt-1">Control de fondos, presupuestos y estado de proyectos de ASOPROMAS.</p>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/capacitaciones"
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white font-medium rounded-md hover:bg-neutral-700 transition-colors border border-neutral-700"
            >
              Ver Capacitaciones
            </Link>
            <Link 
              to="/proyectos/nuevo"
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nuevo Proyecto
            </Link>
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-amber-500" />
            </div>
          ) : proyectos.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">
              <p>No se encontraron proyectos registrados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-900/50 text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nombre del Proyecto</th>
                    <th className="px-6 py-4 font-medium">Presupuesto ($)</th>
                    <th className="px-6 py-4 font-medium">Período</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {proyectos.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-700/20">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{p.nombre}</div>
                        <div className="text-xs text-neutral-500 truncate max-w-xs">{p.descripcion}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-amber-500 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> {p.presupuesto_asignado}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {p.fecha_inicio ? new Date(p.fecha_inicio).toLocaleDateString() : 'N/A'} - 
                        {p.fecha_fin ? new Date(p.fecha_fin).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`capitalize font-medium px-2 py-1 rounded-md text-xs ${
                          p.estado === 'activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          p.estado === 'finalizado' ? 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/proyectos/editar/${p.id}`} className="text-neutral-400 hover:text-amber-500 transition-colors p-2 inline-block">
                          <Edit className="h-4 w-4" />
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
