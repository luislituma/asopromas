import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, CheckCircle2 } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const Certifications: FC = () => {
  useSEO({
    title: 'Certificaciones | ASOPROMAS',
    description: 'Conoce nuestros avales internacionales: USDA Organic y BPA, que garantizan la inocuidad y calidad orgánica.',
    keywords: 'certificaciones cacao, cacao orgánico, USDA Organic, BPA Ecuador',
    url: '/about/certifications',
  });

  return (
    <div className="min-h-screen bg-white font-sans text-stone-800">
      <section className="relative pt-40 pb-20 px-6 bg-chocolate-950 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-light text-white mb-6">Nuestros <span className="font-medium font-serif tracking-wide text-amber-200">Avales</span></h1>
          <p className="text-xl text-stone-300 font-light max-w-2xl mx-auto">La excelencia y pureza de nuestro cacao respaldada por rigurosos estándares internacionales.</p>
        </motion.div>
      </section>

      <section className="py-32 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="bg-white p-12 rounded-[2rem] border border-stone-200 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-cacao-green-50 rounded-full blur-3xl group-hover:bg-cacao-green-100 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-cacao-green-50 text-cacao-green-700 rounded-2xl flex items-center justify-center mb-8"><Award className="w-8 h-8"/></div>
              <h2 className="text-3xl font-medium text-chocolate-900 mb-2">USDA Organic</h2>
              <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">Válido hasta 2025</span>
              <p className="text-stone-500 font-light leading-relaxed mb-8">Garantiza que nuestros productos están libres de pesticidas, herbicidas y fertilizantes sintéticos. Un sello de pureza para el mercado norteamericano y mundial.</p>
              <ul className="space-y-3">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-cacao-green-500 shrink-0"/><span className="text-stone-600 font-light">100% natural</span></li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-cacao-green-500 shrink-0"/><span className="text-stone-600 font-light">Acceso a mercados premium</span></li>
              </ul>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="bg-white p-12 rounded-[2rem] border border-stone-200 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl group-hover:bg-amber-100 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mb-8"><Shield className="w-8 h-8"/></div>
              <h2 className="text-3xl font-medium text-chocolate-900 mb-2">Buenas Prácticas (BPA)</h2>
              <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">Agrocalidad 2026</span>
              <p className="text-stone-500 font-light leading-relaxed mb-8">Certificación nacional que asegura la inocuidad, higiene y sostenibilidad de toda nuestra cadena de producción de cacao y chocolate.</p>
              <ul className="space-y-3">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0"/><span className="text-stone-600 font-light">Seguridad alimentaria</span></li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0"/><span className="text-stone-600 font-light">Trazabilidad completa</span></li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Certifications;