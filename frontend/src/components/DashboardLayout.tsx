import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Users, Factory, ShoppingCart,
  Sprout, Briefcase, Archive, DollarSign, LogOut,
  Menu, X, ChevronDown, ChevronRight, User
} from 'lucide-react';

export default function DashboardLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    socios: false,
    acopio: false,
    procesamiento: false,
    ventas: false,
    campo: false,
    proyectos: false,
    inventario: false,
    pagos: false
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const menuGroups = [
    {
      id: 'socios',
      label: 'Socios',
      icon: <Users className="h-5 w-5" />,
      items: [
        { label: 'Directorio', path: '/socios' },
        { label: 'Grupos Base', path: '/grupos' },
        { label: 'Fincas', path: '/fincas' }
      ]
    },
    {
      id: 'acopio',
      label: 'Acopio',
      icon: <Archive className="h-5 w-5" />,
      items: [
        { label: 'Registros de Acopio', path: '/acopio' },
        { label: 'Gestión de Lotes', path: '/lotes' }
      ]
    },
    {
      id: 'procesamiento',
      label: 'Procesamiento',
      icon: <Factory className="h-5 w-5" />,
      items: [
        { label: 'Recetas', path: '/procesamiento/productos' },
        { label: 'Órdenes de Producción', path: '/procesamiento/ordenes' }
      ]
    },
    {
      id: 'ventas',
      label: 'Ventas',
      icon: <ShoppingCart className="h-5 w-5" />,
      items: [
        { label: 'Tienda / Stock de Ventas', path: '/ventas/tienda' },
        { label: 'Ventas Realizadas', path: '/ventas' },
        { label: 'Directorio de Clientes', path: '/ventas/clientes' }
      ]
    },
    {
      id: 'campo',
      label: 'Asistencia Técnica',
      icon: <Sprout className="h-5 w-5" />,
      items: [
        { label: 'Visitas de Campo', path: '/campo/visitas' }
      ]
    },
    {
      id: 'proyectos',
      label: 'Proyectos',
      icon: <Briefcase className="h-5 w-5" />,
      items: [
        { label: 'Gestión de Proyectos', path: '/proyectos' },
        { label: 'Capacitaciones', path: '/capacitaciones' }
      ]
    },
    {
      id: 'bodegas',
      label: 'Bodegas',
      icon: <Archive className="h-5 w-5" />,
      items: [
        { label: 'Bodega Industrial (Ingredientes/Empaques)', path: '/insumos/industriales' },
        { label: 'Bodega Agrícola (Campo)', path: '/insumos/agricolas' },
        { label: 'Entregas a Socios', path: '/insumos/entregas' }
      ]
    },
    {
      id: 'inventario_activos',
      label: 'Inventario (Activos Fijos)',
      icon: <LayoutDashboard className="h-5 w-5" />,
      items: [
        { label: 'Equipos y Maquinaria', path: '/inventario/equipos' }
      ]
    },
    {
      id: 'pagos',
      label: 'Contabilidad y Pagos',
      icon: <DollarSign className="h-5 w-5" />,
      items: [
        { label: 'Liquidaciones', path: '/pagos' },
        { label: 'Compras de Insumos', path: '/compras' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-900 flex text-white overflow-hidden">

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        print:hidden
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-neutral-950 border-r border-neutral-800 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800 bg-neutral-950">
          <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <img src="/logo-asopromas.svg" alt="Logo" className="h-8 w-auto"
              onError={(e) => { e.currentTarget.src = "/Logo-Asopromas-Completo.jpg"; }} />
            <span className="font-bold text-amber-500 tracking-tight">ASOPROMAS</span>
          </Link>
          <button className="md:hidden text-neutral-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="px-3 space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-amber-500 text-black' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5" />
              Inicio (Dashboard)
            </Link>

            <div className="my-4 border-t border-neutral-800/50"></div>

            {menuGroups.map((group) => {
              const isActive = group.items.some(item => location.pathname.startsWith(item.path));
              const isOpen = openMenus[group.id] || isActive;

              return (
                <div key={group.id} className="mb-1">
                  <button
                    onClick={() => toggleMenu(group.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive ? 'text-amber-500' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-amber-500' : 'text-neutral-400'}>
                        {group.icon}
                      </span>
                      {group.label}
                    </div>
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>

                  {isOpen && (
                    <div className="mt-1 ml-9 space-y-1 border-l-2 border-neutral-800 pl-2 py-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'))
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                            }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 space-y-2">
          <Link
            to="/perfil"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium transition-colors ${location.pathname === '/perfil' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
          >
            <User className="h-5 w-5" />
            Mi Perfil
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium text-neutral-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-900 print:bg-white print:text-black">
        {/* Mobile Header */}
        <header className="print:hidden md:hidden h-16 flex items-center justify-between px-4 border-b border-neutral-800 bg-neutral-950 shrink-0">
          <div className="flex items-center gap-2">
            <img src="/logo-asopromas.svg" alt="Logo" className="h-8 w-auto"
              onError={(e) => { e.currentTarget.src = "/Logo-Asopromas-Completo.jpg"; }} />
          </div>
          <button
            className="text-neutral-400 hover:text-white p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto print:overflow-visible">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
