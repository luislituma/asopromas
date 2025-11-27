import { type FC, useState } from "react";
import { Heart, Wine, Star, Droplets, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";
import { useSEO } from "../../hooks/useSEO";
import { generateProductSchema } from "../../utils/schema";

const CacaoCocktail: FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({ size: "375ml", price: 5.00 });

  const productImages = [
    "/assets/images/products/Coctel-1.jpg",
    "/assets/images/products/Coctel-Pequenio-1.jpg",
    "/assets/images/products/Coctel-Pequenio-2.jpg",
    "/assets/images/products/Coctel-Todos.jpg"
  ];

  const variants = [
    { size: "375ml", price: 5.00 },
    { size: "750ml", price: 12.00 }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Generate Product Schema
  const productSchema = generateProductSchema({
    name: "Cóctel de Cacao KUJEÑITO 12°",
    description: "Bebida suave, dulce y refrescante de 12 grados, perfecta para disfrutar fría en reuniones especiales desde Playas de Cuje, Zumbi.",
    price: selectedVariant.price.toString(),
    currency: "USD",
    category: "Bebida Alcohólica",
    image: "/assets/images/products/Coctel-1.jpg",
    url: "/products/cocoa-cocktail"
  });

  // SEO Configuration
  useSEO({
    title: 'Cóctel de Cacao KUJEÑITO 12° - Bebida Refrescante | ASOPROMAS',
    description: 'Cóctel de cacao KUJEÑITO 12°: bebida suave, dulce y refrescante ideal para reuniones y momentos especiales. De Playas de Cuje, Zumbi.',
    keywords: 'cóctel cacao Ecuador, bebida refrescante 12 grados, cóctel dulce cacao, bebida social, KUJEÑITO Zumbi',
    url: '/products/cocoa-cocktail',
    type: 'product',
    image: '/assets/images/products/Coctel-1.jpg',
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
                    Cacao 12°
                  </span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Bebida suave, dulce y refrescante de 12 grados, perfecta para disfrutar fría y en reuniones especiales desde 
                  <span className="font-semibold text-blue-300"> Playas de Cuje, Zumbi</span>
                </p>

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <p className="text-blue-200 text-sm mb-3">Selecciona tu presentación:</p>
                  <div className="flex gap-3">
                    {variants.map((variant) => (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          selectedVariant.size === variant.size
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : 'bg-white/20 text-blue-100 hover:bg-white/30'
                        }`}
                      >
                        <div className="text-sm">{variant.size}</div>
                        <div className="text-lg">${variant.price.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-900/30 backdrop-blur-sm p-4 rounded-xl border border-amber-500/30 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-100 text-sm">
                    <strong>Advertencia:</strong> Prohibida la venta a menores de 18 años. Consumir con responsabilidad.
                  </p>
                </div>
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
                  productId="cocoa-cocktail"
                  productName={`Cóctel de Cacao ${selectedVariant.size}`}
                  productPrice={selectedVariant.price}
                  productImage="/assets/images/products/Coctel-1.jpg"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="relative overflow-hidden rounded-2xl group">
                  <img
                    src={productImages[currentImageIndex]}
                    alt={`Cóctel de Cacao - Vista ${currentImageIndex + 1}`}
                    className="w-full h-auto shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Ver imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-lg text-lg">
                  ${selectedVariant.price.toFixed(2)}
                </div>

                <div className="mt-6 grid grid-cols-4 gap-3">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-blue-400 scale-105 shadow-lg'
                          : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover aspect-square"
                      />
                    </button>
                  ))}
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
                    <span className="font-semibold">Cóctel Dulce</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Base:</span>
                    <span className="font-semibold">Cacao Premium</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Temperatura:</span>
                    <span className="font-semibold">Bien Frío</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Origen:</span>
                    <span className="font-semibold">Playas de Cuje, Zumbi</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl border-2 border-amber-300">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xl font-semibold text-amber-800 mb-3">Advertencia Importante</h3>
                    <p className="text-gray-700 mb-2">
                      <strong>Grado Alcohólico: 12°</strong>
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Prohibida la venta a menores de 18 años. El consumo excesivo de alcohol 
                      es perjudicial para la salud. Consumir con responsabilidad.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Características</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Sabor suave y dulce</li>
                  <li>• Textura refrescante</li>
                  <li>• Ideal para clima cálido</li>
                  <li>• Perfecto para compartir</li>
                  <li>• Elaboración artesanal</li>
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
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Almacenamiento y Servicio</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Mantener refrigerado (4-6°C)</li>
                  <li>• Conservar en lugar fresco y seco</li>
                  <li>• Servir bien frío con hielo</li>
                  <li>• Agitar suavemente antes de servir</li>
                  <li>• Consumir con moderación</li>
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
              productId="cocoa-cocktail"
              productName={`Cóctel de Cacao ${selectedVariant.size}`}
              productPrice={selectedVariant.price}
              productImage="/assets/images/products/Coctel-1.jpg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CacaoCocktail;
