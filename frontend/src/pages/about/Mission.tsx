import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Target, Eye, Heart, Award } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const Mission: FC = () => {
  // SEO Configuration
  useSEO({
    title: 'Misión y Visión - ASOPROMAS | Cacao Premium Ecuador',
    description: 'Conoce la misión y visión de ASOPROMAS: producir cacao de fino aroma de la más alta calidad, promoviendo el desarrollo sostenible de las comunidades rurales de Zamora Chinchipe.',
    keywords: 'misión ASOPROMAS, visión ASOPROMAS, cacao sostenible, desarrollo rural Ecuador, Zamora Chinchipe',
    url: '/about/mission',
    type: 'article'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-emerald-600 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/about" className="text-gray-500 hover:text-emerald-600 transition-colors">
              Nosotros
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-emerald-600 font-medium">Misión y Visión</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Misión y Visión
          </h1>
          <p className="text-xl sm:text-2xl text-emerald-100 max-w-3xl mx-auto">
            Nuestro propósito y dirección hacia un futuro sostenible
          </p>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Misión */}
            <div className="group">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100 hover:shadow-2xl transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white">
                    <Target className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Nuestra Misión</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Producir y comercializar cacao de fino aroma y productos derivados de la más alta 
                  calidad, promoviendo el desarrollo sostenible de nuestras comunidades rurales, 
                  preservando el medio ambiente y generando valor agregado que beneficie a todos 
                  los miembros de nuestra asociación.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Desarrollo comunitario integral</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Agricultura sostenible y orgánica</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Comercio justo y equitativo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visión */}
            <div className="group">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white">
                    <Eye className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Nuestra Visión</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Ser reconocidos como la asociación líder en la producción de cacao fino de aroma 
                  en Ecuador, siendo referente mundial en calidad, sostenibilidad e innovación, 
                  contribuyendo al bienestar de nuestras familias productoras y al desarrollo 
                  de la región amazónica.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Liderazgo en calidad internacional</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Innovación en procesos productivos</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Desarrollo regional sostenible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objetivos Estratégicos */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Objetivos Estratégicos
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Las metas que guían nuestro trabajo diario y nuestro crecimiento a largo plazo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Calidad Premium</h3>
              <p className="text-gray-300 text-sm">
                Mantener los más altos estándares de calidad en todos nuestros productos de cacao.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-amber-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sostenibilidad</h3>
              <p className="text-gray-300 text-sm">
                Promover prácticas agrícolas sostenibles que preserven nuestro ecosistema.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovación</h3>
              <p className="text-gray-300 text-sm">
                Implementar tecnologías y métodos innovadores en nuestros procesos productivos.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Desarrollo Social</h3>
              <p className="text-gray-300 text-sm">
                Mejorar la calidad de vida de nuestras familias productoras y comunidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Únete a Nuestra Misión
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
            Conoce más sobre nuestros valores y cómo trabajamos cada día para hacer realidad 
            nuestra visión de un futuro sostenible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/about/values"
              className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors inline-flex items-center justify-center"
            >
              Nuestros Valores
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/about/sustainability"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-700 transition-colors inline-flex items-center justify-center"
            >
              Sostenibilidad
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mission;