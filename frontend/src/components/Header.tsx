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

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveMegaMenu(null);
    }, [location.pathname]);

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

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [searchOpen]);

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
                    title: 'Historia',
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
            {/* ── HEADER ── */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={`fixed w-full top-0 z-40 transition-all duration-300 border-b ${
                    isScrolled || activeMegaMenu
                        ? 'bg-white/85 backdrop-saturate-[180%] backdrop-blur-2xl border-black/[0.08]'
                        : 'bg-white/60 backdrop-saturate-[180%] backdrop-blur-xl border-transparent'
                }`}
                onMouseLeave={() => setActiveMegaMenu(null)}
            >
                {/* Logo — absolute izquierda, centrado verticalmente */}
                <Link
                    to="/"
                    className="absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate-400 focus-visible:ring-offset-2 rounded-sm"
                >
                    <img src={logoUrl} alt="ASOPROMAS Logo" className="h-7 w-auto" />
                    <span className="text-[13px] font-medium tracking-[0.05em] text-chocolate-900 group-hover:text-chocolate-700 transition-colors hidden sm:block">
                        ASOPROMAS
                    </span>
                </Link>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-center">

                    {/* Desktop Nav — hijo natural del flex, perfectamente centrado */}
                    <nav className="hidden lg:flex items-center gap-7">
                        {navLinks.map((link) => {
                            const isProducts = link.text === 'Productos';
                            const isAbout = link.text === 'Nosotros';

                            return (
                                <div
                                    key={link.to}
                                    className="flex items-center"
                                    onMouseEnter={() => {
                                        if (isProducts) setActiveMegaMenu('products');
                                        else if (isAbout) setActiveMegaMenu('about');
                                        else setActiveMegaMenu(null);
                                    }}
                                >
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) =>
                                            `text-[13px] leading-none transition-colors duration-150 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate-400 focus-visible:ring-offset-2 ${
                                                isActive || location.pathname.startsWith(link.to)
                                                    ? 'text-chocolate-950 font-medium'
                                                    : 'text-stone-500 hover:text-stone-900 font-normal'
                                            }`
                                        }
                                    >
                                        {link.text}
                                    </NavLink>
                                </div>
                            );
                        })}
                    </nav>
                </div>

                {/* Actions — absolute derecha, centrado verticalmente */}
                <div className="absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 flex items-center gap-4 z-50">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="text-stone-400 hover:text-stone-800 transition-colors p-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate-500 focus-visible:ring-offset-1"
                            aria-label="Buscar"
                        >
                            <Search className="w-[18px] h-[18px]" />
                        </button>

                        <Link
                            to="/ruta-cacao-ancestral"
                            className="hidden md:inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-chocolate-900 text-white text-[12px] font-medium tracking-[0.02em] hover:bg-chocolate-950 transition-colors"
                        >
                            Reservar Ruta
                        </Link>

                        <button
                            className="lg:hidden p-1.5 text-stone-500 hover:text-stone-800 transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                {/* ── MEGA MENU ── */}
                <AnimatePresence>
                    {activeMegaMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute top-full left-0 w-full bg-white/90 backdrop-saturate-[180%] backdrop-blur-2xl border-b border-black/[0.06] overflow-hidden"
                        >
                            <div className="max-w-7xl mx-auto px-6 py-5 pb-7">
                                <div className="grid grid-cols-12 gap-10">

                                    {/* Links */}
                                    <div className="col-span-8 grid grid-cols-2 gap-10">
                                        {(activeMegaMenu === 'products' ? navLinks[4].submenu : navLinks[3].submenu)?.map((section) => (
                                            <div key={section.title}>
                                                <p className="text-[10px] font-semibold text-stone-400/80 tracking-[0.14em] uppercase mb-4">
                                                    {section.title}
                                                </p>
                                                <ul className="space-y-3.5">
                                                    {section.items.map((item) => (
                                                        <li key={item.to}>
                                                            <Link
                                                                to={item.to}
                                                                className="group block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate-400 focus-visible:ring-offset-1"
                                                                onClick={() => setActiveMegaMenu(null)}
                                                            >
                                                                <span className="block text-[13px] font-normal text-stone-700 group-hover:text-chocolate-800 transition-colors duration-150">
                                                                    {item.text}
                                                                </span>
                                                                {item.desc && (
                                                                    <span className="block text-[11px] text-stone-400 mt-0.5">
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

                                    {/* Featured image */}
                                    <div className="col-span-4 border-l border-black/[0.06] pl-10">
                                        <div
                                            className="relative h-full w-full rounded-xl overflow-hidden group cursor-pointer"
                                            onClick={() => navigate(activeMegaMenu === 'products' ? '/products' : '/about')}
                                        >
                                            <img
                                                src={activeMegaMenu === 'products' ? '/assets/images/products/Barra-Pura-1.jpg' : '/assets/images/products/Asopromas-socios.jpg'}
                                                alt="Destacado"
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <p className="text-white text-[13px] font-medium mb-1">
                                                    {activeMegaMenu === 'products' ? 'Explorar Colección' : 'Nuestra Historia'}
                                                </p>
                                                <div className="flex items-center text-white/60 text-[11px] group-hover:text-white/90 transition-colors">
                                                    <span>Descubrir más</span>
                                                    <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
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

            {/* ── MOBILE DRAWER ── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed top-0 right-0 h-full w-[82vw] max-w-xs bg-white/95 backdrop-blur-2xl z-50 shadow-2xl flex flex-col"
                        >
                            <div className="h-12 px-5 border-b border-stone-100 flex justify-between items-center flex-shrink-0">
                                <span className="text-[11px] font-semibold text-stone-400 tracking-[0.12em] uppercase">Menú</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-5 px-5 space-y-6">
                                {navLinks.map((link) => (
                                    <div key={link.to}>
                                        {link.submenu ? (
                                            <div className="space-y-3">
                                                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em]">{link.text}</span>
                                                <div className="space-y-3 pl-3 border-l border-stone-100">
                                                    {link.submenu.map((sec) => (
                                                        <div key={sec.title} className="space-y-2.5">
                                                            {sec.items.map((item) => (
                                                                <Link
                                                                    key={item.to}
                                                                    to={item.to}
                                                                    className="block text-[13px] text-stone-600 hover:text-chocolate-800 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate-500 focus-visible:ring-offset-1"
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
                                                className="block text-[15px] font-normal text-stone-700 hover:text-chocolate-800 transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {link.text}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-5 border-t border-stone-100 flex-shrink-0">
                                <Link
                                    to="/ruta-cacao-ancestral"
                                    className="flex w-full items-center justify-center px-5 py-2.5 rounded-full bg-chocolate-900 text-white text-[13px] font-medium hover:bg-chocolate-950 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Reservar Ruta
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── SEARCH MODAL ── */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-50 flex flex-col items-center pt-20 px-4 sm:px-6"
                    >
                        <div
                            className="absolute inset-0 bg-white/85 backdrop-saturate-[180%] backdrop-blur-2xl"
                            onClick={() => setSearchOpen(false)}
                        />

                        <motion.div
                            initial={{ y: -12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -12, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="relative w-full max-w-2xl z-10"
                        >
                            <button
                                onClick={() => setSearchOpen(false)}
                                className="absolute -right-2 -top-14 p-2 text-stone-400 hover:text-stone-700 transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate-500"
                            >
                                <X className="w-6 h-6" />
                                <span className="sr-only">Cerrar</span>
                            </button>

                            <form onSubmit={handleSearchSubmit} className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-chocolate-500 transition-colors" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar productos..."
                                    className="w-full bg-white py-4 pl-14 pr-6 text-[17px] font-light text-stone-800 placeholder-stone-300 rounded-2xl border border-stone-200 shadow-lg focus:outline-none focus:border-chocolate-300 transition-all"
                                />
                            </form>

                            <AnimatePresence>
                                {searchTerm.trim().length >= 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.15 }}
                                        className="mt-3 bg-white rounded-2xl border border-stone-100 shadow-xl overflow-hidden max-h-[50vh] overflow-y-auto"
                                    >
                                        {searchResults.length === 0 ? (
                                            <div className="p-10 text-center text-[13px] text-stone-400 font-light">
                                                Sin resultados para "{searchTerm}"
                                            </div>
                                        ) : (
                                            <div className="p-3">
                                                <p className="px-3 py-2 text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em]">
                                                    Resultados
                                                </p>
                                                {searchResults.map((product) => (
                                                    <button
                                                        key={product.id}
                                                        onClick={() => {
                                                            navigate(`/products/${product.id}`);
                                                            setSearchOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors text-left group"
                                                    >
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-[13px] font-medium text-stone-800 group-hover:text-chocolate-800 transition-colors">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                                                                {product.description}
                                                            </p>
                                                        </div>
                                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ArrowRight className="w-4 h-4 text-stone-400" />
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
