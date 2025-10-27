import { type FC } from "react";
import { Facebook, Instagram, Youtube, Mail, Send } from "lucide-react";

const Footer: FC = () => {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would implement newsletter subscription
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    console.log('Newsletter subscription:', email);
  };

  return (
    <footer 
      className="bg-gradient-to-b from-gray-50 via-white to-gray-100 w-full text-gray-900 relative overflow-hidden shadow-xl"
      role="contentinfo"
      aria-label="Información de contacto y enlaces"
      id="footer"
    >
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/5 via-gray-500/10 to-gray-900/5 transform -skew-y-1"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-400/5 to-gray-300/5"></div>
      </div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/2 via-gray-100/5 to-white/10" aria-hidden="true"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Columna 1: Marca */}
            <section 
              className="group flex flex-col items-center sm:items-start bg-gradient-to-br from-gray-900/5 to-gray-200/20 p-6 rounded-xl border border-gray-600/20 backdrop-blur-sm shadow-lg hover:shadow-gray-500/10 hover:border-gray-700/30 transition-all duration-300"
              aria-labelledby="brand-heading"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <img
                    src="/src/assets/icons/logo.svg"
                    alt="ASOPROMAS Logo"
                    className="w-10 h-10 lg:w-12 lg:h-12 filter drop-shadow-lg"
                  />
                </div>
                <h2 
                  id="brand-heading"
                  className="text-xl lg:text-2xl text-gray-900 font-bold tracking-wide"
                >
                  ASOPROMAS
                </h2>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed text-center sm:text-left max-w-xs mb-4">
                Cacao de origen premium, elaborado con pasión por nuestra comunidad desde 2000.
              </p>
              <address 
                className="w-full bg-gradient-to-r from-gray-200/40 to-gray-300/30 p-3 rounded-lg border border-gray-400/20 not-italic"
                aria-label="Información de contacto"
              >
                <div className="space-y-1">
                  <p className="text-gray-800 text-xs flex items-center justify-center sm:justify-start">
                    <span className="text-gray-600 mr-2" aria-hidden="true">📍</span>
                    <span>Zamora-Chinchipe, Ecuador</span>
                  </p>
                  <p className="text-gray-800 text-xs flex items-center justify-center sm:justify-start">
                    <span className="text-gray-600 mr-2" aria-hidden="true">📞</span>
                    <a 
                      href="tel:+593961706421" 
                      className="hover:text-[#411900] transition-colors focus-visible"
                      aria-label="Llamar al +593 96 170 6421"
                    >
                      +593 96 170 6421
                    </a>
                  </p>
                  <p className="text-gray-800 text-xs flex items-center justify-center sm:justify-start">
                    <span className="text-gray-600 mr-2" aria-hidden="true">✉️</span>
                    <a 
                      href="mailto:info@asopromas.com" 
                      className="hover:text-[#411900] transition-colors focus-visible"
                      aria-label="Enviar email a info@asopromas.com"
                    >
                      info@asopromas.com
                    </a>
                  </p>
                </div>
              </address>
            </section>

            {/* Columna 2: Redes Sociales */}
            <section 
              className="text-center sm:text-left bg-gradient-to-br from-gray-900/5 to-gray-200/20 p-6 rounded-xl border border-gray-600/20 backdrop-blur-sm shadow-lg"
              aria-labelledby="social-heading"
            >
              <h3 
                id="social-heading"
                className="text-lg lg:text-xl text-gray-900 font-bold mb-4 pb-2 border-b border-gray-500/30"
              >
                Síguenos
              </h3>
              <nav 
                className="flex justify-center gap-3 mb-4"
                aria-label="Redes sociales"
              >
                <a
                  href="https://www.facebook.com/asopromas"
                  className="group bg-gray-200/50 hover:bg-blue-600 p-3 rounded-lg transition-all duration-300 border border-gray-400/30 hover:border-blue-500 focus-visible"
                  aria-label="Visitar Facebook de ASOPROMAS"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" aria-hidden="true" />
                </a>
                <a
                  href="https://www.instagram.com/asopromas"
                  className="group bg-gray-200/50 hover:bg-purple-600 p-3 rounded-lg transition-all duration-300 border border-gray-400/30 hover:border-purple-500 focus-visible"
                  aria-label="Visitar Instagram de ASOPROMAS"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" aria-hidden="true" />
                </a>
                <a
                  href="https://www.youtube.com/asopromas"
                  className="group bg-gray-200/50 hover:bg-red-600 p-3 rounded-lg transition-all duration-300 border border-gray-400/30 hover:border-red-500 focus-visible"
                  aria-label="Visitar YouTube de ASOPROMAS"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" aria-hidden="true" />
                </a>
                <a
                  href="mailto:info@asopromas.com"
                  className="group bg-gray-200/50 hover:bg-green-600 p-3 rounded-lg transition-all duration-300 border border-gray-400/30 hover:border-green-500 focus-visible"
                  aria-label="Enviar email a ASOPROMAS"
                >
                  <Mail className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" aria-hidden="true" />
                </a>
              </nav>
              <div className="bg-gray-200/30 p-3 rounded-lg border border-gray-400/20">
                <p className="text-xs text-gray-700 text-center">
                  Únete a nuestra comunidad de <span className="font-medium text-gray-900">5,000+</span> seguidores
                </p>
              </div>
            </section>

            {/* Columna 3: Newsletter */}
            <section 
              className="bg-gradient-to-br from-gray-900/5 to-gray-200/20 p-6 rounded-xl border border-gray-600/20 backdrop-blur-sm shadow-lg"
              aria-labelledby="newsletter-heading"
            >
              <div className="relative z-10">
                <h3 
                  id="newsletter-heading"
                  className="text-lg lg:text-xl text-gray-900 font-bold mb-4 text-center"
                >
                  📧 Newsletter
                </h3>
                <p className="text-sm text-gray-700 mb-4 text-center leading-relaxed">
                  Recibe ofertas exclusivas y noticias sobre nuestros productos de cacao.
                </p>
                <form 
                  className="space-y-3" 
                  onSubmit={handleNewsletterSubmit}
                  aria-labelledby="newsletter-heading"
                >
                  <div className="relative">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Tu dirección de email para el newsletter
                    </label>
                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      required
                      placeholder="tu@email.com"
                      className="w-full p-3 pr-12 rounded-lg bg-gray-200/50 border border-gray-400/30 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#411900] focus:border-[#411900] transition-all"
                      aria-describedby="email-description"
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" aria-hidden="true" />
                  </div>
                  <p id="email-description" className="sr-only">
                    Ingresa tu email para recibir nuestro newsletter con ofertas y noticias sobre productos de cacao
                  </p>
                  <button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 focus-visible"
                    aria-describedby="subscribe-description"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>Suscribirse</span>
                  </button>
                  <p id="subscribe-description" className="sr-only">
                    Suscribirse al newsletter de ASOPROMAS para recibir ofertas exclusivas
                  </p>
                </form>
                <div className="mt-4 rounded-xl border border-amber-400/20 backdrop-blur-sm">
                  <p className="text-xs text-amber-900 text-center leading-relaxed font-light">
                    🔒 <span className="font-medium">100% Privado</span> • Sin spam • Cancela en cualquier momento
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center container mx-auto px-4 lg:px-6 py-6 bg-gradient-to-r from-gray-100/60 to-gray-50/40 rounded-t-xl border-t border-gray-300/30">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-gray-700 text-sm font-medium">
              © {new Date().getFullYear()} <span className="font-bold text-gray-900">ASOPROMAS</span> - Todos los derechos reservados.
            </p>
            <p className="text-gray-600 text-xs">
              Hecho en <span className="text-yellow-500 text-xl" role="img" aria-label="bandera de Ecuador">🇪🇨</span> para promover el cacao ecuatoriano
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;