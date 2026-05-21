import { type FC, memo } from "react";
import { motion } from "framer-motion";
import products from "../data/products.json";
import ProductCard from "../components/ProductCard";
import { useSEO } from "../hooks/useSEO";

import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const ProductsPageComponent: FC = () => {
  useSEO({
    title: 'Catálogo de Productos - Chocolate Premium | ASOPROMAS',
    description: 'Descubre nuestra colección de productos: barras de chocolate puro, licores premium y bombones artesanales.',
    keywords: 'productos, chocolate artesanal Ecuador, barras chocolate, bombones cacao',
    url: '/products',
  });

  return (
    <main className="min-h-screen bg-stone-50 pt-32 pb-32 font-sans">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center max-w-3xl mx-auto"
        >
          <p className="text-chocolate-400 font-medium tracking-[0.3em] uppercase text-xs mb-6">
            Colección Exclusiva
          </p>
          <h1 className="text-5xl md:text-7xl font-light text-chocolate-950 mb-6">
            Nuestros <span className="font-medium font-serif tracking-wide text-chocolate-800">Tesoros</span>
          </h1>
          <p className="text-xl text-stone-500 font-light leading-relaxed">
            Cada producto es una invitación a descubrir las notas profundas y aromáticas de nuestro cacao milenario cultivado en la Amazonía Ecuatoriana.
          </p>
        </motion.header>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {products
              .filter((p) => p.available !== false)
              .map((p) => (
                <motion.div key={p.id} variants={itemVariants} className="h-full">
                  <ProductCard product={p} />
                </motion.div>
              ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
};

const ProductsPage = memo(ProductsPageComponent);
ProductsPage.displayName = 'ProductsPage';

export default ProductsPage;
