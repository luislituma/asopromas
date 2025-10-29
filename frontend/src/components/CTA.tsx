import { useEffect, useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import chocolate1 from '../assets/images/products/chocolate.png';


interface CTAProps {
  className?: string;
}



const CTA: FC<CTAProps> = ({ className = '' }) => {
  const images = [chocolate1];
  const [current, setCurrent] = useState(0);

  // Cambiar imagen cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
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

        {/* Columna Derecha: Imagen */}
       <div className="relative w-full h-72 flex justify-center items-center">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Chocolate ${index + 1}`}
              className={`absolute w-100 h-auto object-contain transition-opacity duration-1000 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTA;
