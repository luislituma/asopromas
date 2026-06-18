import { CheckCircle2, FileText, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import EmailSenderModal from './EmailSenderModal';

interface ReceiptSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  onNavigateNext: () => void;
  title: string;
  subtitle: string;
  emailData?: {
    recipientRole: string; // e.g. "Socio"
    defaultEmail: string;
    documentName: string;
  };
}

export default function ReceiptSuccessModal({
  isOpen,
  onClose,
  onDownload,
  onNavigateNext,
  title,
  subtitle,
  emailData
}: ReceiptSuccessModalProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
            <p className="text-slate-600 mb-8">{subtitle}</p>

            <div className="space-y-3">
              <button
                onClick={onDownload}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Ver Comprobante PDF
              </button>

              {emailData && (
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="w-full py-3 px-4 bg-white border-2 border-slate-200 hover:border-emerald-600 hover:text-emerald-700 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Enviar por Correo
                </button>
              )}

              <button
                onClick={onNavigateNext}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {emailData && (
        <EmailSenderModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          defaultEmail={emailData.defaultEmail}
          recipientRole={emailData.recipientRole}
          documentName={emailData.documentName}
        />
      )}
    </>
  );
}
