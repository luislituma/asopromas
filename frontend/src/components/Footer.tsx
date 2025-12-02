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
                src="/assets/icons/logo.svg"
                alt="ASOPROMAS Logo"
                className="w-6 h-6"
              />
              <h2 className="text-base font-bold text-amber-300">ASOPROMAS</h2>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-0 text-[10px]">
              <a 
                href="https://wa.me/593961706421" 
                className="flex items-center justify-center md:justify-start gap-1 text-gray-300 hover:text-amber-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
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
            <div className="flex justify-center md:justify-end gap-3 mb-1">
              <a
                href="https://www.facebook.com/asopromas"
                className="bg-[#1877F2] hover:bg-[#0e62d0] p-2.5 rounded-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border border-[#1877F2]"
                aria-label="Síguenos en Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/asopromas"
                className="bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040] hover:opacity-90 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border border-[#E1306C]"
                aria-label="Síguenos en Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@asopromas"
                className="bg-[#FF0000] hover:bg-[#cc0000] p-2.5 rounded-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border border-[#FF0000]"
                aria-label="Síguenos en YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@asopromas"
                className="bg-black hover:bg-gray-800 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border border-gray-700"
                aria-label="Síguenos en TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
            <p className="text-gray-400 text-xs">
              Únete a nuestra comunidad
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-2">
          <div className="flex flex-col items-center gap-2 text-[10px] text-gray-400">
            <div className="text-center">
              <p>
                © {new Date().getFullYear()} ASOPROMAS. Todos los derechos reservados.
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Link to="/privacy" className="hover:text-amber-300 transition-colors">
                  Política de Privacidad
                </Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-amber-300 transition-colors">
                  Términos y Condiciones
                </Link>
              </div>
            </div>
            <p className="flex items-center gap-1 text-center">
              Hecho en Ecuador con <span className="text-amber-500">❤️</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;