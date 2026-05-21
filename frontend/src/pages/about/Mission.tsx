import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';

import type { Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
};

const Mission: FC = () => {
  useSEO({
    title: 'Misión y Visión | ASOPROMAS',
    description: 'Conoce nuestro propósito y visión a largo plazo para el desarrollo sostenible del cacao ecuatoriano.',
    keywords: 'misión ASOPROMAS, visión, futuro sostenible, cacao Ecuador',
    url: '/about/mission',
  });

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <section className="relative pt-40 pb-20 px-6 bg-chocolate-950 overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('/assets/images/products/General.jpg')] opacity-10 mix-blend-overlay object-cover"></div>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl font-light text-white mb-6">Nuestro <span className="font-medium font-serif tracking-wide text-amber-200">Propósito</span></motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-stone-300 font-light leading-relaxed">El norte que guía nuestras acciones y el futuro que construimos cada día.</motion.p>
        </motion.div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="bg-white p-12 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-shadow duration-500">
              <div className="w-16 h-16 bg-cacao-green-50 text-cacao-green-700 rounded-2xl flex items-center justify-center mb-8"><Target className="w-8 h-8" /></div>
              <h2 className="text-3xl font-medium text-chocolate-900 mb-6">Misión</h2>
              <p className="text-lg text-stone-500 font-light leading-relaxed mb-8">Producir y comercializar cacao de fino aroma de la más alta calidad, promoviendo el desarrollo sostenible de nuestras comunidades rurales y preservando el medio ambiente.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cacao-green-500 shrink-0" /><span className="text-stone-600 font-light">Desarrollo comunitario integral</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cacao-green-500 shrink-0" /><span className="text-stone-600 font-light">Agricultura orgánica y regenerativa</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cacao-green-500 shrink-0" /><span className="text-stone-600 font-light">Comercio justo y equitativo</span></li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="bg-white p-12 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-shadow duration-500">
              <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mb-8"><Eye className="w-8 h-8" /></div>
              <h2 className="text-3xl font-medium text-chocolate-900 mb-6">Visión</h2>
              <p className="text-lg text-stone-500 font-light leading-relaxed mb-8">Ser el referente mundial en producción de cacao fino de aroma, destacando por nuestra calidad excepcional, sostenibilidad comprobada y la prosperidad de nuestras familias.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /><span className="text-stone-600 font-light">Liderazgo en mercados internacionales</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /><span className="text-stone-600 font-light">Innovación en derivados del cacao</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /><span className="text-stone-600 font-light">Desarrollo pleno de la región amazónica</span></li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-light text-chocolate-900 mb-8">Nuestros Pilares</h2>
          <Link to="/about/values" className="inline-flex items-center gap-3 px-8 py-4 bg-chocolate-900 text-white rounded-full hover:bg-chocolate-950 transition-colors">
            Explorar Valores <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Mission;