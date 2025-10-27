import { type FC, useState } from 'react';
import { ShoppingCart, X, Minus, Plus, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCart } from '../context/CartContext';
import OrderSummary from './OrderSummary';
import EmailCaptureModal from './EmailCaptureModal';
import { sendOrderEmail, sendOrderNotificationToCompany } from '../services/emailService';
import { downloadOrderPDF } from '../utils/pdfGenerator';

const CartWidget: FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  const handleCheckout = () => {
    // Mostrar modal para capturar email
    setShowEmailModal(true);
  };

  const handleEmailSubmit = async (email: string, name: string) => {
    setIsLoadingEmail(true);

    try {
      const orderNumber = `ASOP-${Date.now().toString().slice(-8)}`;
      const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
      
      // El precio mostrado ya incluye IVA del 15%
      const total = totalPrice;
      // Calcular subtotal (precio sin IVA): Total / 1.15
      const subtotal = total / 1.15;
      // Calcular IVA (15%): Total - Subtotal
      const iva = total - subtotal;

      // Generar y descargar PDF automáticamente para ASOPROMAS
      downloadOrderPDF({
        orderNumber,
        customerName: name,
        customerEmail: email,
        items,
        subtotal,
        iva,
        total,
        orderDate: currentDate,
      });

      // Enviar email al cliente (si está configurado)
      await sendOrderEmail({
        orderNumber,
        customerEmail: email,
        customerName: name,
        items,
        subtotal,
        iva,
        total,
        orderDate: currentDate,
      });

      // Enviar notificación a la empresa (opcional)
      await sendOrderNotificationToCompany({
        orderNumber,
        customerEmail: email,
        customerName: name,
        items,
        subtotal,
        iva,
        total,
        orderDate: currentDate,
      });

      // Cerrar modal de email
      setShowEmailModal(false);
      setIsLoadingEmail(false);

      // Limpiar carrito después de enviar
      clearCart();
      
      // Cerrar el panel del carrito
      setIsOpen(false);

      // Mostrar confirmación
      alert('✅ ¡Pedido procesado exitosamente!\n\n📧 Revisa tu email con las instrucciones de pago y el PDF adjunto del pedido.\n\n💬 Puedes contactarnos por WhatsApp usando el enlace en el email si tienes dudas.');
    } catch (error) {
      console.error('Error:', error);
      setIsLoadingEmail(false);
      alert('⚠️ Hubo un error al procesar el pedido.\n\nPor favor, intenta nuevamente o contáctanos directamente por WhatsApp.');
      
      // Cerrar modal
      setShowEmailModal(false);
    }
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

                  {/* Botón Finalizar Pedido */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span>Finalizar Pedido</span>
                  </button>

                  <p className="text-center text-xs text-gray-500 mt-2">
                    📧 Recibirás un email con las instrucciones de pago
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

      {/* Modal de Captura de Email */}
      {showEmailModal && (
        <EmailCaptureModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
          isLoading={isLoadingEmail}
        />
      )}
    </>
  );
};

export default CartWidget;
