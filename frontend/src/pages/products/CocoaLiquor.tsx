import { type FC } from 'react';

const CocoaLiquorComponent: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div>
          <img
            src="/assets/images/products/chocolate-drink.jpg"
            alt="Licor de Cacao"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Información del producto */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Licor de Cacao</h1>
          <p className="text-gray-600 mb-6">
            Nuestro licor de cacao puro, elaborado a partir de granos seleccionados de
            cacao fino de aroma, es perfecto para la elaboración de chocolate y repostería
            de alta calidad.
          </p>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Características</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>100% Cacao puro</li>
              <li>Sin aditivos</li>
              <li>Proceso controlado de fermentación</li>
              <li>Origen: Zamora Chinchipe, Ecuador</li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Presentaciones</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Bloque de 1kg</li>
              <li>Bloque de 5kg</li>
              <li>Granel por pedido</li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Usos</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Elaboración de chocolate</li>
              <li>Repostería fina</li>
              <li>Bebidas de chocolate</li>
              <li>Rellenos y coberturas</li>
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

export default CocoaLiquorComponent;
