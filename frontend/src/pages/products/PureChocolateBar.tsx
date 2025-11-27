import { type FC, useState } from "react";
import { Award, Heart, Leaf, Star, ChevronLeft, ChevronRight } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";
import { useSEO } from "../../hooks/useSEO";
import { generateProductSchema } from "../../utils/schema";

const PureChocolateBar: FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<{ size: string; price: number }>({
    size: "100g",
    price: 3.00
  });
  
  const productImages = [
    "/assets/images/products/Barra-Pura-1.jpg",
    "/assets/images/products/Barra-Pura-2.jpg"
  ];

  const variants = [
    { size: "100g", price: 3.00 },
    { size: "200g", price: 5.00 }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Generate Product Schema
  const productSchema = generateProductSchema({
    name: "Pasta de Cacao ASOPROMAS",
    description: "Pasta de Cacao para Taza al 100%. Cacao puro sin azúcar, elaborado con granos de cacao de fino aroma.",
    price: selectedVariant.price.toString(),
    currency: "USD",
    category: "Cacao Puro",
    image: "/assets/images/products/Barra-Pura-1.jpg",
    url: "/products/chocolate-bar-100"
  });

  // SEO Configuration
  useSEO({
    title: 'Pasta de Cacao 100% - Para Taza | ASOPROMAS',
    description: 'Pasta de cacao pura al 100% para taza. Disponible en 100g ($3.00) y 200g ($5.00). Cacao de fino aroma sin azúcar.',
    keywords: 'pasta cacao 100%, cacao para taza, chocolate puro Ecuador, cacao sin azúcar, cacao artesanal',
    url: '/products/chocolate-bar-100',
    type: 'product',
    image: '/assets/images/products/Barra-Pura-1.jpg',
    schema: productSchema
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
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
                  <span className="text-amber-200 font-medium text-sm">🍫 100% Puro</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Pasta de
                  <span className="block bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    Cacao
                  </span>
                </h1>
                <p className="text-xl text-amber-100 leading-relaxed">
                  Pasta de cacao para taza al 100%. Cacao puro sin azúcar.
                  <span className="font-semibold text-amber-300"> 100g - $3.00 | 200g - $5.00</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Award className="w-5 h-5 text-amber-300" />
                  <span className="text-amber-100">100% Cacao</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Leaf className="w-5 h-5 text-green-300" />
                  <span className="text-amber-100">Sin Azúcar</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Heart className="w-5 h-5 text-red-300" />
                  <span className="text-amber-100">Para Taza</span>
                </div>
              </div>

              {/* Selector de variantes */}
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <h3 className="text-amber-200 font-semibold mb-3">Selecciona el tamaño:</h3>
                <div className="flex gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        selectedVariant.size === variant.size
                          ? 'bg-amber-500 text-white shadow-lg scale-105'
                          : 'bg-white/20 text-amber-100 hover:bg-white/30'
                      }`}
                    >
                      <div className="text-lg">{variant.size}</div>
                      <div className="text-sm">${variant.price.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <ButtonBuy 
                  productId="chocolate-bar-100"
                  productName={`Pasta de Cacao ${selectedVariant.size}`}
                  productPrice={selectedVariant.price}
                  productImage="/assets/images/products/Barra-Pura-1.jpg"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 overflow-hidden">
                {/* Slider de imágenes */}
                <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
                  <img
                    src={productImages[currentImageIndex]}
                    alt={`Pasta de Cacao - Imagen ${currentImageIndex + 1}`}
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
                    <span>Tipo:</span>
                    <span className="font-semibold">Pasta para Taza</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Cacao:</span>
                    <span className="font-semibold">100%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Presentaciones:</span>
                    <span className="font-semibold">100g y 200g</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Precios:</span>
                    <span className="font-semibold text-amber-600">$3.00 - $5.00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Origen:</span>
                    <span className="font-semibold">Zamora Chinchipe</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredientes</h3>
                <div className="flex items-center justify-center py-4">
                  <span className="text-2xl font-bold text-amber-600">100% Granos de Cacao</span>
                </div>
                <p className="text-sm text-gray-600 text-center mt-2">Sin azúcar | Sin aditivos | Puro cacao de fino aroma</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Información Nutricional</h3>
                <p className="text-xs text-gray-500 mb-3">Por porción</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between border-b pb-1">
                    <span>Grasa total</span>
                    <span className="font-semibold">8%</span>
                  </li>
                  <li className="flex justify-between border-b pb-1 pl-3">
                    <span className="text-xs">Saturadas</span>
                    <span className="font-semibold">15%</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Carbohidratos</span>
                    <span className="font-semibold">1%</span>
                  </li>
                  <li className="flex justify-between border-b pb-1 pl-3">
                    <span className="text-xs">Azúcares</span>
                    <span className="font-semibold">0%</span>
                  </li>
                  <li className="flex justify-between border-b pb-1 pl-3">
                    <span className="text-xs">Fibra</span>
                    <span className="font-semibold">0%</span>
                  </li>
                  <li className="flex justify-between border-b pb-1">
                    <span>Proteínas</span>
                    <span className="font-semibold">1g</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Colesterol</span>
                    <span className="font-semibold">0%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sodio</span>
                    <span className="font-semibold">0%</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">*Basado en dieta de 2.000 Kcal</p>
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
              productId="pure-chocolate-bar-100"
              productName="Barra de Chocolate 100% KUJEÑITO"
              productPrice={15.99}
              productImage="/assets/images/products/chocolate-bar.jpg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PureChocolateBar;
