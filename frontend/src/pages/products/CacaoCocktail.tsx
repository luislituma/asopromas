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
    title: 'Cóctel de Cacao 12° | ASOPROMAS',
    description: 'Bebida suave, dulce y refrescante de 12 grados.',
    keywords: 'cóctel cacao, bebida refrescante',
    url: '/products/cocoa-cocktail',
  });

  const features = [
    { icon: <Award />, title: "12 Grados de Suavidad", desc: "El equilibrio perfecto entre dulzor y cuerpo ligero." },
    { icon: <Leaf />, title: "Ingredientes Naturales", desc: "Elaborado con derivados directos del cacao de fino aroma." },
    { icon: <Star />, title: "Sabor Refrescante", desc: "Disfrútalo muy frío para revelar sus notas tropicales ocultas." },
    { icon: <Heart />, title: "Artesanal", desc: "Embotellado en origen, apoyando a nuestras comunidades." }
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
          <p className="text-chocolate-400 font-medium tracking-[0.3em] uppercase text-xs mb-8">COLECCION LICORES</p>
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-light text-chocolate-950 mb-8 leading-none tracking-tight">
            Cóctel de <br />
            <span className="font-medium font-serif text-chocolate-800 tracking-wide">Cacao</span>
          </h1>
          <p className="text-xl sm:text-2xl text-stone-500 font-light max-w-2xl mx-auto">
            Bebida suave, dulce y refrescante de 12 grados.
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
                  src="/assets/images/products/Coctel-1.jpg"
                  alt="Cóctel de Cacao"
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
                  <h2 className="text-4xl font-light text-white mb-6">El Brindis de la <span className="font-serif text-amber-200 tracking-wide">Amazonía</span></h2>
                  <p className="text-xl text-stone-400 font-light leading-relaxed">
                    Nuestra alternativa refrescante, ideal para tardes calurosas o para compartir en ocasiones especiales. Suave al paladar y lleno de tradición.
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
            <ContactForm productName="Cóctel de Cacao 12°" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProductComponent;
