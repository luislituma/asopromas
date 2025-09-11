import { type FC, useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, X, ChevronDown, ShoppingBag, ArrowRight } from 'lucide-react';
import logoUrl from '../assets/icons/logo.svg'; // ✅ importar en Vite

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

    const navLinks: NavItem[] = [
        { to: '/', text: 'Home' },
        {
            to: '/about',
            text: 'About Us',
            submenu: [
                {
                    title: 'Our History',
                    items: [
                        { to: '/about/history', text: 'ASOPROMAS History' },
                        { to: '/about/mission', text: 'Mission & Vision' },
                        { to: '/about/values', text: 'Values' },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        { to: '/about/producers', text: 'Our Producers' },
                        { to: '/about/sustainability', text: 'Sustainability' },
                        { to: '/about/certifications', text: 'Certifications' },
                    ],
                },
            ],
        },
        {
            to: '/products',
            text: 'Products',
            submenu: [
                {
                    title: 'Chocolate',
                    items: [
                        { to: '/products/chocolate-bar', text: 'Chocolate Bars' },
                        { to: '/products/pralines', text: 'Artisanal Pralines' },
                        { to: '/products/chocolate-drink', text: 'Chocolate Drinks' },
                    ],
                },
                {
                    title: 'Cocoa',
                    items: [
                        { to: '/products/cocoa-liquor', text: 'Cocoa Liquor' },
                        { to: '/products/cocoa-powder', text: 'Cocoa Powder' },
                        { to: '/products/cocoa-nibs', text: 'Cocoa Nibs' },
                    ],
                },
            ],
        },
        { to: '/contact', text: 'Contact' },
    ];

    // Datos demo para el buscador
    const allItems = [
        { name: 'Pure Chocolate', type: 'Product', to: '/products/chocolate-bar' },
        { name: 'Artisanal Pralines', type: 'Product', to: '/products/pralines' },
        { name: 'Cocoa Liquor', type: 'Product', to: '/products/cocoa-liquor' },
        { name: 'Association History', type: 'History', to: '/about/history' },
        { name: 'Our Producers', type: 'Community', to: '/about/producers' },
        { name: 'Blog: Chocolate Festival', type: 'Blog', to: '/blog/festival' },
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

                    {/* Desktop */}
                    <nav className="hidden md:flex items-center gap-14">
                        {navLinks.map((link) => {
                            const hasSub = Boolean(link.submenu);
                            const isProducts = link.text === 'Products';
                            const isAbout = link.text === 'About Us';

                            return (
                                <div
                                    key={link.text}
                                    className="relative group"
                                    onMouseEnter={() => {
                                        if (isProducts) {
                                            setOpenSubmenuProducts(true);
                                            setOpenSubmenuAbout(false);
                                        }
                                        if (isAbout) {
                                            setOpenSubmenuAbout(true);
                                            setOpenSubmenuProducts(false);
                                        }
                                    }}
                                    onClick={() => {
                                        if (isProducts) {
                                            setOpenSubmenuProducts(!openSubmenuProducts);
                                            setOpenSubmenuAbout(false);
                                        }
                                        if (isAbout) {
                                            setOpenSubmenuAbout(!openSubmenuAbout);
                                            setOpenSubmenuProducts(false);
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
                                        {hasSub && <ChevronDown className="w-4 h-4 hidden" />}
                                    </NavLink>

                                    {/* Mega menu */}
                                    {hasSub && (
                                        <div
                                            className={`mega-menu fixed left-0 right-0 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/93 shadow-xl transform transition-all duration-300 ease-out ${(isProducts ? openSubmenuProducts : openSubmenuAbout)
                                                ? 'opacity-100 translate-y-0 pointer-events-auto'
                                                : 'opacity-0 -translate-y-2 pointer-events-none'
                                                }`}
                                            style={{ top: '64px' }}
                                            onMouseEnter={() => {
                                                if (isProducts) setOpenSubmenuProducts(true);
                                                if (isAbout) setOpenSubmenuAbout(true);
                                            }}
                                            onMouseLeave={() => {
                                                if (isProducts) setOpenSubmenuProducts(false);
                                                if (isAbout) setOpenSubmenuAbout(false);
                                            }}
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 text-center md:justify-end ">
                                                {link.submenu!.map((section) => (
                                                    <div key={section.title} className="w-50%">
                                                        {/* 👆 puedes controlar el ancho de cada columna */}
                                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#8B4513] mb-3">
                                                            {section.title}
                                                        </h3>
                                                        <ul className="space-y-2">
                                                            {section.items.map((item) => (
                                                                <li key={item.to}>
                                                                    <NavLink
                                                                        to={item.to}
                                                                        className={({ isActive }) =>
                                                                            `block py-1 text-[15px] transition-colors ${isActive
                                                                                ? 'text-[#411900] font-medium'
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
                                    )}
                                </div>
                            );
                        })}

                        {/* Search button */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 rounded-md text-gray-600 hover:text-[#411900] hover:bg-gray-100"
                            aria-label="Open search"
                        >
                            <Search size={20} />
                        </button>

                        {/* CTA catálogo */}
                        <Link
                            to="/products"
                        >
                            <ShoppingBag className="w-5 h-5" />
                        </Link>
                    </nav>
                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#411900] hover:bg-gray-100"
                        onClick={() => setIsMenuOpen((v) => !v)}
                        aria-label="Toggle menu"
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

                                    {/* Subniveles en mobile, simples (no hover) */}
                                    {link.submenu && (
                                        <div className="pl-4 pb-2">
                                            {link.submenu.map((section) => (
                                                <div key={section.title} className="py-2">
                                                    <h4 className="px-4 text-xs font-semibold uppercase tracking-wide text-[#8B4513]">
                                                        {section.title}
                                                    </h4>
                                                    <div className="mt-1">
                                                        {section.items.map((item) => (
                                                            <NavLink
                                                                key={item.to}
                                                                to={item.to}
                                                                className={({ isActive }) =>
                                                                    `block px-4 py-2 text-sm ${isActive
                                                                        ? 'text-[#411900]'
                                                                        : 'text-gray-600 hover:text-[#411900]'
                                                                    }`
                                                                }
                                                            >
                                                                {item.text}
                                                            </NavLink>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                )}
            </div>

            {/* Search modal */}
            {searchOpen && (
                <div className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-center pt-20">
                    <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl mx-4">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Search</h2>
                            <button
                                onClick={() => setSearchOpen(false)}
                                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                aria-label="Close search"
                            >
                                <X size={22} />
                            </button>
                        </div>
                        <div className="p-4">
                            <input
                                type="text"
                                placeholder="Search products, articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                            />
                            {searchTerm && (
                                <div className="mt-4 space-y-1">
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
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
