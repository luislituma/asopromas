import { type FC, useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Download, Printer, Package, MapPin, Calendar, Hash } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { CartItem } from '../context/CartContext';

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  orderNumber?: string;
  onClose?: () => void;
}

const OrderSummary: FC<OrderSummaryProps> = ({ 
  items, 
  totalPrice, 
  orderNumber = `ASOP-${Date.now().toString().slice(-8)}`,
  onClose 
}) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();

  const handlePrint = () => {
    window.print();
  };

  // Función para generar PDF como base64 (para envío por email)
  const generatePDFBase64 = async (): Promise<string | null> => {
    if (!summaryRef.current) return null;

    try {
      const canvas = await html2canvas(summaryRef.current, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Retornar PDF como base64
      return pdf.output('dataurlstring');
    } catch (error) {
      console.error('Error generating PDF base64:', error);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    if (!summaryRef.current) return;

    try {
      const canvas = await html2canvas(summaryRef.current, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Orden-${orderNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta de nuevo.');
    }
  };

  const handleDownloadImage = async () => {
    if (!summaryRef.current) return;

    try {
      const canvas = await html2canvas(summaryRef.current, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff'
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Orden-${orderNumber}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error al generar la imagen. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
          {/* Header con botones de acción */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 print:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Package className="w-6 h-6" />
                Resumen de Pedido
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                  title="Imprimir pedido"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                  title="Descargar PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDownloadImage}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                  title="Descargar como imagen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                  title="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Contenido del pedido */}
          <div ref={summaryRef} className="p-8 bg-white">
            {/* Logo y encabezado */}
            <div className="border-b-2 border-amber-500 pb-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">ASOPROMAS</h1>
                  <p className="text-lg text-gray-600">Chocolate Artesanal KUJEÑITO</p>
                  <p className="text-sm text-gray-500 mt-1">Playas de Cuje, Zumbi, Zamora Chinchipe</p>
                </div>
                <div className="text-right">
                  <div className="bg-amber-100 px-4 py-2 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Número de Pedido</p>
                    <p className="text-xl font-bold text-amber-700 flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      {orderNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del pedido */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Fecha del Pedido
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {format(currentDate, 'HH:mm:ss')}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Estado
                </p>
                <p className="text-sm font-semibold text-amber-600">Pendiente de Confirmación</p>
                <p className="text-xs text-gray-600 mt-1">Esperando respuesta por WhatsApp</p>
              </div>
            </div>

            {/* Tabla de productos */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Productos</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              {item.variant && (
                                <p className="text-xs text-gray-500">{item.variant}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-gray-900">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumen de totales */}
            <div className="border-t-2 border-gray-200 pt-6">
              <div className="max-w-sm ml-auto space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal (sin IVA):</span>
                  <span className="font-medium text-gray-900">${(totalPrice / 1.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (15%):</span>
                  <span className="font-medium text-gray-900">${(totalPrice - (totalPrice / 1.15)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium text-green-600">Por confirmar</span>
                </div>
                <div className="border-t-2 border-amber-500 pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">TOTAL:</span>
                  <span className="text-2xl font-bold text-amber-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">📦 Información de Entrega</h4>
                  <p className="text-sm text-blue-800">
                    El tiempo de entrega y costos de envío se confirmarán por WhatsApp según su ubicación.
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">💳 Métodos de Pago</h4>
                  <p className="text-sm text-amber-800">
                    Transferencia bancaria, depósito o pago contra entrega (según disponibilidad).
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                ¡Gracias por tu preferencia! Nos pondremos en contacto contigo pronto.
              </p>
              <p className="text-xs text-gray-500">
                ASOPROMAS - Asociación de Productores Orgánicos de Mandarinas, Aguacates y Sandias
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Chocolate Artesanal KUJEÑITO | Zamora Chinchipe, Ecuador
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para impresión */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          ${summaryRef.current ? `
            #${summaryRef.current.id},
            #${summaryRef.current.id} * {
              visibility: visible;
            }
            #${summaryRef.current.id} {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          ` : ''}
        }
      `}</style>
    </div>
  );
};

export default OrderSummary;
