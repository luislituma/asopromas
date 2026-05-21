import { type FC } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

const Footer: FC = () => {
  return (
    <footer 
      className="bg-cacao-green-950 text-cacao-green-50 pt-20 pb-10 border-t border-cacao-green-900"
      role="contentinfo"
      aria-label="Información de contacto y enlaces"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Info */}
          <div className="md:col-span-5 lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/assets/icons/logo.svg"
                alt="ASOPROMAS Logo"
                className="w-10 h-10 brightness-0 invert opacity-90"
              />
              <h2 className="text-xl font-medium tracking-wide text-white">ASOPROMAS</h2>
            </div>
            <p className="text-cacao-green-200/80 font-light leading-relaxed max-w-sm text-sm">
              Cultivando el legado del cacao más antiguo del mundo. Desde la Amazonía ecuatoriana, protegiendo la biodiversidad y empoderando a nuestras comunidades.
            </p>
            
            <div className="space-y-3 pt-4">
              <a 
                href="https://wa.me/593961706421" 
                className="flex items-center gap-3 text-cacao-green-200 hover:text-white transition-colors text-sm font-light group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-8 h-8 rounded-full bg-cacao-green-900 flex items-center justify-center group-hover:bg-cacao-green-800 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+593 96 170 6421</span>
              </a>
              <a 
                href="mailto:info@asopromas.com" 
                className="flex items-center gap-3 text-cacao-green-200 hover:text-white transition-colors text-sm font-light group"
              >
                <div className="w-8 h-8 rounded-full bg-cacao-green-900 flex items-center justify-center group-hover:bg-cacao-green-800 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@asopromas.com</span>
              </a>
              <div className="flex items-center gap-3 text-cacao-green-200 text-sm font-light">
                <div className="w-8 h-8 rounded-full bg-cacao-green-900 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Zumbi, Zamora Chinchipe, Ecuador</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-2 lg:col-start-7">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-cacao-green-400 mb-6">Explorar</h3>
            <nav className="space-y-4">
              <Link to="/cacao-origin" className="block text-cacao-green-200/80 hover:text-white transition-colors font-light text-sm">
                Origen del Cacao
              </Link>
              <Link to="/products" className="block text-cacao-green-200/80 hover:text-white transition-colors font-light text-sm">
                Nuestra Colección
              </Link>
              <Link to="/ruta-cacao-ancestral" className="block text-cacao-green-200/80 hover:text-white transition-colors font-light text-sm">
                Ruta del Cacao
              </Link>
              <Link to="/about" className="block text-cacao-green-200/80 hover:text-white transition-colors font-light text-sm">
                Nosotros
              </Link>
              <Link to="/contact" className="block text-cacao-green-200/80 hover:text-white transition-colors font-light text-sm">
                Contacto
              </Link>
            </nav>
          </div>

          {/* Social Media & Newsletter */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-cacao-green-400 mb-6">Comunidad</h3>
            <p className="text-cacao-green-200/80 font-light text-sm mb-6">
              Síguenos para conocer más sobre nuestro proceso artesanal y las historias de nuestros productores.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/asopromas"
                className="w-10 h-10 rounded-full border border-cacao-green-800 flex items-center justify-center text-cacao-green-200 hover:bg-cacao-green-800 hover:text-white transition-all duration-300"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/asopromas"
                className="w-10 h-10 rounded-full border border-cacao-green-800 flex items-center justify-center text-cacao-green-200 hover:bg-cacao-green-800 hover:text-white transition-all duration-300"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@asopromas"
                className="w-10 h-10 rounded-full border border-cacao-green-800 flex items-center justify-center text-cacao-green-200 hover:bg-cacao-green-800 hover:text-white transition-all duration-300"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@asopromas"
                className="w-10 h-10 rounded-full border border-cacao-green-800 flex items-center justify-center text-cacao-green-200 hover:bg-cacao-green-800 hover:text-white transition-all duration-300"
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cacao-green-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cacao-green-400 text-xs font-light">
            © {new Date().getFullYear()} ASOPROMAS. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-6 text-cacao-green-400 text-xs font-light">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Política de Privacidad
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Términos y Condiciones
            </Link>
          </div>
          
          <p className="flex items-center gap-1 text-cacao-green-400 text-xs font-light">
            Hecho en Ecuador con <span className="text-chocolate-400">♥</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;