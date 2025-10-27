import emailjs from '@emailjs/browser';
import type { CartItem } from '../context/CartContext';
import { SITE_CONFIG } from '../config/site';

// Configuración de EmailJS
// IMPORTANTE: Reemplazar con tus credenciales de EmailJS
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_rc3f9e7', // Tu Service ID
  TEMPLATE_ID: 'template_3vc5pdh', // Tu Template ID
  PUBLIC_KEY: 'dOXxZUCQTP-kLZr92', // Tu Public Key
};

// Verificar si EmailJS está configurado
const isEmailConfigured = () => {
  return (
    EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
    EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
    EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
  );
};

interface OrderEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
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
      to_email: 'luislituma22@gmail.com', // Email de la empresa
      to_name: 'Equipo ASOPROMAS',
      subject: `Nuevo Pedido - ${data.orderNumber}`,
      order_number: data.orderNumber,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      order_date: data.orderDate,
      products_list: productsList,
      total: `$${data.total.toFixed(2)}`,
    };

    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      'template_company_notification', // Plantilla separada para notificaciones
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
