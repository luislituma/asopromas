import emailjs from '@emailjs/browser';
import { SITE_CONFIG } from '../config/site';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

// Configuración de EmailJS
// Ahora soportamos variables de entorno Vite (recomendado) con fallback a los valores actuales.
// Puedes definir en un archivo .env en la raíz del proyecto:
// VITE_EMAILJS_SERVICE_ID=service_xxx
// VITE_EMAILJS_TEMPLATE_ID=template_xxx
// VITE_EMAILJS_PUBLIC_KEY=public_xxx

const SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || 'service_u1xx4q9';
const TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || 'template_3vc5pdh';
const PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || 'dOXxZUCQTP-kLZr92';

// ⚠️ IMPORTANTE: Usa el MISMO email que configuraste en el servicio EmailJS
// Si tu servicio EmailJS usa Gmail (ejemplo: tuempresa@gmail.com), usa ese mismo aquí
// NO uses un dominio externo (como @asopromas.com) si no está verificado en el servicio SMTP
const COMPANY_NOTIFICATION_EMAIL = 'ventas@asopromas.com'; // ⚠️ CAMBIAR si aparece error 553

const EMAILJS_CONFIG = {
  SERVICE_ID,
  TEMPLATE_ID,
  PUBLIC_KEY,
  COMPANY_EMAIL: COMPANY_NOTIFICATION_EMAIL,
};

// Verificar si EmailJS está configurado (asegúrate de no usar los valores por defecto de ejemplo)
const isEmailConfigured = () => {
  return (
    !!EMAILJS_CONFIG.SERVICE_ID &&
    !!EMAILJS_CONFIG.TEMPLATE_ID &&
    !!EMAILJS_CONFIG.PUBLIC_KEY &&
    EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
    EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
    EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
  );
};

interface OrderEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerWhatsApp: string;
  items: CartItem[];
  subtotal: number;
  iva: number;
  total: number;
  orderDate: string;
}

export const sendOrderEmail = async (data: OrderEmailData): Promise<boolean> => {
  // Si EmailJS no está configurado, retornar true sin hacer nada
  if (!isEmailConfigured()) {
    console.warn('⚠️ EmailJS no está configurado. El email no será enviado.');
    return true;
  }

  try {
    // Formatear lista de productos
    const productsList = data.items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}${item.variant ? ` (${item.variant})` : ''}\n   Cantidad: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}`
      )
      .join('\n\n');

    // Parámetros para la plantilla de EmailJS
    const templateParams = {
      to_email: data.customerEmail,
      to_name: data.customerName,
      customer_whatsapp: data.customerWhatsApp,
      order_number: data.orderNumber,
      order_date: data.orderDate,
      products_list: productsList,
      subtotal: `$${data.subtotal.toFixed(2)}`,
      iva: `$${data.iva.toFixed(2)}`,
      total: `$${data.total.toFixed(2)}`,
      // Información de pago
      bank_name: SITE_CONFIG.PAYMENT_INFO.BANK_NAME,
      account_type: SITE_CONFIG.PAYMENT_INFO.ACCOUNT_TYPE,
      account_number: SITE_CONFIG.PAYMENT_INFO.ACCOUNT_NUMBER,
      account_holder: SITE_CONFIG.PAYMENT_INFO.ACCOUNT_HOLDER,
      id_number: SITE_CONFIG.PAYMENT_INFO.ID_NUMBER,
      // Información de contacto
      company_email: SITE_CONFIG.CONTACT_EMAIL,
      company_phone: SITE_CONFIG.CONTACT_PHONE,
      whatsapp_link: `https://wa.me/${SITE_CONFIG.CONTACT_PHONE.replace(/\D/g, '')}?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20pedido%20${data.orderNumber}`,
    };

    // Enviar email usando EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Email enviado exitosamente:', response);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
};

// Función para enviar copia a la empresa
export const sendOrderNotificationToCompany = async (
  data: OrderEmailData
): Promise<boolean> => {
  // Si EmailJS no está configurado, retornar true sin hacer nada
  if (!isEmailConfigured()) {
    console.warn('⚠️ EmailJS no está configurado. La notificación a la empresa no será enviada.');
    return true;
  }

  try {
    const productsList = data.items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} - Cantidad: ${item.quantity} - Subtotal: $${(item.price * item.quantity).toFixed(2)}`
      )
      .join('\n');

    const templateParams = {
      to_email: EMAILJS_CONFIG.COMPANY_EMAIL, // Email de la empresa (configurado arriba)
      to_name: 'Equipo ASOPROMAS',
      subject: `Nuevo Pedido - ${data.orderNumber}`,
      order_number: data.orderNumber,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_whatsapp: data.customerWhatsApp,
      order_date: data.orderDate,
      products_list: productsList,
      total: `$${data.total.toFixed(2)}`,
    };

    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      'template_spy9284', // Plantilla separada para notificaciones
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    return true;
  } catch (error) {
    console.error('Error al enviar notificación a la empresa:', error);
    return false;
  }
};

// Inicializar EmailJS (llamar al inicio de la app)
export const initEmailJS = () => {
  // Solo inicializar si está configurado
  if (!isEmailConfigured()) {
    console.warn('⚠️ EmailJS no está configurado. Por favor, actualiza las credenciales en emailService.ts');
    return;
  }

  try {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('✅ EmailJS inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar EmailJS:', error);
  }
};
