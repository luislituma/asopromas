import { type FC } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

const Footer: FC = () => {
  return (
    <footer 
      className="bg-gradient-to-b from-gray-900 to-[#3b1d0e] text-white py-4"
      role="contentinfo"
      aria-label="Información de contacto y enlaces"
    >
      <div className="container mx-auto px-4 lg:px-6">
        
        {/* Main Content - Single Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          
          {/* Columna 1: Brand & Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <img
                src="/src/assets/icons/logo.svg"
                alt="ASOPROMAS Logo"
                className="w-6 h-6"
              />
              <h2 className="text-base font-bold text-amber-300">ASOPROMAS</h2>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-0 text-[10px]">
              <a 
                href="tel:+593961706421" 
                className="flex items-center justify-center md:justify-start gap-1 text-gray-300 hover:text-amber-300 transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>+593 96 170 6421</span>
              </a>
              <a 
                href="mailto:info@asopromas.com" 
                className="flex items-center justify-center md:justify-start gap-1 text-gray-300 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-3 h-3" />
                <span>info@asopromas.com</span>
              </a>
              <div className="flex items-center justify-center md:justify-start gap-1 text-gray-300">
                <MapPin className="w-3 h-3" />
                <span>Zamora, Ecuador</span>
              </div>
            </div>
          </div>

          {/* Columna 2: Quick Links */}
          <div className="text-center">
            <h3 className="text-sm font-bold text-amber-300 mb-1.5">Enlaces</h3>
            <nav className="space-y-0">
              <Link 
                to="/" 
                className="block text-gray-300 hover:text-amber-300 transition-colors text-[10px]"
              >
                Inicio
              </Link>
              <Link 
                to="/cacao-origin" 
                className="block text-gray-300 hover:text-amber-300 transition-colors text-[10px]"
              >
                Origen del Cacao
              </Link>
              <Link 
                to="/products" 
                className="block text-gray-300 hover:text-amber-300 transition-colors text-[10px]"
              >
                Productos
              </Link>
              <Link 
                to="/about" 
                className="block text-gray-300 hover:text-amber-300 transition-colors text-[10px]"
              >
                Nosotros
              </Link>
              <Link 
                to="/contact" 
                className="block text-gray-300 hover:text-amber-300 transition-colors text-[10px]"
              >
                Contacto
              </Link>
            </nav>
          </div>

          {/* Columna 3: Social Media */}
          <div className="text-center md:text-right">
            <h3 className="text-sm font-bold text-amber-300 mb-1.5">Síguenos</h3>
            <div className="flex justify-center md:justify-end gap-1.5 mb-0.5">
              <a
                href="https://www.facebook.com/asopromas"
                className="bg-white/10 hover:bg-amber-500 p-1.5 rounded transition-all duration-300"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.instagram.com/asopromas"
                className="bg-white/10 hover:bg-amber-500 p-1.5 rounded transition-all duration-300"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.youtube.com/asopromas"
                className="bg-white/10 hover:bg-amber-500 p-1.5 rounded transition-all duration-300"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-gray-400 text-xs">
              Únete a nuestra comunidad
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-0.5 text-[10px] text-gray-400">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} ASOPROMAS. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-1 text-center md:text-right">
              Hecho en Ecuador con <span className="text-amber-500">❤️</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;