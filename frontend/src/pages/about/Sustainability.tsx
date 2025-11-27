import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Leaf, TreePine, Shield, Globe, Recycle } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const Sustainability: FC = () => {
  // SEO Configuration
  useSEO({
    title: 'Sostenibilidad Ambiental - ASOPROMAS | Cacao Ecológico Ecuador',
    description: 'Descubre las prácticas sostenibles de ASOPROMAS: agroforestería, economía circular, conservación del suelo y certificaciones ambientales en Zamora Chinchipe.',
    keywords: 'sostenibilidad cacao Ecuador, agroforestería cacao, agricultura ecológica, certificación orgánica Ecuador, carbono neutral cacao',
    url: '/about/sustainability',
    type: 'article'
  });

  const initiatives = [
    {
      icon: <TreePine className="w-8 h-8" />,
      title: 'Agroforestería',
      description: 'Cultivamos cacao bajo sombra de árboles nativos, preservando la biodiversidad amazónica.',
      impact: '2,500 hectáreas protegidas',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: 'Economía Circular',
      description: 'Aprovechamos subproductos del cacao para crear compost y biomasa energética.',
      impact: '85% de residuos reciclados',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Conservación del Suelo',
      description: 'Implementamos técnicas que previenen la erosión y mantienen la fertilidad natural.',
      impact: '95% suelos saludables',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Carbono Neutro',
      description: 'Nuestras plantaciones capturan más CO2 del que producimos en toda la cadena.',
      impact: '120 ton CO2/año capturadas',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Sostenibilidad Ambiental
          </h1>
          <p className="text-xl sm:text-2xl text-green-100 max-w-3xl mx-auto">
            Comprometidos con la preservación de la Amazonía ecuatoriana para las futuras generaciones
          </p>
        </div>
      </section>

      {/* Environmental Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Nuestra Misión Ambiental
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                En ASOPROMAS creemos que la producción de cacao debe ir de la mano con 
                la conservación del medio ambiente. Nuestro enfoque integral combina 
                prácticas agrícolas ancestrales con tecnologías modernas sostenibles.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Cada grano de cacao que producimos es testimonio de nuestro compromiso 
                con la Madre Tierra y las comunidades que dependen de ella.
              </p>
              <div className="flex items-center gap-4">
                <Leaf className="w-8 h-8 text-green-600" />
                <span className="text-lg font-semibold text-gray-900">
                  35 años protegiendo la biodiversidad amazónica
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Impacto Positivo
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">2,500</div>
                  <div className="text-sm text-gray-600">Hectáreas Protegidas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-600">Especies Preservadas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">Residuos Aprovechados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Químicos Sintéticos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Initiatives */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nuestras Iniciativas Sostenibles
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Acciones concretas que implementamos diariamente para proteger nuestro entorno
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {initiatives.map((initiative) => (
              <div
                key={initiative.title}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${initiative.color} text-white mb-6`}>
                  {initiative.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {initiative.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {initiative.description}
                </p>
                <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm">
                  {initiative.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Objetivos 2030
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Metas ambiciosas para la próxima década en sostenibilidad
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Reforestación
              </h3>
              <p className="text-gray-700 mb-4">
                Plantar 50,000 árboles nativos en nuestras zonas de influencia.
              </p>
              <div className="bg-green-500 h-2 rounded-full mb-2">
                <div className="bg-green-600 h-2 rounded-full w-1/3"></div>
              </div>
              <span className="text-sm text-green-700">33% completado</span>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">💧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Agua Limpia
              </h3>
              <p className="text-gray-700 mb-4">
                100% de nuestras operaciones con sistemas de tratamiento de aguas.
              </p>
              <div className="bg-blue-500 h-2 rounded-full mb-2">
                <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
              </div>
              <span className="text-sm text-blue-700">75% completado</span>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Energía Verde
              </h3>
              <p className="text-gray-700 mb-4">
                Transición completa a energías renovables en todas nuestras instalaciones.
              </p>
              <div className="bg-purple-500 h-2 rounded-full mb-2">
                <div className="bg-purple-600 h-2 rounded-full w-1/2"></div>
              </div>
              <span className="text-sm text-purple-700">50% completado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Únete a Nuestro Compromiso Verde
          </h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
            Cada compra de nuestros productos contribuye directamente a la conservación 
            de la Amazonía ecuatoriana y al bienestar de nuestras comunidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center justify-center"
            >
              Comprar Productos Sostenibles
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/about/certifications"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors inline-flex items-center justify-center"
            >
              Ver Certificaciones
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sustainability;