import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactFormProps {
  productName?: string;
  isReservation?: boolean;
}

const ContactForm: FC<ContactFormProps> = ({ productName, isReservation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: productName 
      ? `Me interesa recibir más información sobre: ${productName}`
      : isReservation 
        ? 'Deseo consultar disponibilidad para la Ruta del Cacao Ancestral.'
        : ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // EmailJS integration
      await emailjs.send(
        'service_u1xx4q9',     // Service ID
        'template_kiuz9i8',    // Template ID
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
        'dOXxZUCQTP-kLZr92'    // Public Key
      );
      
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error enviando el correo:', error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-chocolate-100 max-w-lg w-full mx-auto">
      <h3 className="text-2xl font-bold text-chocolate-900 mb-6 text-center">
        {isReservation ? 'Reserva tu Experiencia' : 'Contáctanos'}
      </h3>
      
      {status === 'success' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-8 text-green-600"
        >
          <CheckCircle className="w-16 h-16 mb-4" />
          <p className="text-lg font-medium text-center">¡Mensaje enviado con éxito!</p>
          <p className="text-stone-500 text-center mt-2">Nos pondremos en contacto contigo muy pronto.</p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-6 px-6 py-2 bg-chocolate-100 text-chocolate-800 rounded-full font-medium hover:bg-chocolate-200 transition-colors"
          >
            Enviar otro mensaje
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-chocolate-800 mb-1">Nombre Completo</label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white/50 focus:ring-2 focus:ring-chocolate-400 focus:border-transparent outline-none transition-all duration-200 text-stone-700"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ej. María Pérez"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-chocolate-800 mb-1">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white/50 focus:ring-2 focus:ring-chocolate-400 focus:border-transparent outline-none transition-all duration-200 text-stone-700"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-chocolate-800 mb-1">Teléfono</label>
              <input
                type="tel"
                id="phone"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white/50 focus:ring-2 focus:ring-chocolate-400 focus:border-transparent outline-none transition-all duration-200 text-stone-700"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+593 999 999 999"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-chocolate-800 mb-1">Mensaje</label>
            <textarea
              id="message"
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white/50 focus:ring-2 focus:ring-chocolate-400 focus:border-transparent outline-none transition-all duration-200 text-stone-700 resize-none"
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              placeholder="¿Cómo podemos ayudarte?"
            />
          </div>
          
          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.</span>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 bg-chocolate-700 hover:bg-chocolate-800 text-white font-medium py-4 px-6 rounded-xl transition-colors disabled:opacity-70"
          >
            {status === 'loading' ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Enviar Mensaje</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
