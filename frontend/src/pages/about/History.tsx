import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Users, Award } from 'lucide-react';

const History: FC = () => {
  const milestones = [
    {
      year: '1985',
      title: 'Fundación de ASOPROMAS',
      description: 'Un grupo visionario de agricultores se unió para formar la Asociación de Productores de Cacao de Zamora Chinchipe.',
      icon: <Users className="w-6 h-6" />
    },
    {
      year: '1992',
      title: 'Primera Certificación Orgánica',
      description: 'Obtuvimos nuestra primera certificación orgánica, pioneros en Ecuador en agricultura sostenible.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '2005',
      title: 'Expansión Internacional',
      description: 'Comenzamos a exportar nuestro cacao fino de aroma a mercados europeos y norteamericanos.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      year: '2015',
      title: 'Procesamiento Propio',
      description: 'Inauguramos nuestra planta de procesamiento para crear productos de chocolate artesanal.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '2025',
      title: 'Presente y Futuro',
      description: 'Hoy somos líderes en la producción de cacao premium, trabajando con más de 500 familias productoras.',
      icon: <Users className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-amber-600 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/about" className="text-gray-500 hover:text-amber-600 transition-colors">
              Nosotros
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-amber-600 font-medium">Historia</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Nuestra Historia
          </h1>
          <p className="text-xl sm:text-2xl text-amber-100 max-w-3xl mx-auto">
            Cuatro décadas cultivando tradición, calidad y sostenibilidad en el corazón de Ecuador
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Momentos Históricos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Desde nuestros humildes comienzos hasta convertirnos en referentes del cacao ecuatoriano
            </p>
          </div>

          <div className="relative">
            {/* Línea central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>

            {/* Milestones */}
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* Punto en la línea */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-amber-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Contenido */}
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'
                    }`}
                  >
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100 hover:shadow-xl transition-shadow duration-300">
                      <div className={`flex items-center gap-3 mb-3 ${
                        index % 2 === 0 ? 'justify-end' : 'justify-start'
                      }`}>
                        <div className="text-amber-600">
                          {milestone.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-amber-600">
                          {milestone.year}
                        </h3>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-20 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Nuestro Legado
          </h2>
          <p className="text-xl text-amber-100 max-w-4xl mx-auto leading-relaxed mb-8">
            Durante más de 35 años, hemos trabajado incansablemente para preservar las tradiciones 
            del cultivo de cacao mientras innovamos en técnicas sostenibles. Cada grano que 
            producimos cuenta la historia de nuestra tierra, nuestras familias y nuestro compromiso 
            con la excelencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/about/mission"
              className="bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors inline-flex items-center justify-center"
            >
              Conoce Nuestra Misión
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/about/producers"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-800 transition-colors inline-flex items-center justify-center"
            >
              Nuestros Productores
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;