import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Coffee, Zap, Heart } from 'lucide-react';
import ButtonBuy from '../../components/ButtonBuy';

const CocoaNibs: FC = () => {
  const products = [
    {
      name: 'Nibs de Cacao Tostados',
      description: 'Fragmentos de granos de cacao tostados con sabor intenso y crujiente textura.',
      roast: 'Medio',
      size: '2-4mm',
      presentation: 'Bolsa de 250g',
      price: '$15.99',
      flavor: 'Intenso con notas florales'
    },
    {
      name: 'Nibs de Cacao Crudos',
      description: 'Nibs sin tostar que conservan todos sus nutrientes y enzimas naturales.',
      roast: 'Sin tostar',
      size: '3-5mm',
      presentation: 'Bolsa de 500g',
      price: '$24.50',
      flavor: 'Suave con ligero amargor'
    },
    {
      name: 'Nibs Premium Gourmet',
      description: 'Selección especial de los mejores granos, perfectos para alta gastronomía.',
      roast: 'Artesanal',
      size: '4-6mm',
      presentation: 'Frasco de vidrio 200g',
      price: '$28.75',
      flavor: 'Complejo y aromático'
    }
  ];

  const uses = [
    {
      icon: <Coffee className="w-6 h-6" />,
      title: 'Smoothies y Batidos',
      description: 'Agrega una cucharada para un boost de energía natural y sabor a chocolate.',
      tip: '1-2 cucharadas por porción'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Repostería Gourmet',
      description: 'Perfecto para decorar pasteles, incorporar en galletas o hacer chocolate artesanal.',
      tip: 'Remoja en agua tibia para suavizar'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Snack Saludable',
      description: 'Consume directamente como un snack nutritivo lleno de antioxidantes.',
      tip: '20-30g diarios como máximo'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Yogurts y Cereales',
      description: 'Espolvorea sobre yogur, avena o cereales para un desayuno energético.',
      tip: 'Combina con frutas frescas'
    }
  ];

  const nutritionalInfo = [
    { nutrient: 'Proteínas', amount: '14g', percentage: '28%' },
    { nutrient: 'Fibra', amount: '9g', percentage: '36%' },
    { nutrient: 'Grasas saludables', amount: '12g', percentage: '18%' },
    { nutrient: 'Magnesio', amount: '272mg', percentage: '65%' },
    { nutrient: 'Hierro', amount: '3.9mg', percentage: '22%' },
    { nutrient: 'Antioxidantes', amount: 'Alto', percentage: '100%' }
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
            <Link to="/products" className="text-gray-500 hover:text-purple-600 transition-colors">
              Productos
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-purple-600 font-medium">Nibs de Cacao</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Nibs de Cacao
              </h1>
              <p className="text-xl sm:text-2xl text-purple-100 mb-8">
                El superalimento ancestral en su forma más pura: fragmentos crujientes de cacao llenos de nutrientes y sabor auténtico
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <ButtonBuy 
                  productName="Nibs de Cacao Premium ASOPROMAS"
                  variant="whatsapp"
                  size="lg"
                />
                <Link
                  to="/products"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-800 transition-colors inline-flex items-center justify-center"
                >
                  Ver Más Productos
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-purple-400/30">
                <div className="aspect-square bg-gradient-to-br from-purple-200 to-purple-400 rounded-2xl flex items-center justify-center">
                  <span className="text-6xl">🌰</span>
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
              Variedades de Nibs de Cacao
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Diferentes procesos para satisfacer todos los gustos y usos culinarios
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.name}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-purple-100"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <span className="text-6xl">🌰</span>
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
                      <span className="text-gray-500">Tostado:</span>
                      <span className="font-medium text-gray-900">{product.roast}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tamaño:</span>
                      <span className="font-medium text-gray-900">{product.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Presentación:</span>
                      <span className="font-medium text-gray-900">{product.presentation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sabor:</span>
                      <span className="font-medium text-gray-900">{product.flavor}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-purple-600">
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

      {/* Uses and Applications */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Usos y Aplicaciones
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Descubre las múltiples formas de incorporar los nibs de cacao en tu dieta diaria
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {uses.map((use) => (
              <div
                key={use.title}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl">
                    {use.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {use.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {use.description}
                    </p>
                    <div className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                      💡 Tip: {use.tip}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutritional Information */}
      <section className="py-20 bg-gradient-to-r from-purple-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Perfil Nutricional
              </h2>
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                Los nibs de cacao son considerados un superalimento por su alta concentración 
                de nutrientes esenciales, antioxidantes y compuestos bioactivos.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Antioxidantes Naturales</h4>
                    <p className="text-purple-200">
                      Flavonoides que protegen las células del daño oxidativo y apoyan la salud cardiovascular.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Energía Sostenida</h4>
                    <p className="text-purple-200">
                      Teobromina y cafeína natural que proporcionan energía duradera sin picos de azúcar.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Bienestar Mental</h4>
                    <p className="text-purple-200">
                      Feniletilamina y anandamida que promueven la sensación de bienestar y felicidad.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Información Nutricional</h3>
              <p className="text-purple-100 text-sm mb-6">Por 100g de nibs de cacao:</p>
              
              <div className="space-y-3">
                {nutritionalInfo.map((info) => (
                  <div key={info.nutrient} className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-purple-100">{info.nutrient}:</span>
                    <div className="text-right">
                      <span className="font-bold text-white">{info.amount}</span>
                      <div className="text-xs text-purple-200">({info.percentage} VD*)</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-purple-500/20 rounded-lg">
                <p className="text-purple-100 text-xs">
                  * VD = Valor Diario basado en una dieta de 2000 calorías
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Ideas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ideas de Recetas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Inspírate con estas deliciosas formas de usar nibs de cacao
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="text-4xl mb-4 text-center">🥤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Smoothie Energético
              </h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 1 banana madura</li>
                <li>• 1 taza de leche de almendras</li>
                <li>• 2 cucharadas de nibs</li>
                <li>• 1 cucharada de miel</li>
                <li>• Hielo al gusto</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="text-4xl mb-4 text-center">🍪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Galletas Fitness
              </h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 1 taza de avena</li>
                <li>• ½ taza de nibs de cacao</li>
                <li>• 2 bananas maduras</li>
                <li>• ¼ taza de nueces</li>
                <li>• Canela al gusto</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="text-4xl mb-4 text-center">🍯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Yogurt Gourmet
              </h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 1 taza de yogurt griego</li>
                <li>• 1 cucharada de nibs</li>
                <li>• Frutos rojos frescos</li>
                <li>• 1 cucharadita de miel</li>
                <li>• Granola casera</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            Descubre el Poder del Cacao Puro
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Los nibs de cacao son la forma más natural de disfrutar todos los beneficios 
            del cacao. ¡Añade este superalimento a tu rutina diaria!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonBuy 
              productName="Colección Completa Nibs de Cacao ASOPROMAS"
              variant="whatsapp"
              size="lg"
            />
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-700 transition-colors inline-flex items-center justify-center"
            >
              Consultar Nutricionista
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CocoaNibs;