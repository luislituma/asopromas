// src/components/ProductCard.tsx
import { type FC } from "react";
import { Link } from "react-router-dom";
import ButtonBuy from "./ButtonBuy";

export type Product = {
  id: string;
  name: string;
  description: string;
  images?: string[];
};

interface Props {
  product: Product;
  className?: string;
}

const fallbackImage = "/assets/images/products/fallback.jpg"; // coloca un fallback en public

const ProductCard: FC<Props> = ({ product, className = "" }) => {
  const thumb = product.images && product.images.length > 0 ? product.images[0] : fallbackImage;

  return (
    <article
      className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 ${className}`}
      aria-labelledby={`product-${product.id}-title`}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative h-56 bg-gray-100 overflow-hidden">
          <img
            src={thumb}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 id={`product-${product.id}-title`} className="text-lg font-semibold text-gray-900 mb-1">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {product.description}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4 flex items-center justify-between">
        <Link
          to={`/products/${product.id}`}
          className="text-sm text-gray-600 hover:text-gray-800"
          aria-label={`View details for ${product.name}`}
        >
          View details
        </Link>

        {/* Botón para comprar / WhatsApp */}
        <ButtonBuy productId={product.id} productName={product.name} />
      </div>
    </article>
  );
};

export default ProductCard;