import { type FC, useState, useEffect } from 'react';
import { Coffee, Heart, Leaf, Star, Clock, Mail } from 'lucide-react';
import logoUrl from '../assets/icons/logo.svg';
import { SITE_CONFIG } from '../config/site';

const ComingSoon: FC = () => {
  // SEO - Actualizar título de la página
  useEffect(() => {
    document.title = 'ASOPROMAS - Próximamente | Chocolate Artesanal de Zamora Chinchipe';
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Muy pronto: nuevo sitio web de ASOPROMAS con chocolate y cacao artesanal de primera calidad directo desde Zamora Chinchipe, Ecuador.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Muy pronto: nuevo sitio web de ASOPROMAS con chocolate y cacao artesanal de primera calidad directo desde Zamora Chinchipe, Ecuador.';
      document.head.appendChild(meta);
    }
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Fecha objetivo: configurada desde el archivo de configuración
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + SITE_CONFIG.LAUNCH_DAYS_FROM_NOW);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 30 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Productos Artesanales",
      description: "Chocolate y cacao de la más alta calidad"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "100% Natural",
      description: "Directo de las plantaciones del Sur de la Amazonia Ecuatoriana"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Certificación Orgánica",
      description: "Apoyando a nuestros productores locales organicos"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Calidad Premium",
      description: "Cacao fino de aroma ecuatoriano"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Fondo con patrón de chocolate */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-600 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-orange-500 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-red-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-amber-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={logoUrl} 
            alt="ASOPROMAS Logo" 
            className="h-20 w-auto mx-auto"
          />
        </div>

        {/* Contenido principal */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            <span className="text-amber-600">Estamos</span>{' '}
            <span className="text-orange-600">Mejorando</span>{' '}
            <span className="text-red-600">Nuestra</span>{' '}
            <span className="text-amber-700">Experiencia</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Muy pronto podrás disfrutar de nuestra nuevo sitio web con 
            todos nuestros productos de <span className="font-semibold text-amber-700">chocolate Premium de origen Ecuatoriano </span> y su mejor cacao
          </p>

          <div className="flex items-center justify-center gap-2 text-gray-500 mb-12">
            <Clock className="w-5 h-5" />
            <span className="text-lg">Lanzamiento estimado</span>
          </div>

          {/* Contador regresivo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
            {[
              { value: timeLeft.days, label: 'Días' },
              { value: timeLeft.hours, label: 'Horas' },
              { value: timeLeft.minutes, label: 'Minutos' },
              { value: timeLeft.seconds, label: 'Segundos' }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
              >
                <div className="text-3xl md:text-4xl font-bold text-amber-700 mb-2">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-gray-600 font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Características */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/80 transition-all duration-300 border border-white/20"
              >
                <div className="text-amber-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Suscripción */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-amber-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">
                ¡Mantente informado!
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Déjanos tu correo y te avisaremos cuando esté listo
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                Notificarme
              </button>
            </div>
          </div>

          {/* Mensaje adicional */}
          <div className="mt-12 text-center">
            <p className="text-gray-500">
              Mientras tanto, puedes contactarnos directamente para pedidos especiales
            </p>
            <div className="mt-4 space-x-4">
              <a 
                href={`mailto:${SITE_CONFIG.CONTACT_EMAIL}`} 
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                {SITE_CONFIG.CONTACT_EMAIL}
              </a>
              <span className="text-gray-300">|</span>
              <a 
                href={`tel:${SITE_CONFIG.CONTACT_PHONE}`} 
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                {SITE_CONFIG.CONTACT_PHONE}
              </a>
            </div>
          </div>
        </div>

        {/* Patrón decorativo inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-100/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default ComingSoon;