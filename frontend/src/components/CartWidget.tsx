import { type FC, useState } from 'react';
import { ShoppingCart, X, Minus, Plus, Trash2, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SITE_CONFIG } from '../config/site';
import OrderSummary from './OrderSummary';

const CartWidget: FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const generateWhatsAppMessage = () => {
    const message = `¡Hola! Me gustaría hacer el siguiente pedido:\n\n${items
      .map(
        (item, index) =>
          `${index + 1}. *${item.name}*${item.variant ? ` (${item.variant})` : ''}\n   Cantidad: ${item.quantity}\n   Precio: $${(item.price * item.quantity).toFixed(2)}`
      )
      .join('\n\n')}\n\n*Total: $${totalPrice.toFixed(2)}*\n\n¿Podrían confirmar disponibilidad y opciones de entrega?`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppCheckout = () => {
    const whatsappNumber = SITE_CONFIG.CONTACT_PHONE.replace(/\D/g, '');
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Botón flotante del carrito */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-full p-4 shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-110"
        aria-label="Ver carrito de compras"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
            {totalItems}
          </span>
        )}
      </button>

      {/* Modal del carrito */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel del carrito */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Mi Carrito</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/20 p-2 rounded-full transition-colors"
                    aria-label="Cerrar carrito"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-white/90 text-sm mt-2">
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                </p>
              </div>

              {/* Contenido del carrito */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ShoppingCart className="w-16 h-16 mb-4" />
                    <p className="text-lg font-medium">Tu carrito está vacío</p>
                    <p className="text-sm mt-2">¡Agrega productos para comenzar!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-amber-300 transition-colors"
                      >
                        <div className="flex gap-4">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            {item.variant && (
                              <p className="text-sm text-gray-500">{item.variant}</p>
                            )}
                            <p className="text-amber-600 font-bold mt-1">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Botón eliminar */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Eliminar del carrito"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-right text-sm text-gray-600">
                            Subtotal:{' '}
                            <span className="font-bold text-gray-800">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Botón limpiar carrito */}
                    {items.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="w-full text-red-500 hover:text-red-700 text-sm font-medium py-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Vaciar carrito
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Footer con total y botones */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-3">
                  <div className="mb-4">
                    <div className="flex justify-between text-lg mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-gray-800">Total:</span>
                      <span className="text-amber-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Botón Ver Resumen de Pedido */}
                  <button
                    onClick={() => setShowOrderSummary(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Ver Resumen de Pedido</span>
                  </button>

                  {/* Botón WhatsApp */}
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>Finalizar por WhatsApp</span>
                  </button>

                  <p className="text-center text-xs text-gray-500 mt-2">
                    Serás redirigido a WhatsApp para confirmar tu pedido
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resumen de Pedido */}
      {showOrderSummary && (
        <OrderSummary
          items={items}
          totalPrice={totalPrice}
          onClose={() => setShowOrderSummary(false)}
        />
      )}
    </>
  );
};

export default CartWidget;
