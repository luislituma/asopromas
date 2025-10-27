import { type FC } from "react";
import { Heart, Wine, Star, Droplets } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";
import { useSEO } from "../../hooks/useSEO";
import { generateProductSchema } from "../../utils/schema";

const CacaoCocktail: FC = () => {
  // Generate Product Schema
  const productSchema = generateProductSchema({
    name: "Cóctel de Cacao KUJEÑITO",
    description: "Bebida premium que combina cacao ecuatoriano con ingredientes selectos. Una experiencia sensorial única para paladares exigentes.",
    price: "19.99",
    currency: "USD",
    category: "Bebida Premium",
    image: "/assets/images/products/cacao-cocktail.jpg",
    url: "/products/cacao-cocktail"
  });

  // SEO Configuration
  useSEO({
    title: 'Cóctel de Cacao KUJEÑITO - Bebida Premium | ASOPROMAS',
    description: 'Cóctel KUJEÑITO: bebida premium que combina cacao ecuatoriano con ingredientes selectos. Experiencia sensorial única para momentos especiales.',
    keywords: 'cóctel cacao Ecuador, bebida premium KUJEÑITO, cóctel artesanal, bebida gourmet cacao, experiencia sensorial',
    url: '/products/cacao-cocktail',
    type: 'product',
    image: '/assets/images/products/cacao-cocktail.jpg',
    schema: productSchema
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-400/40 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/40">
                  <span className="text-blue-200 font-medium text-sm">🍹 KUJEÑITO Premium</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Cóctel de
                  <span className="block bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                    Cacao
                  </span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Bebida suave, dulce y refrescante de 12 grados, perfecta para disfrutar fría y en reuniones especiales desde 
                  <span className="font-semibold text-blue-300"> Playas de Cuje, Zumbi</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Wine className="w-5 h-5 text-blue-300" />
                  <span className="text-blue-100">12° Alcohol</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Droplets className="w-5 h-5 text-indigo-300" />
                  <span className="text-blue-100">Refrescante</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Heart className="w-5 h-5 text-pink-300" />
                  <span className="text-blue-100">Suave y Dulce</span>
                </div>
              </div>

              <div className="pt-6">
                <ButtonBuy 
                  productId="cacao-cocktail-12"
                  productName="Cóctel de Cacao KUJEÑITO 12°"
                  productPrice={19.99}
                  productImage="/assets/images/products/cacao-cocktail.jpg"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <img
                  src="/src/assets/images/products/chocolate-drink.jpg"
                  alt="Cóctel de Cacao"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  12° Cóctel
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
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Sabor Refrescante
                    </h3>
                    <p className="text-gray-700">
                      Una bebida ligera y refrescante que combina el sabor del cacao 
                      con un toque dulce y una textura suave.
                    </p>
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                    <h3 className="text-xl font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                      <Droplets className="w-5 h-5" />
                      Perfecta para el Calor
                    </h3>
                    <p className="text-gray-700">
                      Con 12 grados de alcohol, es ideal para disfrutar bien fría 
                      en climas cálidos y momentos de relajación.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="text-xl font-semibold text-purple-800 mb-3 flex items-center gap-2">
                      <Wine className="w-5 h-5" />
                      Graduación Moderada
                    </h3>
                    <p className="text-gray-700">
                      Con solo 12 grados, permite disfrutar del sabor sin ser 
                      demasiado fuerte, perfecto para ocasiones sociales.
                    </p>
                  </div>

                  <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
                    <h3 className="text-xl font-semibold text-pink-800 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Social y Festivo
                    </h3>
                    <p className="text-gray-700">
                      Ideal para compartir en reuniones, celebraciones y 
                      momentos especiales con amigos y familia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Información del Producto</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex justify-between">
                    <span>Grado Alcohólico:</span>
                    <span className="font-semibold">12°</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-semibold">Cóctel</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Base:</span>
                    <span className="font-semibold">Cacao</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Servir:</span>
                    <span className="font-semibold">Bien Frío</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Origen:</span>
                    <span className="font-semibold">Zamora Chinchipe</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Características Especiales</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Ligero y refrescante</li>
                  <li>• Sabor suave y dulce</li>
                  <li>• Perfecto para el clima tropical</li>
                  <li>• Fácil de beber</li>
                  <li>• Ideal para ocasiones sociales</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serving Occasions */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Ocasiones Perfectas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Reuniones Especiales</h3>
                <p className="text-gray-600">
                  Perfecto para fiestas, celebraciones y encuentros sociales 
                  donde quieres compartir algo único y delicioso.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🏖️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Momentos de Relax</h3>
                <p className="text-gray-600">
                  Ideal para días calurosos, tardes en la piscina 
                  o simplemente para relajarse después del trabajo.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🌅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Atardeceres</h3>
                <p className="text-gray-600">
                  Disfruta de un hermoso atardecer acompañado 
                  de esta bebida refrescante y llena de sabor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Tips */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Tips para Servir</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Temperatura Ideal</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Mantener refrigerado (4-6°C)</li>
                  <li>• Servir con hielo abundante</li>
                  <li>• Usar vasos altos y fríos</li>
                  <li>• Decorar con frutas frescas</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Acompañamientos</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Bocadillos ligeros y frescos</li>
                  <li>• Frutas tropicales</li>
                  <li>• Snacks salados suaves</li>
                  <li>• Música relajante</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Refresca tus Momentos Especiales
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Disfruta el cóctel de cacao KUJEÑITO en tus reuniones más especiales
          </p>
          <div className="flex justify-center">
            <ButtonBuy 
              productId="cacao-cocktail-12"
              productName="Cóctel de Cacao KUJEÑITO 12°"
              productPrice={19.99}
              productImage="/assets/images/products/cacao-cocktail.jpg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CacaoCocktail;
