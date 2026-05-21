import { type FC, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award, Leaf, Star, Heart } from "lucide-react";
import ContactForm from "../../components/ContactForm";
import { useSEO } from "../../hooks/useSEO";

const ProductComponent: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);

  useSEO({
    title: 'Bombones Frutales Artesanales | ASOPROMAS',
    description: 'Delicadas piezas de chocolate rellenas con exóticos sabores frutales amazónicos.',
    keywords: 'bombones relleno, chocolate ecuador',
    url: '/products/fruit-bonbons',
  });

  const features = [
    { icon: <Award/>, title: "Rellenos Exóticos", desc: "Guayaba, piña, maracuyá, mora y jalea de cacao." },
    { icon: <Leaf/>, title: "Fruta 100% Natural", desc: "Mermeladas artesanales hechas con frutas de nuestros propios huertos." },
    { icon: <Star/>, title: "Contraste de Texturas", desc: "La cápsula crujiente de chocolate que esconde un corazón líquido y frutal." },
    { icon: <Heart/>, title: "Hechos a Mano", desc: "Pintados y moldeados individualmente con técnicas chocolateras clásicas." }
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
            Bombones <br/>
            <span className="font-medium font-serif text-chocolate-800 tracking-wide">Rellenos</span>
          </h1>
          <p className="text-xl sm:text-2xl text-stone-500 font-light max-w-2xl mx-auto">
            Delicadas piezas de chocolate con el corazón de la Amazonía.
          </p>
        </motion.div>
      </section>

      {/* Sticky Scroll Section */}
      <section ref={containerRef} className="relative bg-stone-900 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
            
            {/* Left: Sticky Image */}
            <div className="lg:w-1/2 lg:sticky lg:top-0 lg:h-screen flex items-center justify-center py-20 lg:py-0">
              <div className="relative aspect-[3/4] w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
                <motion.img 
                  style={{ scale: imgScale }}
                  src="/assets/images/products/Bombones-1.jpg" 
                  alt="Bombones Rellenos" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
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
                  <h2 className="text-4xl font-light text-white mb-6">Pequeñas <span className="font-serif text-amber-200 tracking-wide">Obras de Arte</span></h2>
                  <p className="text-xl text-stone-400 font-light leading-relaxed">
                    Cada bombón es una explosión de sabor. Cuidamos cada detalle desde la selección de la fruta hasta el temperado del chocolate, creando joyas comestibles inigualables.
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

      {/* Contact Section */}
      <section className="py-32 bg-white px-6">
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
          <div className="bg-stone-50 p-8 sm:p-12 rounded-[2rem] border border-stone-100 shadow-xl">
            <ContactForm productName="Bombones Rellenos" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProductComponent;
