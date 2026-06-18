import { X, Download, Mail, Printer } from 'lucide-react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  fileName: string;
  onSendEmail?: () => void;
}

export default function PDFPreviewModal({ isOpen, onClose, pdfUrl, fileName, onSendEmail }: PDFPreviewModalProps) {
  if (!isOpen || !pdfUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Vista Previa de Documento</h3>
            <p className="text-sm text-slate-500">{fileName}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors tooltip-trigger"
              title="Imprimir"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
            {onSendEmail && (
              <button
                onClick={onSendEmail}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold text-sm transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" />
                Enviar por Correo
              </button>
            )}
            <div className="w-px h-8 bg-slate-300 mx-2"></div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-slate-200 w-full p-4 overflow-hidden">
          <iframe 
            src={pdfUrl + "#toolbar=0"} 
            className="w-full h-full rounded-xl shadow-sm border border-slate-300"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}
