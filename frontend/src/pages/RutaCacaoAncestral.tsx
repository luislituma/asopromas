import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Map, Leaf, Coffee, Sun, Compass, Camera, CalendarHeart, Bird, Wind } from 'lucide-react';
import ContactForm from '../components/ContactForm';
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

const RutaCacaoAncestral: FC = () => {
  useSEO({
    title: 'La Ruta del Cacao Ancestral | Experiencia ASOPROMAS',
    description: 'Reserva tu lugar en la Ruta del Cacao Ancestral. Camina entre árboles centenarios, aprende el proceso de cosecha y cata el mejor chocolate de la Amazonía.',
    keywords: 'ruta del cacao, turismo Zamora Chinchipe, tour chocolate Ecuador, cata de cacao, ecoturismo Amazonía',
    url: '/ruta-cacao-ancestral',
  });

  return (
    <div className="min-h-screen bg-white text-stone-800 font-sans">

      {/* Hero Inmersivo */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-cacao-green-950">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="/assets/images/products/zamora.png"
            alt="Paisaje de las fincas de cacao"
            className="w-full h-full object-cover mix-blend-overlay opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cacao-green-950/60 via-cacao-green-900/30 to-cacao-green-950"></div>
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <Compass className="w-5 h-5 text-cacao-green-200" />
              <span className="text-cacao-green-50 font-medium tracking-[0.2em] uppercase text-sm">Turismo Comunitario</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight">
              Ruta del <br />
              <span className="font-medium font-serif tracking-wide text-cacao-green-200">Cacao Ancestral</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl sm:text-2xl text-cacao-green-100/90 font-light max-w-3xl mx-auto leading-relaxed">
              Sumérgete en una experiencia donde el aroma a tierra, la historia milenaria y la naturaleza convergen en un solo viaje.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* La Experiencia */}
      <section className="py-32 px-6 bg-cacao-green-50 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-light text-cacao-green-950 leading-tight">
                Despierta tus <span className="font-medium font-serif tracking-wide text-cacao-green-700">Sentidos</span>
              </motion.h2>

              <motion.div variants={fadeInUp} className="space-y-6 text-lg text-stone-600 font-light leading-relaxed">
                <p>
                  Nuestra ruta no es solo un paseo, es un retorno a las raíces. Te llevaremos al corazón mismo de arboles ancestrales en las fincas de <strong className="text-cacao-green-900 font-medium">ASOPROMAS</strong> en la Amazonía ecuatoriana.
                </p>
                <p>
                  Caminarás bajo la sombra de árboles centenarios, observando la tierra que da vida al cacao ancestral. Aprenderás de las manos de nuestros productores mas experimentados, el secreto de estos gigantescos y antiguos árboles.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="space-y-6 mt-12">
                <img src="/assets/images/products/Cafe-1.jpg" alt="Detalle del proceso" className="w-full h-64 object-cover rounded-[2rem] shadow-lg" />
                <img src="/assets/images/products/Barra-Pura-1.jpg" alt="Chocolate puro" className="w-full h-48 object-cover rounded-[2rem] shadow-lg" />
              </div>
              <div className="space-y-6">
                <img src="/assets/images/products/Asopromas-socios.jpg" alt="Productores trabajando" className="w-full h-48 object-cover rounded-[2rem] shadow-lg" />
                <img src="/assets/images/products/Palanda.jpg" alt="Fincas amazónicas" className="w-full h-64 object-cover rounded-[2rem] shadow-lg" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Qué Incluye la Ruta */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-light text-chocolate-900 mb-6">El Recorrido</h2>
            <p className="text-xl text-stone-500 font-light max-w-2xl mx-auto">
              Diseñamos cada etapa de este viaje para que te conectes profundamente con la cultura del cacao y sus origenes en esta zona Amazónica.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Bird, title: "Fauna Amazónica", desc: "Avistamiento de aves endémicas, anfibios y especies únicas en el bosque natural." },
              { icon: Wind, title: "Atractivos Naturales", desc: "Experimenta atractivos naturales en la ruta." },
              { icon: Map, title: "Paseo por las Fincas", desc: "Caminata guiada por los senderos de los bosques." },
              { icon: Leaf, title: "Cosecha Participativa", desc: "Aprende a identificar y recolectar las mazorcas en su punto ideal." },
              { icon: Sun, title: "Magia Post-cosecha", desc: "Observa los procesos de fermentación y secado." },
              { icon: Coffee, title: "Cata Profesional", desc: "Degustación guiada de chocolates puros y procesados." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="bg-stone-50 rounded-[2rem] p-10 hover:bg-cacao-green-50 transition-colors duration-500 group border border-stone-100 hover:border-cacao-green-200"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-8 h-8 text-cacao-green-600" />
                </div>
                <h3 className="text-xl font-medium text-chocolate-900 mb-4">{item.title}</h3>
                <p className="text-stone-500 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reserva / ContactForm */}
      <section className="py-32 px-6 bg-stone-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/assets/images/products/Chocolates.jpg')] opacity-5 mix-blend-overlay object-cover pointer-events-none"></div>
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] bg-cacao-green-900/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-cacao-green-900/50 rounded-full border border-cacao-green-700/50">
                <CalendarHeart className="w-5 h-5 text-cacao-green-400" />
                <span className="text-cacao-green-200 font-medium tracking-wide text-sm uppercase">Planifica tu visita</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-light text-white leading-tight">
                Reserva tu <br />
                <span className="font-medium font-serif tracking-wide text-cacao-green-400">Aventura</span>
              </h2>

              <p className="text-lg text-stone-400 font-light leading-relaxed">
                Nuestros grupos son reducidos para garantizar una mejor experiencia, personalizada y respetuosa con el entorno. Completa el formulario para coordinar las fechas disponibles y los detalles de tu expedición.
              </p>

              <div className="flex items-center gap-4 pt-6 text-cacao-green-200">
                <Camera className="w-6 h-6" />
                <span className="font-light">No olvides traer cámara, ropa cómoda y espíritu explorador.</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-white rounded-[2rem] p-8 sm:p-12 shadow-2xl"
            >
              <h3 className="text-2xl font-medium text-chocolate-900 mb-8 border-b border-stone-100 pb-6">
                Formulario de Reserva
              </h3>
              {/* Formulario que ya existe y funciona con EmailJS */}
              <ContactForm isReservation={true} />
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default RutaCacaoAncestral;
