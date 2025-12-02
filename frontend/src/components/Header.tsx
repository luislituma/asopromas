import { type FC, useState, useEffect, useRef, memo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, X, ChevronDown, ShoppingBag, Menu } from 'lucide-react';
import logoUrl from '../assets/icons/logo.svg';
import { useA11y } from '../hooks/useA11y';
import productsData from '../data/products.json';

type SubmenuItem = { to: string; text: string };
type SubmenuSection = { title: string; items: SubmenuItem[] };
type NavItem = { to: string; text: string; submenu?: SubmenuSection[] };

const HeaderComponent: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenuProducts, setOpenSubmenuProducts] = useState(false);
    const [openSubmenuAbout, setOpenSubmenuAbout] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<typeof productsData>([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { announceToScreenReader } = useA11y();
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    

    // Detectar scroll usando Intersection Observer (más confiable)
    useEffect(() => {
        const sentinel = document.getElementById('scroll-sentinel'); if (!sentinel) { console.error(' Sentinel no encontrado'); return; }

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Cuando el sentinel NO es visible = estamos scrolleados
                const scrolled = !entry.isIntersecting;
                console.log('�️ Intersection Observer - isScrolled:', scrolled);
                setIsScrolled(scrolled);
            },
            {
                threshold: 0,
                rootMargin: '-1px 0px 0px 0px'
            }
        );

        observer.observe(sentinel);

        return () => {
            if (sentinel) {
                observer.unobserve(sentinel);
            }
        };
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setOpenSubmenuProducts(false);
        setOpenSubmenuAbout(false);
    }, [location.pathname]);

    // Handle ESC key to close menus
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (searchOpen) {
                    setSearchOpen(false);
                } else if (isMenuOpen) {
                    setIsMenuOpen(false);
                } else if (openSubmenuProducts || openSubmenuAbout) {
                    setOpenSubmenuProducts(false);
                    setOpenSubmenuAbout(false);
                }
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [searchOpen, isMenuOpen, openSubmenuProducts, openSubmenuAbout]);

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    // Announce menu state changes
    const toggleMobileMenu = () => {
        const newState = !isMenuOpen;
        setIsMenuOpen(newState);
        announceToScreenReader(newState ? 'Menú abierto' : 'Menú cerrado');
    };

    const toggleSubmenu = (menu: 'products' | 'about') => {
        if (menu === 'products') {
            const newState = !openSubmenuProducts;
            setOpenSubmenuProducts(newState);
            setOpenSubmenuAbout(false);
            announceToScreenReader(newState ? 'Submenú de productos abierto' : 'Submenú de productos cerrado');
        } else {
            const newState = !openSubmenuAbout;
            setOpenSubmenuAbout(newState);
            setOpenSubmenuProducts(false);
            announceToScreenReader(newState ? 'Submenú de nosotros abierto' : 'Submenú de nosotros cerrado');
        }
    };

    // Search functionality with real-time suggestions
    useEffect(() => {
        if (searchTerm.trim().length >= 2) {
            const filtered = productsData.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            announceToScreenReader(`Buscando: ${searchTerm}`);
            navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
            setSearchOpen(false);
            setSearchTerm('');
            setSearchResults([]);
        }
    };

    const handleProductClick = (productId: string) => {
        navigate(`/products/${productId}`);
        setSearchOpen(false);
        setSearchTerm('');
        setSearchResults([]);
        announceToScreenReader('Navegando al producto seleccionado');
    };

    const navLinks: NavItem[] = [
        { to: '/', text: 'Inicio' },
        { to: '/cacao-origin', text: 'Origen del Cacao' },
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
                        { to: '/products/chocolate-bar-100', text: 'Barra de Chocolate 100%' },
                        { to: '/products/chocolate-nibs-salt', text: 'Chocolate con Nibs y Sal' },
                        { to: '/products/chocolate-coffee', text: 'Chocolate con Café' },
                    ],
                },
                {
                    title: 'Productos Especiales',
                    items: [
                        { to: '/products/fruit-bonbons', text: 'Bombones de Frutas Exóticas' },
                        { to: '/products/cocoa-nibs', text: 'Nibs de Cacao Natural' },
                        { to: '/products/cocoa-liqueur', text: 'Licor Dulce de Cacao (20°)' },
                        { to: '/products/cocoa-cocktail', text: 'Cóctel de Cacao (12°)' },
                    ],
                },
            ],
        },
        { to: '/contact', text: 'Contacto' },
    ];

    return (
        <>
            <header 
                className={`sticky top-0 z-40 transition-all duration-700 ease-in-out ${
                    isScrolled 
                        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
                        : 'bg-white shadow-sm'
                } border-b ${isScrolled ? 'border-gray-300' : 'border-gray-200'}`}
                role="banner"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link 
                            to="/" 
                            className="flex items-center focus-visible transition-all duration-500"
                            aria-label="ASOPROMAS - Ir a inicio"
                        >
                            <img 
                                src={logoUrl} 
                                alt="ASOPROMAS Logo" 
                                className={`w-auto transition-all duration-500 ${
                                    isScrolled ? 'h-8' : 'h-10'
                                }`}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav 
                            className="hidden md:flex items-center gap-12"
                            role="navigation"
                            aria-label="Navegación principal"
                        >
                            {navLinks.map((link) => {
                                const isProducts = link.text === 'Productos';
                                const hasSub = link.submenu && link.submenu.length > 0;

                                return (
                                    <div 
                                        key={link.to} 
                                        className="relative"
                                        onMouseEnter={() => {
                                            if (hasSub) {
                                                if (isProducts) {
                                                    setOpenSubmenuProducts(true);
                                                    setOpenSubmenuAbout(false);
                                                } else {
                                                    setOpenSubmenuAbout(true);
                                                    setOpenSubmenuProducts(false);
                                                }
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            if (hasSub) {
                                                setOpenSubmenuProducts(false);
                                                setOpenSubmenuAbout(false);
                                            }
                                        }}
                                    >
                                        {hasSub ? (
                                            <NavLink
                                                to={link.to}
                                                className={({ isActive }) =>
                                                    `nav-item inline-flex items-center gap-1 text-sm transition-colors duration-200 focus-visible ${
                                                        isActive || location.pathname.startsWith(link.to)
                                                            ? 'text-[#411900] font-semibold'
                                                            : isScrolled 
                                                                ? 'text-gray-600 hover:text-[#411900]' 
                                                                : 'text-gray-700 hover:text-[#411900]'
                                                    }`
                                                }
                                                aria-expanded={isProducts ? openSubmenuProducts : openSubmenuAbout}
                                                aria-haspopup="true"
                                            >
                                                {link.text}
                                            </NavLink>
                                        ) : (
                                            <NavLink
                                                to={link.to}
                                                className={({ isActive }) =>
                                                    `nav-item inline-flex items-center gap-1 text-sm transition-colors duration-200 focus-visible ${
                                                        isActive
                                                            ? 'text-[#411900] font-semibold'
                                                            : isScrolled 
                                                                ? 'text-gray-600 hover:text-[#411900]' 
                                                                : 'text-gray-700 hover:text-[#411900]'
                                                    }`
                                                }
                                            >
                                                {link.text}
                                            </NavLink>
                                        )}

                                        {/* Desktop Mega menu */}
                                        {hasSub && (
                                            <div
                                                className={`mega-menu absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 z-50 ${
                                                    (isProducts ? openSubmenuProducts : openSubmenuAbout)
                                                        ? 'opacity-100 visible translate-y-0'
                                                        : 'opacity-0 invisible -translate-y-2'
                                                }`}
                                                role="menu"
                                                aria-labelledby={`${link.text.toLowerCase()}-menu-button`}
                                            >
                                                <div className="p-6">
                                                    <div className="grid grid-cols-1 gap-6">
                                                        {link.submenu?.map((section) => (
                                                            <div key={section.title}>
                                                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                                                    {section.title}
                                                                </h3>
                                                                <ul className="space-y-2" role="none">
                                                                    {section.items.map((item) => (
                                                                        <li key={item.to} role="none">
                                                                            <Link
                                                                                to={item.to}
                                                                                className="block text-sm text-gray-600 hover:text-[#411900] transition-colors duration-200 focus-visible"
                                                                                role="menuitem"
                                                                                onClick={() => {
                                                                                    setOpenSubmenuProducts(false);
                                                                                    setOpenSubmenuAbout(false);
                                                                                }}
                                                                            >
                                                                                {item.text}
                                                                            </Link>
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
                                className={`p-2 rounded-md transition-colors duration-200 focus-visible ${
                                    isScrolled 
                                        ? 'text-gray-600 hover:text-[#411900] hover:bg-gray-100' 
                                        : 'text-gray-600 hover:text-[#411900] hover:bg-gray-100'
                                }`}
                                aria-label="Abrir búsqueda"
                            >
                                <Search size={20} aria-hidden="true" />
                            </button>

                            {/* CTA catálogo */}
                            <Link 
                                to="/products" 
                                className="group relative p-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 
                                    hover:from-orange-600 hover:to-amber-600 text-white
                                    transform hover:scale-110 active:scale-105
                                    transition-all duration-300 ease-out
                                    shadow-md hover:shadow-lg hover:shadow-orange-500/50
                                    focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                                    before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
                                    before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-500"
                                aria-label="Ver catálogo de productos"
                            >
                                <ShoppingBag className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" aria-hidden="true" />
                            </Link>
                        </nav>

                        {/* Mobile action buttons */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className={`p-2 rounded-md transition-colors duration-200 focus-visible ${
                                    isScrolled 
                                        ? 'text-gray-600 hover:text-[#411900] hover:bg-gray-100' 
                                        : 'text-gray-600 hover:text-[#411900] hover:bg-gray-100'
                                }`}
                                aria-label="Abrir búsqueda"
                            >
                                <Search size={20} aria-hidden="true" />
                            </button>

                            <Link 
                                to="/products" 
                                className="group relative p-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 
                                    hover:from-orange-600 hover:to-amber-600 text-white
                                    transform hover:scale-110 active:scale-105
                                    transition-all duration-300 ease-out
                                    shadow-md hover:shadow-lg hover:shadow-orange-500/50
                                    focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                                    before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
                                    before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-500"
                                aria-label="Ver catálogo de productos"
                            >
                                <ShoppingBag className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" aria-hidden="true" />
                            </Link>

                            <button
                                className={`p-2 rounded-md transition-colors duration-200 focus-visible ${
                                    isScrolled 
                                        ? 'text-gray-600 hover:text-[#411900] hover:bg-gray-100' 
                                        : 'text-gray-700 hover:text-[#411900] hover:bg-gray-100'
                                }`}
                                onClick={toggleMobileMenu}
                                aria-label="Alternar menú de navegación"
                                aria-expanded={isMenuOpen}
                                aria-controls="mobile-menu"
                            >
                                <Menu size={24} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div 
                        id="mobile-menu"
                        ref={mobileMenuRef}
                        className="md:hidden bg-white border-t border-gray-200"
                        role="navigation"
                        aria-label="Navegación móvil"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <div key={link.to}>
                                    {link.submenu ? (
                                        <div>
                                            <button
                                                className="w-full flex items-center justify-between text-base font-medium text-gray-900 focus-visible"
                                                onClick={() => toggleSubmenu(link.text === 'Productos' ? 'products' : 'about')}
                                                aria-expanded={link.text === 'Productos' ? openSubmenuProducts : openSubmenuAbout}
                                            >
                                                {link.text}
                                                <ChevronDown 
                                                    className={`w-5 h-5 transition-transform duration-200 ${
                                                        (link.text === 'Productos' ? openSubmenuProducts : openSubmenuAbout) ? 'rotate-180' : 'rotate-0'
                                                    }`} 
                                                    aria-hidden="true"
                                                />
                                            </button>
                                            {(link.text === 'Productos' ? openSubmenuProducts : openSubmenuAbout) && (
                                                <div className="mt-4 pl-4 space-y-4">
                                                    {link.submenu.map((section) => (
                                                        <div key={section.title}>
                                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                                                {section.title}
                                                            </h3>
                                                            <ul className="space-y-2">
                                                                {section.items.map((item) => (
                                                                    <li key={item.to}>
                                                                        <Link
                                                                            to={item.to}
                                                                            className="block text-sm text-gray-600 hover:text-[#411900] focus-visible"
                                                                            onClick={() => setIsMenuOpen(false)}
                                                                        >
                                                                            {item.text}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <NavLink
                                            to={link.to}
                                            className={({ isActive }) =>
                                                `block text-base font-medium transition-colors duration-200 focus-visible ${isActive
                                                    ? 'text-[#411900]'
                                                    : 'text-gray-900 hover:text-[#411900]'
                                                }`
                                            }
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.text}
                                        </NavLink>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Search Modal */}
            {searchOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="search-title"
                    onClick={() => {
                        setSearchOpen(false);
                        setSearchTerm('');
                        setSearchResults([]);
                    }}
                >
                    <div 
                        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 id="search-title" className="text-lg font-semibold text-gray-900">
                                    Buscar productos
                                </h2>
                                <button
                                    onClick={() => {
                                        setSearchOpen(false);
                                        setSearchTerm('');
                                        setSearchResults([]);
                                    }}
                                    className="p-2 rounded-md text-gray-400 hover:text-gray-600 focus-visible"
                                    aria-label="Cerrar búsqueda"
                                >
                                    <X size={20} aria-hidden="true" />
                                </button>
                            </div>
                            <form onSubmit={handleSearchSubmit}>
                                <div className="relative">
                                    <Search 
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
                                        aria-hidden="true"
                                    />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar chocolate, licor, pasta..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        aria-label="Campo de búsqueda"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Search Results */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {searchTerm.trim().length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>Empieza a escribir para buscar productos</p>
                                    <p className="text-sm mt-2">Chocolate, licor, pasta de cacao...</p>
                                </div>
                            ) : searchTerm.trim().length < 2 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Escribe al menos 2 caracteres</p>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No se encontraron productos para "{searchTerm}"</p>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="mt-4 text-amber-600 hover:text-amber-700 underline"
                                    >
                                        Limpiar búsqueda
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 mb-4">
                                        {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'} encontrados
                                    </p>
                                    {searchResults.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleProductClick(product.id)}
                                            className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                                        >
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                    {product.description}
                                                </p>
                                                <p className="text-sm font-semibold text-amber-600 mt-1">
                                                    ${(product.price || 0).toFixed(2)}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer with shortcut hint */}
                        {searchResults.length > 0 && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <p className="text-xs text-gray-500 text-center">
                                    Presiona <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">ESC</kbd> para cerrar
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

// Memoizar el Header para evitar re-renders innecesarios
const Header = memo(HeaderComponent);
Header.displayName = 'Header';

export default Header;

