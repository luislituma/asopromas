// src/pages/Products.tsx
import { type FC } from "react";
import products from "../data/products.json";
import ProductCard from "../components/ProductCard";

const ProductsPage: FC = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold">KUJEÑITO — Nuestros Productos</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-3">
          Elaborados con amor por ASOPROMAS en Playas de Cuje, Zumbi, Zamora Chinchipe.
        </p>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default ProductsPage;