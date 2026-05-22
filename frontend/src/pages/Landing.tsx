import { type FC, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

// Use Vite env var if provided (for CDN-hosted video). Fallback to local file for dev.
const heroVideoSrc = (import.meta as any).env?.VITE_HERO_VIDEO_URL || '/assets/video/Hero.mp4';

const Landing: FC = () => {
  useSEO({
    title: 'ASOPROMAS - El Origen del Cacao Fino de Aroma',
    description: 'Descubre la Ruta del Cacao Ancestral y conoce la esencia de ASOPROMAS, productores del cacao más fino de Zamora Chinchipe.',
    keywords: 'ASOPROMAS, Ruta del Cacao Ancestral, cacao Ecuador, chocolate artesanal, Zamora Chinchipe',
    url: '/',
  });

  // 1. Hero Parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "50%"]);

  // 2. Sticky Storytelling (Asociación)
  const storyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"]
  });
  
  // Crossfade between texts based on scroll inside the sticky section
  const text1Opacity = useTransform(storyProgress, [0, 0.3, 0.4], [1, 1, 0]);
  const text1Y = useTransform(storyProgress, [0, 0.4], [0, -50]);
  
  const text2Opacity = useTransform(storyProgress, [0.35, 0.5, 0.7, 0.8], [0, 1, 1, 0]);
  const text2Y = useTransform(storyProgress, [0.35, 0.5], [50, 0]);

  const text3Opacity = useTransform(storyProgress, [0.75, 0.9], [0, 1]);
  const text3Y = useTransform(storyProgress, [0.75, 0.9], [50, 0]);

  const bgScale = useTransform(storyProgress, [0, 1], [1, 1.2]);

  // 3. Video Reveal
  const videoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: videoProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "center center"]
  });
  const videoScale = useTransform(videoProgress, [0, 1], [0.85, 1]);
  const videoOpacity = useTransform(videoProgress, [0, 1], [0.5, 1]);

  // 4. Parallax Catalog
  const catalogRef = useRef<HTMLElement>(null);
  const { scrollYProgress: catalogProgress } = useScroll({
    target: catalogRef,
    offset: ["start end", "end start"]
  });
  
  const card1Y = useTransform(catalogProgress, [0, 1], [100, -100]);
  const card2Y = useTransform(catalogProgress, [0, 1], [0, 0]); // Centro estático
  const card3Y = useTransform(catalogProgress, [0, 1], [150, -150]);

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans text-stone-800">
      
      {/* 1. Hero Parallax Extremo */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-stone-950">
        <motion.div 
          className="absolute inset-0 z-0 origin-center"
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
        >
          <video
            className="w-full h-full object-cover object-center md:object-[center_20%] opacity-60 grayscale-[10%] scale-105"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/images/products/Chocolates.jpg"
            aria-hidden="true"
          >
            <source src={heroVideoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/35 via-stone-950/15 to-stone-950/70"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_70%,rgba(0,0,0,0.4)_100%)]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-stone-950/25"></div>
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-stone-950 to-transparent"></div>
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
            El origen del <br/>
            <span className="font-medium font-serif tracking-wide text-amber-100">Cacao Fino de Aroma</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-stone-200 font-light max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
          >
            Descubre la esencia pura de la Amazonía en cada bocado de nuestras colecciones premium.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center mb-16"
          >
            <Link 
              to="/products"
              className="inline-flex items-center gap-3 bg-white text-chocolate-950 hover:bg-stone-200 px-10 py-4 rounded-full text-lg font-medium transition-all duration-500 shadow-2xl hover:scale-105"
            >
              Explorar Colección
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="hidden md:flex flex-col items-center justify-center"
          >
            <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* 2. Sticky Storytelling (La Asociación) */}
      <section ref={storyRef} className="relative h-[300vh] bg-stone-950">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Fondo animado que crece suavemente */}
          <motion.div className="absolute inset-0 z-0" style={{ scale: bgScale }}>
            <img 
              src="/assets/images/products/Asopromas-socios.jpg" 
              alt="Familias productoras" 
              className="w-full h-full object-cover opacity-30 mix-blend-luminosity" 
            />
            <div className="absolute inset-0 bg-cacao-green-950/80 mix-blend-multiply"></div>
          </motion.div>

          {/* Textos cruzados (Crossfade) */}
          <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
            {/* Texto 1 */}
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center" style={{ opacity: text1Opacity, y: text1Y, pointerEvents: "none" }}>
              <h2 className="text-5xl md:text-7xl font-light text-white mb-6">
                Nacimos de la <span className="font-serif font-medium tracking-wide text-cacao-green-300">Tierra</span>
              </h2>
              <p className="text-xl md:text-2xl text-cacao-green-100/80 font-light leading-relaxed">
                ASOPROMAS es la unión de más de 100 familias apasionadas por la Amazonía ecuatoriana.
              </p>
            </motion.div>

            {/* Texto 2 */}
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center" style={{ opacity: text2Opacity, y: text2Y, pointerEvents: "none" }}>
              <h2 className="text-5xl md:text-7xl font-light text-white mb-6">
                Cultivamos con <span className="font-serif font-medium tracking-wide text-amber-200">Respeto</span>
              </h2>
              <p className="text-xl md:text-2xl text-cacao-green-100/80 font-light leading-relaxed">
                Rescatamos el cacao fino de aroma mediante prácticas orgánicas que nutren la biodiversidad.
              </p>
            </motion.div>

            {/* Texto 3 */}
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center" style={{ opacity: text3Opacity, y: text3Y }}>
              <h2 className="text-5xl md:text-7xl font-light text-white mb-10">
                Llevamos el origen al <span className="font-serif font-medium tracking-wide text-white">Mundo</span>
              </h2>
              <Link 
                to="/about" 
                className="inline-flex items-center gap-4 bg-white text-cacao-green-950 px-8 py-4 rounded-full text-lg hover:bg-stone-200 transition-all duration-500 hover:scale-105"
              >
                Conoce nuestra historia <ArrowRight className="w-5 h-5"/>
              </Link>
            </motion.div>
          </div>
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
            <img 
              src="/assets/images/products/Palanda.jpg" 
              alt="Documental ASOPROMAS" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-stone-900/10 transition-colors duration-500"></div>
            
            <Link 
              to="/ruta-cacao-ancestral"
              className="absolute inset-0 flex flex-col items-center justify-center group/btn focus:outline-none"
              aria-label="Descubrir la Ruta"
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover/btn:scale-110 group-hover/btn:bg-white/30 transition-all duration-500 shadow-xl mb-6">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-white font-medium tracking-widest uppercase text-sm drop-shadow-md">Ver Ruta del Cacao</span>
            </Link>
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
              Cada producto es una obra maestra elaborada para resaltar las notas únicas del cacao fino de aroma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            
            {/* Tarjeta 1 */}
            <motion.div style={{ y: card1Y }} className="group cursor-pointer">
              <Link to="/products/chocolate-bar-100">
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-8 shadow-xl">
                  <img src="/assets/images/products/Barra-Pura-1.jpg" alt="Chocolate Puro" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-medium text-chocolate-900 mb-2 group-hover:text-amber-700 transition-colors">Chocolate Puro</h3>
                  <p className="text-stone-500 font-light">Barras que despiertan sentidos.</p>
                </div>
              </Link>
            </motion.div>

            {/* Tarjeta 2 */}
            <motion.div style={{ y: card2Y }} className="group cursor-pointer">
              <Link to="/products/cocoa-liqueur">
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-8 shadow-xl">
                  <img src="/assets/images/products/Licor-Grande-1.jpg" alt="Licores" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-medium text-chocolate-900 mb-2 group-hover:text-amber-700 transition-colors">Licores Premium</h3>
                  <p className="text-stone-500 font-light">El espíritu de la tierra.</p>
                </div>
              </Link>
            </motion.div>

            {/* Tarjeta 3 */}
            <motion.div style={{ y: card3Y }} className="group cursor-pointer">
              <Link to="/products/fruit-bonbons">
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-8 shadow-xl">
                  <img src="/assets/images/products/Bombones-1.jpg" alt="Bombones" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-medium text-chocolate-900 mb-2 group-hover:text-amber-700 transition-colors">Bombones Artesanales</h3>
                  <p className="text-stone-500 font-light">Sabores exóticos amazónicos.</p>
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
              Explorar Catálogo Completo <ArrowRight className="w-5 h-5"/>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 5. Call to Action (CTA) */}
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
              Descubre el verdadero origen del cacao fino de aroma. Visítanos en la Amazonía o lleva nuestra esencia a tu mesa.
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
