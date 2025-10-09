import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Shield, Globe, CheckCircle } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const Certifications: FC = () => {
  // SEO Configuration
  useSEO({
    title: 'Certificaciones - ASOPROMAS | Cacao Orgánico Certificado Ecuador',
    description: 'ASOPROMAS cuenta con certificaciones USDA Organic, Fair Trade, Rainforest Alliance y más. Cacao orgánico certificado de la más alta calidad de Ecuador.',
    keywords: 'certificaciones ASOPROMAS, cacao orgánico certificado, USDA Organic Ecuador, Fair Trade cacao, Rainforest Alliance',
    url: '/about/certifications',
    type: 'article'
  });

  const certifications = [
    {
      name: 'USDA Organic',
      organization: 'United States Department of Agriculture',
      description: 'Certificación que garantiza que nuestros productos están libres de pesticidas sintéticos, herbicidas y fertilizantes artificiales.',
      year: '2010',
      validity: '2025',
      benefits: [
        'Productos 100% naturales',
        'Sin químicos sintéticos',
        'Métodos de cultivo sostenibles',
        'Acceso a mercados premium'
      ],
      icon: '🇺🇸',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Fair Trade Certified',
      organization: 'Fairtrade International',
      description: 'Garantiza precios justos para los productores, condiciones laborales dignas y desarrollo comunitario sostenible.',
      year: '2012',
      validity: '2026',
      benefits: [
        'Precios justos garantizados',
        'Prima para desarrollo social',
        'Condiciones laborales dignas',
        'Empoderamiento comunitario'
      ],
      icon: '🤝',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Rainforest Alliance',
      organization: 'Rainforest Alliance Certified',
      description: 'Certifica que nuestras fincas protegen la biodiversidad, mejoran los medios de vida y promueven derechos humanos.',
      year: '2015',
      validity: '2027',
      benefits: [
        'Protección de biodiversidad',
        'Conservación de recursos naturales',
        'Bienestar de trabajadores',
        'Desarrollo rural sostenible'
      ],
      icon: '🌳',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      name: 'IFOAM Organic',
      organization: 'International Federation of Organic Agriculture Movements',
      description: 'Estándar internacional que certifica la producción orgánica según principios ecológicos, sociales y económicos.',
      year: '2018',
      validity: '2028',
      benefits: [
        'Estándares internacionales',
        'Producción ecológica',
        'Sostenibilidad integral',
        'Reconocimiento mundial'
      ],
      icon: '🌍',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const processSteps = [
    {
      step: '1',
      title: 'Evaluación Inicial',
      description: 'Inspección completa de fincas, procesos y documentación.'
    },
    {
      step: '2',
      title: 'Implementación',
      description: 'Adopción de prácticas y estándares requeridos por cada certificación.'
    },
    {
      step: '3',
      title: 'Auditoría Externa',
      description: 'Verificación independiente por organismos certificadores autorizados.'
    },
    {
      step: '4',
      title: 'Certificación',
      description: 'Obtención del certificado y derecho a usar los sellos correspondientes.'
    },
    {
      step: '5',
      title: 'Monitoreo Continuo',
      description: 'Inspecciones periódicas para mantener la validez de las certificaciones.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/about" className="text-gray-500 hover:text-blue-600 transition-colors">
              Nosotros
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-blue-600 font-medium">Certificaciones</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Certificaciones Internacionales
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
            Respaldos que garantizan la calidad, sostenibilidad y responsabilidad social de nuestros productos
          </p>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nuestras Certificaciones Activas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cada certificación representa años de trabajo y compromiso con los más altos estándares internacionales
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div className={`h-2 bg-gradient-to-r ${cert.color}`}></div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl">{cert.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {cert.name}
                      </h3>
                      <p className="text-gray-600 font-medium">
                        {cert.organization}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {cert.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">Certificado desde</div>
                      <div className="text-lg font-bold text-gray-900">{cert.year}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">Válido hasta</div>
                      <div className="text-lg font-bold text-gray-900">{cert.validity}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Beneficios:</h4>
                    <div className="space-y-2">
                      {cert.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Proceso de Certificación
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              El camino riguroso que seguimos para obtener y mantener nuestras certificaciones
            </p>
          </div>

          <div className="relative">
            {/* Línea conectora */}
            <div className="hidden lg:block absolute top-16 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>

            <div className="grid lg:grid-cols-5 gap-8">
              {processSteps.map((process) => (
                <div key={process.step} className="relative">
                  {/* Punto en la línea */}
                  <div className="hidden lg:flex absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full items-center justify-center text-white font-bold text-sm z-10">
                    {process.step}
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mt-8 lg:mt-12 border border-blue-200 hover:shadow-lg transition-shadow duration-300">
                    <div className="lg:hidden w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4">
                      {process.step}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {process.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Impacto de Nuestras Certificaciones
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Las certificaciones no son solo sellos en nuestros productos, son compromisos 
                tangibles que transforman vidas y protegen el medio ambiente.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Acceso a Mercados Globales</h4>
                    <p className="text-blue-200">
                      Nuestras certificaciones nos abren las puertas de los mercados más exigentes del mundo.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Garantía de Calidad</h4>
                    <p className="text-blue-200">
                      Los consumidores confían en la consistencia y calidad de nuestros productos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Mejores Precios</h4>
                    <p className="text-blue-200">
                      Las certificaciones nos permiten obtener precios premium por nuestros productos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Resultados Medibles</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span className="text-blue-100">Incremento en ingresos:</span>
                  <span className="font-bold text-2xl">+35%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span className="text-blue-100">Mercados internacionales:</span>
                  <span className="font-bold text-2xl">15</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span className="text-blue-100">Auditorías exitosas:</span>
                  <span className="font-bold text-2xl">100%</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-blue-100">Renovaciones consecutivas:</span>
                  <span className="font-bold text-2xl">5</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
                <p className="text-blue-100 text-sm">
                  📊 Datos actualizados a diciembre 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Confía en la Calidad Certificada
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Cuando eliges ASOPROMAS, eliges productos respaldados por los estándares 
            internacionales más rigurosos de calidad y sostenibilidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
            >
              Ver Productos Certificados
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/about/sustainability"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors inline-flex items-center justify-center"
            >
              Conocer Sostenibilidad
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Certifications;