import { type FC } from 'react';

const ChocolateBarComponent: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div>
          <img
            src="/assets/images/products/chocolate-bar.jpg"
            alt="Barra de Chocolate"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Información del producto */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Barra de Chocolate</h1>
          <p className="text-gray-600 mb-6">
            Nuestro chocolate fino de aroma, elaborado con el mejor cacao de Manabí,
            ofrece una experiencia única de sabor que combina notas frutales y florales.
          </p>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Características</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>70% Cacao fino de aroma</li>
              <li>Sin aditivos artificiales</li>
              <li>Proceso artesanal</li>
              <li>Origen: Manabí, Ecuador</li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Presentaciones</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Barra de 50g</li>
              <li>Barra de 100g</li>
              <li>Pack degustación (4 x 25g)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">¿Interesado en este producto?</h2>
            <a
              href="/contact"
              className="inline-block bg-brown-600 text-white px-6 py-3 rounded-lg hover:bg-brown-700 transition-colors"
            >
              Contactar para más información
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChocolateBarComponent;
