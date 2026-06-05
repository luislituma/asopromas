import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { StatCard } from '../../components/ui/StatCard';
import { Users, Map, Calendar, TrendingUp, Package, DollarSign, Archive, Factory, ShoppingCart, Sprout, Briefcase, ChevronLeft, ChevronRight, Settings, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const modules = [
  { path: '/socios', icon: Users, title: 'Administrar Socios', desc: 'Gestión de los miembros de la asociación, registro y perfiles.', color: 'text-blue-500', hoverBorder: 'hover:border-blue-500' },
  { path: '/grupos', icon: Users, title: 'Grupos Base', desc: 'Organización territorial de la asociación y sus líderes.', color: 'text-amber-500', hoverBorder: 'hover:border-amber-500' },
  { path: '/fincas', icon: Map, title: 'Directorio de Fincas', desc: 'Geolocalización, hectáreas cultivadas y control de certificaciones.', color: 'text-emerald-500', hoverBorder: 'hover:border-emerald-500' },
  { path: '/acopio', icon: TrendingUp, title: 'Acopio de Cacao', desc: 'Gestiona recolecciones, registra entregas y administra lotes.', color: 'text-amber-500', hoverBorder: 'hover:border-amber-500' },
  { path: '/lotes', icon: Package, title: 'Lotes y Trazabilidad', desc: 'Gestión de lotes de cacao y preparación para procesamiento o exportación.', color: 'text-amber-500', hoverBorder: 'hover:border-amber-500' },
  { path: '/procesamiento/productos', icon: Factory, title: 'Recetas', desc: 'Catálogo de recetas y fórmulas de elaboración de productos.', color: 'text-amber-500', hoverBorder: 'hover:border-amber-500' },
  { path: '/procesamiento/ordenes', icon: Settings, title: 'Órdenes de Producción', desc: 'Transformación de lotes de cacao en productos derivados.', color: 'text-amber-500', hoverBorder: 'hover:border-amber-500' },
  { path: '/ventas', icon: ShoppingCart, title: 'Gestión de Ventas', desc: 'Venta de lotes crudos o derivados, clientes y facturación.', color: 'text-emerald-500', hoverBorder: 'hover:border-emerald-500' },
  { path: '/insumos', icon: Archive, title: 'Inventario e Insumos', desc: 'Gestión de fertilizantes y entrega de insumos a crédito.', color: 'text-purple-500', hoverBorder: 'hover:border-purple-500' },
  { path: '/compras', icon: ShoppingBag, title: 'Compras de Insumos', desc: 'Ingreso de inventario comprado a proveedores y su facturación.', color: 'text-blue-500', hoverBorder: 'hover:border-blue-500' },
  { path: '/pagos', icon: DollarSign, title: 'Liquidación de Pagos', desc: 'Pagos por cacao, aplicando descuentos automáticos por deudas.', color: 'text-emerald-500', hoverBorder: 'hover:border-emerald-500' },
  { path: '/campo/visitas', icon: Sprout, title: 'Asistencia Técnica', desc: 'Programación de visitas a fincas, checklists de plagas y orgánico.', color: 'text-green-500', hoverBorder: 'hover:border-green-500' },
  { path: '/proyectos', icon: Briefcase, title: 'Proyectos y Capacitaciones', desc: 'Gestión de proyectos, talleres y asistencia de socios.', color: 'text-blue-500', hoverBorder: 'hover:border-blue-500' }
];

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSocios: 0,
    totalFincas: 0,
    visitasPendientes: 0
  });
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [sociosRes, fincasRes, visitasRes] = await Promise.all([
          supabase.from('socios').select('id', { count: 'exact', head: true }).neq('estado', 'eliminado'),
          supabase.from('fincas').select('id', { count: 'exact', head: true }).neq('estado', 'eliminado'),
          supabase.from('visitas_campo').select('id', { count: 'exact', head: true }).eq('estado', 'programada')
        ]);

        setStats({
          totalSocios: sociosRes.count || 0,
          totalFincas: fincasRes.count || 0,
          visitasPendientes: visitasRes.count || 0
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Resumen General</h2>
          <p className="text-neutral-400">Panel de control administrativo</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="h-32 bg-neutral-800 rounded-xl w-full"></div>
          <div className="h-32 bg-neutral-800 rounded-xl w-full"></div>
          <div className="h-32 bg-neutral-800 rounded-xl w-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Socios Activos"
            value={stats.totalSocios}
            icon={Users}
            colorClass="text-blue-400"
          />
          <StatCard
            title="Fincas Registradas"
            value={stats.totalFincas}
            icon={Map}
            colorClass="text-green-400"
          />
          <StatCard
            title="Visitas Pendientes"
            value={stats.visitasPendientes}
            icon={Calendar}
            colorClass="text-amber-400"
          />
          <StatCard
            title="Cosecha Estimada"
            value="-- kg"
            description="Módulo en desarrollo"
            icon={TrendingUp}
            colorClass="text-purple-400"
          />
        </div>
      )}

      {/* Carrusel de Funcionalidades */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Módulos del Sistema</h3>
          <div className="flex gap-2">
            <button 
              onClick={scrollLeft}
              className="p-2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={scrollRight}
              className="p-2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 hide-scrollbar [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {modules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <Link 
                  key={idx} 
                  to={mod.path} 
                  className={`min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] snap-center bg-neutral-800 border border-neutral-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center ${mod.hoverBorder} transition-colors group shrink-0`}
                >
                  <div className="h-16 w-16 bg-neutral-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className={`h-8 w-8 ${mod.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{mod.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {mod.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
