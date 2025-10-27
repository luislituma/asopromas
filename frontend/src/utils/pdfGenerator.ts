import { jsPDF } from 'jspdf';
import type { CartItem } from '../context/CartContext';

interface OrderPDFData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  iva: number;
  total: number;
  orderDate: string;
}

/**
 * Genera un PDF del pedido y lo retorna como base64
 */
export const generateOrderPDF = (data: OrderPDFData): string => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Configuración de colores
  const primaryColor = [245, 158, 11]; // Amber
  const secondaryColor = [234, 88, 12]; // Orange
  const textColor = [31, 41, 55]; // Gray-800

  let y = 20;

  // Header con gradiente simulado
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, 0, 210, 40, 'F');

  // Logo/Título
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('🍫 ASOPROMAS', 105, 15, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Chocolate Artesanal KUJEÑITO', 105, 25, { align: 'center' });
  pdf.text('Zamora Chinchipe, Ecuador', 105, 32, { align: 'center' });

  y = 50;

  // Información del pedido
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Orden de Pedido', 20, y);

  y += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  // Box con info del pedido
  pdf.setFillColor(243, 244, 246); // Gray-100
  pdf.rect(20, y - 5, 170, 25, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.text('Número de Pedido:', 25, y);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.orderNumber, 70, y);

  y += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Fecha:', 25, y);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.orderDate, 70, y);

  y += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Cliente:', 25, y);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.customerName, 70, y);

  y += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Email:', 25, y);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.customerEmail, 70, y);

  y += 15;

  // Productos
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Detalle de Productos', 20, y);

  y += 10;

  // Encabezado de tabla
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(20, y - 5, 170, 8, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Producto', 25, y);
  pdf.text('Cant.', 130, y);
  pdf.text('Precio', 150, y);
  pdf.text('Subtotal', 175, y, { align: 'right' });

  y += 10;

  // Filas de productos
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFont('helvetica', 'normal');

  data.items.forEach((item, index) => {
    // Alternar color de fondo
    if (index % 2 === 0) {
      pdf.setFillColor(249, 250, 251); // Gray-50
      pdf.rect(20, y - 5, 170, 8, 'F');
    }

    const productName = item.name + (item.variant ? ` (${item.variant})` : '');
    
    // Truncar nombre si es muy largo
    const maxLength = 40;
    const displayName = productName.length > maxLength 
      ? productName.substring(0, maxLength) + '...' 
      : productName;

    pdf.text(displayName, 25, y);
    pdf.text(item.quantity.toString(), 135, y);
    pdf.text(`$${item.price.toFixed(2)}`, 155, y);
    pdf.text(`$${(item.price * item.quantity).toFixed(2)}`, 185, y, { align: 'right' });

    y += 8;

    // Nueva página si es necesario
    if (y > 260) {
      pdf.addPage();
      y = 20;
    }
  });

  y += 5;

  // Totales
  pdf.setDrawColor(229, 231, 235); // Gray-200
  pdf.line(20, y, 190, y);

  y += 10;

  // Box de totales
  pdf.setFillColor(254, 243, 199); // Amber-100
  pdf.rect(120, y - 5, 70, 25, 'F');

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Subtotal (sin IVA):', 125, y);
  pdf.text(`$${data.subtotal.toFixed(2)}`, 185, y, { align: 'right' });

  y += 7;
  pdf.text('IVA (15%):', 125, y);
  pdf.text(`$${data.iva.toFixed(2)}`, 185, y, { align: 'right' });

  y += 7;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  pdf.text('TOTAL:', 125, y);
  pdf.text(`$${data.total.toFixed(2)}`, 185, y, { align: 'right' });

  y += 15;

  // Información adicional
  pdf.setFontSize(10);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Próximos Pasos:', 20, y);

  y += 7;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('• Te contactaremos por WhatsApp para confirmar disponibilidad', 25, y);
  y += 5;
  pdf.text('• Coordinaremos el método de pago', 25, y);
  y += 5;
  pdf.text('• Acordaremos fecha y método de entrega', 25, y);

  y += 15;

  // Footer
  pdf.setDrawColor(229, 231, 235);
  pdf.line(20, y, 190, y);

  y += 7;
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128); // Gray-500
  pdf.text('ASOPROMAS - Asociación de Productores Orgánicos', 105, y, { align: 'center' });
  y += 4;
  pdf.text('Playas de Cuje, Zumbi, Zamora Chinchipe, Ecuador', 105, y, { align: 'center' });
  y += 4;
  pdf.text('Email: luislituma22@gmail.com', 105, y, { align: 'center' });

  // Retornar PDF como base64
  return pdf.output('dataurlstring');
};

/**
 * Genera el PDF y lo descarga directamente
 */
export const downloadOrderPDF = (data: OrderPDFData): void => {
  // Generar el PDF como base64
  const pdfBase64 = generateOrderPDF(data);
  
  // Crear link de descarga
  const link = document.createElement('a');
  link.href = pdfBase64;
  link.download = `Orden-${data.orderNumber}.pdf`;
  link.click();
};
