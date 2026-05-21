import { type FC, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award, Leaf, Star, Heart, Coffee, Sparkles, Zap } from "lucide-react";
import ContactForm from "../../components/ContactForm";
import { useSEO } from "../../hooks/useSEO";

const CocoaNibs: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);

  useSEO({
    title: 'Nibs de Cacao Natural | ASOPROMAS',
    description: 'Nibs de cacao tostados, puros y naturales. Perfectos como snack saludable.',
    keywords: 'nibs cacao, superalimento',
    url: '/products/cocoa-nibs',
  });

  const features = [
    { icon: <Award/>, title: "Superalimento Ancestral", desc: "La forma más pura de consumir cacao, lleno de antioxidantes y magnesio." },
    { icon: <Leaf/>, title: "100% Naturales", desc: "Granos pelados y triturados, sin ningún tipo de aditivo ni proceso químico." },
    { icon: <Star/>, title: "Tostado Perfecto", desc: "Tostados lentamente para revelar notas profundas sin quemar los aceites esenciales." },
    { icon: <Heart/>, title: "Versatilidad", desc: "Ideales para repostería, batidos, o simplemente como un snack crujiente." }
  ];

  const uses = [
    { icon: <Coffee/>, title: 'Smoothies y Batidos', desc: 'Agrega una cucharada para un boost de energía natural.' },
    { icon: <Sparkles/>, title: 'Repostería Gourmet', desc: 'Perfecto para decorar pasteles o hacer chocolate.' },
    { icon: <Heart/>, title: 'Snack Saludable', desc: 'Consume directamente como un snack nutritivo.' },
    { icon: <Zap/>, title: 'Yogurts y Cereales', desc: 'Espolvorea sobre avena para un desayuno energético.' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      
      {/* Parallax Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <p className="text-chocolate-400 font-medium tracking-[0.3em] uppercase text-xs mb-8">Colección Premium</p>
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-light text-chocolate-950 mb-8 leading-none tracking-tight">
            Nibs de <br/>
            <span className="font-medium font-serif text-chocolate-800 tracking-wide">Cacao</span>
          </h1>
          <p className="text-xl sm:text-2xl text-stone-500 font-light max-w-2xl mx-auto">
            El superalimento amazónico en su forma más pura y crujiente.
          </p>
        </motion.div>
      </section>

      {/* Sticky Scroll Section */}
      <section ref={containerRef} className="relative bg-stone-900 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
            
            {/* Left: Sticky Image */}
            <div className="lg:w-1/2 lg:sticky lg:top-0 lg:h-screen flex items-center justify-center py-20 lg:py-0">
              <div className="relative aspect-[3/4] w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-stone-800 flex items-center justify-center">
                <motion.img 
                  style={{ scale: imgScale }}
                  src="/assets/images/products/cocoa-nibs.jpg" 
                  alt="Nibs de Cacao" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML += '<span class="text-6xl absolute z-20">🌰</span>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
              </div>
            </div>

            {/* Right: Scrolling Features */}
            <div className="lg:w-1/2 py-10 lg:py-[30vh]">
              <div className="space-y-32">
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ margin: "-20%" }}
                  className="space-y-6"
                >
                  <h2 className="text-4xl font-light text-white mb-6">Puro <span className="font-serif text-amber-200 tracking-wide">Poder</span></h2>
                  <p className="text-xl text-stone-400 font-light leading-relaxed">
                    Los nibs son fragmentos de semillas de cacao tostadas. Conservan todas las propiedades energéticas y antioxidantes que los antiguos imperios veneraban.
                  </p>
                </motion.div>

                {features.map((feat, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ margin: "-20%" }}
                    className="flex gap-6 items-start"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-200 shrink-0">
                      {feat.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-medium text-white mb-3">{feat.title}</h3>
                      <p className="text-lg text-stone-400 font-light leading-relaxed">{feat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Extra: Usos */}
      <section className="py-32 bg-white px-6 border-b border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-chocolate-900 mb-4">¿Cómo <span className="font-serif text-chocolate-800 tracking-wide">usarlos?</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {uses.map((use, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-white text-chocolate-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  {use.icon}
                </div>
                <h3 className="text-xl font-medium text-chocolate-900 mb-3">{use.title}</h3>
                <p className="text-stone-500 font-light">{use.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 bg-stone-50 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-chocolate-900 mb-6">Adquiere este <span className="font-serif text-chocolate-800 tracking-wide">Producto</span></h2>
            <p className="text-xl text-stone-500 font-light">Ponte en contacto con nosotros para reservas y envíos.</p>
          </motion.div>
          <div className="bg-white p-8 sm:p-12 rounded-[2rem] border border-stone-100 shadow-xl">
            <ContactForm productName="Nibs de Cacao Naturales" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default CocoaNibs;