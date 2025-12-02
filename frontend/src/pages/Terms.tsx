import { type FC } from "react";
import { FileText, ShoppingCart, Package, CreditCard, AlertCircle, Scale } from "lucide-react";

const Terms: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="w-16 h-16 text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          
          {/* Introducción */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              Bienvenido a ASOPROMAS (Asociación de Producción de Cacao y Derivados Aromas del Sur). Al acceder y 
              utilizar este sitio web, usted acepta estar sujeto a los siguientes términos y condiciones. 
              Si no está de acuerdo con estos términos, le solicitamos que no utilice nuestro sitio.
            </p>
          </section>

          {/* Sección 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                1. Aceptación de Términos
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Al utilizar este sitio web y realizar pedidos de nuestros productos, usted acepta:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cumplir con estos Términos y Condiciones</li>
                <li>Proporcionar información veraz y actualizada</li>
                <li>Ser responsable de la confidencialidad de su cuenta</li>
                <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
              </ul>
            </div>
          </section>

          {/* Sección 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                2. Productos y Precios
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Disponibilidad:</strong> Los productos mostrados en el sitio están sujetos 
                a disponibilidad. Nos reservamos el derecho de discontinuar productos en cualquier momento.
              </p>
              <p>
                <strong>Precios:</strong> Todos los precios están expresados en dólares estadounidenses 
                (USD) e incluyen IVA del 15%. Los precios pueden cambiar sin previo aviso.
              </p>
              <p>
                <strong>Descripciones:</strong> Hacemos nuestro mejor esfuerzo para describir 
                nuestros productos con precisión. Las imágenes son representativas y pueden variar 
                ligeramente del producto real.
              </p>
            </div>
          </section>

          {/* Sección 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                3. Pedidos y Procesamiento
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Realización de Pedidos:</strong> Al realizar un pedido, recibirá un correo 
                electrónico de confirmación con los detalles del pedido y un PDF con el resumen de compra.
              </p>
              <p>
                <strong>Confirmación:</strong> Nos reservamos el derecho de rechazar o cancelar 
                pedidos por razones que incluyen, pero no se limitan a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Falta de disponibilidad del producto</li>
                <li>Errores en la información del pedido</li>
                <li>Problemas con la verificación de pago</li>
                <li>Actividad fraudulenta o sospechosa</li>
              </ul>
            </div>
          </section>

          {/* Sección 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                4. Pago y Facturación
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Métodos de Pago:</strong> Actualmente procesamos pedidos mediante contacto 
                directo por WhatsApp o correo electrónico. Los detalles de pago se proporcionarán 
                después de confirmar su pedido.
              </p>
              <p>
                <strong>Facturación:</strong> Emitimos facturas legales para todas las transacciones. 
                Asegúrese de proporcionar sus datos de facturación correctos.
              </p>
              <p>
                <strong>Seguridad:</strong> Nunca compartimos información de pago con terceros no 
                autorizados. Todas las transacciones se procesan de forma segura.
              </p>
            </div>
          </section>

          {/* Sección 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                5. Envío y Entrega
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Área de Cobertura:</strong> Realizamos entregas dentro de Ecuador. 
                Las condiciones específicas y costos de envío se coordinarán directamente con el cliente.
              </p>
              <p>
                <strong>Tiempos de Entrega:</strong> Los tiempos de entrega varían según la ubicación 
                y disponibilidad. Le mantendremos informado sobre el estado de su pedido.
              </p>
              <p>
                <strong>Responsabilidad:</strong> Es responsabilidad del cliente proporcionar una 
                dirección de entrega correcta y estar disponible para recibir el pedido.
              </p>
            </div>
          </section>

          {/* Sección 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                6. Devoluciones y Reembolsos
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Productos Defectuosos:</strong> Si recibe un producto defectuoso o dañado, 
                contáctenos dentro de las 48 horas posteriores a la recepción para coordinar una 
                devolución o reemplazo.
              </p>
              <p>
                <strong>Condiciones para Devolución:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>El producto debe estar sin abrir y en su empaque original</li>
                <li>Debe incluir toda la documentación y accesorios</li>
                <li>El cliente debe proporcionar evidencia fotográfica del defecto</li>
              </ul>
              <p>
                <strong>Productos Perecederos:</strong> Debido a la naturaleza artesanal y orgánica 
                de nuestros productos de chocolate y cacao, no aceptamos devoluciones por cambio de 
                opinión, solo por defectos de fabricación.
              </p>
            </div>
          </section>

          {/* Sección 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                7. Propiedad Intelectual
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Todo el contenido de este sitio web, incluyendo textos, imágenes, logotipos, 
                diseños y marcas comerciales, es propiedad de ASOPROMAS y está protegido por 
                las leyes de propiedad intelectual de Ecuador.
              </p>
              <p>
                No está permitido reproducir, distribuir o usar nuestro contenido sin 
                autorización expresa por escrito.
              </p>
            </div>
          </section>

          {/* Sección 8 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                8. Limitación de Responsabilidad
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                ASOPROMAS no será responsable por:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Daños indirectos, incidentales o consecuentes</li>
                <li>Pérdida de datos o interrupciones del servicio</li>
                <li>Errores técnicos o de sistema</li>
                <li>Retrasos causados por terceros (servicios de envío, etc.)</li>
                <li>Casos de fuerza mayor</li>
              </ul>
            </div>
          </section>

          {/* Sección 9 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                9. Modificaciones
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier 
                momento. Los cambios entrarán en vigor inmediatamente después de su publicación. 
                El uso continuado del sitio después de las modificaciones constituye su aceptación 
                de los términos actualizados.
              </p>
            </div>
          </section>

          {/* Sección 10 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                10. Ley Aplicable y Jurisdicción
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Estos Términos y Condiciones se rigen por las leyes de la República del Ecuador. 
                Cualquier disputa será resuelta en los tribunales competentes de Zamora Chinchipe, 
                Ecuador.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contacto
            </h2>
            <p className="text-gray-700 mb-4">
              Si tiene preguntas sobre estos Términos y Condiciones, contáctenos:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:info@asopromas.com" className="text-amber-600 hover:text-amber-700">
                  info@asopromas.com
                </a>
              </p>
              <p>
                <strong>WhatsApp:</strong>{" "}
                <a href="https://wa.me/593961706421" className="text-amber-600 hover:text-amber-700" target="_blank" rel="noopener noreferrer">
                  +593 96 170 6421
                </a>
              </p>
              <p>
                <strong>Dirección:</strong> Zamora, Ecuador
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
