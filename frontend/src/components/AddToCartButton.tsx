import { type FC, useState } from 'react';
import { ShoppingCart, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  variant?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({
  productId,
  productName,
  productPrice,
  productImage,
  variant,
  className = '',
  size = 'md',
  showText = true
}) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const sizeClasses = {
    sm: showText ? 'px-4 py-2 text-sm' : 'w-10 h-10 text-sm',
    md: showText ? 'px-6 py-3 text-base' : 'w-12 h-12 text-base',
    lg: showText ? 'px-8 py-4 text-lg' : 'w-14 h-14 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    addItem({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      variant
    });

    // Crear efecto de partículas
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }));
    setParticles(newParticles);

    // Mostrar feedback visual
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setParticles([]);
    }, 2000);
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isAdded}
        className={`
          group relative inline-flex items-center justify-center gap-2
          ${sizeClasses[size]} ${showText ? 'rounded-lg' : 'rounded-full'}
          ${isAdded 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
            : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-size-200 bg-pos-0 hover:bg-pos-100'
          }
          text-white font-semibold shadow-lg hover:shadow-2xl
          transform hover:scale-105 active:scale-95
          transition-all duration-500 ease-out
          focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:transform-none
          ${className}
        `}
        style={{
          backgroundSize: '200% 100%',
        }}
        aria-label={`Agregar ${productName} al carrito`}
        title={isAdded ? '¡Agregado!' : 'Agregar al carrito'}
      >
        {/* Brillo animado */}
        <span className="absolute inset-0 ${showText ? 'rounded-lg' : 'rounded-full'} overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
        </span>

        {/* Contenido del botón */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isAdded ? (
            <>
              <Check className={`${iconSizes[size]} animate-scale-check`} strokeWidth={3} />
              {showText && <span>¡Agregado!</span>}
            </>
          ) : (
            <>
              <ShoppingCart className={`${iconSizes[size]} group-hover:scale-110 transition-transform duration-300`} />
              {showText && <span>Agregar al carrito</span>}
            </>
          )}
        </span>
        
        {/* Efecto de pulso cuando se agrega */}
        {isAdded && (
          <span className={`absolute inset-0 ${showText ? 'rounded-lg' : 'rounded-full'} animate-ping bg-green-400 opacity-75`}></span>
        )}

        {/* Efecto de onda al hacer clic */}
        <span className={`absolute inset-0 ${showText ? 'rounded-lg' : 'rounded-full'} bg-white opacity-0 group-active:opacity-30 transition-opacity duration-150`}></span>
      </button>

      {/* Partículas flotantes */}
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: particle.x,
            top: particle.y,
            animation: `float-away-${index % 4} 1s ease-out forwards`
          }}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
      ))}

      <style>{`
        @keyframes scale-check {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-scale-check {
          animation: scale-check 0.6s ease-in-out;
        }
        
        .bg-size-200 { background-size: 200% 100%; }
        .bg-pos-0 { background-position: 0% 0%; }
        .bg-pos-100 { background-position: 100% 0%; }

        @keyframes float-away-0 {
          to {
            transform: translate(20px, -40px);
            opacity: 0;
          }
        }
        @keyframes float-away-1 {
          to {
            transform: translate(-20px, -40px);
            opacity: 0;
          }
        }
        @keyframes float-away-2 {
          to {
            transform: translate(30px, -30px);
            opacity: 0;
          }
        }
        @keyframes float-away-3 {
          to {
            transform: translate(-30px, -30px);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default AddToCartButton;
