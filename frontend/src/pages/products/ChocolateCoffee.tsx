import { type FC } from "react";
import { Award, Heart, Coffee, Star, Zap } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";
import { useSEO } from "../../hooks/useSEO";
import { generateProductSchema } from "../../utils/schema";

const ChocolateCoffee: FC = () => {
  // Generate Product Schema
  const productSchema = generateProductSchema({
    name: "Chocolate con Café KUJEÑITO",
    description: "Chocolate al 65% con café de altura de Palanda. Perfecto para empezar el día con energía y rico aroma.",
    price: "13.99",
    currency: "USD",
    category: "Chocolate Energético",
    image: "/assets/images/products/chocolate-coffee.jpg",
    url: "/products/chocolate-coffee"
  });

  // SEO Configuration
  useSEO({
    title: 'Chocolate con Café KUJEÑITO - Energía y Sabor | ASOPROMAS',
    description: 'Chocolate KUJEÑITO al 65% con café de altura de Palanda. Combinación perfecta de cacao ecuatoriano y café premium para energizar tu día.',
    keywords: 'chocolate café Ecuador, KUJEÑITO café, chocolate energético, café Palanda, chocolate estimulante',
    url: '/products/chocolate-coffee',
    type: 'product',
    image: '/assets/images/products/chocolate-coffee.jpg',
    schema: productSchema
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-900 to-orange-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-amber-400/40 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/40">
                  <span className="text-amber-200 font-medium text-sm">☕ KUJEÑITO Premium</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Chocolate con
                  <span className="block bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    Café de Palanda
                  </span>
                </h1>
                <p className="text-xl text-amber-100 leading-relaxed">
                  Chocolate 65% con café de altura elaborado con granos de café de Palanda, 
                  <span className="font-semibold text-amber-300"> Playas de Cuje, Zumbi</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Award className="w-5 h-5 text-amber-300" />
                  <span className="text-amber-100">65% Cacao</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Coffee className="w-5 h-5 text-orange-300" />
                  <span className="text-amber-100">Café de Palanda</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-amber-100">Energizante</span>
                </div>
              </div>

              <div className="pt-6">
                <ButtonBuy 
                  productName="Chocolate con Café de Palanda KUJEÑITO - ASOPROMAS"
                  variant="whatsapp"
                  size="lg"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <img
                  src="/src/assets/images/products/chocolate.png"
                  alt="Chocolate con Café"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  Café + Cacao
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
                      Fusión Perfecta
                    </h3>
                    <p className="text-gray-700">
                      La combinación ideal entre el chocolate 65% y el café de altura de Palanda, 
                      creando un sabor único y energizante.
                    </p>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="text-xl font-semibold text-orange-800 mb-3 flex items-center gap-2">
                      <Coffee className="w-5 h-5" />
                      Café de Altura
                    </h3>
                    <p className="text-gray-700">
                      Granos de café cultivados en las montañas de Palanda, 
                      reconocidos por su aroma intenso y sabor excepcional.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                    <h3 className="text-xl font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Energía Natural
                    </h3>
                    <p className="text-gray-700">
                      Perfecto para empezar el día con energía, combinando los beneficios 
                      del cacao con la cafeína natural del café.
                    </p>
                  </div>

                  <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <h3 className="text-xl font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Tradición Amazónica
                    </h3>
                    <p className="text-gray-700">
                      Dos tesoros de la región amazónica unidos en una sola barra, 
                      representando la riqueza de nuestros cultivos.
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
                    <span className="font-semibold">65%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Café de:</span>
                    <span className="font-semibold">Palanda</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tipo de Café:</span>
                    <span className="font-semibold">Altura</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Efecto:</span>
                    <span className="font-semibold">Energizante</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Origen:</span>
                    <span className="font-semibold">Zamora Chinchipe</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Beneficios del Producto</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Antioxidantes del cacao y café</li>
                  <li>• Energía natural y sostenida</li>
                  <li>• Mejora el estado de alerta</li>
                  <li>• Rico en flavonoides</li>
                  <li>• Estimula la concentración</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Moments */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Momentos Perfectos para Disfrutarlo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🌅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Mañana Energizante</h3>
                <p className="text-gray-600">
                  Inicia tu día con energía. La combinación perfecta de cacao y café 
                  te dará el impulso natural que necesitas.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Break de Trabajo</h3>
                <p className="text-gray-600">
                  Durante tu jornada laboral, este chocolate te ayudará a mantener 
                  la concentración y renovar tu energía.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🏃‍♂️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Pre-Ejercicio</h3>
                <p className="text-gray-600">
                  Antes de tu rutina de ejercicios, obtendrás la energía natural 
                  que tu cuerpo necesita para un mejor rendimiento.
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
            Energiza tu Día con Sabor Auténtico
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Descubre la perfecta fusión del chocolate KUJEÑITO con café de Palanda
          </p>
          <div className="flex justify-center">
            <ButtonBuy 
              productName="Chocolate con Café de Palanda KUJEÑITO - ASOPROMAS"
              variant="whatsapp"
              size="lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChocolateCoffee;


