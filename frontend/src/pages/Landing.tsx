import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Users, Heart, ShoppingBag } from 'lucide-react';
import asopromasLogo from '../assets/icons/logo.svg';
import CTA from '../components/CTA';
import { useSEO } from '../hooks/useSEO';

const Landing: FC = () => {
  // SEO Configuration
  useSEO({
    title: 'ASOPROMAS - Cacao Premium y Chocolate Artesanal del Ecuador',
    description: 'Descubre los productos KUJEÑITO de ASOPROMAS: chocolate 100% puro, barras artesanales y productos derivados del cacao de fino aroma de Zamora Chinchipe, Ecuador.',
    keywords: 'ASOPROMAS, KUJEÑITO, cacao Ecuador, chocolate artesanal, cacao fino aroma, Zamora Chinchipe, chocolate orgánico, comercio justo',
    url: '/',
    type: 'website',
    image: '/assets/images/hero-cacao.jpg'
  });

  const features = [
    {
      icon: <Award className="h-8 w-8 text-amber-600" aria-hidden="true" />,
      title: "Calidad Premium",
      description: "Nuestros chocolates están elaborados con los mejores granos de cacao del Ecuador"
    },
    {
      icon: <Users className="h-8 w-8 text-amber-600" aria-hidden="true" />,
      title: "Comunidad Primero",
      description: "Apoyando a los agricultores locales y sus familias a través de prácticas de comercio justo"
    },
    {
      icon: <Heart className="h-8 w-8 text-amber-600" aria-hidden="true" />,
      title: "Futuro Sostenible",
      description: "Comprometidos con métodos de cultivo conscientes del medio ambiente"
    }
  ];

  const products = [
    {
      image: "/src/assets/images/products/chocolate-bar.jpg",
      title: "Barras de Chocolate Artesanales",
      description: "Experimenta el sabor puro del Ecuador en cada bocado",
      link: "/products/pure-chocolate-bar"
    },
    {
      image: "/src/assets/images/products/chocolate-drink.jpg",
      title: "Bebidas de Cacao Premium",
      description: "Bebidas ricas y aromáticas para los amantes del chocolate",
      link: "/products/cacao-cocktail"
    },
    {
      image: "/src/assets/images/products/cocoa-liquor.jpg",
      title: "Licor de Cacao Puro",
      description: "La esencia del fino cacao ecuatoriano",
      link: "/products/cocoa-liquor"
    }
  ];

  return (

    <div className="flex flex-col min-h-screen">
      {/* Call to Action */}
      <div>
        <CTA />
      </div>

      {/* Final CTA Section */}
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center bg-black text-white overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent transform rotate-12"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-400/10 to-transparent transform -rotate-12"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-500/30 rounded-full blur-xl animate-pulse" aria-hidden="true"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000" aria-hidden="true"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-emerald-500/25 rounded-full blur-lg animate-pulse delay-500" aria-hidden="true"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Columna Izquierda: Texto */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/40">
                  <span className="text-emerald-300 font-medium text-sm">🇪🇨 Desde Ecuador para el Mundo</span>
                </div>
                <h1
                  id="hero-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                >
                  Descubre el
                  <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    Chocolate
                  </span>
                  <span className="block text-blue-100">Ecuatoriano</span>
                </h1>
              </div>

              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                ASOPROMAS te trae productos de cacao de calidad premium desde el corazón de
                <span className="font-semibold text-amber-400"> Zamora Chinchipe</span>,
                donde cada grano cuenta una historia de tradición y excelencia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center">
                    <ShoppingBag className="mr-3 h-5 w-5" />
                    Explorar Productos
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>

                <Link
                  to="/about"
                  className="group border-2 border-blue-400 text-blue-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
                >
                  <Award className="mr-3 h-5 w-5" />
                  Nuestra Historia
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-600/50">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-400">15+</div>
                  <div className="text-sm text-gray-400">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-400">100%</div>
                  <div className="text-sm text-gray-400">Cacao Premium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400">100+</div>
                  <div className="text-sm text-gray-400">Familias Productoras</div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Imagen */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-blue-500/15 rounded-full blur-3xl transform scale-110"></div>

                {/* Logo Container */}
                <div className="relative bg-gray-800/40 backdrop-blur-md rounded-3xl p-12 border border-gray-600/50 shadow-2xl">
                  <img
                    src={asopromasLogo}
                    alt="ASOPROMAS"
                    className="h-48 sm:h-64 lg:h-80 w-auto filter drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />

                  {/* Floating badges */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    🏆 Premium
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    🌱 Orgánico
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">¿Por qué elegir ASOPROMAS?</h2>
            <div className="h-1 w-96 bg-amber-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
            <div className="h-1 w-20 bg-amber-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Link
                key={index}
                to={product.link}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Nuestra Historia</h2>
            <p className="text-gray-600 mb-6 text-lg">
              ASOPROMAS es una orgullosa asociación de productores de cacao en Zamora Chinchipe, Ecuador.
              Nuestro viaje comenzó con una misión simple: producir cacao de la más alta calidad mientras
              apoyamos a nuestras comunidades agrícolas locales.
            </p>
            <p className="text-gray-600 mb-8 text-lg">
              Hoy, continuamos manteniendo estos valores, combinando la sabiduría agrícola tradicional
              con prácticas sostenibles modernas para crear productos de chocolate excepcionales que
              son disfrutados en todo el mundo.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold"
            >
              Conoce nuestro camino
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>


      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-amber-950">¿Listo para Experimentar Nuestros Productos?</h2>
          <p className="text-xl mb-8 text-amber-800">
            Descubre los ricos sabores de nuestros productos premium de chocolate y cacao
          </p>
          <div className='flex justify-center'>
            <Link to="/products">
              <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Comprar
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
