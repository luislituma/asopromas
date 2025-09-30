import { type FC } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Award, Heart, Sparkles, Star, Cherry } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";

const FruitBonbons: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-pink-600 transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-pink-600 transition-colors">Productos</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-pink-600 font-medium">Bombones con Frutas Exóticas</span>
        </nav>
      </div>

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
                  Bombones con
                  <span className="block bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                    Frutas Exóticas
                  </span>
                </h1>
                <p className="text-xl text-pink-100 leading-relaxed">
                  Deliciosos bombones rellenos de frutas locales y exóticas de la zona amazónica de 
                  <span className="font-semibold text-pink-300"> Playas de Cuje, Zumbi</span>
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
                  productName="Bombones con Frutas Exóticas KUJEÑITO - ASOPROMAS"
                  variant="whatsapp"
                  size="lg"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <img
                  src="/src/assets/images/products/chocolate.png"
                  alt="Bombones con Frutas Exóticas"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  Frutas Exóticas
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
                    <span className="font-semibold">Bombones Premium</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Relleno:</span>
                    <span className="font-semibold">Frutas Exóticas</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Variedad:</span>
                    <span className="font-semibold">Frutas Locales</span>
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Frutas Utilizadas</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Maracuyá amazónico</li>
                  <li>• Uvilla (golden berry)</li>
                  <li>• Guayusa</li>
                  <li>• Cacao de origen</li>
                  <li>• Frutas de temporada</li>
                </ul>
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
              productName="Bombones con Frutas Exóticas KUJEÑITO - ASOPROMAS"
              variant="whatsapp"
              size="lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default FruitBonbons;


