import { type FC } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Award, Heart, Leaf, Star } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";

const PureChocolateBar: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-amber-600 transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-amber-600 transition-colors">Productos</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-amber-600 font-medium">Barra de Chocolate 100%</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-900 to-amber-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-amber-400/40 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/40">
                  <span className="text-amber-200 font-medium text-sm">🍫 KUJEÑITO Premium</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Barra de
                  <span className="block bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    Chocolate 100%
                  </span>
                </h1>
                <p className="text-xl text-amber-100 leading-relaxed">
                  Chocolate puro elaborado directamente con cacao fino de aroma de 
                  <span className="font-semibold text-amber-300"> Playas de Cuje, Zumbi</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Award className="w-5 h-5 text-amber-300" />
                  <span className="text-amber-100">100% Cacao Puro</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Leaf className="w-5 h-5 text-green-300" />
                  <span className="text-amber-100">Orgánico</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Heart className="w-5 h-5 text-red-300" />
                  <span className="text-amber-100">Artesanal</span>
                </div>
              </div>

              <div className="pt-6">
                <ButtonBuy 
                  productName="Barra de Chocolate 100% KUJEÑITO - ASOPROMAS"
                  variant="whatsapp"
                  size="lg"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <img
                  src="/src/assets/images/products/chocolate.png"
                  alt="Barra de Chocolate 100%"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  100% Puro
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Características del Producto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <h3 className="text-xl font-semibold text-amber-800 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Sabor Intenso y Auténtico
                    </h3>
                    <p className="text-gray-700">
                      Experimenta el sabor puro del cacao en su forma más natural. 
                      Sin azúcar añadida, solo la riqueza natural del cacao fino de aroma.
                    </p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-xl font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <Leaf className="w-5 h-5" />
                      Origen Amazónico
                    </h3>
                    <p className="text-gray-700">
                      Proveniente de las fértiles tierras de Playas de Cuje, 
                      donde el clima y suelo crean las condiciones perfectas para el cacao premium.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="text-xl font-semibold text-orange-800 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Proceso Artesanal
                    </h3>
                    <p className="text-gray-700">
                      Elaborado con métodos tradicionales que preservan todas las propiedades 
                      y sabores únicos del cacao ecuatoriano.
                    </p>
                  </div>

                  <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <h3 className="text-xl font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Para Conocedores
                    </h3>
                    <p className="text-gray-700">
                      Ideal para los verdaderos amantes del cacao que buscan una experiencia 
                      sensorial completa y auténtica.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-amber-800 mb-4">Información del Producto</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex justify-between">
                    <span>Contenido de Cacao:</span>
                    <span className="font-semibold">100%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Origen:</span>
                    <span className="font-semibold">Zamora Chinchipe</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-semibold">Fino de Aroma</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Proceso:</span>
                    <span className="font-semibold">Artesanal</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Certificación:</span>
                    <span className="font-semibold">Orgánico</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Beneficios del Cacao Puro</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Rico en antioxidantes naturales</li>
                  <li>• Fuente de magnesio y hierro</li>
                  <li>• Estimula la producción de endorfinas</li>
                  <li>• Mejora el estado de ánimo</li>
                  <li>• Protege la salud cardiovascular</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo disfrutar */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">¿Cómo Disfrutar tu Chocolate 100%?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🍫</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Degustación Pura</h3>
                <p className="text-gray-600">
                  Disfruta pequeños trozos lentamente, permitiendo que se derrita en tu boca 
                  para apreciar todos los matices del sabor.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">☕</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Con Bebidas Calientes</h3>
                <p className="text-gray-600">
                  Combina con café o té para crear una experiencia de sabores complementarios 
                  y realzar las notas del cacao.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🍯</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Con Miel Natural</h3>
                <p className="text-gray-600">
                  Añade una pequeña cantidad de miel para equilibrar la intensidad 
                  manteniendo la pureza del sabor original.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Experimenta la Pureza del Cacao Ecuatoriano
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Descubre el sabor auténtico del chocolate 100% cacao KUJEÑITO
          </p>
          <div className="flex justify-center">
            <ButtonBuy 
              productName="Barra de Chocolate 100% KUJEÑITO - ASOPROMAS"
              variant="whatsapp"
              size="lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PureChocolateBar;
