import { type FC } from 'react';
import { Leaf, Users, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

const About: FC = () => {
  // SEO Configuration
  useSEO({
    title: 'Nosotros - ASOPROMAS | Asociación de Productores de Cacao Ecuador',
    description: 'Conoce ASOPROMAS, asociación de productores de cacao de Zamora Chinchipe. Fortaleciendo comunidades rurales a través del cacao de fino aroma desde 2000.',
    keywords: 'ASOPROMAS, productores cacao Ecuador, Zamora Chinchipe, cacao fino aroma, cooperativa agrícola, desarrollo rural',
    url: '/about',
    type: 'article',
    image: '/assets/images/hero-cacao.jpg'
  });

  const values = [
    {
      icon: <Leaf className="h-8 w-8 text-brown-600" />,
      title: "Calidad y Sostenibilidad",
      description: "Nos comprometemos con prácticas agrícolas responsables que protegen la tierra y la biodiversidad.",
      link: "/about/sustainability"
    },
    {
      icon: <Users className="h-8 w-8 text-brown-600" />,
      title: "Comunidad y Equidad",
      description: "Promovemos la participación activa de todos los socios, dando especial importancia al rol de las mujeres rurales.",
      link: "/about/producers"
    },
    {
      icon: <Handshake className="h-8 w-8 text-brown-600" />,
      title: "Transparencia y Cooperación",
      description: "Cada decisión se toma colectivamente, asegurando un impacto positivo en la región.",
      link: "/about/certifications"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/assets/images/products/General.jpg")' }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Asopromas: Fortaleciendo comunidades a través del cacao en Zamora Chinchipe y Morona Santiago
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            <strong className="text-amber-300">188 socios</strong> comprometidos con la producción sostenible, donde <strong className="text-amber-300">el 51% son mujeres y 49% hombres</strong>, personas rurales que lideran el cambio en sus comunidades.
          </p>
        </div>
      </section>

      {/* Nuestra Comunidad Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Nuestra Comunidad
              </h2>
              <p className="text-lg text-gray-600">
                Asopromas es una asociación que une a productores locales de cacao, fomentando el desarrollo económico, social y cultural de la región. Nuestra comunidad está formada por hombres y mujeres que trabajan unidos, promoviendo prácticas sostenibles y valores de cooperación y responsabilidad.
              </p>
              <Link
                to="/about/producers"
                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold transition-colors mt-4"
              >
                Conoce a Nuestros Productores →
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/assets/images/products/Asopromas-socios.jpg"
                alt="Comunidad Asopromas"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Valores y Filosofía Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Valores y Filosofía
          </h2>
          <p className="text-center text-gray-600 mb-8">
            <Link to="/about/values" className="text-amber-600 hover:text-amber-700 font-medium">
              Explora nuestros valores en detalle →
            </Link>
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Link
                key={index}
                to={value.link}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 block group"
              >
                <div className="bg-brown-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-amber-600 transition-colors">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
                <span className="text-amber-600 font-medium mt-4 inline-block group-hover:translate-x-1 transition-transform">
                  Ver más →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Historia Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="/assets/images/products/Palanda.jpg"
                alt="Historia de Asopromas"
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Nuestra Historia
              </h2>
              <p className="text-lg text-gray-600">
                Desde su fundación, Asopromas ha trabajado para fortalecer la economía local mediante la producción de cacao fino de aroma, promoviendo la cultura y el desarrollo de las comunidades rurales de Zamora Chinchipe.
              </p>
              <Link
                to="/about/history"
                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold transition-colors mt-4"
              >
                Descubre Nuestra Historia Completa →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/assets/images/products/Chocolates.jpg")' }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Únete a nuestra misión de fortalecer comunidades y preservar la tradición del cacao en Ecuador
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-brown-600 rounded-lg hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 transition-colors"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
