import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Leaf, Globe, ArrowRight, Users, Mountain } from 'lucide-react';

const CacaoOrigin: FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#f9f5f0] to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3b1d0e] via-[#6b3e24] to-[#8b5a3c]">
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/30 mb-6">
            <Mountain className="w-5 h-5 text-amber-300" />
            <span className="text-amber-100 font-semibold">5,000+ años de historia</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            El Origen del Cacao
            <span className="block text-amber-300 mt-2">Más Antiguo del Mundo</span>
          </h1>
          
          <p className="text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
            Descubre la conexión ancestral entre Zamora Chinchipe y el nacimiento del cacao, 
            una historia que comenzó hace más de 5 milenios.
          </p>
        </div>
      </section>

      {/* A. Herencia Ancestral */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenido */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
                <Leaf className="w-5 h-5 text-amber-700" />
                <span className="text-amber-900 font-semibold">Herencia Ancestral</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-[#3b1d0e] mb-6">
                En el Corazón de la Historia
              </h2>
              
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  En el corazón de <strong className="text-[#3b1d0e]">Zamora Chinchipe</strong>, 
                  en los valles fértiles de <strong className="text-[#3b1d0e]">Palanda</strong>, 
                  se descubrieron los vestigios del cacao más antiguo del mundo, con más de 
                  <strong className="text-amber-700"> 5.000 años de historia</strong>.
                </p>
                
                <p>
                  <strong className="text-[#3b1d0e]">Asopromas</strong>, con sus raíces en 
                  <strong className="text-[#3b1d0e]"> Zumbi</strong>, comparte ese mismo suelo 
                  ancestral donde el cacao nació y evolucionó junto a nuestras comunidades.
                </p>
                
                <p className="text-amber-800 font-semibold italic bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                  Cada grano que cultivamos honra esa herencia y continúa una tradición 
                  que ha perdurado milenios.
                </p>
              </div>
            </div>

            {/* Visual / Imagen */}
            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#6b3e24] to-[#c9a27e] flex items-center justify-center">
                  {/* Placeholder - Puedes reemplazar con imagen real */}
                  <div className="text-center p-8">
                    <MapPin className="w-20 h-20 text-white/80 mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">Santa Ana de Palanda</p>
                    <p className="text-white/80 text-sm mt-2">Sitio Arqueológico</p>
                  </div>
                </div>
                
                {/* Mapa decorativo */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center gap-3 text-white">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="font-semibold">Zamora Chinchipe</p>
                      <p className="text-sm text-white/80">Ecuador - Amazonía</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. El Legado que Vive */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#3b1d0e] to-[#6b3e24]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual / Imagen */}
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#c9a27e] to-[#8b5a3c] flex items-center justify-center">
                  {/* Placeholder - Puedes reemplazar con imagen real de productores */}
                  <div className="text-center p-8">
                    <Users className="w-20 h-20 text-white/80 mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">Nuestros Productores</p>
                    <p className="text-white/80 text-sm mt-2">Guardianes del Legado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/30 mb-6">
                <Leaf className="w-5 h-5 text-amber-300" />
                <span className="text-amber-100 font-semibold">El Legado que Vive</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Herederos de una Historia Milenaria
              </h2>
              
              <div className="space-y-4 text-lg text-amber-100 leading-relaxed">
                <p>
                  Nuestros socios —productores rurales de <strong className="text-amber-300">Palanda</strong>, 
                  <strong className="text-amber-300"> Zumbi</strong> y comunidades cercanas— son los 
                  <strong className="text-white"> herederos de esa historia</strong>.
                </p>
                
                <p>
                  A través del <strong className="text-amber-300">cultivo sostenible</strong> y el 
                  respeto por la naturaleza, mantenemos vivo el legado del cacao original, 
                  conectando <strong className="text-white">pasado, presente y futuro</strong> en 
                  cada tableta de chocolate <strong className="text-amber-300">Kujeñito</strong>.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-3xl font-bold text-amber-300">5000+</p>
                  <p className="text-sm text-white/80 mt-1">Años de Historia</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-3xl font-bold text-amber-300">100%</p>
                  <p className="text-sm text-white/80 mt-1">Cultivo Sostenible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* C. De Zamora Chinchipe al Mundo */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Globe className="w-5 h-5 text-blue-700" />
            <span className="text-blue-900 font-semibold">De Zamora Chinchipe al Mundo</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-[#3b1d0e] mb-6">
            Compartiendo Nuestro Origen con el Mundo
          </h2>
          
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed mb-12">
            <p>
              Desde las <strong className="text-[#3b1d0e]">montañas amazónicas</strong> hasta 
              los paladares del mundo, el cacao de <strong className="text-[#3b1d0e]">Asopromas</strong> cuenta 
              una historia que comenzó hace miles de años.
            </p>
            
            <p className="text-xl font-semibold text-amber-700">
              No solo producimos chocolate: compartimos un pedazo del origen del cacao.
            </p>
          </div>

          {/* Mapa Visual Decorativo */}
          <div className="relative my-12 p-12 bg-gradient-to-br from-blue-50 to-amber-50 rounded-2xl border-2 border-amber-200">
            <Globe className="w-32 h-32 text-amber-600/20 mx-auto mb-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Punto de origen */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-amber-600 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-amber-600 rounded-full"></div>
                </div>
                
                {/* Líneas que se expanden */}
                <svg className="w-64 h-64" viewBox="0 0 200 200">
                  <line x1="100" y1="100" x2="20" y2="40" stroke="#d97706" strokeWidth="2" strokeDasharray="4 2" opacity="0.5"/>
                  <line x1="100" y1="100" x2="180" y2="60" stroke="#d97706" strokeWidth="2" strokeDasharray="4 2" opacity="0.5"/>
                  <line x1="100" y1="100" x2="160" y2="140" stroke="#d97706" strokeWidth="2" strokeDasharray="4 2" opacity="0.5"/>
                  <line x1="100" y1="100" x2="40" y2="160" stroke="#d97706" strokeWidth="2" strokeDasharray="4 2" opacity="0.5"/>
                </svg>
              </div>
            </div>
            <p className="relative z-10 text-amber-800 font-semibold mt-8">
              Zamora Chinchipe, Ecuador
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white 
                bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-xl
                hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600
                transform hover:scale-105 active:scale-100
                shadow-xl hover:shadow-2xl hover:shadow-amber-500/50
                transition-all duration-300"
            >
              <Leaf className="w-6 h-6" />
              <span>Descubre Nuestro Cacao</span>
              <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/about/history"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-[#3b1d0e] 
                bg-white border-2 border-amber-600 rounded-xl
                hover:bg-amber-50
                transform hover:scale-105 active:scale-100
                shadow-lg hover:shadow-xl
                transition-all duration-300"
            >
              <span>Nuestra Historia</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline Visual */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#3b1d0e] mb-12">
            Una Línea de Tiempo Extraordinaria
          </h2>
          
          <div className="relative">
            {/* Línea vertical */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600 -translate-x-1/2"></div>
            
            {/* Hitos */}
            <div className="space-y-12">
              {/* 3000 AC */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <h3 className="text-2xl font-bold text-amber-700">3000 AC</h3>
                  <p className="text-gray-600 mt-2">Primeros vestigios de cacao en Palanda</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="flex-1 pl-8"></div>
              </div>
              
              {/* Culturas Ancestrales */}
              <div className="relative flex items-center">
                <div className="flex-1 pr-8"></div>
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="flex-1 pl-8">
                  <h3 className="text-2xl font-bold text-amber-700">Culturas Mayo-Chinchipe</h3>
                  <p className="text-gray-600 mt-2">Domesticación y cultivo del cacao</p>
                </div>
              </div>
              
              {/* Actualidad */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <h3 className="text-2xl font-bold text-amber-700">2025</h3>
                  <p className="text-gray-600 mt-2">ASOPROMAS continúa el legado</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full border-4 border-white shadow-xl z-10 animate-pulse"></div>
                <div className="flex-1 pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CacaoOrigin;
