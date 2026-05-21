// src/pages/ProductDetail.tsx
import { type FC, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import productsData from "../data/products.json"; // tu JSON importable
import { SITE_CONFIG } from '../config/site';

type ProductVariant = {
  size: string;
  price: number;
};

type ProductJson = {
  id: string;
  name: string;
  description: string;
  images?: string[];
  price?: number;
  priceVariant?: number;
  variants?: ProductVariant[] | string[];
  weight?: string;
  weightVariant?: string;
  volume?: string;
  volumeVariant?: string;
  available?: boolean;
};

const ProductDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product: ProductJson | undefined = productsData.find((p) => p.id === id);

  // Carousel state
  const [current, setCurrent] = useState(0);
  const images = product?.images ?? ["/assets/images/products/fallback.jpg"];
  
  // Variant selection state
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  
  // Check if variants are price variants (ProductVariant[]) or flavor variants (string[])
  const hasPriceVariants = product?.variants && 
    product.variants.length > 0 && 
    typeof product.variants[0] === 'object' && 
    'size' in product.variants[0];
  
  // Get current price based on selected variant
  const getCurrentPrice = (): number => {
    if (hasPriceVariants && product?.variants) {
      return (product.variants[selectedVariant] as ProductVariant)?.price || product.price || 0;
    }
    return product?.price || 0;
  };
  
  // Get current size/variant name
  const getCurrentVariantName = (): string => {
    if (hasPriceVariants && product?.variants) {
      return (product.variants[selectedVariant] as ProductVariant)?.size || '';
    }
    return '';
  };

  useEffect(() => {
    setCurrent(0);
  }, [id]);

  // auto rotate every 4s (pause when hover)
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Producto no encontrado</h2>
        <p className="text-gray-600 mb-6">El producto solicitado no existe.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Regresar
        </button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* IMAGES */}
        <section className="lg:w-1/2">
          <div className="relative rounded-2xl overflow-hidden bg-gray-50 shadow">
            {/* Main image */}
            <img
              src={images[current]}
              alt={`${product.name} - image ${current + 1}`}
              className="w-full h-[420px] object-contain bg-white"
              loading="lazy"
            />

            {/* thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-white/60 px-3 py-2 rounded-full shadow backdrop-blur">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-12 h-12 rounded-md overflow-hidden border-2 ${i === current ? "border-[#8B4513]" : "border-transparent"} focus:outline-none`}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <img src={img} alt={`${product.name} thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* DETAILS */}
        <section className="lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          {/* Static brand/location info — ajusta si lo quieres por producto */}
          <div className="text-sm text-gray-600 mb-4">
            <span className="font-medium">Marca:</span> KUJEÑITO •{" "}
            <span className="font-medium">Organización:</span> ASOPROMAS •{" "}
            <span className="font-medium">Origen:</span> Playas de Cuje, Zumbi, Zamora Chinchipe
          </div>

          <p className="text-gray-700 mb-8 text-lg leading-relaxed">{product.description}</p>

          {/* Variant Selector - Only for price variants */}
          {hasPriceVariants && product.variants && product.variants.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Selecciona la presentación:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(product.variants as ProductVariant[]).map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(index)}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      selectedVariant === index
                        ? 'border-amber-500 bg-amber-50 shadow-md'
                        : 'border-gray-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{variant.size}</div>
                      <div className="text-lg font-bold text-amber-600 mt-1">
                        ${variant.price.toFixed(2)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Display */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">
                ${getCurrentPrice().toFixed(2)}
              </span>
              {getCurrentVariantName() && (
                <span className="text-sm text-gray-500">
                  ({getCurrentVariantName()})
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            {product.available === false ? (
              <div className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg font-semibold">
                Producto No Disponible
              </div>
            ) : (
              <>
                <a 
                  href={`https://wa.me/${SITE_CONFIG.CONTACT_PHONE.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, me interesa el producto: ${product.name}${getCurrentVariantName() ? ` (${getCurrentVariantName()})` : ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Comprar por WhatsApp
                </a>
                <div className="text-sm text-gray-500">
                  💬 Respuesta inmediata por WhatsApp
                </div>
              </>
            )}
          </div>

          <div className="border-t pt-6">
            <Link 
              to="/products" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-amber-600 transition-colors duration-200 group"
            >
              <span className="transform transition-transform duration-200 group-hover:-translate-x-1">←</span>
              <span className="ml-2">Volver al catálogo</span>
            </Link>
          </div>

          {/* Extra: suggestions / related products placeholder */}
          <div className="mt-10">
            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">También te puede gustar</h3>
            {/* Aquí puedes mapear y mostrar 2-3 productos relacionados */}
            <div className="flex gap-3">
              {/* placeholder cards */}
              {/* Reemplaza con productos reales si quieres */}
              <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-600">Related 1</div>
              <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-600">Related 2</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
