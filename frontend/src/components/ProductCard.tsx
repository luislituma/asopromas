// src/components/ProductCard.tsx
import { type FC, memo, useState } from "react";
import { Link } from "react-router-dom";
import ButtonBuy from "./ButtonBuy";

export type ProductVariant = {
  size: string;
  price: number;
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

const fallbackImage = "/assets/images/products/fallback.jpg"; // coloca un fallback en public

const ProductCardComponent: FC<Props> = ({ product, className = "" }) => {
  const thumb = product.images && product.images.length > 0 ? product.images[0] : fallbackImage;
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  
  // Obtener precio y variante actual
  const hasVariants = product.variants && 
    product.variants.length > 0 && 
    typeof product.variants[0] === 'object' && 
    'size' in product.variants[0];
  
  const currentPrice = hasVariants && product.variants
    ? (product.variants[selectedVariantIndex] as ProductVariant).price 
    : (product.price || 0);
  const currentVariant = hasVariants && product.variants
    ? (product.variants[selectedVariantIndex] as ProductVariant).size 
    : undefined;

  return (
    <article
      className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-[#411900] focus-within:ring-offset-2 ${className}`}
      aria-labelledby={`product-${product.id}-title`}
      aria-describedby={`product-${product.id}-description`}
    >
      <Link 
        to={`/products/${product.id}`} 
        className="block focus-visible"
        aria-label={`Ver producto ${product.name}`}
      >
        <div className="relative h-56 bg-gray-100 overflow-hidden">
          <img
            src={thumb}
            alt={`Imagen de ${product.name}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback image if main image fails to load
              const target = e.target as HTMLImageElement;
              target.src = fallbackImage;
            }}
          />
        </div>

        <div className="p-4">
          <h3 id={`product-${product.id}-title`} className="text-lg font-semibold text-gray-900 mb-1">
            {product.name}
          </h3>

          <p 
            id={`product-${product.id}-description`}
            className="text-sm text-gray-600 mb-4 line-clamp-3"
          >
            {product.description}
          </p>
        </div>
      </Link>

      {/* Selector de variantes si existen */}
      {hasVariants && (
        <div className="px-4 pb-3">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Presentación:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(product.variants as ProductVariant[]).map((variant, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedVariantIndex(index)}
                className={`px-2 py-1.5 rounded-lg border-2 transition-all text-xs font-medium ${
                  selectedVariantIndex === index
                    ? "border-amber-600 bg-amber-50 text-amber-900"
                    : "border-gray-300 bg-white text-gray-700 hover:border-amber-400"
                }`}
              >
                <div>{variant.size}</div>
                <div className="text-xs font-bold">${variant.price.toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pb-4 flex items-center justify-between">
        <Link
          to={`/products/${product.id}`}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 hover:underline focus-visible"
          aria-label={`Ver detalles completos de ${product.name}`}
        >
          Ver detalles →
        </Link>

        {/* Botón para comprar o badge de no disponible */}
        {product.available === false ? (
          <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium">
            No Disponible
          </span>
        ) : (
          <ButtonBuy 
            productId={product.id} 
            productName={product.name}
            productPrice={currentPrice}
            productImage={thumb}
            variant={currentVariant}
          />
        )}
      </div>
    </article>
  );
};

// Memoizar para evitar re-renders innecesarios
const ProductCard = memo(ProductCardComponent);
ProductCard.displayName = 'ProductCard';

export default ProductCard;