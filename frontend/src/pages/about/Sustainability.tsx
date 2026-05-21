import { type FC } from 'react';
import { motion } from 'framer-motion';
import { TreePine, Recycle, Shield, Globe } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const Sustainability: FC = () => {
  useSEO({
    title: 'Sostenibilidad | ASOPROMAS',
    description: 'Descubre las prácticas sostenibles de ASOPROMAS: agroforestería, economía circular y conservación en la Amazonía.',
    keywords: 'sostenibilidad cacao, agroforestería, cacao orgánico, deforestación cero',
    url: '/about/sustainability',
  });

  const initiatives = [
    { icon: <TreePine/>, title: 'Agroforestería', desc: 'Cultivamos bajo la sombra de maderables y frutales nativos, creando bosques comestibles que protegen la fauna.' },
    { icon: <Recycle/>, title: 'Economía Circular', desc: 'Reutilizamos el 85% de los residuos, como la cascarilla, para compost y biomasa energética.' },
    { icon: <Shield/>, title: 'Deforestación Cero', desc: 'Estamos comprometidos a expandir nuestra producción únicamente en tierras ya intervenidas, protegiendo la selva virgen.' },
    { icon: <Globe/>, title: 'Carbono Neutro', desc: 'Nuestras prácticas de suelo aseguran que las fincas capturen grandes toneladas de CO2 de la atmósfera.' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      <section className="relative pt-40 pb-20 px-6 bg-cacao-green-900 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cacao-green-950 to-cacao-green-900"></div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-light text-white mb-6">Nuestro Compromiso <span className="font-medium font-serif tracking-wide text-cacao-green-300">Verde</span></h1>
          <p className="text-xl text-cacao-green-100/90 font-light leading-relaxed max-w-2xl mx-auto">Producimos el mejor cacao en armonía total con la Amazonía ecuatoriana, devolviendo a la tierra lo que ella nos da.</p>
        </motion.div>
      </section>

      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {initiatives.map((ini, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="p-12 bg-cacao-green-50 rounded-[2rem] hover:bg-cacao-green-100 transition-colors group border border-cacao-green-100"
            >
              <div className="w-16 h-16 bg-white text-cacao-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {ini.icon}
              </div>
              <h3 className="text-2xl font-medium text-cacao-green-950 mb-4">{ini.title}</h3>
              <p className="text-cacao-green-900/70 font-light leading-relaxed">{ini.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Sustainability;