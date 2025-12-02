import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Users, Award } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const History: FC = () => {
  // SEO Configuration
  useSEO({
    title: 'Historia de ASOPROMAS - Desde 2013 Cultivando Tradición | Ecuador',
    description: 'Descubre la historia de ASOPROMAS desde 2013: más de una década cultivando cacao de fino aroma y ancestral en Zamora Chinchipe y Morona Santiago, con 181 socios y certificación orgánica.',
    keywords: 'historia ASOPROMAS, cacao Ecuador historia, Zamora Chinchipe agricultura, cacao ancestral, cooperativa cacao, tradición cacaotera Ecuador, cacao orgánico',
    url: '/about/history',
    type: 'article'
  });

  const milestones = [
    {
      year: '2013',
      title: 'Fundación de ASOPROMAS',
      description: 'Creada con 13 socios impulsada por el FEPP. Producción inicial de 15-18 quintales anuales con venta local de chocolates artesanales.',
      icon: <Users className="w-6 h-6" />
    },
    {
      year: '2015',
      title: 'Terreno Propio',
      description: 'Adquisición de terreno propio con título de propiedad en Playas de Cuje, Zumbi.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '2016-2019',
      title: 'Infraestructura',
      description: 'Construcción del centro de acopio y planta de procesamiento con apoyo de ONG´s, Instituciones Locales Implementación de marquesinas y 15 cajones de fermentación.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      year: '2019',
      title: 'Alianzas Estratégicas',
      description: 'Apoyo de PRO AMAZONIA (PPR red++) para implementar el CAS y bioinsumos. Inicio del proceso de certificación Libre de Deforestación.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '2020',
      title: 'Yachak y Cacao Ancestral',
      description: 'Nace "Yachak Premium Chocolate". Se identifican 70 árboles de cacao ancestral en Centinela del Cóndor, iniciando su investigación.',
      icon: <Users className="w-6 h-6" />
    },
    {
      year: '2022-2024',
      title: 'Expansión y Capacitación',
      description: 'Ejecución de 7 escuelas de campo (IAF). Entrega de kits a 84 socios. Apoyo de Farmer to Farmer en género, certificación orgánica y chocolate. Incremento a 181 socios en 13 comunidades.',
      icon: <Calendar className="w-6 h-6" />
    },
    {
      year: '2023',
      title: 'Marca Kujeñito',
      description: 'Registro sanitario y de marca "Kujeñito". Diseño de empaques, instalación de refinadora de 25kg y nueva marquesina. Acopio alcanza 150 quintales.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '2024',
      title: 'Alianza Yachak',
      description: 'Exclusividad entre Yachak y ASOPROMAS. Proyecto conjunto con INIAP/FIASA para rescate de cacao ancestral en microlotes.',
      icon: <Users className="w-6 h-6" />
    },
    {
      year: '2025',
      title: 'Certificaciones y Exportación',
      description: 'Certificación Orgánica (UE y Norteamérica) y BPA. Primera exportación de nibs de cacao nacional y ancestral a POWATHAN, Virginia, EE.UU.',
      icon: <Award className="w-6 h-6" />
    },
    {
      year: '2025+',
      title: 'Consolidación y Futuro',
      description: 'Meta de 350 quintales de cacao orgánico y 22 de ancestral. 22 viveros con 45,000 plantas. Apertura de "Ruta del Cacao Ancestral" y proyectos con COSPE, FAO y FUNDACIÓN HUMANA.',
      icon: <Calendar className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/assets/images/products/Asopromas-socios.jpg")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-amber-800/75 to-amber-700/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Nuestra Historia
          </h1>
          <p className="text-xl sm:text-2xl text-amber-100 max-w-3xl mx-auto">
            Desde 2013 cultivando tradición, calidad y sostenibilidad en Zamora Chinchipe y Morona Santiago con 181 socios comprometidos
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
            Desde 2013, ASOPROMAS ha crecido de 13 a 188 socios (96 mujeres y 92 hombres) de nacionalidad 
            Shuar y mestiza. Hemos preservado las tradiciones del cultivo de cacao mientras innovamos en 
            técnicas sostenibles, rescatando el cacao ancestral y logrando certificaciones orgánicas 
            internacionales. Cada grano cuenta la historia de nuestras comunidades, nuestra tierra y nuestro 
            compromiso con la excelencia y la sostenibilidad.
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