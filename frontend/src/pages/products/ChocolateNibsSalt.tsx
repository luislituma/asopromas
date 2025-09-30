import { type FC } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Award, Heart, Sparkles, Star, Coffee } from "lucide-react";
import ButtonBuy from "../../components/ButtonBuy";

const ChocolateNibsSalt: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-slate-600 transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-slate-600 transition-colors">Productos</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-600 font-medium">Chocolate con Nibs y Sal</span>
        </nav>
      </div>

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
                  <span className="text-slate-200 font-medium text-sm">🧂 KUJEÑITO Premium</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Chocolate con
                  <span className="block bg-gradient-to-r from-slate-300 to-gray-300 bg-clip-text text-transparent">
                    Nibs y Sal Marina
                  </span>
                </h1>
                <p className="text-xl text-slate-100 leading-relaxed">
                  Chocolate 65% con trocitos de cacao tostado y un toque de sal marina de 
                  <span className="font-semibold text-slate-300"> Playas de Cuje, Zumbi</span>
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
                  productName="Chocolate con Nibs y Sal Marina KUJEÑITO - ASOPROMAS"
                  variant="whatsapp"
                  size="lg"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <img
                  src="/src/assets/images/products/chocolate.png"
                  alt="Chocolate con Nibs y Sal Marina"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-slate-500 to-gray-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  65% Cacao
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
              productName="Chocolate con Nibs y Sal Marina KUJEÑITO - ASOPROMAS"
              variant="whatsapp"
              size="lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChocolateNibsSalt;


