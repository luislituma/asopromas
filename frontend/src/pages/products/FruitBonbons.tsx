import { type FC, useState } from "react";
import { Award, Heart, Sparkles, Star, Cherry, ChevronLeft, ChevronRight } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";
import { useSEO } from "../../hooks/useSEO";
import { generateProductSchema } from "../../utils/schema";

const FruitBonbons: FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const productImages = [
    "/assets/images/products/Bombones-1.jpg",
    "/assets/images/products/Bombones-2.jpg",
    "/assets/images/products/Bombones-3.jpg"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Generate Product Schema
  const productSchema = generateProductSchema({
    name: "Bombones de Chocolate ASOPROMAS",
    description: "Bombones de Chocolate Artesanales con relleno de frutas tropicales amazónicas. Disponibles con rellenos de guayaba, piña, maracuyá, mora, frutilla y jalea de cacao.",
    price: "5.00",
    currency: "USD",
    category: "Bombones Artesanales",
    image: "/assets/images/products/Bombones-1.jpg",
    url: "/products/fruit-bonbons"
  });

  // SEO Configuration
  useSEO({
    title: 'Bombones de Chocolate - Rellenos de Frutas Tropicales | ASOPROMAS',
    description: 'Bombones artesanales con rellenos de frutas amazónicas: guayaba, piña, maracuyá, mora, frutilla y jalea de cacao. 80g por $5.00',
    keywords: 'bombones chocolate, bombones frutas tropicales, bombones artesanales Ecuador, chocolate amazónico',
    url: '/products/fruit-bonbons',
    type: 'product',
    image: '/assets/images/products/Bombones-1.jpg',
    schema: productSchema
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-pink-800 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-400/40 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-pink-500/20 backdrop-blur-sm rounded-full border border-pink-400/40">
                  <span className="text-pink-200 font-medium text-sm">🍓 KUJEÑITO Premium</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Bombones de
                  <span className="block bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                    Chocolate
                  </span>
                </h1>
                <p className="text-xl text-pink-100 leading-relaxed">
                  Bombones artesanales con relleno de frutas tropicales amazónicas.
                  <span className="font-semibold text-pink-300"> 80g de puro sabor | $5.00</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Award className="w-5 h-5 text-pink-300" />
                  <span className="text-pink-100">Premium</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Cherry className="w-5 h-5 text-purple-300" />
                  <span className="text-pink-100">Frutas Amazónicas</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-pink-100">Artesanal</span>
                </div>
              </div>

              <div className="pt-6">
                <ButtonBuy 
                  productId="fruit-bonbons"
                  productName="Bombones de Chocolate"
                  productPrice={5.00}
                  productImage="/assets/images/products/Bombones-1.jpg"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 overflow-hidden">
                {/* Slider de imágenes */}
                <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
                  <img
                    src={productImages[currentImageIndex]}
                    alt={`Bombones de Chocolate - Imagen ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Overlay con efecto de brillo dinámico */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/20 transition-all duration-300 pointer-events-none"></div>
                  {/* Sombra interna para profundidad */}
                  <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
                  
                  {/* Botones de navegación */}
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6 text-pink-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-6 h-6 text-pink-600" />
                  </button>

                  {/* Indicadores */}
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

                {/* Miniaturas */}
                <div className="flex gap-2 mt-4 justify-center">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'border-pink-400 scale-110 shadow-lg'
                          : 'border-white/30 hover:border-pink-300 opacity-70 hover:opacity-100'
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

                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold shadow-lg z-10">
                  <div className="text-2xl">$5.00</div>
                  <div className="text-xs">80g</div>
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
                  <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
                    <h3 className="text-xl font-semibold text-pink-800 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Sabores Tropicales
                    </h3>
                    <p className="text-gray-700">
                      Una combinación única de sabores dulces y frutales que resalta 
                      la riqueza amazónica en cada bombón.
                    </p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="text-xl font-semibold text-purple-800 mb-3 flex items-center gap-2">
                      <Cherry className="w-5 h-5" />
                      Frutas Locales
                    </h3>
                    <p className="text-gray-700">
                      Utilizamos frutas exóticas y locales de la región amazónica, 
                      cuidadosamente seleccionadas por su sabor y calidad.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                    <h3 className="text-xl font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Proceso Artesanal
                    </h3>
                    <p className="text-gray-700">
                      Cada bombón es cuidadosamente elaborado a mano, garantizando 
                      la perfecta fusión entre chocolate y frutas.
                    </p>
                  </div>

                  <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <h3 className="text-xl font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Experiencia Única
                    </h3>
                    <p className="text-gray-700">
                      Una explosión de sabores que transporta tus sentidos 
                      al corazón de la selva amazónica.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-pink-800 mb-4">Información del Producto</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-semibold">Bombones Artesanales</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Peso:</span>
                    <span className="font-semibold">80g</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Precio:</span>
                    <span className="font-semibold text-pink-600">$5.00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Rellenos:</span>
                    <span className="font-semibold">6 Variedades</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Origen:</span>
                    <span className="font-semibold">Zamora Chinchipe</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Sabores Disponibles</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    Guayaba
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Piña
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Maracuyá
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Mora
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Frutilla
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-700 rounded-full"></span>
                    Jalea de Cacao
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Información Nutricional</h3>
                <p className="text-xs text-gray-500 mb-3">Por porción de 80g</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between border-b pb-1">
                    <span>Grasa total</span>
                    <span className="font-semibold">6g (9%)</span>
                  </li>
                  <li className="flex justify-between border-b pb-1 pl-3">
                    <span className="text-xs">Saturadas</span>
                    <span className="font-semibold">1.5g (8%)</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Carbohidratos</span>
                    <span className="font-semibold">7g (2%)</span>
                  </li>
                  <li className="flex justify-between border-b pb-1 pl-3">
                    <span className="text-xs">Azúcares</span>
                    <span className="font-semibold">4g</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Proteínas</span>
                    <span className="font-semibold">1g (2%)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Colesterol</span>
                    <span className="font-semibold">0mg</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">*Basado en dieta de 2.000 Kcal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fruit Varieties */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Variedades de Sabores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🍋</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Cítricos Amazónicos</h3>
                <p className="text-gray-600">
                  Maracuyá, naranjilla y otras frutas cítricas que aportan 
                  frescura y acidez natural al chocolate.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🍓</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Frutos del Bosque</h3>
                <p className="text-gray-600">
                  Uvilla, mortiño y otros frutos silvestres que brindan 
                  dulzura natural y antioxidantes.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🥭</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Tropicales Exóticos</h3>
                <p className="text-gray-600">
                  Frutas únicas de la región que ofrecen sabores 
                  tropicales intensos y memorables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Ocasiones Especiales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl border border-pink-200">
                <h3 className="text-xl font-semibold text-pink-800 mb-4">Celebraciones</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Regalos románticos especiales</li>
                  <li>• Cumpleaños y aniversarios</li>
                  <li>• Celebraciones familiares</li>
                  <li>• Eventos corporativos únicos</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">Momentos Especiales</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Cenas románticas</li>
                  <li>• Reuniones con amigos</li>
                  <li>• Meriendas gourmet</li>
                  <li>• Degustaciones especiales</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Saborea la Riqueza Amazónica
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Descubre los sabores únicos de nuestros bombones KUJEÑITO con frutas exóticas
          </p>
          <div className="flex justify-center">
            <ButtonBuy 
              productId="fruit-bonbons-exotic"
              productName="Bombones con Frutas Exóticas KUJEÑITO"
              productPrice={22.99}
              productImage="/assets/images/products/fruit-bonbons.jpg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default FruitBonbons;


