import { type FC } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Globe, Leaf, Award } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';
import usdaLogo from '../../assets/images/certifications/certificacion-usda.jpg';
import orgEcuadorLogo from '../../assets/images/certifications/certificacion-organica-ecuador.png';
import bpaLogo from '../../assets/images/certifications/bpa.jpg';
import euLogo from '../../assets/images/certifications/certificacion-uue.png';

const CERTS = [
  {
    id: 'usda',
    logo: usdaLogo,
    name: 'USDA Organic',
    entity: 'U.S. Department of Agriculture',
    entityShort: 'USDA — EE.UU.',
    validity: 'Vigente hasta 2027',
    validityColor: 'bg-green-50 text-green-700',
    icon: <Award className="w-6 h-6" />,
    iconBg: 'bg-[#2B4D3F]/10 text-[#2B4D3F]',
    market: 'Norteamérica · Mercados premium globales',
    description:
      'El sello USDA Organic es el estándar más reconocido a nivel mundial para producción orgánica certificada. Garantiza que nuestro cacao se cultiva sin pesticidas sintéticos, herbicidas, fertilizantes químicos ni organismos genéticamente modificados, bajo un sistema de producción que protege los recursos naturales.',
    guarantees: [
      'Producción 100% libre de agroquímicos sintéticos',
      'Suelo agrícola gestionado bajo principios orgánicos',
      'Sin semillas ni organismos genéticamente modificados (OGM)',
      'Inspección y auditoría anual por entidad acreditada',
      'Acceso al mercado norteamericano de productos orgánicos',
    ],
  },
  {
    id: 'organica-ec',
    logo: orgEcuadorLogo,
    name: 'Certificación Orgánica Ecuador',
    entity: 'Agencia de Regulación y Control Fitosanitario',
    entityShort: 'Agrocalidad — Ecuador',
    validity: 'Vigente 2026',
    validityColor: 'bg-green-50 text-green-700',
    icon: <Leaf className="w-6 h-6" />,
    iconBg: 'bg-[#7A9E3B]/10 text-[#7A9E3B]',
    market: 'Ecuador · Exportación regional',
    description:
      'Certificación emitida por Agrocalidad, la autoridad nacional de sanidad agropecuaria del Ecuador. Avala que los procesos de producción, cosecha, postcosecha y manejo de nuestro cacao cumplen la normativa ecuatoriana de agricultura orgánica, constituyendo la base legal indispensable para la exportación de cacao orgánico certificado desde el país.',
    guarantees: [
      'Cumplimiento de la normativa orgánica ecuatoriana vigente',
      'Sistema de producción documentado y auditable',
      'Registro de insumos permitidos y prohibidos',
      'Habilitación legal para exportar cacao orgánico',
      'Respaldo de Agrocalidad como autoridad competente nacional',
    ],
  },
  {
    id: 'bpa',
    logo: bpaLogo,
    name: 'Buenas Prácticas Agrícolas',
    entity: 'Agencia de Regulación y Control Fitosanitario',
    entityShort: 'Agrocalidad — Ecuador',
    validity: 'Vigente 2026',
    validityColor: 'bg-amber-50 text-amber-700',
    icon: <ShieldCheck className="w-6 h-6" />,
    iconBg: 'bg-[#C45A28]/10 text-[#C45A28]',
    market: 'Ecuador · Exigido por clientes internacionales',
    description:
      'Las BPA son un conjunto de principios, normas y recomendaciones técnicas que aseguran la inocuidad, higiene y sostenibilidad en toda la cadena de producción. Esta certificación evalúa nuestras fincas, el manejo del cultivo, la postcosecha y las condiciones del trabajador agrícola, verificando que cada etapa cumple estándares de seguridad alimentaria y respeto ambiental.',
    guarantees: [
      'Inocuidad y seguridad alimentaria en campo y postcosecha',
      'Gestión responsable del agua, suelo y biodiversidad',
      'Condiciones dignas y seguras para los productores',
      'Registros de campo auditables: bitácoras, insumos, actividades',
      'Requisito previo para exportar a mercados europeos y asiáticos',
    ],
  },
  {
    id: 'ue',
    logo: euLogo,
    name: 'Certificación Unión Europea',
    entity: 'Reglamento (UE) 2018/848 — Producción Ecológica',
    entityShort: 'Unión Europea',
    validity: 'Vigente 2026',
    validityColor: 'bg-blue-50 text-blue-700',
    icon: <Globe className="w-6 h-6" />,
    iconBg: 'bg-blue-500/10 text-blue-700',
    market: '27 países de la Unión Europea',
    description:
      'Esta certificación acredita que nuestro cacao cumple con el Reglamento Europeo de Producción Ecológica (EU 2018/848), el más exigente del mundo en materia de agricultura orgánica. Además, a partir de julio de 2026 el Reglamento EUDR exige que todo cacao que ingrese a la UE sea trazable hasta la parcela de origen y esté libre de deforestación — requisito para el cual ASOPROMAS ya dispone de la geolocalización de fincas y lotes necesaria.',
    guarantees: [
      'Cumplimiento del Reglamento EU 2018/848 de producción ecológica',
      'Habilitación para comercializar con el sello "ecológico" europeo',
      'Trazabilidad hasta parcela (lote georeferenciado) exigida por EUDR',
      'Libre de deforestación: fincas verificadas con coordenadas GPS',
      'Acceso a los 27 mercados de la Unión Europea sin restricciones',
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1 },
  }),
};

