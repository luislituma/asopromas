import { type FC } from "react";
import { Link } from "react-router-dom";
import ButtonBuy from "../../components/ButtonBuy";
import { motion } from "framer-motion";

const CacaoNibs: FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="mb-8">
          <Link to="/products" className="text-gray-600 hover:text-gray-900">
            ← Back to Products
          </Link>
        </nav>

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
                <ButtonBuy />
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
