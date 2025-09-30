import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Heart, Shield, Users, Leaf, Handshake, Star } from 'lucide-react';

const Values: FC = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Compromiso',
      description: 'Dedicación absoluta hacia la calidad, nuestros productores y el medio ambiente.',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Integridad',
      description: 'Actuamos con honestidad y transparencia en todas nuestras relaciones comerciales.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Solidaridad',
      description: 'Fortalecemos la unión entre productores para el beneficio común de toda la comunidad.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Sostenibilidad',
      description: 'Preservamos el medio ambiente para las futuras generaciones de productores.',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: 'Respeto',
      description: 'Valoramos la diversidad, los conocimientos tradicionales y las ideas de cada miembro.',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Excelencia',
      description: 'Buscamos la mejora continua en todos nuestros procesos y productos.',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-purple-600 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/about" className="text-gray-500 hover:text-purple-600 transition-colors">
              Nosotros
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-purple-600 font-medium">Valores</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Nuestros Valores
          </h1>
          <p className="text-xl sm:text-2xl text-purple-100 max-w-3xl mx-auto">
            Los principios fundamentales que guían cada decisión y acción en ASOPROMAS
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Los Pilares de Nuestra Organización
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Estos valores no son solo palabras, sino principios vividos que definen 
              nuestra cultura organizacional y nuestra relación con la comunidad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className={`group relative ${value.bgColor} rounded-2xl p-8 border ${value.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${value.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {value.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values in Action */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Valores en Acción
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conoce cómo aplicamos estos valores en nuestro trabajo diario
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Prácticas Sostenibles
                  </h4>
                  <p className="text-gray-600">
                    Implementamos técnicas de agricultura orgánica y conservación del suelo 
                    que protegen la biodiversidad amazónica.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Apoyo Comunitario
                  </h4>
                  <p className="text-gray-600">
                    Proporcionamos capacitación técnica, acceso a microcréditos y 
                    programas de desarrollo social para nuestras familias productoras.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Transparencia Total
                  </h4>
                  <p className="text-gray-600">
                    Mantenemos procesos transparentes en la fijación de precios, 
                    distribución de beneficios y toma de decisiones organizacionales.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Nuestro Compromiso
              </h3>
              <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-6">
                "En ASOPROMAS, creemos que los valores no son solo aspiraciones, 
                sino compromisos tangibles que se reflejan en cada grano de cacao 
                que producimos y en cada relación que construimos."
              </blockquote>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm text-gray-600 font-medium">
                  Consejo Directivo de ASOPROMAS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Vive Nuestros Valores
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Conoce más sobre cómo estos valores se traducen en nuestra misión 
            y en el impacto que generamos en nuestras comunidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/about/mission"
              className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors inline-flex items-center justify-center"
            >
              Nuestra Misión
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/about/producers"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-700 transition-colors inline-flex items-center justify-center"
            >
              Conoce a Nuestros Productores
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Values;