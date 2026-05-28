import { type FC, useState, useEffect, useRef, memo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Menu, ArrowRight } from 'lucide-react';
import logoUrl from '../assets/icons/logo.svg';

import productsData from '../data/products.json';

type SubmenuItem = { to: string; text: string; desc?: string };
type SubmenuSection = { title: string; items: SubmenuItem[] };
type NavItem = { to: string; text: string; submenu?: SubmenuSection[] };

const HeaderComponent: FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState<'products' | 'about' | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<typeof productsData>([]);
    const [isScrolled, setIsScrolled] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();

    const searchInputRef = useRef<HTMLInputElement>(null);

    // Scroll Detection
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveMegaMenu(null);
    }, [location.pathname]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setIsMobileMenuOpen(false);
                setActiveMegaMenu(null);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    // Search Focus
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [searchOpen]);

    // Search Logic
    useEffect(() => {
        if (searchTerm.trim().length >= 2) {
            const filtered = productsData.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
            setSearchOpen(false);
            setSearchTerm('');
        }
    };

    const navLinks: NavItem[] = [
        { to: '/', text: 'Inicio' },
        { to: '/cacao-origin', text: 'Origen' },
        { to: '/ruta-cacao-ancestral', text: 'Ruta del Cacao' },
        {
            to: '/about',
            text: 'Nosotros',
            submenu: [
                {
                    title: 'Nuestra Historia',
                    items: [
                        { to: '/about/history', text: 'Historia de ASOPROMAS', desc: 'El comienzo de nuestro sueño' },
                        { to: '/about/mission', text: 'Misión y Visión', desc: 'Nuestro norte como organización' },
                        { to: '/about/values', text: 'Valores', desc: 'Lo que nos hace únicos' },
                    ],
                },
                {
                    title: 'Comunidad',
                    items: [
                        { to: '/about/producers', text: 'Nuestros Productores', desc: 'Las familias detrás del cacao' },
                        { to: '/about/sustainability', text: 'Sostenibilidad', desc: 'Cuidado de nuestra Amazonía' },
                        { to: '/about/certifications', text: 'Certificaciones', desc: 'Avales de nuestra calidad' },
                    ],
                },
            ],
        },
        {
            to: '/products',
            text: 'Productos',
            submenu: [
                {
                    title: 'Colección Principal',
                    items: [
                        { to: '/products/chocolate-bar-100', text: 'Barra de Chocolate 100%', desc: 'Puro e intenso, sin azúcar' },
                        { to: '/products/chocolate-nibs-salt', text: 'Chocolate con Nibs y Sal', desc: 'Equilibrio perfecto de sabores' },
                        { to: '/products/chocolate-coffee', text: 'Chocolate con Café', desc: 'Fusión de granos selectos' },
                    ],
                },
                {
                    title: 'Especialidades',
                    items: [
                        { to: '/products/fruit-bonbons', text: 'Bombones Frutales', desc: 'Rellenos de sabores exóticos' },
                        { to: '/products/cocoa-nibs', text: 'Nibs Naturales', desc: 'Crujientes y saludables' },
                        { to: '/products/cocoa-liqueur', text: 'Licor Dulce (20°)', desc: 'Para ocasiones especiales' },
                        { to: '/products/cocoa-cocktail', text: 'Cóctel de Cacao (12°)', desc: 'Suave y muy refrescante' },
                    ],
                },
            ],
        },
    ];

    return (
        <>
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed w-full top-0 z-40 transition-all duration-500 border-b ${
                    isScrolled 
                        ? 'bg-white/90 backdrop-blur-xl border-stone-200 shadow-sm py-3' 
                        : 'bg-white/50 backdrop-blur-sm border-transparent py-5'
                }`}
                onMouseLeave={() => setActiveMegaMenu(null)}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className="relative z-50 flex-shrink-0 flex items-center gap-3 group">
                            <img 
                                src={logoUrl} 
                                alt="ASOPROMAS Logo" 
                                className={`w-auto transition-all duration-500 ease-out ${isScrolled ? 'h-8' : 'h-10'}`}
                            />
                            <span className={`font-medium tracking-wide text-chocolate-900 transition-all duration-500 ease-out hidden sm:block group-hover:text-chocolate-700 ${isScrolled ? 'text-lg' : 'text-xl'}`}>
                                ASOPROMAS
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-10">
                            {navLinks.map((link) => {

                                const isProducts = link.text === 'Productos';
                                const isAbout = link.text === 'Nosotros';

                                return (
                                    <div 
                                        key={link.to} 
                                        className="relative group h-full flex items-center"
                                        onMouseEnter={() => {
                                            if (isProducts) setActiveMegaMenu('products');
                                            else if (isAbout) setActiveMegaMenu('about');
                                            else setActiveMegaMenu(null);
                                        }}
                                    >
                                        <NavLink
                                            to={link.to}
                                            className={({ isActive }) =>
                                                `flex items-center gap-1 text-[15px] font-medium transition-colors ${
                                                    isActive || location.pathname.startsWith(link.to)
                                                        ? 'text-chocolate-800'
                                                        : 'text-stone-600 hover:text-chocolate-900'
                                                }`
                                            }
                                        >
                                            {link.text}
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-6 relative z-50">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="text-stone-500 hover:text-chocolate-800 transition-colors p-2"
                                aria-label="Buscar"
                            >
                                <Search className="w-[22px] h-[22px]" />
                            </button>

                            <Link 
                                to="/ruta-cacao-ancestral" 
                                className="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-chocolate-900 text-white text-sm font-medium hover:bg-chocolate-950 transition-colors shadow-md hover:shadow-lg"
                            >
                                Reservar Ruta
                            </Link>

                            <button
                                className="lg:hidden p-2 text-stone-600"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                    {activeMegaMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-xl overflow-hidden"
                        >
                            <div className="max-w-7xl mx-auto px-6 py-12">
                                <div className="grid grid-cols-12 gap-12">
                                    {/* Links Section */}
                                    <div className="col-span-8 grid grid-cols-2 gap-12">
                                        {(activeMegaMenu === 'products' ? navLinks[4].submenu : navLinks[3].submenu)?.map((section) => (
                                            <div key={section.title}>
                                                <h3 className="text-sm font-semibold text-chocolate-900 tracking-wider uppercase mb-6">
                                                    {section.title}
                                                </h3>
                                                <ul className="space-y-5">
                                                    {section.items.map((item) => (
                                                        <li key={item.to}>
                                                            <Link
                                                                to={item.to}
                                                                className="group block"
                                                                onClick={() => setActiveMegaMenu(null)}
                                                            >
                                                                <span className="block text-base font-medium text-stone-800 group-hover:text-chocolate-700 transition-colors">
                                                                    {item.text}
                                                                </span>
                                                                {item.desc && (
                                                                    <span className="block text-sm text-stone-500 mt-1">
                                                                        {item.desc}
                                                                    </span>
                                                                )}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Featured Section */}
                                    <div className="col-span-4 border-l border-stone-100 pl-12">
                                        <div className="relative h-full w-full rounded-2xl overflow-hidden group cursor-pointer" onClick={() => navigate(activeMegaMenu === 'products' ? '/products' : '/about')}>
                                            <img 
                                                src={activeMegaMenu === 'products' ? "/assets/images/products/Barra-Pura-1.jpg" : "/assets/images/products/Asopromas-socios.jpg"} 
                                                alt="Destacado"
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute bottom-6 left-6 right-6">
                                                <h4 className="text-white text-xl font-medium mb-2">
                                                    {activeMegaMenu === 'products' ? 'Explorar Colección' : 'Nuestra Historia'}
                                                </h4>
                                                <div className="flex items-center text-stone-300 text-sm group-hover:text-white transition-colors">
                                                    <span>Descubrir más</span>
                                                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Mobile Drawer Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-50 shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                                <span className="font-semibold text-chocolate-900 tracking-wider">MENÚ</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-500 hover:text-chocolate-800 rounded-full hover:bg-stone-50">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto py-6 px-6 space-y-8">
                                {navLinks.map((link) => (
                                    <div key={link.to}>
                                        {link.submenu ? (
                                            <div className="space-y-4">
                                                <span className="text-sm font-semibold text-stone-400 uppercase tracking-widest">{link.text}</span>
                                                <div className="space-y-4 pl-4 border-l border-stone-100">
                                                    {link.submenu.map((sec) => (
                                                        <div key={sec.title} className="space-y-3">
                                                            {sec.items.map((item) => (
                                                                <Link 
                                                                    key={item.to} 
                                                                    to={item.to}
                                                                    className="block text-stone-600 hover:text-chocolate-800 font-medium"
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                >
                                                                    {item.text}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                to={link.to}
                                                className="block text-lg font-medium text-stone-800 hover:text-chocolate-800"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {link.text}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-stone-50 border-t border-stone-100">
                                <Link 
                                    to="/ruta-cacao-ancestral" 
                                    className="flex w-full items-center justify-center px-6 py-3 rounded-full bg-chocolate-900 text-white font-medium hover:bg-chocolate-950 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Reservar Ruta
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Elegant Search Modal */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center pt-24 px-4 sm:px-6"
                    >
                        {/* Blur Backdrop */}
                        <div 
                            className="absolute inset-0 bg-white/90 backdrop-blur-xl"
                            onClick={() => setSearchOpen(false)}
                        />

                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="relative w-full max-w-3xl z-10"
                        >
                            <button
                                onClick={() => setSearchOpen(false)}
                                className="absolute -right-4 -top-16 p-2 text-stone-400 hover:text-chocolate-900 transition-colors"
                            >
                                <X className="w-8 h-8" />
                                <span className="sr-only">Cerrar</span>
                            </button>

                            <form onSubmit={handleSearchSubmit} className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-stone-300 group-focus-within:text-chocolate-600 transition-colors" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar productos..."
                                    className="w-full bg-white py-6 pl-20 pr-8 text-2xl font-light text-stone-800 placeholder-stone-300 rounded-2xl border-2 border-stone-100 shadow-2xl focus:outline-none focus:border-chocolate-300 focus:ring-0 transition-all"
                                />
                            </form>

                            {/* Search Results Dropdown-style */}
                            <AnimatePresence>
                                {searchTerm.trim().length >= 2 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mt-6 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden max-h-[50vh] overflow-y-auto"
                                    >
                                        {searchResults.length === 0 ? (
                                            <div className="p-12 text-center text-stone-500 font-light">
                                                No se encontraron resultados para "{searchTerm}"
                                            </div>
                                        ) : (
                                            <div className="p-4">
                                                <p className="px-4 py-2 text-xs font-semibold text-stone-400 uppercase tracking-widest">
                                                    Resultados
                                                </p>
                                                {searchResults.map((product) => (
                                                    <button
                                                        key={product.id}
                                                        onClick={() => {
                                                            navigate(`/products/${product.id}`);
                                                            setSearchOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-6 p-4 rounded-xl hover:bg-stone-50 transition-colors text-left group"
                                                    >
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-medium text-stone-800 group-hover:text-chocolate-800 transition-colors">
                                                                {product.name}
                                                            </h3>
                                                            <p className="text-sm text-stone-500 line-clamp-1 mt-1">
                                                                {product.description}
                                                            </p>
                                                        </div>
                                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ArrowRight className="w-5 h-5 text-chocolate-500" />
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const Header = memo(HeaderComponent);
Header.displayName = 'Header';

export default Header;