const Certifications: FC = () => {
  useSEO({
    title: 'Certificaciones | ASOPROMAS',
    description:
      'Conoce los avales internacionales de ASOPROMAS: USDA Organic, Orgánico Ecuador, BPA y Certificación UE — garantía de cacao fino de aroma producido con los más altos estándares.',
    keywords: 'certificaciones cacao, USDA Organic, BPA, cacao orgánico Ecuador, EUDR, certificación UE',
    url: '/about/certifications',
  });

  return (
    <div className="min-h-screen bg-asop-cream font-sans text-asop-dark">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 px-6 bg-asop-deep overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #7A9E3B 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 text-asop-cert font-medium tracking-[0.25em] uppercase text-xs mb-6">
            <ShieldCheck className="w-4 h-4" />
            Calidad Verificada
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-white mb-6 leading-tight">
            Nuestros{' '}
            <span className="font-serif font-medium tracking-wide text-asop-cert">
              Avales
            </span>
          </h1>
          <p className="text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
            Cada sello certifica el compromiso de ASOPROMAS con la excelencia orgánica, la sostenibilidad ambiental y la trazabilidad que exigen los mercados más exigentes del mundo.
          </p>
        </motion.div>

        {/* Logos overview en el hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 max-w-3xl mx-auto mt-14 grid grid-cols-4 gap-5"
        >
          {CERTS.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-brand-divider rounded-2xl p-6 flex items-center justify-center aspect-square shadow-sm"
            >
              <img src={c.logo} alt={c.name} className="max-h-20 max-w-full object-contain" />
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Certificaciones Detalladas ────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          {CERTS.map((cert, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.article
                key={cert.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, margin: '-80px' }}
                className="bg-white rounded-3xl border border-brand-divider shadow-sm overflow-hidden"
              >
                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                  {/* Logo panel */}
                  <div className="md:w-2/5 bg-asop-cream flex flex-col items-center justify-center gap-6 p-12 md:p-16 border-b md:border-b-0 border-brand-divider">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-brand-divider w-full max-w-[220px] aspect-square flex items-center justify-center">
                      <img
                        src={cert.logo}
                        alt={cert.name}
                        className="max-h-28 max-w-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-asop-dark/40 uppercase tracking-widest font-medium mb-1">
                        Entidad certificadora
                      </p>
                      <p className="text-sm font-medium text-asop-green">
                        {cert.entityShort}
                      </p>
                    </div>
                  </div>

                  {/* Content panel */}
                  <div className="md:w-3/5 p-10 md:p-14 flex flex-col justify-center">

                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cert.iconBg}`}>
                        {cert.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-medium text-asop-deep leading-tight">
                          {cert.name}
                        </h2>
                        <p className="text-sm text-asop-dark/50 font-light mt-0.5">
                          {cert.entity}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cert.validityColor}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> {cert.validity}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-asop-green/10 text-asop-green">
                        <Globe className="w-3.5 h-3.5" /> {cert.market}
                      </span>
                    </div>

                    <p className="text-asop-dark/70 font-light leading-relaxed mb-8 text-base">
                      {cert.description}
                    </p>

                    <div>
                      <p className="text-xs font-semibold text-asop-cert uppercase tracking-widest mb-4">
                        Lo que garantiza
                      </p>
                      <ul className="space-y-2.5">
                        {cert.guarantees.map((g) => (
                          <li key={g} className="flex gap-3 items-start">
                            <CheckCircle2 className="w-4 h-4 text-asop-cert shrink-0 mt-0.5" />
                            <span className="text-sm text-asop-dark/70 font-light leading-snug">{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ── Banner EUDR ──────────────────────────────── */}
      <section className="py-20 px-6 bg-asop-deep relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #7A9E3B 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 text-asop-cert font-medium tracking-[0.25em] uppercase text-xs mb-5">
            <ShieldCheck className="w-4 h-4" />
            Compromiso EUDR
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-5">
            Listos para el{' '}
            <span className="font-serif font-medium tracking-wide text-asop-cert">
              Reglamento Europeo de Deforestación
            </span>
          </h2>
          <p className="text-white/60 font-light leading-relaxed text-lg max-w-3xl mx-auto">
            El EUDR, obligatorio desde julio de 2026 para exportar a la Unión Europea, exige que el cacao sea trazable hasta la parcela exacta de origen y provenga de tierras libres de deforestación. ASOPROMAS cuenta con la geolocalización GPS de todas las fincas y lotes de sus socios, cumpliendo este requisito antes de que sea exigido.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-left">
            {[
              { label: '~200 fincas', sub: 'georeferenciadas con coordenadas GPS' },
              { label: 'Lote a lote', sub: 'trazabilidad desde la parcela hasta la exportación' },
              { label: 'Julio 2026', sub: 'cumplimiento anticipado del Reglamento EUDR' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <p className="text-2xl font-medium text-asop-cert mb-1">{item.label}</p>
                <p className="text-sm text-white/50 font-light leading-snug">{item.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Certifications;
