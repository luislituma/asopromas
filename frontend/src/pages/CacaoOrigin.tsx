import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Leaf, Globe, ArrowRight, Mountain, History } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

import type { Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const CacaoOrigin: FC = () => {
  useSEO({
    title: 'El Origen del Cacao Ancestral | ASOPROMAS',
    description: 'Descubre la historia del cacao más antiguo del mundo en Zamora Chinchipe, Ecuador. 5,500 años de legado vivo cultivado por nuestras familias.',
    keywords: 'origen del cacao, cacao ancestral, Palanda, Zamora Chinchipe, historia del cacao, Ecuador',
    url: '/cacao-origin',
  });

  return (
    <div className="min-h-screen bg-white text-stone-800 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cacao-green-950">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="/assets/images/products/santa-ana-vista-panoramica.jpg"
            alt="Centro Arqueológico Santa Ana - Palanda"
            className="w-full h-full object-cover mix-blend-overlay opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cacao-green-950/80 via-cacao-green-900/40 to-cacao-green-950/90"></div>
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-5 py-2 bg-cacao-green-800/30 backdrop-blur-md rounded-full border border-cacao-green-400/20 mb-8">
              <Mountain className="w-5 h-5 text-cacao-green-300" />
              <span className="text-cacao-yellow-800 font-medium tracking-wide uppercase text-sm">Cuna Mundial del Cacao</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight">
              El Legado de <br />
              <span className="font-medium font-serif tracking-wide text-cacao-green-200">5,500 Años</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl sm:text-2xl text-cacao-green-50 font-light max-w-3xl mx-auto leading-relaxed">
              En lo profundo de la Amazonía ecuatoriana, descansa el secreto mejor guardado de la historia del chocolate.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Herencia Ancestral */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-cacao-green-700 font-semibold uppercase tracking-widest text-sm">
                <History className="w-5 h-5" />
                <span>Herencia Ancestral</span>
              </motion.div>

              <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-light text-chocolate-900 leading-tight">
                El Descubrimiento que <br />
                <span className="font-medium font-serif tracking-wide text-cacao-green-800">cambió la historia</span>
              </motion.h2>

              <motion.div variants={fadeInUp} className="space-y-6 text-lg text-stone-500 font-light leading-relaxed">
                <p>
                  Durante mucho tiempo se creyó que el cacao se originó en Mesoamérica. Sin embargo, en el corazón de <strong className="text-chocolate-900 font-medium">Zamora Chinchipe</strong>, específicamente en el sitio arqueológico de Santa Ana de La Florida, en Palanda, se encontró la verdad.
                </p>
                <p>
                  Las vasijas de la cultura Mayo-Chinchipe revelaron trazas de cacao con más de <strong className="text-cacao-green-700 font-medium">5,500 años de antigüedad</strong>. Este hallazgo demostró que la Amazonía ecuatoriana es la verdadera cuna del cacao.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative">
                <img
                  src="/assets/images/products/Palanda.jpg"
                  alt="Sitio Arqueológico en Palanda"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-cacao-green-900/20 mix-blend-multiply"></div>
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4 text-chocolate-900">
                    <MapPin className="w-8 h-8 text-cacao-green-600" />
                    <div>
                      <p className="font-semibold text-lg">Santa Ana de La Florida</p>
                      <p className="text-sm text-stone-500">Palanda, Zamora Chinchipe</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Un Legado Vivo (Sostenibilidad y Plantaciones - Fuerte uso de Verde) */}
      <section className="py-32 bg-cacao-green-50 px-6 relative overflow-hidden">
        {/* Elemento decorativo */}
        <div className="absolute -left-40 -top-40 w-96 h-96 bg-cacao-green-200/50 rounded-full blur-3xl"></div>
        <div className="absolute -right-40 -bottom-40 w-96 h-96 bg-cacao-green-300/30 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <Leaf className="w-12 h-12 text-cacao-green-600 mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl font-light text-cacao-green-950 mb-6">
              Guardianes de la <span className="font-medium font-serif tracking-wide">Selva</span>
            </h2>
            <p className="text-xl text-cacao-green-800/70 font-light leading-relaxed">
              En ASOPROMAS no solo cultivamos cacao, cultivamos vida. Nuestras plantaciones en Zumbi y comunidades aledañas son verdaderos bosques comestibles que protegen la biodiversidad.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Cultivo Sostenible",
                desc: "Prácticas orgánicas que nutren la tierra y evitan la deforestación, conviviendo en armonía con la flora y fauna local.",
                stat: "100%",
                substat: "Orgánico"
              },
              {
                title: "Sombra Amazónica",
                desc: "Nuestro cacao crece bajo la sombra de árboles nativos, maderables y frutales, recreando su hábitat natural milenario.",
                stat: "Agroforestería",
                substat: "Sistema de cultivo"
              },
              {
                title: "Comercio Justo",
                desc: "El respeto por la tierra comienza con el respeto a quienes la trabajan. Garantizamos bienestar para más de 200 familias.",
                stat: "200+",
                substat: "Familias Productoras"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] p-10 shadow-sm hover:shadow-xl transition-shadow duration-500 border border-cacao-green-100"
              >
                <div className="mb-6">
                  <span className="block text-3xl font-semibold text-cacao-green-700 mb-1">{item.stat}</span>
                  <span className="block text-sm font-medium text-cacao-green-400 uppercase tracking-wider">{item.substat}</span>
                </div>
                <h3 className="text-xl font-medium text-chocolate-900 mb-4">{item.title}</h3>
                <p className="text-stone-500 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* De Zamora para el mundo */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Globe className="w-16 h-16 text-chocolate-300 mx-auto mb-8" />
            <h2 className="text-4xl sm:text-5xl font-light text-chocolate-900 mb-8 leading-tight">
              Llevando el origen al <span className="font-medium font-serif tracking-wide text-cacao-green-700">Mundo</span>
            </h2>
            <p className="text-xl text-stone-500 font-light leading-relaxed mb-12">
              Cada barra de chocolate, cada bombón y cada licor que sale de nuestras instalaciones lleva consigo el ADN del primer cacao del mundo. Es un privilegio y una responsabilidad que asumimos con total pasión.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/products"
                className="group flex items-center gap-4 bg-cacao-green-800 text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-cacao-green-950 transition-all duration-500 shadow-xl"
              >
                <span>Descubrir Nuestro Cacao</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/ruta-cacao-ancestral"
                className="group flex items-center gap-4 bg-white text-chocolate-900 border border-chocolate-200 px-10 py-4 rounded-full text-lg font-medium hover:bg-chocolate-50 transition-all duration-500"
              >
                <span>Vivir la Experiencia</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CacaoOrigin;
