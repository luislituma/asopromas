import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, TrendingUp, Home } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const Producers: FC = () => {
  useSEO({
    title: 'Nuestros Productores | ASOPROMAS',
    description: 'Conoce a las más de 100 familias cacaoteras de Zamora Chinchipe responsables de nuestro cacao fino de aroma.',
    keywords: 'productores cacao Ecuador, familias cacaoteras, Zamora Chinchipe agricultores, ASOPROMAS',
    url: '/about/producers',
  });

  const stats = [
    { icon: <Users/>, num: '188', label: 'Familias Productoras' },
    { icon: <MapPin/>, num: '13', label: 'Comunidades' },
    { icon: <TrendingUp/>, num: '51%', label: 'Liderazgo Femenino' },
    { icon: <Home/>, num: '84+', label: 'Hectáreas de Agroforestería' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <section className="relative pt-40 pb-20 px-6 bg-cacao-green-950 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/products/Asopromas-socios.jpg')] opacity-20 mix-blend-overlay object-cover"></div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-4xl mx-auto">
          <span className="text-cacao-green-300 font-medium tracking-widest uppercase text-sm mb-4 block">El Corazón de ASOPROMAS</span>
          <h1 className="text-5xl sm:text-7xl font-light text-white mb-6">Nuestra <span className="font-medium font-serif tracking-wide text-cacao-green-400">Comunidad</span></h1>
          <p className="text-xl text-cacao-green-100/90 font-light leading-relaxed max-w-2xl mx-auto">188 familias ecuatorianas unidas por la pasión, la tierra y el legado del mejor cacao del mundo.</p>
        </motion.div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 border border-cacao-green-100 rounded-[2rem] text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-cacao-green-50 text-cacao-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                {s.icon}
              </div>
              <div className="text-4xl font-semibold text-chocolate-900 mb-2">{s.num}</div>
              <div className="text-stone-500 font-light">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 px-6 bg-cacao-green-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-light text-cacao-green-950 mb-6">Equidad y Desarrollo</h2>
            <p className="text-lg text-cacao-green-800/80 font-light leading-relaxed mb-6">
              Nuestra asociación empodera directamente a sus socios mediante precios justos y capacitación constante. Estamos orgullosos de que el 51% de nuestra directiva y bases esté conformado por mujeres rurales, jefas de familia y guardianas de la sabiduria ancestral.
            </p>
            <p className="text-lg text-cacao-green-800/80 font-light leading-relaxed">
              Mediante escuelas de campo y certificaciones internacionales, logramos un incremento promedio del 15% en los ingresos familiares, mejorando la calidad de vida de toda la comunidad en Zamora Chinchipe.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
            <img src="/assets/images/products/Cafe-1.jpg" alt="Productoras de ASOPROMAS" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-cacao-green-900/10 mix-blend-multiply"></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Producers;