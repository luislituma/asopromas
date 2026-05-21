import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, Handshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

import type { Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const About: FC = () => {
  useSEO({
    title: 'Nuestra Esencia | ASOPROMAS',
    description: 'Conoce ASOPROMAS, la cooperativa agrícola que transforma la Amazonía ecuatoriana mediante cacao fino de aroma, comercio justo y equidad.',
    keywords: 'ASOPROMAS, cooperativa agrícola, cacao fino aroma, comercio justo, mujeres rurales, Zamora Chinchipe',
    url: '/about',
  });

  const cards = [
    {
      icon: <Handshake className="w-8 h-8 text-chocolate-600" />,
      title: "Nuestra Historia",
      desc: "El camino que hemos recorrido desde el 2000 hasta convertirnos en referentes.",
      img: "/assets/images/products/Palanda.jpg",
      link: "/about/history"
    },
    {
      icon: <Users className="w-8 h-8 text-chocolate-600" />,
      title: "Nuestros Productores",
      desc: "188 socios, 51% mujeres rurales liderando el cambio en Zamora Chinchipe.",
      img: "/assets/images/products/Asopromas-socios.jpg",
      link: "/about/producers"
    },
    {
      icon: <Leaf className="w-8 h-8 text-cacao-green-600" />,
      title: "Sostenibilidad",
      desc: "Protegemos la selva mediante agroforestería y prácticas de deforestación cero.",
      img: "/assets/images/products/zamora.png",
      link: "/about/sustainability"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-stone-800">
      
      {/* Hero Inmersivo */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-chocolate-950">
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="/assets/images/products/General.jpg" 
            alt="Productores de cacao" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-chocolate-950/60 via-chocolate-900/40 to-chocolate-950"></div>
        </motion.div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.p variants={fadeInUp} className="text-chocolate-300 font-medium tracking-[0.2em] uppercase text-sm mb-6">
              Nuestra Identidad
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl font-light text-white mb-6 leading-tight">
              Transformando la <br/>
              <span className="font-medium font-serif tracking-wide text-amber-200">Amazonía Ecuatoriana</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl sm:text-2xl text-stone-300 font-light max-w-3xl mx-auto leading-relaxed">
              Más que una asociación, somos el reflejo del esfuerzo de comunidades rurales unidas por el amor al cacao fino de aroma.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Hub de Navegación / Tarjetas */}
      <section className="py-32 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-light text-chocolate-900 mb-6">Conoce nuestra esencia</h2>
            <p className="text-xl text-stone-500 font-light max-w-2xl mx-auto">
              Explora los pilares que hacen de ASOPROMAS un proyecto único de desarrollo sostenible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <Link to={card.link} className="group block relative rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={card.img} 
                      alt={card.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col relative bg-white">
                    <div className="absolute -top-8 right-8 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500">
                      {card.icon}
                    </div>
                    <h3 className="text-2xl font-medium text-chocolate-900 mb-4 pr-16">{card.title}</h3>
                    <p className="text-stone-500 font-light leading-relaxed mb-8 flex-1">{card.desc}</p>
                    <div className="flex items-center text-chocolate-700 font-medium group-hover:text-amber-600 transition-colors">
                      <span>Descubrir más</span>
                      <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Navegación Secundaria (Misión, Valores, Certificaciones) */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <Link to="/about/mission" className="group p-8 rounded-3xl hover:bg-stone-50 transition-colors">
              <h3 className="text-xl font-medium text-chocolate-900 mb-3 border-b border-stone-200 pb-3 group-hover:border-chocolate-400 transition-colors">Misión y Visión</h3>
              <p className="text-stone-500 font-light">Nuestro propósito a largo plazo.</p>
            </Link>
            <Link to="/about/values" className="group p-8 rounded-3xl hover:bg-stone-50 transition-colors">
              <h3 className="text-xl font-medium text-chocolate-900 mb-3 border-b border-stone-200 pb-3 group-hover:border-chocolate-400 transition-colors">Valores</h3>
              <p className="text-stone-500 font-light">Lo que rige nuestras acciones.</p>
            </Link>
            <Link to="/about/certifications" className="group p-8 rounded-3xl hover:bg-cacao-green-50 transition-colors">
              <h3 className="text-xl font-medium text-cacao-green-900 mb-3 border-b border-cacao-green-200 pb-3 group-hover:border-cacao-green-600 transition-colors">Certificaciones</h3>
              <p className="text-stone-500 font-light">Avales de nuestra calidad orgánica.</p>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
