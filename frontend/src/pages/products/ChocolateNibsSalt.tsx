import { type FC, useState } from "react";
import { Award, Heart, Sparkles, Star, Coffee, ChevronLeft, ChevronRight } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";
import { useSEO } from "../../hooks/useSEO";
import { generateProductSchema } from "../../utils/schema";

const ChocolateNibsSalt: FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const productImages = [
    "/assets/images/products/Nibs-Sal-Marina-1.jpg",
    "/assets/images/products/Nibs-Sal-Marina-2.jpg",
    "/assets/images/products/Nibs-Sal-Marina-3.jpg"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Generate Product Schema
  const productSchema = generateProductSchema({
    name: "Barra de Chocolate con Nibs & Sal Marina ASOPROMAS",
    description: "Barra de Chocolate Fino Artesanal al 65% con Nibs y Sal Marina. 50g de chocolate premium.",
    price: "3.50",
    currency: "USD",
    category: "Chocolate Artesanal",
    image: "/assets/images/products/Nibs-Sal-Marina-1.jpg",
    url: "/products/chocolate-nibs-salt"
  });

  // SEO Configuration
  useSEO({
    title: 'Barra de Chocolate con Nibs & Sal Marina - 65% Cacao | ASOPROMAS',
    description: 'Chocolate artesanal al 65% con nibs de cacao y sal marina. 50g / 1.76 oz por $3.50. Equilibrio perfecto entre dulce y salado.',
    keywords: 'chocolate nibs sal marina, chocolate 65%, chocolate artesanal Ecuador, barra chocolate cacao',
    url: '/products/chocolate-nibs-salt',
    type: 'product',
    image: '/assets/images/products/Nibs-Sal-Marina-1.jpg',
    schema: productSchema
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-slate-800 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-slate-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-gray-400/40 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-slate-500/20 backdrop-blur-sm rounded-full border border-slate-400/40">
                  <span className="text-slate-200 font-medium text-sm">🧂 Premium 65%</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Chocolate con
                  <span className="block bg-gradient-to-r from-slate-300 to-gray-300 bg-clip-text text-transparent">
                    Nibs & Sal Marina
                  </span>
                </h1>
                <p className="text-xl text-slate-100 leading-relaxed">
                  Barra de chocolate fino artesanal al 65% con nibs de cacao y sal marina.
                  <span className="font-semibold text-slate-300"> 50g | $3.50</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Award className="w-5 h-5 text-slate-300" />
                  <span className="text-slate-100">65% Cacao</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Sparkles className="w-5 h-5 text-blue-300" />
                  <span className="text-slate-100">Sal Marina</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Coffee className="w-5 h-5 text-amber-300" />
                  <span className="text-slate-100">Nibs Crocantes</span>
                </div>
              </div>

              <div className="pt-6">
                <ButtonBuy 
                  productId="chocolate-nibs-salt"
                  productName="Barra de Chocolate con Nibs & Sal Marina"
                  productPrice={3.50}
                  productImage="/assets/images/products/Nibs-Sal-Marina-1.jpg"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 overflow-hidden">
                {/* Slider de imágenes */}
                <div className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer">
                  <img
                    src={productImages[currentImageIndex]}
                    alt={`Barra de Chocolate con Nibs & Sal Marina - Imagen ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Botones de navegación */}
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-6 h-6 text-slate-600" />
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
                          ? 'border-slate-400 scale-110 shadow-lg'
                          : 'border-white/30 hover:border-slate-300 opacity-70 hover:opacity-100'
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

                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-slate-500 to-gray-500 text-white px-6 py-3 rounded-full font-bold shadow-lg z-10">
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
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Sabor Equilibrado
                    </h3>
                    <p className="text-gray-700">
                      La combinación perfecta entre el dulce del chocolate y la textura 
                      crocante de los nibs, realzada por el toque sutil de sal marina.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Sal Marina Artesanal
                    </h3>
                    <p className="text-gray-700">
                      Sal marina cuidadosamente seleccionada que aporta minerales naturales 
                      y realza todos los sabores del chocolate.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <h3 className="text-xl font-semibold text-amber-800 mb-3 flex items-center gap-2">
                      <Coffee className="w-5 h-5" />
                      Nibs Crocantes
                    </h3>
                    <p className="text-gray-700">
                      Trocitos de cacao tostado que añaden textura y concentran el sabor 
                      más puro del cacao en cada bocado.
                    </p>
                  </div>

                  <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <h3 className="text-xl font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Experiencia Sensorial
                    </h3>
                    <p className="text-gray-700">
                      Una sinfonía de texturas y sabores que despierta todos los sentidos 
                      en una experiencia única e inolvidable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-slate-100 to-gray-100 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Información del Producto</h3>
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
                    <span className="font-semibold text-slate-600">$3.50</span>
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
                    <span className="text-sm font-semibold bg-slate-100 px-2 py-1 rounded">50%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Azúcar</span>
                    <span className="text-sm font-semibold bg-slate-100 px-2 py-1 rounded">34.5%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Nibs de Cacao</span>
                    <span className="text-sm font-semibold bg-amber-100 px-2 py-1 rounded">5%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Manteca de Cacao</span>
                    <span className="text-sm font-semibold bg-slate-100 px-2 py-1 rounded">5%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Sal Marina</span>
                    <span className="text-sm font-semibold bg-blue-100 px-2 py-1 rounded">0.5%</span>
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
                    <span className="font-semibold">6g</span>
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
                    <span>Contenido de Cacao:</span>
                    <span className="font-semibold">65%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Ingredientes Especiales:</span>
                    <span className="font-semibold">Nibs + Sal Marina</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Textura:</span>
                    <span className="font-semibold">Crocante</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sabor:</span>
                    <span className="font-semibold">Equilibrado</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Origen:</span>
                    <span className="font-semibold">Zamora Chinchipe</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Beneficios Únicos</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Antioxidantes del cacao y nibs</li>
                  <li>• Minerales naturales de la sal marina</li>
                  <li>• Estimula los sentidos</li>
                  <li>• Textura satisfactoria</li>
                  <li>• Sabor duradero y memorable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">La Experiencia Perfecta</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🧂</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Toque Salino</h3>
                <p className="text-gray-600">
                  La sal marina realza los sabores naturales del chocolate, 
                  creando un contraste perfecto que intensifica cada nota.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Textura Crocante</h3>
                <p className="text-gray-600">
                  Los nibs de cacao añaden una textura única que contrasta 
                  con la suavidad del chocolate, creando una experiencia multisensorial.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">🍫</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Sabor Equilibrado</h3>
                <p className="text-gray-600">
                  La perfecta armonía entre dulce y salado, suave y crocante, 
                  que hace de cada bocado una experiencia única.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-slate-600 to-gray-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Descubre el Equilibrio Perfecto
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experimenta la armonía única del chocolate KUJEÑITO con nibs y sal marina
          </p>
          <div className="flex justify-center">
            <ButtonBuy 
              productId="chocolate-nibs-salt"
              productName="Chocolate con Nibs y Sal Marina KUJEÑITO"
              productPrice={17.99}
              productImage="/assets/images/products/chocolate-nibs-salt.jpg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChocolateNibsSalt;


