import { type FC } from "react";
import ButtonBuy from "../../components/ButtonBuy";
import { motion } from "framer-motion";
import { useSEO } from "../../hooks/useSEO";
import { generateProductSchema } from "../../utils/schema";

const CacaoNibs: FC = () => {
  // Generate Product Schema
  const productSchema = generateProductSchema({
    name: "Nibs Naturales de Cacao KUJEÑITO",
    description: "Fragmentos crujientes de granos de cacao tostados, el superalimento ancestral en su forma más pura, llenos de nutrientes y sabor auténtico.",
    price: "16.99",
    currency: "USD",
    category: "Superalimento",
    image: "/assets/images/products/cacao-nibs.jpg",
    url: "/products/cacao-nibs"
  });

  // SEO Configuration
  useSEO({
    title: 'Nibs de Cacao Premium KUJEÑITO - Superalimento Natural | ASOPROMAS',
    description: 'Nibs de cacao KUJEÑITO: fragmentos crujientes de cacao tostado, superalimento rico en antioxidantes, magnesio y hierro. ¡El poder del cacao puro!',
    keywords: 'nibs cacao Ecuador, superalimento cacao, cacao crujiente, antioxidantes naturales, KUJEÑITO nibs, cacao saludable',
    url: '/products/cacao-nibs',
    type: 'product',
    image: '/assets/images/products/cacao-nibs.jpg',
    schema: productSchema
  });

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Natural Cacao Nibs</h1>
            <p className="text-xl text-gray-600">
              Pure and natural roasted cacao nibs, perfect as a healthy snack or to enhance your favorite recipes.
            </p>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Product Details</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>100% natural cacao nibs</li>
                <li>No additives or preservatives</li>
                <li>Rich in antioxidants</li>
                <li>Versatile culinary ingredient</li>
                <li>Perfect for healthy snacking</li>
              </ul>
              <div className="pt-6">
                <ButtonBuy 
                  productId="cacao-nibs-premium"
                  productName="Nibs de Cacao Premium ASOPROMAS"
                  productPrice={16.99}
                  productImage="/assets/images/products/cacao-nibs.jpg"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/src/assets/images/products/cacao-nibs.jpg"
              alt="Natural Cacao Nibs"
              className="rounded-lg shadow-lg w-full h-auto"
            />
            <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-md">
              <span className="font-semibold text-gray-900">100% Natural</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CacaoNibs;
