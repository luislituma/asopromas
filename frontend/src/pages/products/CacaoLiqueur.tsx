import { type FC } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Award, Heart, Wine, Star, Clock } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";

const CacaoLiqueur: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-red-600 transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-red-600 transition-colors">Productos</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-red-600 font-medium">Licor Dulce de Cacao</span>
        </nav>
      </div>

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
                  <span className="text-red-200 font-medium text-sm">🍷 KUJEÑITO Premium</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Licor Dulce
                  <span className="block bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
                    de Cacao
                  </span>
                </h1>
                <p className="text-xl text-red-100 leading-relaxed">
                  Licor artesanal suave y dulce de 20 grados, ideal para disfrutar y compartir desde 
                  <span className="font-semibold text-red-300"> Playas de Cuje, Zumbi</span>
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

              <div className="pt-6">
                <ButtonBuy 
                  productName="Licor Dulce de Cacao KUJEÑITO 20° - ASOPROMAS"
                  variant="whatsapp"
                  size="lg"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <img
                  src="/src/assets/images/products/chocolate.png"
                  alt="Licor Dulce de Cacao"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  20° Licor
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
                <h3 className="text-xl font-semibold text-red-800 mb-4">Información del Producto</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex justify-between">
                    <span>Grado Alcohólico:</span>
                    <span className="font-semibold">20°</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-semibold">Licor Dulce</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Base:</span>
                    <span className="font-semibold">Cacao Premium</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Proceso:</span>
                    <span className="font-semibold">Artesanal</span>
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
                  <li>• Textura suave y sedosa</li>
                  <li>• Aroma intenso a cacao</li>
                  <li>• Dulzor natural balanceado</li>
                  <li>• Final prolongado y placentero</li>
                  <li>• Sin aditivos artificiales</li>
                </ul>
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
                  <li>• Mantener en lugar fresco y seco</li>
                  <li>• Temperatura ambiente (18-22°C)</li>
                  <li>• Proteger de la luz directa</li>
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
              productName="Licor Dulce de Cacao KUJEÑITO 20° - ASOPROMAS"
              variant="whatsapp"
              size="lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CacaoLiqueur;


