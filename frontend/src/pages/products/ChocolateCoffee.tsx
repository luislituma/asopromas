import { type FC } from "react";
import { Link } from "react-router-dom";
import ButtonBuy from "../../components/ButtonBuy";
import { motion } from "framer-motion";

const ChocolateCoffee: FC = () => {
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
            <h1 className="text-4xl font-bold text-gray-900">Chocolate Bar with Coffee</h1>
            <p className="text-xl text-gray-600">
              A sophisticated blend of 65% chocolate with premium Palanda coffee beans, creating an energizing and aromatic experience.
            </p>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Product Details</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>65% fine dark chocolate</li>
                <li>Premium Palanda coffee beans</li>
                <li>Natural energy boost</li>
                <li>Rich coffee aroma</li>
                <li>Perfect morning companion</li>
              </ul>
              <div className="pt-6">
                <ButtonBuy />
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/src/assets/images/products/chocolate-coffee.jpg"
              alt="Chocolate Bar with Coffee"
              className="rounded-lg shadow-lg w-full h-auto"
            />
            <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-md">
              <span className="font-semibold text-gray-900">Coffee Blend</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChocolateCoffee;
