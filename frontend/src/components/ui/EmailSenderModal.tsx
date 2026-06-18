import { useState } from 'react';
import { X, Send, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { sendEmailMock } from '../../lib/emailService';

interface EmailSenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  recipientRole: string; // e.g. "Socio", "Administrador de Procesamiento"
  documentName: string; // e.g. "Recibo_Entrega_Juan.pdf"
}

export default function EmailSenderModal({
  isOpen,
  onClose,
  defaultEmail = '',
  recipientRole,
  documentName
}: EmailSenderModalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState(`Documento Adjunto: ${documentName}`);
  const [message, setMessage] = useState(`Estimado/a ${recipientRole},\n\nAdjunto a este correo encontrará el documento correspondiente a la reciente transacción en el sistema Asopromas.\n\nSaludos cordiales.`);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await sendEmailMock(email, subject, message, documentName);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Error enviando el correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Enviar Documento por Correo</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">¡Correo Enviado!</h3>
            <p className="text-slate-600">El comprobante ha sido enviado exitosamente a {email}.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destinatario ({recipientRole})</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Asunto</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-slate-200">
              <FileText className="w-8 h-8 text-rose-500" />
              <div>
                <p className="text-sm font-medium text-slate-700">Documento Adjunto (PDF)</p>
                <p className="text-xs text-slate-500">{documentName}</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? 'Enviando...' : 'Enviar Correo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
