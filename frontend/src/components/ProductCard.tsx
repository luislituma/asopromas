import { type FC, memo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export type ProductVariant = {
  size: string;
  price?: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  images?: string[];
  price?: number;
  variants?: ProductVariant[] | string[];
  available?: boolean;
};

interface Props {
  product: Product;
  className?: string;
}

const fallbackImage = "/assets/images/products/fallback.jpg";

const ProductCardComponent: FC<Props> = ({ product, className = "" }) => {
  const thumb = product.images && product.images.length > 0 ? product.images[0] : fallbackImage;
  const ref = useRef<HTMLAnchorElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <article
      className={`group w-full h-full ${className}`}
      aria-labelledby={`product-${product.id}-title`}
      aria-describedby={`product-${product.id}-description`}
      style={{ perspective: 1200 }}
    >
      <Link 
        to={`/products/${product.id}`} 
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="block focus-visible outline-none h-full"
        aria-label={`Ver producto ${product.name}`}
      >
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 border border-stone-100 h-full flex flex-col will-change-transform"
        >
          <div className="relative h-72 bg-stone-50 overflow-hidden" style={{ transform: "translateZ(20px)" }}>
            <img
              src={thumb}
              alt={`Imagen de ${product.name}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {product.available === false && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-stone-500 px-4 py-1.5 rounded-full text-xs font-medium">
                No Disponible
              </div>
            )}
          </div>

          <div className="p-8 flex-1 flex flex-col bg-white" style={{ transform: "translateZ(40px)" }}>
            <h3 id={`product-${product.id}-title`} className="text-2xl font-medium text-chocolate-900 mb-3 group-hover:text-amber-600 transition-colors">
              {product.name}
            </h3>

            <p 
              id={`product-${product.id}-description`}
              className="text-stone-500 font-light leading-relaxed mb-6 line-clamp-3 flex-1"
            >
              {product.description}
            </p>
            
            <div className="flex items-center text-chocolate-700 font-medium group-hover:text-amber-600 transition-colors mt-auto">
              <span className="text-sm uppercase tracking-wider">Descubrir</span>
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </motion.div>
      </Link>
    </article>
  );
};

const ProductCard = memo(ProductCardComponent);
ProductCard.displayName = 'ProductCard';

export default ProductCard;