import { type FC, useState } from "react";
import { Award, Heart, Wine, Star, Clock, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";
import { useSEO } from "../../hooks/useSEO";
import { generateProductSchema } from "../../utils/schema";

const CacaoLiqueur: FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<{ size: string; price: number }>({
    size: "375ml",
    price: 4.00
  });
  
  const productImages = [
    "/assets/images/products/Licor-Pequenio-1.jpg",
    "/assets/images/products/Licor-Grande-1.jpg",
    "/assets/images/products/Licor-Grande-2.jpg",
    "/assets/images/products/Licores-1.jpg"
  ];

  const variants = [
    { size: "375ml", price: 4.00 },
    { size: "750ml", price: 10.00 }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Generate Product Schema
  const productSchema = generateProductSchema({
    name: "Licor de Cacao ASOPROMAS",
    description: "Licor dulce de cacao al 20°. Artesanal, suave y dulce. Disponible en 375ml y 750ml.",
    price: selectedVariant.price.toString(),
    currency: "USD",
    category: "Licor Artesanal",
    image: "/assets/images/products/Licor-Pequenio-1.jpg",
    url: "/products/cacao-liqueur"
  });

  // SEO Configuration
  useSEO({
    title: 'Licor de Cacao 20° - Dulce y Suave | ASOPROMAS',
    description: 'Licor dulce de cacao al 20°. Artesanal, suave y dulce. 375ml ($4.00) y 750ml ($10.00). ¡Ideal para disfrutar!',
    keywords: 'licor cacao Ecuador, licor dulce 20 grados, licor artesanal, bebida alcohólica cacao',
    url: '/products/cacao-liqueur',
    type: 'product',
    image: '/assets/images/products/Licor-Pequenio-1.jpg',
    schema: productSchema
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-red-900 to-orange-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-red-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-400/40 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-400/40">
                  <span className="text-red-200 font-medium text-sm">🍷 20° Licor</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Licor de
                  <span className="block bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
                    Cacao
                  </span>
                </h1>
                <p className="text-xl text-red-100 leading-relaxed">
                  Licor dulce de cacao al 20°. Artesanal, suave y dulce.
                  <span className="font-semibold text-red-300"> 375ml - $7.00 | 750ml - $10.00</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Wine className="w-5 h-5 text-red-300" />
                  <span className="text-red-100">20° Alcohol</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Award className="w-5 h-5 text-orange-300" />
                  <span className="text-red-100">Artesanal</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Heart className="w-5 h-5 text-pink-300" />
                  <span className="text-red-100">Suave y Dulce</span>
                </div>
              </div>

              {/* Selector de variantes */}
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <h3 className="text-red-200 font-semibold mb-3">Selecciona el tamaño:</h3>
                <div className="flex gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        selectedVariant.size === variant.size
                          ? 'bg-red-500 text-white shadow-lg scale-105'
                          : 'bg-white/20 text-red-100 hover:bg-white/30'
                      }`}
                    >
                      <div className="text-lg">{variant.size}</div>
                      <div className="text-sm">${variant.price.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advertencia */}
              <div className="bg-yellow-500/20 border border-yellow-400/40 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-100">Venta prohibida a menores de 18 años</p>
              </div>

              <div className="pt-6">
                <ButtonBuy 
                  productId="cocoa-liqueur"
                  productName={`Licor de Cacao ${selectedVariant.size}`}
                  productPrice={selectedVariant.price}
                  productImage="/assets/images/products/Licor-Pequenio-1.jpg"
                  variant={selectedVariant.size}
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 overflow-hidden">
                {/* Slider de imágenes */}
                <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
                  <img
                    src={productImages[currentImageIndex]}
                    alt={`Licor de Cacao - Imagen ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6 text-red-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-6 h-6 text-red-600" />
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

                <div className="flex gap-2 mt-4 justify-center flex-wrap">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'border-red-400 scale-110 shadow-lg'
                          : 'border-white/30 hover:border-red-300 opacity-70 hover:opacity-100'
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

                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg z-10">
                  <div className="text-2xl">${selectedVariant.price.toFixed(2)}</div>
                  <div className="text-xs">{selectedVariant.size}</div>
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
                  <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <h3 className="text-xl font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Sabor Exquisito
                    </h3>
                    <p className="text-gray-700">
                      Un licor suave y dulce que combina la riqueza del cacao 
                      con la calidez del alcohol, perfecto para ocasiones especiales.
                    </p>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="text-xl font-semibold text-orange-800 mb-3 flex items-center gap-2">
                      <Wine className="w-5 h-5" />
                      20 Grados Perfectos
                    </h3>
                    <p className="text-gray-700">
                      Con 20 grados de alcohol, ofrece el equilibrio ideal entre 
                      potencia y suavidad para una experiencia memorable.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <h3 className="text-xl font-semibold text-amber-800 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Proceso Artesanal
                    </h3>
                    <p className="text-gray-700">
                      Elaborado con métodos tradicionales que requieren tiempo y paciencia 
                      para alcanzar la perfección en cada botella.
                    </p>
                  </div>

                  <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
                    <h3 className="text-xl font-semibold text-pink-800 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Para Compartir
                    </h3>
                    <p className="text-gray-700">
                      Ideal para disfrutar en compañía, creando momentos especiales 
                      y memorables con familia y amigos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-red-800 mb-4">Ingredientes</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex justify-between">
                    <span>Agua desmineralizada:</span>
                    <span className="font-semibold">48.93%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Aguardiente de caña:</span>
                    <span className="font-semibold">46%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Macerado de cacao:</span>
                    <span className="font-semibold">18.81%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Nibs de cacao:</span>
                    <span className="font-semibold">50%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Azúcar:</span>
                    <span className="font-semibold">10%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Esencia sabor a cacao:</span>
                    <span className="font-semibold">0.13%</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl border-2 border-amber-300">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xl font-semibold text-amber-800 mb-3">Advertencia Importante</h3>
                    <p className="text-gray-700 mb-2">
                      <strong>Grado Alcohólico: 20°</strong>
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Prohibida la venta a menores de 18 años. El consumo excesivo de alcohol 
                      es perjudicial para la salud. Consumir con responsabilidad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serving Suggestions */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Formas de Disfrutarlo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🥃</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Solo o con Hielo</h3>
                <p className="text-gray-600">
                  Disfrútalo puro para apreciar todos sus matices, 
                  o con hielo para una experiencia más refrescante.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🍸</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">En Cócteles</h3>
                <p className="text-gray-600">
                  Base perfecta para crear cócteles únicos, 
                  mezclándolo con crema, café o frutas tropicales.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🍰</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Con Postres</h3>
                <p className="text-gray-600">
                  Acompaña postres de chocolate, helados o frutas 
                  para crear una experiencia gastronómica completa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storage and Serving */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Conservación y Servicio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Almacenamiento</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Consérvese en ambiente fresco y seco</li>
                  <li>• Mantener en refrigeración después de abierto</li>
                  <li>• Proteger de la luz solar directa</li>
                  <li>• Conservar bien cerrado</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4">Servicio Ideal</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Servir a temperatura ambiente</li>
                  <li>• Usar copas de licor pequeñas</li>
                  <li>• Degustación lenta y pausada</li>
                  <li>• Acompañar con conversación</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Brinda con el Sabor Auténtico del Cacao
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experimenta el licor dulce de cacao KUJEÑITO en tus momentos más especiales
          </p>
          <div className="flex justify-center">
            <ButtonBuy 
              productId="cocoa-liqueur"
              productName={`Licor de Cacao ${selectedVariant.size}`}
              productPrice={selectedVariant.price}
              productImage="/assets/images/products/Licor-Grande-1.jpg"
              variant={selectedVariant.size}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CacaoLiqueur;


