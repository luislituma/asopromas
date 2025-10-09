import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, MapPin, Heart, Award, TrendingUp, Home } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const Producers: FC = () => {
  // SEO Configuration
  useSEO({
    title: 'Nuestros Productores - ASOPROMAS | Familias Cacaoteras de Ecuador',
    description: 'Conoce a los productores de cacao de ASOPROMAS: 150 familias de Zamora Chinchipe dedicadas al cultivo sostenible de cacao de fino aroma ecuatoriano.',
    keywords: 'productores cacao Ecuador, familias cacaoteras, Zamora Chinchipe agricultores, comercio justo cacao, agricultores ASOPROMAS',
    url: '/about/producers',
    type: 'article'
  });

  const producers = [
    {
      name: 'María Elena Vargas',
      location: 'El Pangui',
      experience: '25 años',
      specialty: 'Cacao Trinitario',
      image: '/api/placeholder/150/150',
      story: 'Pionera en técnicas de fermentación que realzan el sabor floral del cacao.'
    },
    {
      name: 'Carlos Mendoza',
      location: 'Yantzaza',
      experience: '18 años',
      specialty: 'Cacao Nacional',
      image: '/api/placeholder/150/150',
      story: 'Líder en prácticas agroforestales que conservan la biodiversidad.'
    },
    {
      name: 'Rosa Chuncho',
      location: 'Centinela del Cóndor',
      experience: '30 años',
      specialty: 'Cacao Fino de Aroma',
      image: '/api/placeholder/150/150',
      story: 'Guardiana de semillas ancestrales y técnicas tradicionales de cultivo.'
    }
  ];

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: '520+',
      label: 'Familias Productoras',
      description: 'Miembros activos de nuestra asociación'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      number: '12',
      label: 'Comunidades',
      description: 'Distribuidas en Zamora Chinchipe'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      number: '15%',
      label: 'Aumento Anual',
      description: 'En ingresos familiares promedio'
    },
    {
      icon: <Home className="w-8 h-8" />,
      number: '2,500',
      label: 'Hectáreas',
      description: 'Bajo manejo sostenible'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Nuestros Productores
          </h1>
          <p className="text-xl sm:text-2xl text-green-100 max-w-3xl mx-auto">
            Las familias que hacen posible el mejor cacao del Ecuador
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nuestra Comunidad en Números
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              El impacto real de nuestro trabajo conjunto en la región amazónica
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-8 text-center shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Producers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Historias de Éxito
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conoce a algunos de nuestros productores destacados y sus historias inspiradoras
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {producers.map((producer) => (
              <div
                key={producer.name}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {producer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {producer.name}
                      </h3>
                      <p className="text-green-600 font-medium">
                        {producer.location}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experiencia:</span>
                      <span className="font-semibold text-gray-900">{producer.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Especialidad:</span>
                      <span className="font-semibold text-gray-900">{producer.specialty}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{producer.story}"
                  </p>

                  <div className="flex items-center gap-2 text-green-600">
                    <Award className="w-5 h-5" />
                    <span className="text-sm font-medium">Productor Certificado</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-r from-green-800 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Impacto en las Comunidades
              </h2>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Nuestro trabajo va más allá de la producción de cacao. Generamos 
                un impacto positivo integral en las vidas de nuestras familias productoras.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Desarrollo Social</h4>
                    <p className="text-green-200">
                      Programas de salud, educación y vivienda para mejorar la calidad de vida.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Crecimiento Económico</h4>
                    <p className="text-green-200">
                      Precios justos y acceso a mercados internacionales premium.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Fortalecimiento Organizacional</h4>
                    <p className="text-green-200">
                      Capacitaciones en liderazgo, gestión y técnicas agrícolas avanzadas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Testimonios</h3>
              
              <blockquote className="text-green-100 italic mb-4 leading-relaxed">
                "Gracias a ASOPROMAS, mis hijos pueden estudiar y mi finca produce 
                el mejor cacao de la región. Somos una familia próspera."
              </blockquote>
              <cite className="text-green-300 font-medium">
                - María Elena Vargas, Productora desde 1998
              </cite>

              <blockquote className="text-green-100 italic mb-4 mt-6 leading-relaxed">
                "La capacitación técnica y el acceso a mercados justos han 
                transformado completamente nuestra comunidad."
              </blockquote>
              <cite className="text-green-300 font-medium">
                - Carlos Mendoza, Líder Comunitario
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Conoce Más Sobre Nuestro Impacto
          </h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
            Descubre cómo trabajamos por la sostenibilidad y el desarrollo 
            de nuestras comunidades cacaoteras.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/about/sustainability"
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center justify-center"
            >
              Sostenibilidad
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/about/certifications"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors inline-flex items-center justify-center"
            >
              Certificaciones
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Producers;