import { useEffect, useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

interface CTAProps {
  className?: string;
}

const CTA: FC<CTAProps> = ({ className = '' }) => {
  const images = [
    '/assets/images/products/Chocolates.jpg',
    '/assets/images/products/Cafe-1.jpg',
    '/assets/images/products/Bombones-fondo.png'
  ];
  const [current, setCurrent] = useState(0);

  // Cambiar imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);
  return (
    <section className={`relative overflow-hidden bg-gradient-to-r from-[#411900]  to-[#ffffff] min-h-screen ${className}`}>
      <div className="w-full h-full px-4 py-16 sm:px-6 sm:py-24 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Columna Izquierda: Texto */}
        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Descubre Nuestra
            <span className="block text-amber-300">Colección Premium de Cacao</span>
          </h2>

          <p className="mt-6 text-lg text-amber-100 max-w-xl mx-auto lg:mx-0">
            Del grano a la barra, experimenta el sabor auténtico del Ecuador. 
            Explora nuestro cacao de fino aroma y creaciones artesanales de chocolate.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-56">
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white 
                bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-xl
                hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600
                focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-brown-900
                transform hover:scale-110 hover:-translate-y-1 active:scale-105 active:translate-y-0
                shadow-2xl hover:shadow-orange-500/50
                transition-all duration-300 ease-out
                overflow-hidden
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
                before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700
                animate-pulse hover:animate-none"
            >
              <ShoppingBag className="w-6 h-6 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
              <span className="relative z-10">Ver Catálogo</span>
              <ArrowRight className="w-6 h-6 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-125" />
            </Link>

          </div>
        </div>

        {/* Columna Derecha: Slider de Imágenes */}
        <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] flex justify-center items-center group">
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
            {images.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === current 
                    ? "opacity-100 scale-100" 
                    : "opacity-0 scale-95"
                }`}
              >
                <img
                  src={img}
                  alt={`Producto ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            ))}

            {/* Indicadores de puntos */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === current
                      ? 'bg-amber-400 w-10 h-3'
                      : 'bg-white/50 hover:bg-white/75 w-3 h-3'
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
