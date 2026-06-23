import { type FC, useState, useEffect, useRef, memo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Menu, ArrowRight, ChevronRight, ChevronLeft, Leaf } from 'lucide-react';
import logoUrl from '../assets/icons/logo.svg';

import productsData from '../data/products.json';

type SubmenuItem = { to: string; text: string; desc?: string };
type SubmenuSection = { title: string; items: SubmenuItem[] };
type NavItem = { to: string; text: string; submenu?: SubmenuSection[] };

const HeaderComponent: FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileSubmenu, setMobileSubmenu] = useState<'products' | 'about' | null>(null);
    const [activeMegaMenu, setActiveMegaMenu] = useState<'products' | 'about' | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<typeof productsData>([]);
    const [isScrolled, setIsScrolled] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout>>();

    const openDrawer = (menu: 'products' | 'about') => {
        clearTimeout(closeTimer.current);
        setActiveMegaMenu(menu);
    };
    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setActiveMegaMenu(null), 180);
    };
    const cancelClose = () => clearTimeout(closeTimer.current);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setMobileSubmenu(null);
        setActiveMegaMenu(null);
    }, [location.pathname]);

    useEffect(() => () => clearTimeout(closeTimer.current), []);

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
                className="fixed w-full h-14 top-0 z-40 border-b bg-chocolate-950 border-black/40"
            >
                <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">

                    {/* Logo — izquierda, en flujo normal */}
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chocolate-400 focus-visible:ring-offset-2 rounded-sm"
                    >
                        <img src={logoUrl} alt="ASOPROMAS Logo" className="h-7 w-auto brightness-0 invert" />
                        <span className="text-[13px] font-medium tracking-[0.05em] text-white/90 group-hover:text-white transition-colors hidden sm:block">
                            ASOPROMAS
                        </span>
                    </Link>

                    {/* Desktop Nav — absolute centrado en el header */}
                    <nav className="hidden lg:flex items-center gap-7 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {navLinks.map((link) => {
                            const isProducts = link.text === 'Productos';
                            const isAbout = link.text === 'Nosotros';

                            return (
                                <div
                                    key={link.to}
                                    className="flex items-center"
                                    onMouseEnter={() => {
                                        if (isProducts) openDrawer('products');
                                        else if (isAbout) openDrawer('about');
                                        else scheduleClose();
                                    }}
                                    onMouseLeave={() => {
                                        if (!isProducts && !isAbout) return;
                                        scheduleClose();
                                    }}
                                >
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) => {
                                            const isOpen = (isProducts && activeMegaMenu === 'products') || (isAbout && activeMegaMenu === 'about');
                                            const active = isActive || location.pathname.startsWith(link.to);
                                            return [
                                                'flex items-center text-[13px] transition-colors duration-150 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-chocolate-950 relative',
                                                isOpen
                                                    ? 'text-cacao-gold-300 font-medium after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[2px] after:bg-cacao-gold-400 after:rounded-full'
                                                    : active
                                                        ? 'text-white font-medium'
                                                        : 'text-white/80 hover:text-white font-normal',
                                            ].join(' ');
                                        }}
                                    >
                                        {link.text}
                                    </NavLink>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Actions — derecha, en flujo normal */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="text-white/80 hover:text-white transition-colors p-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-chocolate-950"
                            aria-label="Buscar"
                        >
                            <Search className="w-[18px] h-[18px]" />
                        </button>

                        <Link
                            to="/ruta-cacao-ancestral"
                            className="relative overflow-hidden hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/60 bg-gradient-to-br from-cacao-green-600 to-cacao-green-800 text-white text-[12px] font-medium tracking-[0.02em] shadow-[0_2px_10px_rgba(52,111,79,0.45)] hover:from-cacao-green-500 hover:to-cacao-green-700 hover:border-white/90 hover:shadow-[0_4px_14px_rgba(52,111,79,0.6)] transition-all duration-200 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:animate-shine before:pointer-events-none"
                        >
                            <Leaf className="w-3 h-3 opacity-80" />
                            Reservar Ruta
                        </Link>

                        <button
                            className="lg:hidden p-1.5 text-white/80 hover:text-white transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

            </motion.header>

            {/* ── DRAWER LATERAL (Desktop) ── */}
            <AnimatePresence>
                {activeMegaMenu && (
                    <>
                        {/* Backdrop invisible — cierra al click */}
                        <div
                            className="fixed inset-0 z-30 top-14 hidden lg:block"
                            onClick={() => setActiveMegaMenu(null)}
                        />
                        <motion.div
                            key="submenu-panel"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-14 left-0 w-full z-40 hidden lg:block bg-chocolate-950 border-b border-black/40 shadow-[0_8px_28px_rgba(0,0,0,0.28)]"
                            onMouseEnter={cancelClose}
                            onMouseLeave={scheduleClose}
                        >
                            <div className="max-w-xl mx-auto px-8 py-8 grid grid-cols-[1fr_1fr] gap-x-10">

                                {/* Columnas de secciones */}
                                {(activeMegaMenu === 'products' ? navLinks[4].submenu : navLinks[3].submenu)?.map((section) => (
                                    <div key={section.title}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <p className="text-[10px] font-semibold text-white/35 tracking-[0.16em] uppercase">
                                                {section.title}
                                            </p>
                                            <div className="flex-1 h-px bg-cacao-green-700/40" />
                                        </div>
                                        <ul className="space-y-0.5">
                                            {section.items.map((item) => (
                                                <li key={item.to}>
                                                    <Link
                                                        to={item.to}
                                                        className="group flex flex-col py-2 pl-3 border-l-2 border-transparent hover:border-cacao-gold-400/70 hover:bg-cacao-green-950/50 transition-all duration-100 rounded-r focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cacao-gold-400/50"
                                                        onClick={() => setActiveMegaMenu(null)}
                                                    >
                                                        <span className="text-[13px] text-white/70 group-hover:text-white transition-colors duration-100">
                                                            {item.text}
                                                        </span>
                                                        {item.desc && (
                                                            <span className="text-[11px] text-white/30 leading-snug mt-0.5">
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
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

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
                            onClick={() => { setIsMobileMenuOpen(false); setMobileSubmenu(null); }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed top-0 right-0 h-full w-[82vw] max-w-xs bg-chocolate-950 z-50 shadow-2xl flex flex-col overflow-hidden"
                        >
                            {/* Cabecera del drawer */}
                            <div className="h-12 px-4 border-b border-white/10 flex items-center flex-shrink-0 relative">
                                <AnimatePresence mode="wait">
                                    {mobileSubmenu ? (
                                        <motion.button
                                            key="back"
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -8 }}
                                            transition={{ duration: 0.15 }}
                                            onClick={() => setMobileSubmenu(null)}
                                            className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span className="text-[12px] font-medium">Menú</span>
                                        </motion.button>
                                    ) : (
                                        <motion.span
                                            key="title"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="text-[11px] font-semibold text-white/35 tracking-[0.12em] uppercase"
                                        >
                                            Menú
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                <button
                                    onClick={() => { setIsMobileMenuOpen(false); setMobileSubmenu(null); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Contenido con push navigation */}
                            <div className="flex-1 overflow-hidden relative">
                                <AnimatePresence mode="wait">
                                    {!mobileSubmenu ? (
                                        /* ── NIVEL 1 ── */
                                        <motion.div
                                            key="level1"
                                            initial={{ x: 0 }}
                                            animate={{ x: 0 }}
                                            exit={{ x: '-100%' }}
                                            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                                            className="absolute inset-0 overflow-y-auto py-4 px-4 space-y-1"
                                        >
                                            {navLinks.map((link) => (
                                                <div key={link.to}>
                                                    {link.submenu ? (
                                                        <button
                                                            onClick={() => setMobileSubmenu(link.text === 'Nosotros' ? 'about' : 'products')}
                                                            className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/[0.06] transition-colors text-left"
                                                        >
                                                            <span className="text-[15px] text-white/80">{link.text}</span>
                                                            <ChevronRight className="w-4 h-4 text-white/25" />
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            to={link.to}
                                                            className="flex items-center px-3 py-3 rounded-xl hover:bg-white/[0.06] transition-colors text-[15px] text-white/80 hover:text-white"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            {link.text}
                                                        </Link>
                                                    )}
                                                </div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        /* ── NIVEL 2 ── */
                                        <motion.div
                                            key="level2"
                                            initial={{ x: '100%' }}
                                            animate={{ x: 0 }}
                                            exit={{ x: '100%' }}
                                            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                                            className="absolute inset-0 overflow-y-auto"
                                        >
                                            {/* Título sección nivel 2 */}
                                            <div className="px-5 pt-5 pb-4 border-b border-white/10">
                                                <p className="text-[10px] font-semibold text-white/35 tracking-[0.14em] uppercase mb-1">
                                                    {mobileSubmenu === 'products' ? 'Tienda' : 'La Asociación'}
                                                </p>
                                                <p className="text-[18px] font-light text-white">
                                                    {mobileSubmenu === 'products' ? 'Nuestros Productos' : 'Nosotros'}
                                                </p>
                                            </div>
                                            <div className="pb-4">
                                                {(mobileSubmenu === 'products' ? navLinks[4].submenu : navLinks[3].submenu)?.map((section, si) => (
                                                    <div key={section.title} className={si > 0 ? 'border-t border-white/[0.07]' : ''}>
                                                        <p className="text-[10px] font-semibold text-white/35 tracking-[0.14em] uppercase px-5 pt-4 pb-2">
                                                            {section.title}
                                                        </p>
                                                        <ul>
                                                            {section.items.map((item) => (
                                                                <li key={item.to}>
                                                                    <Link
                                                                        to={item.to}
                                                                        className="flex flex-col pl-5 pr-4 py-2.5 border-l-2 border-transparent active:border-cacao-gold-400/70 active:bg-cacao-green-950/50"
                                                                        onClick={() => { setIsMobileMenuOpen(false); setMobileSubmenu(null); }}
                                                                    >
                                                                        <span className="text-[14px] text-white/70">{item.text}</span>
                                                                        {item.desc && <span className="text-[12px] text-white/30 mt-0.5">{item.desc}</span>}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                                <div className="border-t border-cacao-green-700/30 mx-5 mt-4 pt-4">
                                                    <Link
                                                        to={mobileSubmenu === 'products' ? '/products' : '/about'}
                                                        className="flex items-center gap-1.5 text-[12px] text-cacao-gold-400/60 hover:text-cacao-gold-300 transition-colors"
                                                        onClick={() => { setIsMobileMenuOpen(false); setMobileSubmenu(null); }}
                                                    >
                                                        Ver todo en {mobileSubmenu === 'products' ? 'Productos' : 'Nosotros'}
                                                        <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="p-4 border-t border-white/10 flex-shrink-0">
                                <Link
                                    to="/ruta-cacao-ancestral"
                                    className="relative overflow-hidden flex w-full items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/60 bg-gradient-to-br from-cacao-green-600 to-cacao-green-800 text-white text-[13px] font-medium shadow-[0_2px_10px_rgba(52,111,79,0.45)] hover:from-cacao-green-500 hover:to-cacao-green-700 hover:border-white/90 hover:shadow-[0_4px_14px_rgba(52,111,79,0.6)] transition-all duration-200 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:animate-shine before:pointer-events-none"
                                    onClick={() => { setIsMobileMenuOpen(false); setMobileSubmenu(null); }}
                                >
                                    <Leaf className="w-3.5 h-3.5 opacity-80" />
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
