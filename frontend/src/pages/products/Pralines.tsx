import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Gift, Heart, Award } from 'lucide-react';
import ButtonBuy from '../../components/ButtonBuy';

const Pralines: FC = () => {
  const pralinesCollection = [
    {
      name: 'Pralines de Cacao Puro',
      description: 'Deliciosos pralines elaborados con 70% de cacao ecuatoriano.',
      flavor: 'Intenso y aromático',
      presentation: 'Caja de 12 unidades',
      price: '$18.99',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Pralines con Nibs',
      description: 'Combinación perfecta de chocolate suave con crujientes nibs de cacao.',
      flavor: 'Textura contrastante',
      presentation: 'Caja de 8 unidades',
      price: '$22.50',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Pralines Rellenos',
      description: 'Chocolate premium relleno con ganache de cacao y especias.',
      flavor: 'Cremoso y especiado',
      presentation: 'Caja de 16 unidades',
      price: '$28.75',
      image: '/api/placeholder/300/300'
    }
  ];

  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Artesanal',
      description: 'Elaborados a mano con técnicas tradicionales'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Premium',
      description: 'Cacao fino de aroma de primera calidad'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Certificado',
      description: 'Orgánico y de comercio justo'
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: 'Regalo Perfecto',
      description: 'Presentación elegante para ocasiones especiales'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Pralines Artesanales
              </h1>
              <p className="text-xl sm:text-2xl text-amber-100 mb-8">
                Pequeñas obras de arte culinario que capturan la esencia del mejor cacao ecuatoriano
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <ButtonBuy 
                  productId="pralines-artisan"
                  productName="Pralines Artesanales ASOPROMAS"
                  productPrice={19.99}
                  productImage="/assets/images/products/pralines.jpg"
                />
                <Link
                  to="/products"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-800 transition-colors inline-flex items-center justify-center"
                >
                  Ver Más Productos
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-amber-400/30">
                <div className="aspect-square bg-gradient-to-br from-amber-200 to-amber-400 rounded-2xl flex items-center justify-center">
                  <span className="text-6xl">🍫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Collection */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nuestra Colección de Pralines
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cada praline es una experiencia única, elaborado con amor y los mejores ingredientes
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pralinesCollection.map((praline) => (
              <div
                key={praline.name}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-100"
              >
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <span className="text-8xl">🍫</span>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {praline.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {praline.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sabor:</span>
                      <span className="font-medium text-gray-900">{praline.flavor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Presentación:</span>
                      <span className="font-medium text-gray-900">{praline.presentation}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-amber-600">
                      {praline.price}
                    </span>
                    <ButtonBuy 
                      productId={`praline-${praline.name.toLowerCase().replace(/\s+/g, '-')}`}
                      productName={praline.name}
                      productPrice={parseFloat(praline.price.replace('$', ''))}
                      productImage={praline.image}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ¿Por Qué Elegir Nuestros Pralines?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Calidad artesanal que hace la diferencia en cada bocado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Proceso Artesanal
              </h2>
              <p className="text-xl text-amber-100 mb-8 leading-relaxed">
                Nuestros pralines son el resultado de un cuidadoso proceso artesanal 
                que respeta las tradiciones chocolateras ecuatorianas.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Selección de Granos</h4>
                    <p className="text-amber-200">
                      Escogemos cuidadosamente los mejores granos de cacao de nuestras fincas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Tostado y Molido</h4>
                    <p className="text-amber-200">
                      Proceso controlado que realza los sabores naturales del cacao.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Moldeo Artesanal</h4>
                    <p className="text-amber-200">
                      Cada praline es moldeado a mano con técnicas tradicionales.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Ingredientes Premium</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span className="text-amber-100">Cacao Ecuatoriano:</span>
                  <span className="font-semibold">70% - 85%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span className="text-amber-100">Azúcar de Caña:</span>
                  <span className="font-semibold">Orgánico</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span className="text-amber-100">Manteca de Cacao:</span>
                  <span className="font-semibold">100% Natural</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-amber-100">Lecitina:</span>
                  <span className="font-semibold">De Girasol</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-500/20 rounded-lg">
                <p className="text-amber-100 text-sm">
                  🌱 Todos nuestros ingredientes son orgánicos y de comercio justo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Experimenta el Sabor Auténtico
          </h2>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto mb-8">
            Nuestros pralines artesanales son perfectos para regalar o disfrutar 
            en momentos especiales. ¡Haz tu pedido hoy!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonBuy 
              productId="pralines-collection"
              productName="Colección Completa de Pralines ASOPROMAS"
              productPrice={65.99}
              productImage="/assets/images/products/pralines-collection.jpg"
            />
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-700 transition-colors inline-flex items-center justify-center"
            >
              Contactar Directamente
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pralines;