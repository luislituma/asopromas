import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, Leaf, Handshake, Star } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const Values: FC = () => {
  useSEO({
    title: 'Nuestros Valores | ASOPROMAS',
    description: 'Conoce los valores que guían a ASOPROMAS: compromiso, integridad, solidaridad, sostenibilidad, respeto y excelencia.',
    keywords: 'valores ASOPROMAS, sostenibilidad, compromiso, integridad cooperativa',
    url: '/about/values',
  });

  const values = [
    { icon: <Heart />, title: 'Compromiso', desc: 'Dedicación absoluta hacia la calidad, nuestros productores y el medio ambiente.' },
    { icon: <Shield />, title: 'Integridad', desc: 'Actuamos con honestidad y transparencia en todas nuestras relaciones.' },
    { icon: <Users />, title: 'Solidaridad', desc: 'Fortalecemos la unión entre productores para el beneficio de toda la comunidad.' },
    { icon: <Leaf />, title: 'Sostenibilidad', desc: 'Preservamos el medio ambiente para las futuras generaciones mediante agricultura limpia.' },
    { icon: <Handshake />, title: 'Respeto', desc: 'Valoramos la diversidad, los saberes ancestrales y las ideas de cada miembro.' },
    { icon: <Star />, title: 'Excelencia', desc: 'Buscamos la mejora continua en cada paso, desde la siembra hasta la barra.' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-stone-800">
      <section className="pt-40 pb-20 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto">
          <span className="text-chocolate-400 uppercase tracking-[0.2em] text-sm font-medium mb-4 block">Nuestros Principios</span>
          <h1 className="text-5xl md:text-7xl font-light text-chocolate-950 mb-6">Valores que <span className="font-medium font-serif tracking-wide text-cacao-green-700">Inspiran</span></h1>
          <p className="text-xl text-stone-500 font-light">La brújula moral que sostiene nuestra asociacion y da forma a todo lo que hacemos.</p>
        </motion.div>
      </section>

      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2rem] border border-stone-100 hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-stone-50 text-chocolate-600 rounded-xl flex items-center justify-center mb-6">
                {v.icon}
              </div>
              <h3 className="text-2xl font-medium text-chocolate-900 mb-3">{v.title}</h3>
              <p className="text-stone-500 font-light leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Values;