import { type FC, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Users, Heart, ShoppingBag } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSEO } from '../hooks/useSEO';
import './Landing.css';

// Animación para fade-in desde abajo
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

// Animación para escalar
const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

// Animación en cascada para elementos hijos
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const Landing: FC = () => {
  // Ref para el parallax
  const heroRef = useRef<HTMLElement>(null);
  
  // Estado para el slider de imágenes del hero
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  
  const heroImages = [
    '/assets/images/products/Chocolates.jpg',
    '/assets/images/products/Bombones-1.jpg',
    '/assets/images/products/Cafe-1.jpg',
    '/assets/images/products/Licor-Grande-1.jpg',
    '/assets/images/products/Barra-Pura-1.jpg'
  ];

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

  // Auto-advance del slider del hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // SEO Configuration
  useSEO({
    title: 'ASOPROMAS - Cacao Premium y Chocolate Artesanal del Ecuador',
    description: 'Descubre los productos KUJEÑITO de ASOPROMAS: chocolate 100% puro, barras artesanales y productos derivados del cacao de fino aroma de Zamora Chinchipe, Ecuador.',
    keywords: 'ASOPROMAS, KUJEÑITO, cacao Ecuador, chocolate artesanal, cacao fino aroma, Zamora Chinchipe, chocolate orgánico, comercio justo',
    url: '/',
    type: 'website',
    image: '/assets/images/products/Asopromas-socios.jpg'
  });

  const products = [
    {
      image: "/assets/images/products/Barra-Pura-1.jpg",
      title: "Barras de Chocolate Artesanales",
      description: "Experimenta el sabor puro del Ecuador en cada bocado",
      link: "/products/chocolate-bar-100"
    },
    {
      image: "/assets/images/products/Coctel-1.jpg",
      title: "Bebidas de Cacao Premium",
      description: "Bebidas ricas y aromáticas para los amantes del chocolate",
      link: "/products/cocoa-cocktail"
    },
    {
      image: "/assets/images/products/Bombones-1.jpg",
      title: "Bombones",
      description: "Rellenos de frutas frescas con chocolate premium",
      link: "/products/fruit-bonbons"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center bg-black text-white overflow-hidden"
          aria-labelledby="hero-heading"
        >
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            poster="/assets/images/products/Chocolates.jpg"
          >
            <source src="/assets/videos/hero-background.mp4" type="video/mp4" />
            <source src="/assets/videos/hero-background.webm" type="video/webm" />
            {/* Fallback para navegadores sin soporte de video */}
          </video>
          {/* Overlay gradient para mejorar legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>

        {/* Background Pattern (sobre el video) */}
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent transform rotate-12"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-400/10 to-transparent transform -rotate-12"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-500/30 rounded-full blur-xl animate-pulse" aria-hidden="true"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000" aria-hidden="true"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-amber-500/25 rounded-full blur-lg animate-pulse delay-500" aria-hidden="true"></div>

        <motion.div 
          className="container mx-auto px-4 relative z-10"
          style={{ y: y1, opacity }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Columna Izquierda: Texto */}
            <motion.div 
              className="text-center lg:text-left space-y-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div className="space-y-4" variants={fadeInUp}>
                <motion.div 
                  className="inline-block px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/40"
                  variants={scaleIn}
                >
                  <span className="text-amber-300 font-medium text-sm">🇪🇨 Desde Ecuador para el Mundo</span>
                </motion.div>
                <motion.h1
                  id="hero-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                  variants={fadeInUp}
                >
                  Descubre el
                  <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                    Chocolate
                  </span>
                  <span className="block text-blue-100">Ecuatoriano</span>
                </motion.h1>
              </motion.div>

              <motion.p 
                className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                variants={fadeInUp}
              >
                ASOPROMAS te trae productos de cacao de calidad premium desde el corazón de
                <span className="font-semibold text-amber-400"> Zamora Chinchipe</span>,
                donde cada grano cuenta una historia de tradición y excelencia.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={fadeInUp}
              >
                <Link
                  to="/products"
                  className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center">
                    <ShoppingBag className="mr-3 h-5 w-5" />
                    Explorar Productos
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>

                <Link
                  to="/about"
                  className="group border-2 border-blue-400 text-blue-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
                >
                  <Award className="mr-3 h-5 w-5" />
                  Nuestra Historia
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-600/50"
                variants={fadeInUp}
              >
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-400">15+</div>
                  <div className="text-sm text-gray-400">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-400">100%</div>
                  <div className="text-sm text-gray-400">Cacao Premium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400">100+</div>
                  <div className="text-sm text-gray-400">Familias Productoras</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Columna Derecha: Slider de Imágenes */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 to-blue-500/15 rounded-full blur-3xl"></div>

                {/* Image Slider Container */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-gray-700/50 shadow-2xl">
                  {/* Slider de imágenes */}
                  <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-800">
                    {heroImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Producto ASOPROMAS ${index + 1}`}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
                        style={{
                          opacity: currentHeroImage === index ? 1 : 0
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section - Por qué elegir ASOPROMAS */}
      <section className="relative py-24 bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden">
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #92400e 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Encabezado */}
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.span 
              className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-4"
              variants={scaleIn}
            >
              Organización
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-800 via-amber-600 to-orange-600 bg-clip-text text-transparent">
              ¿Por qué elegir ASOPROMAS?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Más que chocolate, somos una familia comprometida con la calidad, 
              la sostenibilidad y el bienestar de nuestras comunidades
            </p>
          </motion.div>

          {/* Grid de características con imágenes */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Card 1 - Calidad Premium */}
            <motion.div
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
              variants={fadeInUp}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src="/assets/images/products/Calidad.jpg"
                    alt="Calidad Premium"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/80 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="h-20 w-20 text-white opacity-80" />
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-4">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Calidad Premium</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Nuestro cacao fino de aroma es seleccionado meticulosamente, 
                    garantizando los más altos estándares de calidad en cada grano.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Cacao certificado de fino aroma
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Proceso artesanal controlado
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Sabor único e inigualable
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Card 2 - Comunidad y Productores */}
            <motion.div
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
              variants={fadeInUp}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src="/assets/images/products/Asopromas-socios.jpg"
                    alt="Comunidad de Productores"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/80 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="h-20 w-20 text-white opacity-80" />
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-4">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Comunidad Primero</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Apoyamos a más de 100 familias productoras con prácticas de 
                    procesos agroecológicos, equidad de género y desarrollo comunitario sostenible.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Mejor precio garantizado
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Capacitación continua
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Bienestar familiar
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Card 3 - Sostenibilidad */}
            <motion.div
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
              variants={fadeInUp}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src="/assets/images/products/General.jpg"
                    alt="Sostenibilidad"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="h-20 w-20 text-white opacity-80" />
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                    <Heart className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Futuro Sostenible</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Cultivamos respetando el medio ambiente con prácticas 
                    orgánicas que preservan nuestros bosques y biodiversidad.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                      Cultivo 100% orgánico
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                      Reforestación activa
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                      Biodiversidad protegida
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Card 4 - Tradición e Innovación */}
            <motion.div
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
              variants={fadeInUp}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src="/assets/images/products/Tradicion.png"
                    alt="Tradición e Innovación"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="h-20 w-20 text-white opacity-80" />
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                    <ShoppingBag className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Tradición e Innovación</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Combinamos técnicas ancestrales con innovación moderna 
                    para crear productos únicos de clase mundial.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                      Recetas tradicionales
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                      Procesos innovadores
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                      Productos únicos
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA bottom */}
          <motion.div 
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Heart className="h-5 w-5" />
              <span>Más de 15 años transformando vidas con cacao de calidad</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products - KUJEÑITO */}
      <section className="relative py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Presentación de la Marca KUJEÑITO */}
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {/* Título de presentación */}
            <motion.div 
              className="mb-6"
              variants={fadeInUp}
            >
              <div className="inline-block bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm px-6 py-2 rounded-full mb-4 border border-amber-400/30">
                <span className="text-amber-300 font-semibold text-sm tracking-widest">PRODUCTOS DESTACADOS</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
                Descubre la Colección
              </h2>
            </motion.div>

            {/* Logo KUJEÑITO */}
            <motion.div 
              className="inline-block mb-4 group cursor-pointer"
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="relative bg-white/10 backdrop-blur-sm rounded-[2rem] p-4 md:p-5 border border-white/20 inline-block overflow-hidden
                group-hover:bg-white/15 group-hover:border-amber-400/40 group-hover:shadow-2xl group-hover:shadow-amber-500/30 
                transition-all duration-500">
                {/* Brillo animado de fondo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Círculos decorativos con animación */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl group-hover:scale-150 group-hover:bg-amber-400/30 transition-all duration-700"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl group-hover:scale-150 group-hover:bg-orange-400/30 transition-all duration-700"></div>
                
                {/* Logo con efectos */}
                <div className="relative transform group-hover:scale-105 transition-transform duration-500">
                  <div className="bg-white rounded-[1.5rem] p-3 shadow-2xl group-hover:shadow-amber-500/50 transition-shadow duration-500">
                    <img 
                      src="/assets/images/products/logo-Kujenito.png" 
                      alt="Kujeñito Logo" 
                      className="w-full max-w-xs md:max-w-sm mx-auto h-auto"
                    />
                  </div>
                  
                  {/* Anillo brillante alrededor */}
                  <div className="absolute inset-0 rounded-[1.5rem] border-2 border-transparent group-hover:border-amber-400/50 group-hover:animate-pulse transition-all duration-500"></div>
                </div>

                {/* Badge flotante */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                  ✨ Premium
                </div>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-lg text-gray-400 max-w-2xl mx-auto mb-4"
              variants={fadeInUp}
            >
              Desde el corazón de la Amazonía ecuatoriana
            </motion.p>
            
            {/* Texto descriptivo con diseño sofisticado */}
            <motion.div 
              className="max-w-4xl mx-auto mb-4"
              variants={fadeInUp}
            >
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed mb-3">
                Nuestra marca premium de productos artesanales del{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                    cacao más fino del Ecuador
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-sm"></span>
                </span>
              </p>
              
              <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Cada producto <span className="text-amber-400 font-semibold">KUJEÑITO</span> es el resultado de años de tradición 
                y dedicación de nuestros productores, combinando técnicas ancestrales con estándares 
                de calidad internacional.
              </p>
            </motion.div>
            
            {/* Badge de origen mejorado */}
            <motion.div 
              className="flex items-center justify-center gap-4 text-amber-400 mb-4"
              variants={fadeInUp}
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-amber-400"></div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-400/30">
                <span className="text-xl">📍</span>
                <span className="text-xs font-bold tracking-wider">ZAMORA CHINCHIPE, ECUADOR</span>
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent via-amber-400 to-amber-400"></div>
            </motion.div>

            {/* Stats de calidad */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6"
              variants={fadeInUp}
            >
              <div className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-amber-400 mb-1">100%</div>
                <div className="text-xs text-gray-400">Orgánico Certificado</div>
              </div>
              <div className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-amber-400 mb-1">🏆</div>
                <div className="text-xs text-gray-400">Calidad Premium</div>
              </div>
              <div className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-amber-400 mb-1">15+</div>
                <div className="text-xs text-gray-400">Años de Tradición</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Grid de Productos con diseño moderno */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {products.map((product, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
              >
                <Link
                  to={product.link}
                  className="group block relative"
                >
                  {/* Card con efecto hover */}
                  <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/20">
                    {/* Imagen del producto */}
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>

                      {/* Badge Premio de Plata - solo para Barras de Chocolate */}
                      {index === 0 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 border-2 border-gray-400/50">
                          <span className="text-lg">🥈</span>
                          <span>Premio de Plata</span>
                        </div>
                      )}

                      {/* Hover overlay con icono */}
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-600/90 via-orange-600/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <ShoppingBag className="h-16 w-16 text-white mb-4 mx-auto" />
                          <span className="text-white font-semibold text-lg">Ver Producto</span>
                        </div>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-amber-400 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {product.description}
                      </p>

                      {/* Botón sutil */}
                      <div className="mt-4 flex items-center text-amber-500 text-sm font-semibold group-hover:text-amber-400 transition-colors">
                        <span>Explorar</span>
                        <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Brillo decorativo */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA para ver todos los productos */}
          <motion.div 
            className="text-center mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-full font-bold text-lg hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/50 transform hover:scale-105"
            >
              <ShoppingBag className="h-6 w-6" />
              <span>Ver Toda la Colección KUJEÑITO</span>
              <ChevronRight className="h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section - Nuestra Historia */}
      <section className="relative py-24 bg-gradient-to-br from-white via-amber-50/30 to-white overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            
            {/* Columna izquierda - Imágenes en grid */}
            <motion.div 
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Imagen grande */}
                <div className="col-span-2 relative h-72 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/assets/images/products/Asopromas-socios.jpg"
                    alt="Productores ASOPROMAS"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-sm font-semibold mb-1">Más de 100 familias</p>
                    <p className="text-2xl font-bold">Productores Unidos</p>
                  </div>
                </div>
                
                {/* Imágenes pequeñas */}
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/assets/images/products/Chocolates.jpg"
                    alt="Productos ASOPROMAS"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/assets/images/products/Cafe-1.jpg"
                    alt="Cacao ASOPROMAS"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Badge flotante */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white px-6 py-3 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <p className="text-sm font-semibold">Desde 2008</p>
                <p className="text-2xl font-bold">15+ Años</p>
              </div>
            </motion.div>

            {/* Columna derecha - Contenido */}
            <motion.div 
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-4">
                  Nosotros
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Nuestra Historia
                </h2>
              </motion.div>

              <motion.p 
                className="text-lg text-gray-700 leading-relaxed"
                variants={fadeInUp}
              >
                <span className="text-2xl font-bold text-amber-600">ASOPROMAS</span> es una orgullosa 
                asociación de productores de cacao en <span className="font-semibold text-gray-900">Zamora Chinchipe, Ecuador</span>. 
                Nuestro viaje comenzó con una misión simple pero poderosa: producir cacao de la más alta calidad 
                mientras apoyamos y fortalecemos a nuestras comunidades agrícolas locales.
              </motion.p>

              <motion.div 
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-l-4 border-amber-500"
                variants={fadeInUp}
              >
                <p className="text-gray-700 leading-relaxed italic">
                  "Hoy, continuamos manteniendo estos valores, combinando la sabiduría agrícola tradicional 
                  con prácticas sostenibles modernas para crear productos de chocolate excepcionales que 
                  son disfrutados en todo el mundo."
                </p>
              </motion.div>

              {/* Stats en línea */}
              <motion.div 
                className="grid grid-cols-3 gap-4 py-6"
                variants={fadeInUp}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-1">100+</div>
                  <div className="text-sm text-gray-600">Familias</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-1">15+</div>
                  <div className="text-sm text-gray-600">Años</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-1">100%</div>
                  <div className="text-sm text-gray-600">Orgánico</div>
                </div>
              </motion.div>

              {/* Lista de valores */}
              <motion.div 
                className="space-y-3"
                variants={fadeInUp}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mt-1">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Calidad Excepcional</h4>
                    <p className="text-sm text-gray-600">Cacao fino de aroma certificado</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mt-1">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Compromiso Social</h4>
                    <p className="text-sm text-gray-600">Mejores precios y desarrollo comunitario</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-1">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Sostenibilidad</h4>
                    <p className="text-sm text-gray-600">Prácticas agrícolas conscientes del medio ambiente</p>
                  </div>
                </div>
              </motion.div>

              {/* Botones de acción */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                variants={fadeInUp}
              >
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Conoce más sobre nosotros
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/about/producers"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-amber-500 text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-300"
                >
                  <Users className="h-5 w-5" />
                  Conoce a los Productores
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Origen del Cacao - Timeline Visual */}
      <section className="relative py-24 bg-gradient-to-br from-[#2c1810] via-[#4a2618] to-[#6b3e24] text-white overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        </div>

        {/* Patrón de cacao */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm5 5h30v30H25V25z' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }}></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Encabezado */}
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/40 mb-6"
              variants={scaleIn}
            >
              <Award className="h-5 w-5 text-amber-300" />
              <span className="text-amber-200 font-semibold">El Legado Ancestral</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
            >
              El Origen del Cacao
              <span className="block bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent mt-2">
                Más Antiguo del Mundo
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-amber-100 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Hace más de 5,000 años, en las tierras sagradas de Zamora Chinchipe, 
              nació la historia del cacao que hoy compartimos con el mundo.
            </motion.p>
          </motion.div>

          {/* Timeline Visual */}
          <motion.div 
            className="max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Línea conectora en desktop */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 transform -translate-y-1/2"></div>

              {/* Card 1 - 3000 AC */}
              <motion.div 
                className="relative"
                variants={fadeInUp}
              >
                <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/30 group">
                  {/* Icono circular */}
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">🌱</span>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-5xl font-bold text-amber-300 mb-3">3000 AC</h3>
                    <h4 className="text-xl font-semibold text-white mb-4">Los Primeros Vestigios</h4>
                    <p className="text-amber-100 text-sm leading-relaxed">
                      Los primeros indicios del cultivo de cacao en Santa Ana-La Florida, 
                      marcando el inicio de una civilización construida alrededor del cacao.
                    </p>
                  </div>

                  {/* Decoración */}
                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>
              </motion.div>

              {/* Card 2 - Ecuador */}
              <motion.div 
                className="relative"
                variants={fadeInUp}
              >
                <div className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/30 group">
                  {/* Icono circular */}
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">🇪🇨</span>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-5xl font-bold text-amber-300 mb-3">Ecuador</h3>
                    <h4 className="text-xl font-semibold text-white mb-4">Cuna del Cacao</h4>
                    <p className="text-amber-100 text-sm leading-relaxed">
                      Reconocido mundialmente como el lugar donde se originó el cacao fino de aroma, 
                      tesoro invaluable que compartimos con el planeta.
                    </p>
                  </div>

                  {/* Badge especial */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    Patrimonio Mundial
                  </div>

                  {/* Decoración */}
                  <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>
              </motion.div>

              {/* Card 3 - ASOPROMAS */}
              <motion.div 
                className="relative"
                variants={fadeInUp}
              >
                <div className="bg-gradient-to-br from-orange-900/50 to-amber-900/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/30 group">
                  {/* Icono circular */}
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-4xl font-bold text-orange-300 mb-3">HOY</h3>
                    <h4 className="text-xl font-semibold text-white mb-4">ASOPROMAS</h4>
                    <p className="text-orange-100 text-sm leading-relaxed">
                      Continuamos el legado ancestral, cultivando con orgullo el cacao 
                      más fino del mundo en las mismas tierras sagradas.
                    </p>
                  </div>

                  {/* Badge especial */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    Legado Vivo
                  </div>

                  {/* Decoración */}
                  <div className="absolute -top-2 -left-2 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats y CTA */}
          <motion.div 
            className="mt-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Stats en línea */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mb-10"
              variants={fadeInUp}
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-300 mb-1">5,000+</div>
                <div className="text-sm text-amber-100">Años de Historia</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-300 mb-1">100%</div>
                <div className="text-sm text-amber-100">Cacao Fino Aroma</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-300 mb-1">🏆</div>
                <div className="text-sm text-amber-100">Premio Mundial</div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeInUp}>
              <Link
                to="/cacao-origin"
                className="group inline-flex items-center gap-3 px-10 py-5 text-xl font-bold text-[#2c1810]
                  bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 rounded-2xl
                  hover:from-amber-400 hover:via-yellow-500 hover:to-amber-400
                  transform hover:scale-105 active:scale-95
                  shadow-2xl hover:shadow-amber-400/50
                  transition-all duration-300"
              >
                <Award className="w-7 h-7" />
                <span>Descubre Nuestra Historia Completa</span>
                <ChevronRight className="w-7 h-7 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final - Experimenta Nuestros Productos */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-orange-800">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <motion.div 
              className="text-center mb-16"
              variants={fadeInUp}
            >
              <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-white/20">
                <span className="text-amber-300 font-semibold text-sm tracking-wider">SABORES ÚNICOS</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                ¿Listo para{' '}
                <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
                  Experimentar
                </span>
                {' '}Nuestros Productos?
              </h2>
              <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto">
                Descubre los ricos sabores de nuestros productos premium de chocolate y cacao, 
                elaborados con pasión por nuestros productores
              </p>
            </motion.div>

            {/* Product Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* Product 1 */}
              <motion.div 
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500"
                variants={fadeInUp}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src="/assets/images/products/Barra-Pura-1.jpg" 
                    alt="Barra de Chocolate Pura"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span>🏆</span>
                    <span>Barra Pura</span>
                  </h3>
                  <p className="text-sm text-amber-200">100% Cacao Fino Aroma</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-600/0 via-transparent to-transparent group-hover:from-amber-600/40 transition-all duration-500"></div>
              </motion.div>

              {/* Product 2 */}
              <motion.div 
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500"
                variants={fadeInUp}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src="/assets/images/products/Bombones-1.jpg" 
                    alt="Bombones Premium"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Bombones</h3>
                  <p className="text-sm text-amber-200">Rellenos de Frutas</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/0 via-transparent to-transparent group-hover:from-orange-600/40 transition-all duration-500"></div>
              </motion.div>

              {/* Product 3 */}
              <motion.div 
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500"
                variants={fadeInUp}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src="/assets/images/products/Cafe-1.jpg" 
                    alt="Café con Chocolate"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Barra con Cafe Premium</h3>
                  <p className="text-sm text-amber-200">Con Nibs de Cafe de Palanda</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-600/0 via-transparent to-transparent group-hover:from-amber-600/40 transition-all duration-500"></div>
              </motion.div>

              {/* Product 4 */}
              <motion.div 
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500"
                variants={fadeInUp}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src="/assets/images/products/Licor-Grande-1.jpg" 
                    alt="Licor de Cacao"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Licor de Cacao</h3>
                  <p className="text-sm text-amber-200">Edición Especial</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/0 via-transparent to-transparent group-hover:from-orange-600/40 transition-all duration-500"></div>
              </motion.div>
            </div>

            {/* Features & CTA */}
            <motion.div 
              className="bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10"
              variants={fadeInUp}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Features */}
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                    ¿Por qué elegir KUJEÑITO?
                  </h3>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">100% Orgánico</h4>
                      <p className="text-amber-100 text-sm">Cultivado sin químicos ni pesticidas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Mejores Precios</h4>
                      <p className="text-amber-100 text-sm">Apoyando a más de 100 familias productoras</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Cacao Fino Aroma</h4>
                      <p className="text-amber-100 text-sm">Reconocido internacionalmente por su calidad</p>
                    </div>
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="text-center lg:text-right space-y-6">
                  <div className="inline-block lg:block">
                    <div className="text-5xl md:text-6xl font-black mb-4">
                      <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
                        KUJEÑITO
                      </span>
                    </div>
                    <p className="text-amber-100 text-lg mb-8">
                      Sabores auténticos del Ecuador amazónico
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                    <Link to="/products">
                      <motion.button 
                        className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-[#2c1810]
                          bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 rounded-xl
                          hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400
                          transform hover:scale-105 active:scale-95
                          shadow-2xl hover:shadow-amber-400/50
                          transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingBag className="w-6 h-6" />
                        <span>Ver Todos los Productos</span>
                        <ChevronRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
                      </motion.button>
                    </Link>
                  </div>

                  {/* Trust Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <span className="text-2xl">🏆</span>
                    <span className="text-sm text-amber-200 font-semibold">Premio Internacional de Calidad</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
              variants={fadeInUp}
            >
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">100+</div>
                <div className="text-sm text-amber-100">Familias Productoras</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">15+</div>
                <div className="text-sm text-amber-100">Años de Experiencia</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">100%</div>
                <div className="text-sm text-amber-100">Orgánico y Natural</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">🌍</div>
                <div className="text-sm text-amber-100">Exportación Global</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
