import { useEffect, useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import chocolate1 from '../assets/images/products/chocolate.png';
import chocolate2 from '../assets/images/products/chocolate-bar.jpg';
import chocolate3 from '../assets/images/products/chocolate-drink.jpg';


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
    <section className={`relative overflow-hidden bg-gradient-to-r from-[#411900]  to-[#ffffff] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Columna Izquierda: Texto */}
        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover Our Premium
            <span className="block text-amber-300">Cacao Collection</span>
          </h2>

          <p className="mt-6 text-lg text-amber-100 max-w-xl mx-auto lg:mx-0">
            From bean to bar, experience the authentic taste of Ecuador. 
            Explore our fine aroma cacao and artisanal chocolate creations.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-56">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-amber-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 rounded-lg
                hover:from-amber-500 hover:to-amber-400
                focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-brown-900
                transform hover:-translate-y-0.5 active:translate-y-0
                shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              View Catalog
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/about"
              className="text-lg font-semibold text-white hover:text-amber-200 transition-colors duration-300"
            >
              Learn More →
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
