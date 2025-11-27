import { type FC, useState } from "react";
import { Award, Heart, Coffee, Star, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";
import { useSEO } from "../../hooks/useSEO";
import { generateProductSchema } from "../../utils/schema";

const ChocolateCoffee: FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const productImages = [
    "/assets/images/products/Cafe-1.jpg",
    "/assets/images/products/Cafe-2.jpg"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Generate Product Schema
  const productSchema = generateProductSchema({
    name: "Barra de Chocolate con Café ASOPROMAS",
    description: "Barra de Chocolate Fino Artesanal al 65% con Café. 50g de chocolate premium con café tostado.",
    price: "3.50",
    currency: "USD",
    category: "Chocolate Artesanal",
    image: "/assets/images/products/Cafe-1.jpg",
    url: "/products/chocolate-coffee"
  });

  // SEO Configuration
  useSEO({
    title: 'Barra de Chocolate con Café - 65% Cacao | ASOPROMAS',
    description: 'Chocolate artesanal al 65% con café tostado. 50g / 1.76 oz por $3.50. La combinación perfecta de cacao y café.',
    keywords: 'chocolate café, chocolate 65%, chocolate artesanal Ecuador, barra chocolate café',
    url: '/products/chocolate-coffee',
    type: 'product',
    image: '/assets/images/products/Cafe-1.jpg',
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
                  <span className="text-amber-200 font-medium text-sm">☕ Premium 65%</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Chocolate con
                  <span className="block bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    Café
                  </span>
                </h1>
                <p className="text-xl text-amber-100 leading-relaxed">
                  Barra de chocolate fino artesanal al 65% con café tostado.
                  <span className="font-semibold text-amber-300"> 50g | $3.50</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Award className="w-5 h-5 text-amber-300" />
                  <span className="text-amber-100">65% Cacao</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Coffee className="w-5 h-5 text-orange-300" />
                  <span className="text-amber-100">Café Tostado</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-amber-100">Artesanal</span>
                </div>
              </div>

              <div className="pt-6">
                <ButtonBuy 
                  productId="chocolate-coffee"
                  productName="Barra de Chocolate con Café"
                  productPrice={3.50}
                  productImage="/assets/images/products/Cafe-1.jpg"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 overflow-hidden">
                {/* Slider de imágenes */}
                <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
                  <img
                    src={productImages[currentImageIndex]}
                    alt={`Barra de Chocolate con Café - Imagen ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6 text-amber-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-6 h-6 text-amber-600" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white w-8' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Ver imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 justify-center">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'border-amber-400 scale-110 shadow-lg'
                          : 'border-white/30 hover:border-amber-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg z-10">
                  <div className="text-2xl">$3.50</div>
                  <div className="text-xs">50g</div>
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
                    <span>Tipo:</span>
                    <span className="font-semibold">Barra Artesanal</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Cacao:</span>
                    <span className="font-semibold">65%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Peso:</span>
                    <span className="font-semibold">50g / 1.76 oz</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Precio:</span>
                    <span className="font-semibold text-amber-600">$3.50</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Origen:</span>
                    <span className="font-semibold">Zamora Chinchipe</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredientes</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex justify-between items-center">
                    <span>Pasta de Cacao</span>
                    <span className="text-sm font-semibold bg-amber-100 px-2 py-1 rounded">57%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Azúcar</span>
                    <span className="text-sm font-semibold bg-amber-100 px-2 py-1 rounded">32%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Manteca de Cacao</span>
                    <span className="text-sm font-semibold bg-amber-100 px-2 py-1 rounded">8%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Café Tostado</span>
                    <span className="text-sm font-semibold bg-orange-100 px-2 py-1 rounded">3%</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Información Nutricional</h3>
                <p className="text-xs text-gray-500 mb-3">Tamaño por porción: 10g | Porciones: 5</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between border-b pb-1">
                    <span>Energía</span>
                    <span className="font-semibold">50 kcal</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Grasa total</span>
                    <span className="font-semibold">4g (9%)</span>
                  </li>
                  <li className="flex justify-between border-b pb-1 pl-3">
                    <span className="text-xs">Saturadas</span>
                    <span className="font-semibold">3g (14%)</span>
                  </li>
                  <li className="flex justify-between border-b pb-1 pl-3">
                    <span className="text-xs">Monoinsaturadas</span>
                    <span className="font-semibold">2g</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Carbohidratos</span>
                    <span className="font-semibold">6g (2%)</span>
                  </li>
                  <li className="flex justify-between border-b pb-1 pl-3">
                    <span className="text-xs">Azúcares</span>
                    <span className="font-semibold">3g (2%)</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Proteínas</span>
                    <span className="font-semibold">1g</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Colesterol</span>
                    <span className="font-semibold">0mg</span>
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
              productId="chocolate-coffee-palanda"
              productName="Chocolate con Café de Palanda KUJEÑITO"
              productPrice={18.99}
              productImage="/assets/images/products/chocolate-coffee.jpg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChocolateCoffee;


