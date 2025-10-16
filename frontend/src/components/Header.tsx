import { type FC, useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, X, ChevronDown, ShoppingBag, Menu } from 'lucide-react';
import logoUrl from '../assets/icons/logo.svg';
import { useA11y } from '../hooks/useA11y';

type SubmenuItem = { to: string; text: string };
type SubmenuSection = { title: string; items: SubmenuItem[] };
type NavItem = { to: string; text: string; submenu?: SubmenuSection[] };

const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenuProducts, setOpenSubmenuProducts] = useState(false);
    const [openSubmenuAbout, setOpenSubmenuAbout] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const { announceToScreenReader } = useA11y();
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            announceToScreenReader(`Buscando: ${searchTerm}`);
            // Here you would implement actual search functionality
            setSearchOpen(false);
            setSearchTerm('');
        }
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
                    ],
                },
                {
                    title: 'Productos Especiales',
                    items: [
                        { to: '/products/cocoa-nibs', text: 'Nibs de Cacao' },
                        { to: '/products/cocoa-powder', text: 'Polvo de Cacao' },
                        { to: '/products/cocoa-liquor', text: 'Licor de Cacao' },
                        { to: '/products/cacao-cocktail', text: 'Cocktail de Cacao' },
                        { to: '/products/cacao-liqueur', text: 'Licor de Cacao Premium' },
                        { to: '/products/chocolate-coffee', text: 'Café con Chocolate' },
                        { to: '/products/fruit-bonbons', text: 'Bombones de Fruta' },
                        { to: '/products/pralines', text: 'Pralinés Artesanales' },
                    ],
                },
            ],
        },
        { to: '/contact', text: 'Contacto' },
    ];

    return (
        <>
            <header 
                className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40"
                role="banner"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link 
                            to="/" 
                            className="flex items-center focus-visible"
                            aria-label="ASOPROMAS - Ir a inicio"
                        >
                            <img 
                                src={logoUrl} 
                                alt="ASOPROMAS Logo" 
                                className="h-10 w-auto"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav 
                            className="hidden md:flex items-center gap-8"
                            role="navigation"
                            aria-label="Navegación principal"
                        >
                            {navLinks.map((link) => {
                                const isProducts = link.text === 'Productos';
                                const hasSub = link.submenu && link.submenu.length > 0;

                                return (
                                    <div key={link.to} className="relative">
                                        {hasSub ? (
                                            <button
                                                className={`nav-item inline-flex items-center gap-1 text-base transition-colors duration-200 focus-visible ${
                                                    location.pathname.startsWith(link.to) && link.to !== '/'
                                                        ? 'text-[#411900]'
                                                        : 'text-gray-700 hover:text-[#411900]'
                                                }`}
                                                onClick={() => toggleSubmenu(isProducts ? 'products' : 'about')}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        toggleSubmenu(isProducts ? 'products' : 'about');
                                                    }
                                                }}
                                                aria-expanded={isProducts ? openSubmenuProducts : openSubmenuAbout}
                                                aria-haspopup="true"
                                                aria-label={`${link.text} - menú desplegable`}
                                            >
                                                {link.text}
                                                <ChevronDown 
                                                    className={`w-4 h-4 transition-transform duration-200 ${
                                                        (isProducts ? openSubmenuProducts : openSubmenuAbout) ? 'rotate-180' : 'rotate-0'
                                                    }`} 
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        ) : (
                                            <NavLink
                                                to={link.to}
                                                className={({ isActive }) =>
                                                    `nav-item inline-flex items-center gap-1 text-base transition-colors duration-200 focus-visible ${isActive
                                                        ? 'text-[#411900]'
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
                                className="p-2 rounded-md text-gray-600 hover:text-[#411900] hover:bg-gray-100 focus-visible"
                                aria-label="Abrir búsqueda"
                            >
                                <Search size={20} aria-hidden="true" />
                            </button>

                            {/* CTA catálogo */}
                            <Link 
                                to="/products" 
                                className="p-2 rounded-md text-gray-600 hover:text-[#411900] hover:bg-gray-100 focus-visible"
                                aria-label="Ver catálogo de productos"
                            >
                                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                            </Link>
                        </nav>

                        {/* Mobile action buttons */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 rounded-md text-gray-600 hover:text-[#411900] hover:bg-gray-100 focus-visible"
                                aria-label="Abrir búsqueda"
                            >
                                <Search size={20} aria-hidden="true" />
                            </button>

                            <Link 
                                to="/products" 
                                className="p-2 rounded-md text-gray-600 hover:text-[#411900] hover:bg-gray-100 focus-visible"
                                aria-label="Ver catálogo de productos"
                            >
                                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                            </Link>

                            <button
                                className="p-2 rounded-md text-gray-700 hover:text-[#411900] hover:bg-gray-100 focus-visible"
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
                >
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 id="search-title" className="text-lg font-semibold text-gray-900">
                                    Buscar productos
                                </h2>
                                <button
                                    onClick={() => setSearchOpen(false)}
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
                                        placeholder="¿Qué estás buscando?"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#411900] focus:border-transparent"
                                        aria-label="Campo de búsqueda"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 w-full bg-[#411900] text-white py-3 px-4 rounded-lg hover:bg-[#2a0f00] transition-colors duration-200 focus-visible"
                                >
                                    Buscar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;