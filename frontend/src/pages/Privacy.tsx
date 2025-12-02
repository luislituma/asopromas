import { type FC } from "react";
import { Shield, Lock, Eye, Database, Mail, FileText } from "lucide-react";

const Privacy: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidad
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
              En ASOPROMAS (Asociación de Producción de Cacao y Derivados Aromas del Sur), nos comprometemos a proteger 
              la privacidad y seguridad de la información personal de nuestros clientes, visitantes del 
              sitio web y socios comerciales. Esta Política de Privacidad describe cómo recopilamos, 
              usamos y protegemos su información.
            </p>
          </section>

          {/* Sección 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                1. Información que Recopilamos
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">Información de Contacto:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nombre completo</li>
                  <li>Correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Dirección de envío</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Información de Pedidos:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Detalles de productos seleccionados</li>
                  <li>Cantidades y preferencias</li>
                  <li>Historial de compras</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Información Técnica:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Dirección IP</li>
                  <li>Tipo de navegador</li>
                  <li>Páginas visitadas</li>
                  <li>Tiempo de navegación</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sección 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                2. Cómo Usamos su Información
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>Utilizamos la información recopilada para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Procesar y gestionar sus pedidos</li>
                <li>Comunicarnos sobre el estado de sus compras</li>
                <li>Enviar información sobre nuevos productos y promociones (con su consentimiento)</li>
                <li>Mejorar nuestro sitio web y servicios</li>
                <li>Cumplir con obligaciones legales y fiscales</li>
                <li>Prevenir fraudes y garantizar la seguridad</li>
              </ul>
            </div>
          </section>

          {/* Sección 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                3. Protección de Datos
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger su 
                información personal contra acceso no autorizado, pérdida o alteración:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encriptación de datos sensibles</li>
                <li>Acceso restringido a información personal</li>
                <li>Servidores seguros con certificados SSL</li>
                <li>Monitoreo constante de seguridad</li>
                <li>Copias de seguridad regulares</li>
              </ul>
            </div>
          </section>

          {/* Sección 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                4. Compartir Información
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                No vendemos ni alquilamos su información personal a terceros. Podemos compartir 
                información únicamente con:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proveedores de servicios de envío y logística</li>
                <li>Procesadores de pagos seguros</li>
                <li>Servicios de email marketing (con su consentimiento)</li>
                <li>Autoridades legales cuando sea requerido por ley</li>
              </ul>
            </div>
          </section>

          {/* Sección 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                5. Sus Derechos
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>Usted tiene derecho a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acceder a su información personal</li>
                <li>Corregir datos inexactos o incompletos</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Oponerse al procesamiento de su información</li>
                <li>Retirar su consentimiento en cualquier momento</li>
                <li>Solicitar una copia de sus datos en formato portable</li>
              </ul>
              <p className="mt-4">
                Para ejercer estos derechos, contáctenos en:{" "}
                <a href="mailto:info@asopromas.com" className="text-amber-600 hover:text-amber-700 font-semibold">
                  info@asopromas.com
                </a>
              </p>
            </div>
          </section>

          {/* Sección 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                6. Almacenamiento Local
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Utilizamos el almacenamiento local de su navegador únicamente para mantener su 
                carrito de compras mientras navega por el sitio. Esta información:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Se guarda solo en su dispositivo</li>
                <li>No se envía a nuestros servidores</li>
                <li>No rastrea su actividad</li>
                <li>Puede ser eliminada en cualquier momento desde su navegador</li>
              </ul>
              <p className="mt-3">
                No utilizamos cookies de terceros ni herramientas de rastreo externas.
              </p>
            </div>
          </section>

          {/* Sección 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                7. Retención de Datos
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Conservamos su información personal durante el tiempo necesario para cumplir con 
                los propósitos descritos en esta política, a menos que la ley requiera o permita 
                un período de retención más largo.
              </p>
            </div>
          </section>

          {/* Sección 8 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                8. Cambios a esta Política
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier 
                momento. Los cambios serán efectivos inmediatamente después de su publicación en 
                el sitio web. Le recomendamos revisar periódicamente esta página.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contacto
            </h2>
            <p className="text-gray-700 mb-4">
              Si tiene preguntas o inquietudes sobre esta Política de Privacidad, contáctenos:
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
                <strong>Dirección:</strong>Zumbi, Zamora-Chinchipe, Ecuador
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
