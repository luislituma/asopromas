import { type FC, useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, X, ChevronDown, ShoppingBag } from 'lucide-react';
import logoUrl from '../assets/icons/logo.svg';

type SubmenuItem = { to: string; text: string };
type SubmenuSection = { title: string; items: SubmenuItem[] };
type NavItem = { to: string; text: string; submenu?: SubmenuSection[] };

const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenuProducts, setOpenSubmenuProducts] = useState(false);
    const [openSubmenuAbout, setOpenSubmenuAbout] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [submenuTimeout, setSubmenuTimeout] = useState<NodeJS.Timeout | null>(null);
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
        setOpenSubmenuProducts(false);
        setOpenSubmenuAbout(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.mega-menu') && !target.closest('.nav-item')) {
                setOpenSubmenuProducts(false);
                setOpenSubmenuAbout(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Función para manejar la apertura de submenús
    const handleSubmenuEnter = (menuType: 'products' | 'about') => {
        // Limpiar cualquier timeout pendiente
        if (submenuTimeout) {
            clearTimeout(submenuTimeout);
            setSubmenuTimeout(null);
        }

        if (menuType === 'products') {
            setOpenSubmenuProducts(true);
            setOpenSubmenuAbout(false);
        } else {
            setOpenSubmenuAbout(true);
            setOpenSubmenuProducts(false);
        }
    };

    // Función para manejar el cierre de submenús con delay
    const handleSubmenuLeave = (menuType: 'products' | 'about') => {
        const timeout = setTimeout(() => {
            if (menuType === 'products') {
                setOpenSubmenuProducts(false);
            } else {
                setOpenSubmenuAbout(false);
            }
        }, 200); // Delay de 200ms para permitir navegar cómodamente

        setSubmenuTimeout(timeout);
    };

    const navLinks: NavItem[] = [
        { to: '/', text: 'Inicio' },
        {
            to: '/about',
            text: 'Nosotros',
            submenu: [
                {
                    title: 'Nuestra Historia',
                    items: [
                        { to: '/about/history', text: 'Historia de ASOPROMAS' },
                        { to: '/about/mission', text: 'Misión y Visión' },
                        { to: '/about/values', text: 'Valores' },
                    ],
                },
                {
                    title: 'Comunidad',
                    items: [
                        { to: '/about/producers', text: 'Nuestros Productores' },
                        { to: '/about/sustainability', text: 'Sostenibilidad' },
                        { to: '/about/certifications', text: 'Certificaciones' },
                    ],
                },
            ],
        },
        {
            to: '/products',
            text: 'Productos',
            submenu: [
                {
                    title: 'Barras de Chocolate',
                    items: [
                        { to: '/products/pure-chocolate-bar', text: 'Barra de Chocolate 100%' },
                        { to: '/products/chocolate-nibs-salt', text: 'Chocolate con Nibs y Sal' },
                        { to: '/products/chocolate-coffee', text: 'Chocolate con Café' },
                    ],
                },
                {
                    title: 'Dulces y Bebidas',
                    items: [
                        { to: '/products/fruit-bonbons', text: 'Bombones con Frutas' },
                        { to: '/products/cacao-nibs', text: 'Nibs Naturales de Cacao' },
                        { to: '/products/cacao-liqueur', text: 'Licor Dulce de Cacao' },
                        { to: '/products/cacao-cocktail', text: 'Cóctel de Cacao' },
                    ],
                },
            ],
        },
        { to: '/contact', text: 'Contacto' },
    ];

    // Datos demo para el buscador
    const allItems = [
        { name: 'Barra de Chocolate 100%', type: 'Producto', to: '/products/pure-chocolate-bar' },
        { name: 'Chocolate con Nibs y Sal', type: 'Producto', to: '/products/chocolate-nibs-salt' },
        { name: 'Chocolate con Café', type: 'Producto', to: '/products/chocolate-coffee' },
        { name: 'Bombones con Frutas', type: 'Producto', to: '/products/fruit-bonbons' },
        { name: 'Nibs Naturales de Cacao', type: 'Producto', to: '/products/cacao-nibs' },
        { name: 'Licor Dulce de Cacao', type: 'Producto', to: '/products/cacao-liqueur' },
        { name: 'Cóctel de Cacao', type: 'Producto', to: '/products/cacao-cocktail' },
        { name: 'Historia de la Asociación', type: 'Historia', to: '/about/history' },
        { name: 'Nuestros Productores', type: 'Comunidad', to: '/about/producers' },
    ];
    const filteredItems = allItems.filter(
        (i) =>
            i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <header className="sticky top-0 inset-x-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/93 border-b">
            {/* Overlay para evitar que el menú se cierre al mover el mouse hacia él */}
            {(openSubmenuProducts || openSubmenuAbout) && (
                <div className="fixed inset-0 z-40" style={{ top: '64px' }}></div>
            )}
            
            {/* Barra superior */}
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-8">
                        <img src={logoUrl} alt="ASOPROMAS" className="h-8 w-auto" />
                        <span className="text-xl font-bold text-[#411900]">Asopromas</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-14">
                        {navLinks.map((link) => {
                            const hasSub = Boolean(link.submenu);
                            const isProducts = link.text === 'Productos';
                            const isAbout = link.text === 'Nosotros';

                            return (
                                <div
                                    key={link.text}
                                    className="relative group nav-item"
                                    onMouseEnter={() => {
                                        if (isProducts) {
                                            handleSubmenuEnter('products');
                                        }
                                        if (isAbout) {
                                            handleSubmenuEnter('about');
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (isProducts) {
                                            handleSubmenuLeave('products');
                                        }
                                        if (isAbout) {
                                            handleSubmenuLeave('about');
                                        }
                                    }}
                                >
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) =>
                                            `nav-item inline-flex items-center gap-1 text-base transition-colors duration-200 ${isActive
                                                ? 'text-[#411900]'
                                                : 'text-gray-700 hover:text-[#411900]'
                                            }`
                                        }
                                    >
                                        {link.text}
                                        {hasSub && (
                                            <ChevronDown 
                                                className={`w-4 h-4 transition-transform duration-200 ${
                                                    (isProducts ? openSubmenuProducts : openSubmenuAbout) ? 'rotate-180' : 'rotate-0'
                                                }`} 
                                            />
                                        )}
                                    </NavLink>

                                    {/* Mega menu */}
                                    {hasSub && (
                                        <div
                                            className={`mega-menu absolute left-1/2 transform -translate-x-1/2 w-screen max-w-md bg-white border border-gray-200 shadow-xl rounded-lg transition-all duration-300 ease-out z-50 ${
                                                (isProducts ? openSubmenuProducts : openSubmenuAbout)
                                                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                                                    : 'opacity-0 -translate-y-2 pointer-events-none'
                                            }`}
                                            style={{ marginTop: '8px', paddingTop: '8px' }}
                                            onMouseEnter={() => {
                                                // Mantener el submenu abierto cuando el mouse está sobre él
                                                if (submenuTimeout) {
                                                    clearTimeout(submenuTimeout);
                                                    setSubmenuTimeout(null);
                                                }
                                                if (isProducts) handleSubmenuEnter('products');
                                                if (isAbout) handleSubmenuEnter('about');
                                            }}
                                            onMouseLeave={() => {
                                                // Cerrar con delay cuando sale del submenu
                                                if (isProducts) handleSubmenuLeave('products');
                                                if (isAbout) handleSubmenuLeave('about');
                                            }}
                                        >
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    {link.submenu!.map((section) => (
                                                        <div key={section.title}>
                                                            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#8B4513] mb-3 border-b border-gray-100 pb-2">
                                                                {section.title}
                                                            </h3>
                                                            <ul className="space-y-2">
                                                                {section.items.map((item) => (
                                                                    <li key={item.to}>
                                                                        <NavLink
                                                                            to={item.to}
                                                                            className={({ isActive }) =>
                                                                                `block py-2 px-3 text-sm transition-colors rounded-md hover:bg-gray-50 ${
                                                                                    isActive
                                                                                        ? 'text-[#411900] font-medium bg-amber-50'
                                                                                        : 'text-gray-700 hover:text-[#411900]'
                                                                                }`
                                                                            }
                                                                        >
                                                                            {item.text}
                                                                        </NavLink>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Search button */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 rounded-md text-gray-600 hover:text-[#411900] hover:bg-gray-100"
                            aria-label="Abrir búsqueda"
                        >
                            <Search size={20} />
                        </button>

                        {/* CTA catálogo */}
                        <Link to="/products" className="p-2 rounded-md text-gray-600 hover:text-[#411900] hover:bg-gray-100">
                            <ShoppingBag className="w-5 h-5" />
                        </Link>
                    </nav>

                    {/* Mobile action buttons */}
                    <div className="md:hidden flex items-center gap-2">
                        {/* Mobile search button */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 rounded-md text-gray-600 hover:text-[#411900] hover:bg-gray-100"
                            aria-label="Abrir búsqueda"
                        >
                            <Search size={20} />
                        </button>

                        {/* Mobile catalog button */}
                        <Link 
                            to="/products" 
                            className="p-2 rounded-md text-gray-600 hover:text-[#411900] hover:bg-gray-100"
                            aria-label="Ver catálogo"
                        >
                            <ShoppingBag className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#411900] hover:bg-gray-100"
                        onClick={() => setIsMenuOpen((v) => !v)}
                        aria-label="Alternar menú"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X size={24} /> : <span className="text-2xl leading-none">≡</span>}
                    </button>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white shadow-md border-t py-3">
                        <nav className="flex flex-col">
                            {navLinks.map((link) => (
                                <div key={link.text}>
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) =>
                                            `block px-4 py-2 font-medium ${isActive ? 'text-[#411900]' : 'text-gray-700 hover:text-[#411900]'
                                            }`
                                        }
                                    >
                                        {link.text}
                                    </NavLink>
                                    {link.submenu && (
                                        <div className="pl-8 py-2 space-y-1">
                                            {link.submenu.map((section) => (
                                                <div key={section.title}>
                                                    <div className="text-xs font-semibold text-[#8B4513] uppercase tracking-wide mb-1">
                                                        {section.title}
                                                    </div>
                                                    {section.items.map((item) => (
                                                        <NavLink
                                                            key={item.to}
                                                            to={item.to}
                                                            className={({ isActive }) =>
                                                                `block py-1 text-sm ${isActive ? 'text-[#411900]' : 'text-gray-600 hover:text-[#411900]'
                                                                }`
                                                            }
                                                        >
                                                            {item.text}
                                                        </NavLink>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {/* Separador */}
                            <div className="border-t border-gray-200 my-3"></div>
                            
                            {/* Botones de acción en móvil */}
                            <div className="px-4 space-y-2">
                                {/* Botón de búsqueda */}
                                <button
                                    onClick={() => {
                                        setSearchOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 py-2 px-2 text-gray-700 hover:text-[#411900] hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <Search size={20} />
                                    <span className="font-medium">Buscar</span>
                                </button>
                                
                                {/* Botón de catálogo */}
                                <Link
                                    to="/products"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full flex items-center gap-3 py-2 px-2 text-gray-700 hover:text-[#411900] hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <ShoppingBag size={20} />
                                    <span className="font-medium">Catálogo</span>
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </div>

            {/* Search Modal */}
            {searchOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
                        <div className="p-4 border-b">
                            <div className="flex items-center gap-3">
                                <Search size={20} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar productos, páginas..."
                                    className="flex-1 bg-transparent outline-none text-lg"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    onClick={() => setSearchOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {filteredItems.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="block p-3 hover:bg-gray-50 rounded-lg"
                                    onClick={() => setSearchOpen(false)}
                                >
                                    <div className="font-medium text-gray-800">{item.name}</div>
                                    <div className="text-sm text-gray-500">{item.type}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;