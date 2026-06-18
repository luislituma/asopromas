import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Configuración base
const ASOPROMAS_NAME = 'ASOPROMAS';
const ASOPROMAS_SUBTITLE = 'Asociación de Productores de Cacao';
const FOOTER_TEXT = 'Este documento es válido como recibo oficial de recepción de materia prima.';

export const generateEntregaReceiptPDF = (entregaData: any, returnBlob: boolean = false) => {
  const doc = new jsPDF();

  // Membrete
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129); // Emerald 500
  doc.text(ASOPROMAS_NAME, 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(ASOPROMAS_SUBTITLE, 14, 28);
  doc.text(`Fecha de emisión: ${new Date().toLocaleString()}`, 14, 34);

  // Título del documento
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text('COMPROBANTE DE RECEPCIÓN DE CACAO', 105, 50, { align: 'center' });

  // Tabla de datos del Productor
  autoTable(doc, {
    startY: 60,
    head: [['Datos del Productor', 'Detalles']],
    body: [
      ['Socio', entregaData.socioNombre || 'No registrado'],
      ['Código/Cédula', entregaData.socioIdentificacion || 'N/A'],
      ['Finca de Origen', entregaData.fincaNombre || 'N/A'],
      ['Fecha de Entrega', new Date(entregaData.fecha_entrega).toLocaleDateString()]
    ],
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] },
    margin: { left: 14 }
  });

  // Tabla de detalles del cacao
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Detalles del Cacao', 'Valores']],
    body: [
      ['Variedad de Cacao', entregaData.variedad || 'N/A'],
      ['Estado', entregaData.estado_cacao || 'N/A'],
      ['Peso Bruto Recibido (kg)', (entregaData.peso_bruto_kg || 0).toFixed(2)],
      ['Merma / Deducciones (kg)', (entregaData.merma_kg || 0).toFixed(2)],
      ['Peso Neto Resultante (kg)', ((entregaData.peso_bruto_kg || 0) - (entregaData.merma_kg || 0)).toFixed(2)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }, // Blue 500
    margin: { left: 14 }
  });

  // Tabla financiera (Si aplica)
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Liquidación', 'Monto']],
    body: [
      ['Precio Base (por kg)', `$ ${(entregaData.precio_base || 0).toFixed(2)}`],
      ['Total a Pagar', `$ ${(entregaData.valor_total || 0).toFixed(2)}`],
    ],
    theme: 'plain',
    styles: { fontStyle: 'bold' },
    margin: { left: 14 }
  });

  // Espacios para firmas
  const signatureY = (doc as any).lastAutoTable.finalY + 50;
  
  doc.line(30, signatureY, 90, signatureY);
  doc.setFontSize(10);
  doc.text('Firma Responsable Acopio', 60, signatureY + 5, { align: 'center' });
  
  doc.line(120, signatureY, 180, signatureY);
  doc.text('Firma Productor (Entregué conforme)', 150, signatureY + 5, { align: 'center' });

  // Footer legal
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(FOOTER_TEXT, 105, 280, { align: 'center' });

  // Guardar PDF o retornar Blob
  const filename = `Recibo_Entrega_${entregaData.socioNombre?.replace(/\s+/g, '_') || 'Socio'}_${new Date().getTime()}.pdf`;
  if (returnBlob) {
    return { url: URL.createObjectURL(doc.output('blob')), filename };
  }
  doc.save(filename);
  return { url: '', filename };
};

export const generateAcopioReportPDF = (loteData: any, entregas: any[], returnBlob: boolean = false) => {
  const doc = new jsPDF();

  // Membrete
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129);
  doc.text(ASOPROMAS_NAME, 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(ASOPROMAS_SUBTITLE, 14, 28);
  doc.text(`Fecha de reporte: ${new Date().toLocaleString()}`, 14, 34);

  // Título
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(`REPORTE DE LOTE DE ACOPIO: ${loteData.codigo}`, 105, 50, { align: 'center' });

  // Resumen del Lote
  autoTable(doc, {
    startY: 60,
    head: [['Resumen del Lote', 'Datos']],
    body: [
      ['Estado', loteData.estado || 'N/A'],
      ['Fecha de Inicio', new Date(loteData.fecha_inicio).toLocaleDateString()],
      ['Peso Total Recibido (kg)', (Number(loteData.peso_total_kg) || 0).toFixed(2)],
      ['Total Entregas', entregas.length.toString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] },
  });

  // Lista de entregas
  const entregasBody = entregas.map((e: any) => [
    new Date(e.fecha_entrega).toLocaleDateString(),
    e.socio?.nombres ? `${e.socio.nombres} ${e.socio.apellidos || ''}` : 'Desconocido',
    (Number(e.peso_bruto) || 0).toFixed(2),
    (Number(e.merma) || 0).toFixed(2),
    (Number(e.peso_neto) || 0).toFixed(2)
  ]);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Fecha', 'Socio', 'Peso Bruto', 'Merma', 'Peso Neto']],
    body: entregasBody,
    theme: 'striped',
    headStyles: { fillColor: [51, 65, 85] }, // Slate 700
  });

  const filename = `Reporte_Acopio_${loteData.codigo}.pdf`;
  if (returnBlob) {
    return { url: URL.createObjectURL(doc.output('blob')), filename };
  }
  doc.save(filename);
  return { url: '', filename };
};
