import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Leaf, Award, Zap, Coffee } from 'lucide-react';
import ButtonBuy from '../../components/ButtonBuy';

const CocoaPowder: FC = () => {
  const products = [
    {
      name: 'Cacao en Polvo Natural',
      description: 'Cacao 100% puro, sin azúcar ni aditivos artificiales.',
      fat: '10-12%',
      presentation: 'Bolsa de 500g',
      price: '$12.99',
      uses: ['Repostería', 'Bebidas calientes', 'Smoothies']
    },
    {
      name: 'Cacao en Polvo Alcalinizado',
      description: 'Procesado para reducir acidez y mejorar solubilidad.',
      fat: '8-10%',
      presentation: 'Bolsa de 1kg',
      price: '$22.50',
      uses: ['Chocolates', 'Helados', 'Postres']
    },
    {
      name: 'Cacao en Polvo Premium',
      description: 'Nuestra selección más fina para usos gourmet.',
      fat: '12-14%',
      presentation: 'Lata de 300g',
      price: '$18.75',
      uses: ['Alta repostería', 'Trufas', 'Bebidas premium']
    }
  ];

  const nutritionalBenefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Energía Natural',
      description: 'Rico en teobromina, un estimulante natural suave'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Antioxidantes',
      description: 'Alto contenido de flavonoides beneficiosos para la salud'
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Minerales',
      description: 'Fuente de magnesio, hierro y potasio'
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: 'Sabor Intenso',
      description: 'Perfil de sabor complejo y aromático'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-orange-600 transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-orange-600 transition-colors">
              Productos
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-orange-600 font-medium">Cacao en Polvo</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-orange-900 via-orange-800 to-orange-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Cacao en Polvo Premium
              </h1>
              <p className="text-xl sm:text-2xl text-orange-100 mb-8">
                La base perfecta para todas tus creaciones culinarias, directo desde las plantaciones de Zamora Chinchipe
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <ButtonBuy 
                  productName="Cacao en Polvo Premium ASOPROMAS"
                  variant="whatsapp"
                  size="lg"
                />
                <Link
                  to="/products"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-800 transition-colors inline-flex items-center justify-center"
                >
                  Ver Más Productos
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-orange-400/30">
                <div className="aspect-square bg-gradient-to-br from-orange-200 to-orange-400 rounded-2xl flex items-center justify-center">
                  <span className="text-6xl">🍮</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Variants */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Variedades de Cacao en Polvo
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Diferentes procesados para satisfacer todas tus necesidades culinarias
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-100"
              >
                <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <span className="text-6xl">🥄</span>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Grasa:</span>
                      <span className="font-medium text-gray-900">{product.fat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Presentación:</span>
                      <span className="font-medium text-gray-900">{product.presentation}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Usos recomendados:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.uses.map((use) => (
                        <span
                          key={use}
                          className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-orange-600">
                      {product.price}
                    </span>
                    <ButtonBuy 
                      productName={product.name}
                      variant="whatsapp"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutritional Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Beneficios Nutricionales
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nuestro cacao en polvo no solo es delicioso, sino también nutritivo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nutritionalBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white mb-4">
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

      {/* Usage Guide */}
      <section className="py-20 bg-gradient-to-r from-orange-800 to-orange-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Guía de Uso
              </h2>
              <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                Aprovecha al máximo nuestro cacao en polvo con estos consejos de expertos.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Para Bebidas</h4>
                    <p className="text-orange-200">
                      Disuelve 2-3 cucharadas en leche caliente o agua. Agrega endulzante al gusto.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Para Repostería</h4>
                    <p className="text-orange-200">
                      Sustituye hasta 25% de la harina en tus recetas para intensificar el sabor.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Para Decoración</h4>
                    <p className="text-orange-200">
                      Espolvorea sobre postres o mezcla con azúcar glass para un toque gourmet.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Información Nutricional</h3>
              <div className="text-sm text-orange-100">
                <p className="mb-4 font-semibold">Por 100g de producto:</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Energía:</span>
                    <span className="font-semibold">228 kcal</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Proteínas:</span>
                    <span className="font-semibold">19.6g</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Grasas:</span>
                    <span className="font-semibold">13.7g</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Carbohidratos:</span>
                    <span className="font-semibold">57.9g</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Fibra:</span>
                    <span className="font-semibold">37g</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange-500/20 rounded-lg">
                  <p className="text-orange-100 text-xs">
                    * Valores aproximados. Sin gluten, sin lactosa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Dale Sabor a Tus Creaciones
          </h2>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
            Nuestro cacao en polvo premium transformará tus recetas en experiencias 
            gastronómicas únicas. ¡Ordena el tuyo hoy!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonBuy 
              productName="Pack Completo Cacao en Polvo ASOPROMAS"
              variant="whatsapp"
              size="lg"
            />
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-700 transition-colors inline-flex items-center justify-center"
            >
              Consultar Precios al Mayor
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CocoaPowder;