import emailjs from '@emailjs/browser';

// ==========================================
// CONFIGURACIÓN DE EMAILJS
// ==========================================
// Para que esto funcione en producción, debes registrarte en EmailJS
// y reemplazar estos valores con los de tu cuenta.
// 1. SERVICE_ID: ID de tu servicio de correo (ej. Gmail)
// 2. TEMPLATE_ID: ID de la plantilla que crearás en EmailJS
// 3. PUBLIC_KEY: Tu clave pública de EmailJS

const EMAILJS_SERVICE_ID: string = 'sservice_hzj6v8b'; // REEMPLAZAR
const EMAILJS_TEMPLATE_ID: string = 'template_382mwoe'; // REEMPLAZAR
const EMAILJS_PUBLIC_KEY: string = 'dOXxZUCQTP-kLZr92'; // REEMPLAZAR

export interface EmailNotificationParams {
  tipo_operacion: string; // Ej: 'Acopio de Cacao', 'Orden de Producción'
  codigo: string;         // Ej: 'LOTE-123', 'ORD-001'
  detalles: string;       // Ej: '100 qq de Cacao Baba recibidos'
  responsable: string;    // Ej: 'Luis Lituma'
  fecha: string;
  destinatarios_extra?: string; // Correos separados por coma (ej. a Procesamiento)
}

/**
 * Envia una notificación por correo a Administradora, Contadora y encargados.
 */
export const sendOperationNotification = async (params: EmailNotificationParams) => {
  try {
    // Por defecto enviamos a Admin y Contabilidad. 
    // Si hay destinatarios extra, los agregamos.
    const defaultEmails = 'admin@asopromas.com, contabilidad@asopromas.com';
    const to_email = params.destinatarios_extra
      ? `${defaultEmails}, ${params.destinatarios_extra}`
      : defaultEmails;

    const templateParams = {
      to_email,
      tipo_operacion: params.tipo_operacion,
      codigo: params.codigo,
      detalles: params.detalles,
      responsable: params.responsable,
      fecha: params.fecha,
    };

    // Para evitar errores en desarrollo si no está configurado aún:
    if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY.includes('tu_public_key_aqui')) {
      console.warn('EmailJS no está configurado. Simulación de envío: ', templateParams);
      return { success: true, simulated: true };
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
      }
    );

    console.log('✅ Correo enviado exitosamente:', response);
    return { success: true, response };
  } catch (error: any) {
    console.error('❌ Error enviando notificación por correo:', error);
    // EmailJS suele enviar el motivo exacto del rechazo en error.text
    if (error?.text) {
      console.error('Detalle del error de EmailJS:', error.text);
      alert(`Error de EmailJS: ${error.text}`);
    }
    return { success: false, error };
  }
};
