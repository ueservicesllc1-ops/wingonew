import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGift, FiTrendingUp, FiUsers, FiPercent, FiArrowRight } from 'react-icons/fi';

/**
 * Sección de promociones con tarjetas animadas
 */
const PromotionsSection = () => {
  const promociones = [
    {
      id: 1,
      title: 'Bono de Bienvenida',
      description: 'Duplica tu primer depósito hasta $500',
      icon: FiGift,
      color: 'from-primary-500 to-primary-800',
      glow: 'bg-primary-500/40',
      badge: 'NUEVO',
      terms: 'T&C aplican',
    },
    {
      id: 2,
      title: 'Cashback Semanal',
      description: 'Recupera hasta 10% de tus pérdidas',
      icon: FiPercent,
      color: 'from-yellow-500 to-cyan-500',
      glow: 'bg-yellow-500/40',
      badge: 'POPULAR',
      terms: 'Cada semana',
    },
    {
      id: 3,
      title: 'Apuesta sin Riesgo',
      description: 'Tu primera apuesta es gratis hasta $100',
      icon: FiTrendingUp,
      color: 'from-secondary-500 to-orange-500',
      glow: 'bg-secondary-500/40',
      badge: 'HOT',
      terms: 'Nuevos usuarios',
    },
    {
      id: 4,
      title: 'Refiere y Gana',
      description: 'Obtén $50 por cada amigo referido',
      icon: FiUsers,
      color: 'from-fuchsia-500 to-primary-600',
      glow: 'bg-fuchsia-500/40',
      badge: 'LIMITADO',
      terms: 'Sin límite',
    },
  ];

  return (
    <section className="py-12">
      <div className="px-4">
        {/* Título de la sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="section-title text-2xl md:text-3xl text-white mb-2">
              Promociones <span className="text-gradient">exclusivas</span>
            </h2>
            <p className="text-dark-300">Aprovecha nuestras ofertas y maximiza tus ganancias.</p>
          </div>
          <Link
            to="/promotions"
            className="hidden sm:flex items-center space-x-1.5 text-sm font-semibold text-yellow-400 hover:text-yellow-300"
          >
            <span>Ver todas</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Grid de promociones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5">
          {promociones.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <div className="relative overflow-hidden surface-card h-full hover:border-white/25">
                {/* Cabecera con gradiente */}
                <div className={`h-36 bg-gradient-to-br ${promo.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 grid-pattern opacity-50" />
                  <div className={`absolute -top-12 -right-12 w-44 h-44 rounded-full ${promo.glow} blur-2xl`} />
                  <promo.icon className="absolute -bottom-5 -right-3 w-32 h-32 text-white/15 group-hover:text-white/25 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500" />

                  <span className="absolute top-4 left-4 px-3 py-1 bg-black/35 backdrop-blur-md border border-white/20 text-white text-[10px] font-extrabold tracking-widest rounded-full">
                    {promo.badge}
                  </span>

                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                    <promo.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-5 space-y-3">
                  <h3 className="font-display text-lg font-bold text-white">{promo.title}</h3>
                  <p className="text-dark-300 text-sm leading-relaxed">{promo.description}</p>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-dark-400">{promo.terms}</span>
                    <Link
                      to="/promotions"
                      className="flex items-center space-x-1 text-sm font-bold text-yellow-400 group-hover:text-yellow-300"
                    >
                      <span>Reclamar</span>
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;
