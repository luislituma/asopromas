import { type FC, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import usdaLogo from '../assets/images/certifications/certificacion-usda.jpg';
import orgEcuadorLogo from '../assets/images/certifications/certificacion-organica-ecuador.png';
import bpaLogo from '../assets/images/certifications/bpa.jpg';
import euLogo from '../assets/images/certifications/certificacion-uue.png';

const CERTS = [
  { src: usdaLogo,       alt: 'USDA Organic',                   label: 'USDA Organic',               codes: []                                    },
  { src: orgEcuadorLogo, alt: 'Certificación Orgánica Ecuador',  label: 'Orgánico Ecuador',            codes: ['POA: 1125-4', 'POA KIWA: 001-AC']   },
  { src: bpaLogo,        alt: 'Buenas Prácticas Agrícolas',      label: 'Buenas Prácticas Agrícolas',  codes: []                                    },
  { src: euLogo,         alt: 'Certificación Unión Europea',     label: 'Certificación UE',            codes: ['EC-BIO-141', 'Ecuador Agriculture']  },
];

// Use Vite env var if provided (for CDN-hosted video). Fallback to Cloudinary URL then local file for dev.
const heroVideoSrc = (import.meta as any).env?.VITE_HERO_VIDEO_URL || 'https://res.cloudinary.com/djvcofmr0/video/upload/v1779490371/Asopromas_fzp0xv.mp4' || '/assets/video/Hero.mp4';

const Landing: FC = () => {
  useSEO({
    title: 'ASOPROMAS - El Origen del Cacao Fino de Aroma',
    description: 'Descubre la Ruta del Cacao Ancestral y conoce la esencia de ASOPROMAS, productores del cacao más fino de Zamora Chinchipe.',
    keywords: 'ASOPROMAS, Ruta del Cacao Ancestral, cacao Ecuador, chocolate artesanal, Zamora Chinchipe',
    url: '/',
  });

  const prefersReducedMotion = useReducedMotion();

  // 1. Hero Parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });
  const heroScale = useTransform(heroProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1.05, 1.15]);
  const heroY = useTransform(heroProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "-7%"]);

  // 2. Sticky Storytelling (Asociación) - Framer Motion
  const storyContainerRef = useRef<HTMLElement>(null);
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyContainerRef,
    offset: ["start start", "end end"]
  });

  // Text 1: in (0 - 0.15), hold (0.15 - 0.25), out (0.25 - 0.35)
  const text1Opacity = useTransform(storyProgress, [0, 0.15, 0.25, 0.35], [0, 1, 1, 0]);
  const text1Y = useTransform(storyProgress, [0, 0.15, 0.25, 0.35], [50, 0, 0, -50]);

  // Text 2: in (0.35 - 0.5), hold (0.5 - 0.6), out (0.6 - 0.7)
  const text2Opacity = useTransform(storyProgress, [0.35, 0.5, 0.6, 0.7], [0, 1, 1, 0]);
  const text2Y = useTransform(storyProgress, [0.35, 0.5, 0.6, 0.7], [50, 0, 0, -50]);

  // Text 3: in (0.7 - 0.85), hold (0.85 - 1.0)
  const text3Opacity = useTransform(storyProgress, [0.7, 0.85, 1], [0, 1, 1]);
  const text3Y = useTransform(storyProgress, [0.7, 0.85, 1], [50, 0, 0]);

  // 3. Video Reveal
  const videoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: videoProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "center center"]
  });
  const videoScale = useTransform(videoProgress, [0, 1], prefersReducedMotion ? [1, 1] : [0.85, 1]);
  const videoOpacity = useTransform(videoProgress, [0, 1], [0.5, 1]);

  // 4. Parallax Catalog
  const catalogRef = useRef<HTMLElement>(null);
  const { scrollYProgress: catalogProgress } = useScroll({
    target: catalogRef,
    offset: ["start end", "end start"]
  });

  const card1Y = useTransform(catalogProgress, [0, 1], prefersReducedMotion ? [0, 0] : [60, -60]);
  const card2Y = useTransform(catalogProgress, [0, 1], [0, 0]);
  const card3Y = useTransform(catalogProgress, [0, 1], prefersReducedMotion ? [0, 0] : [80, -80]);

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans text-stone-800">

      {/* 1. Hero Parallax Extremo */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-stone-950">
        <motion.div
          className="absolute inset-0 z-0 origin-center"
          style={{ scale: heroScale, y: heroY }}
        >
          <video
            className="w-full h-full object-cover object-center md:object-[center_20%] opacity-60 grayscale-[10%] scale-105"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src={heroVideoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/30 via-transparent to-stone-950/55"></div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-950 to-transparent"></div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl mt-20">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-amber-200 font-medium tracking-[0.3em] uppercase text-sm mb-6"
          >
            Zamora Chinchipe, Ecuador
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight mb-8 drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          >
            ORIGEN <br />
            <span className="font-medium font-serif tracking-wide text-amber-100">Cacao Ancestral</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-stone-200 font-light max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
          >
            Descubre la Ruta del Cacao Ancestral y vive la esencia de la Amazonía en cada aroma, sabor e historia nacida de nuestra tierra.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center mb-16"
          >
            <Link
              to="/ruta-cacao-ancestral"
              className="inline-flex items-center gap-3 bg-white text-chocolate-950 hover:bg-stone-200 px-10 py-4 rounded-full text-lg font-medium transition-all duration-500 shadow-2xl hover:scale-105"
            >
              Ruta del Cacao Ancestral <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* 2. Sticky Storytelling (La Asociación) */}
      <section ref={storyContainerRef} className="relative h-[300vh] bg-stone-950">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="/assets/images/products/Asopromas-socios.jpg"
              className="w-full h-full object-cover opacity-50"
              alt="Familias productoras de ASOPROMAS"
            />
            <div className="absolute inset-0 bg-cacao-green-950/70"></div>
          </div>

          {/* TEXT 1 */}
          <motion.div
            style={{ opacity: text1Opacity, y: text1Y }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-light text-white mb-6 leading-tight">
              Origen{" "}
              <span className="font-serif font-medium tracking-wide text-cacao-green-400">
                Amazónico
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-cacao-green-100/80 font-light leading-relaxed max-w-3xl">
              ASOPROMAS es la unión de 200 familias productoras de cacao
              de la Amazonía Ecuatoriana.
            </p>
          </motion.div>

          {/* TEXT 2 */}
          <motion.div
            style={{ opacity: text2Opacity, y: text2Y }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-light text-white mb-6 leading-tight">
              Cultivamos con{" "}
              <span className="font-serif font-medium tracking-wide text-amber-200">
                Respeto
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-cacao-green-100/80 font-light leading-relaxed max-w-3xl">
              Rescatamos el cacao ancestral mediante prácticas orgánicas.
            </p>
          </motion.div>

          {/* TEXT 3 */}
          <motion.div
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-light text-white mb-10 leading-tight">
              Llevamos el origen al{" "}
              <span className="font-serif font-medium tracking-wide text-blue-400">
                Mundo
              </span>
            </h2>
            <Link
              to="/about"
              className="inline-flex items-center gap-4 bg-white text-cacao-green-950 px-8 py-4 rounded-full text-lg hover:bg-stone-200 transition-all duration-500 hover:scale-105 pointer-events-auto"
            >
              Conoce nuestra historia <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 3. El Latido de la Selva (Video Reveal Cinematográfico) */}
      <section className="py-32 bg-stone-50 overflow-hidden relative">
        <div className="container mx-auto px-6 max-w-6xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-light text-chocolate-900 mb-6"
          >
            El latido de la <span className="font-medium font-serif tracking-wide text-cacao-green-700">Selva</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-stone-500 font-light max-w-2xl mx-auto"
          >
            Siente en primera persona la recolección, el aroma y la magia de nuestro cacao.
          </motion.p>
        </div>

        <div ref={videoRef} className="w-full flex justify-center px-4 md:px-10 h-[70vh]">
          <motion.div
            style={{ scale: videoScale, opacity: videoOpacity }}
            className="relative w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl group border border-stone-200"
          >
            <video
              src="https://res.cloudinary.com/djvcofmr0/video/upload/v1780004240/Video-Ruta_hu4ojk.mp4"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/30 transition-colors duration-500"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <Link
                to="/ruta-cacao-ancestral"
                className="pointer-events-auto inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm text-chocolate-950 hover:bg-white px-8 py-4 rounded-full text-lg font-medium transition-transform duration-500 shadow-2xl hover:scale-105 transform translate-y-4 group-hover:translate-y-0"
              >
                Ver Ruta del Cacao <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Catálogo Flotante (Cascada Parallax) */}
      <section ref={catalogRef} className="py-40 bg-stone-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-32 relative z-20">
            <h2 className="text-4xl md:text-6xl font-light text-chocolate-950 mb-6">
              Nuestras <span className="font-serif font-medium tracking-wide text-chocolate-800">Creaciones</span>
            </h2>
            <p className="text-xl text-stone-500 font-light max-w-2xl mx-auto">
              Cada producto esta elaborado con base de cacao ancestral y el fino de aroma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">

            {/* Tarjeta 1 */}
            <motion.div style={{ y: card1Y }} className="group cursor-pointer">
              <Link to="/products/chocolate-bar-100">
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-8 shadow-xl">
                  <img src="/assets/images/products/barra.jpg" alt="Chocolate Puro" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-medium text-chocolate-900 mb-2 group-hover:text-amber-700 transition-colors">Chocolate 100%</h3>
                  <p className="text-stone-500 font-light">Barras de chocolate puro, activa tus sentidos.</p>
                </div>
              </Link>
            </motion.div>

            {/* Tarjeta 2 */}
            <motion.div style={{ y: card2Y }} className="group cursor-pointer">
              <Link to="/products/cocoa-liqueur">
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-8 shadow-xl">
                  <img src="/assets/images/products/licor.jpg" alt="Licores" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-medium text-chocolate-900 mb-2 group-hover:text-amber-700 transition-colors">Licores de Cacao</h3>
                  <p className="text-stone-500 font-light">Bebida Tradicional.</p>
                </div>
              </Link>
            </motion.div>

            {/* Tarjeta 3 */}
            <motion.div style={{ y: card3Y }} className="group cursor-pointer">
              <Link to="/products/fruit-bonbons">
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-8 shadow-xl">
                  <img src="/assets/images/products/bombon.jpg" alt="Bombones" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-medium text-chocolate-900 mb-2 group-hover:text-amber-700 transition-colors">Bombones</h3>
                  <p className="text-stone-500 font-light">Con sabores exóticos de la Amazonía.</p>
                </div>
              </Link>
            </motion.div>

          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-32 relative z-20"
          >
            <Link to="/products" className="inline-flex items-center gap-3 bg-chocolate-900 text-white hover:bg-chocolate-950 px-10 py-5 rounded-full text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105">
              Explorar Catálogo Completo <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 5. Certificaciones */}
      <section className="py-24 bg-asop-cream relative overflow-hidden border-t border-brand-divider">
        {/* Textura de fondo sutil */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #2B4D3F 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">

          {/* Encabezado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 text-asop-cert font-medium tracking-[0.25em] uppercase text-xs mb-5">
              <ShieldCheck className="w-4 h-4" />
              Calidad Verificada
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-asop-deep mb-5">
              Producción con{' '}
              <span className="font-serif font-medium tracking-wide text-asop-green">
                Certificación
              </span>
            </h2>
            <p className="text-lg text-asop-dark/60 font-light max-w-2xl mx-auto leading-relaxed">
              Contamos con certificaciones nacionales e internacionales.
            </p>
          </motion.div>

          {/* Grid de logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 items-stretch mb-14">
            {CERTS.map((cert, i) => (
              <motion.div
                key={cert.alt}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-brand-divider group-hover:shadow-md group-hover:border-asop-cert/30 transition-all duration-300 w-full aspect-square flex items-center justify-center">
                  <img
                    src={cert.src}
                    alt={cert.alt}
                    className="max-h-20 max-w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                </div>
                <div className="text-center px-1">
                  <p className="text-sm font-medium text-asop-green leading-snug">{cert.label}</p>
                  {cert.codes.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {cert.codes.map(code => (
                        <p key={code} className="text-xs text-asop-dark/45 font-mono">{code}</p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Separador + CTA secundario */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-brand-divider"
          >
            <p className="text-sm text-asop-dark/50 font-light text-center sm:text-left">
              Comprometidos con la trazabilidad EUDR y la producción libre de deforestación.
            </p>
            <Link
              to="/about/certifications"
              className="shrink-0 inline-flex items-center gap-2 text-asop-green border border-asop-green/30 hover:border-asop-green hover:bg-asop-green/5 px-7 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            >
              Ver certificaciones <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* 6. Call to Action (CTA) */}
      <section className="py-32 bg-white relative overflow-hidden border-t border-stone-100">
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-chocolate-950 mb-6">
              Sé parte de nuestra <span className="font-serif font-medium tracking-wide text-chocolate-800">Historia</span>
            </h2>
            <p className="text-xl md:text-2xl text-stone-500 font-light mb-12 leading-relaxed">
              Descubre el verdadero origen del Cacao Ancestral, el fino de aroma. Visítanos en nuestras instalaciones o lleva nuestros productos contigo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/ruta-cacao-ancestral"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-chocolate-900 text-white hover:bg-chocolate-950 px-10 py-4 rounded-full text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Reservar Ruta Ancestral
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-chocolate-900 border border-chocolate-200 hover:bg-stone-50 px-10 py-4 rounded-full text-lg transition-all"
              >
                Adquirir Cacao
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
