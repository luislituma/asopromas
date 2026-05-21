import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';

const History: FC = () => {
  useSEO({
    title: 'Nuestra Historia | ASOPROMAS',
    description: 'Descubre la historia de ASOPROMAS desde 2013: cultivando tradición, calidad y sostenibilidad en Zamora Chinchipe.',
    keywords: 'historia ASOPROMAS, cacao Ecuador historia, cooperativa cacao, tradición cacaotera',
    url: '/about/history',
  });

  const milestones = [
    { year: '2013', title: 'El Comienzo', desc: 'Fundada con 13 socios visionarios impulsados por ONGs. Producción inicial de apenas 18 quintales anuales.' },
    { year: '2015', title: 'Nuestras Raíces', desc: 'Adquisición de terreno propio en Playas de Cuje, Zumbi, consolidando nuestro hogar.' },
    { year: '2016', title: 'Infraestructura', desc: 'Construcción del centro de acopio y planta de procesamiento. Implementación de cajones de fermentación.' },
    { year: '2019', title: 'Sostenibilidad', desc: 'Alianza con PROAMAZONIA. Inicio formal de la certificación Libre de Deforestación.' },
    { year: '2020', title: 'Cacao Ancestral', desc: 'Identificamos 70 árboles de cacao milenario en Centinela del Cóndor, iniciando su rescate.' },
    { year: '2023', title: 'Nuestra Marca', desc: 'Nacimiento de "Kujeñito". Instalación de maquinaria avanzada y acopio récord.' },
    { year: '2025', title: 'Al Mundo', desc: 'Certificaciones internacionales y primera exportación de nibs a Estados Unidos. Crecimiento a 188 socios.' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-stone-800">
      <section className="relative pt-40 pb-20 px-6 bg-chocolate-950 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-light text-white mb-6">Nuestra <span className="font-medium font-serif tracking-wide text-cacao-green-200">Historia</span></h1>
          <p className="text-xl text-stone-300 font-light leading-relaxed">Más de una década cultivando esperanza, comunidad y el mejor cacao del mundo.</p>
        </motion.div>
      </section>

      <section className="py-32 px-6 bg-stone-50">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-stone-200 -translate-x-1/2"></div>
          
          <div className="space-y-24">
            {milestones.map((m, idx) => (
              <motion.div 
                key={m.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-chocolate-600 rounded-full border-4 border-stone-50 -translate-x-1/2 shadow-sm z-10"></div>
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12 text-left">
                  <span className="text-chocolate-400 font-bold tracking-widest text-lg block mb-2">{m.year}</span>
                  <h3 className="text-2xl font-medium text-chocolate-900 mb-3">{m.title}</h3>
                  <p className="text-stone-500 font-light leading-relaxed">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 text-center">
        <Link to="/about/mission" className="inline-flex items-center gap-2 text-chocolate-700 hover:text-chocolate-900 font-medium">Hacia dónde vamos <ArrowRight className="w-4 h-4"/></Link>
      </section>
    </div>
  );
};

export default History;