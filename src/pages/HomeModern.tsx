import { motion } from 'framer-motion';
import HeroSlider from '@/components/Home/HeroSlider';
import LiveSection from '@/components/Home/LiveSection';
import SportsSection from '@/components/Home/SportsSection';
import PromotionsSection from '@/components/Home/PromotionsSection';
import SidebarSports from '@/components/Layout/SidebarSports';
import BetSlipModern from '@/components/BetSlip/BetSlipModern';
import { FiTrendingUp, FiUsers, FiAward, FiShield, FiLock, FiZap, FiTarget, FiArrowRight } from 'react-icons/fi';
import { useModalStore } from '@/store/useModalStore';

/**
 * Página principal moderna con todas las secciones
 * Incluye Hero slider, deportes, eventos en vivo, promociones y estadísticas
 */
const HomeModern = () => {
  const { openRegisterModal } = useModalStore();

  const stats = [
    { icon: FiUsers, value: '500K+', label: 'Usuarios activos', accent: 'from-yellow-500/20 text-yellow-400' },
    { icon: FiTrendingUp, value: '$2M+', label: 'Pagos diarios', accent: 'from-primary-500/25 text-primary-300' },
    { icon: FiAward, value: '10K+', label: 'Eventos al mes', accent: 'from-secondary-500/25 text-secondary-300' },
    { icon: FiShield, value: '100%', label: 'Seguro y confiable', accent: 'from-cyan-400/20 text-cyan-300' },
  ];

  const trust = [
    {
      icon: FiLock,
      title: '100% Seguro',
      text: 'Tus datos y transacciones protegidos con encriptación de última generación.',
      accent: 'text-yellow-400 bg-yellow-500/10',
    },
    {
      icon: FiZap,
      title: 'Retiros Rápidos',
      text: 'Recibe tus ganancias en menos de 24 horas con múltiples métodos de pago.',
      accent: 'text-primary-300 bg-primary-500/15',
    },
    {
      icon: FiTarget,
      title: 'Mejores Cuotas',
      text: 'Las cuotas más competitivas del mercado en todos los deportes.',
      accent: 'text-secondary-300 bg-secondary-500/15',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="w-full container mx-auto px-0 md:px-4 md:pt-4 max-w-[1800px]">
        <HeroSlider />
      </section>

      {/* Layout con 3 columnas: deportes | contenido | boleto */}
      <div className="flex max-w-[1800px] mx-auto">
        {/* Sidebar izquierda - Deportes */}
        <aside className="hidden lg:block w-80 flex-shrink-0 pl-4 pt-6">
          <div className="sticky top-32 max-h-[calc(100vh-9rem)] rounded-2xl overflow-hidden border border-white/10 bg-dark-900/60 backdrop-blur-md">
            <SidebarSports alwaysShowDesktop={true} />
          </div>
        </aside>

        {/* Contenido central */}
        <div className="flex-1 min-w-0">
          {/* Estadísticas */}
          <section className="pt-8 pb-2">
            <div className="px-4">
              <div className="grid grid-cols-2 2xl:grid-cols-4 gap-3 md:gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="relative overflow-hidden surface-card p-4 md:p-5 flex items-center space-x-4"
                  >
                    <div className={`w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br ${stat.accent.split(' ')[0]} to-transparent border border-white/10 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.accent.split(' ')[1]}`} />
                    </div>
                    <div>
                      <div className="font-display text-2xl md:text-3xl font-extrabold text-white leading-none">
                        {stat.value}
                      </div>
                      <div className="text-xs text-dark-300 mt-1">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Eventos en Vivo */}
          <LiveSection />

          {/* Deportes Disponibles */}
          <SportsSection />

          {/* Promociones */}
          <PromotionsSection />

          {/* Sección de Confianza */}
          <section className="py-16">
            <div className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="section-title text-3xl md:text-4xl text-white mb-3">
                  ¿Por qué elegir <span className="text-gradient">WingoSports</span>?
                </h2>
                <p className="text-dark-300 max-w-2xl mx-auto">
                  La plataforma de apuestas deportivas más confiable y segura del mercado.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-5">
                {trust.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="surface-card p-7 hover:border-white/20"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.accent}`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-dark-300 text-sm leading-relaxed">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="px-4 pb-16">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary-700 via-primary-800 to-dark-900 p-8 md:p-14">
              <div className="absolute inset-0 grid-pattern opacity-60" />
              <div className="absolute -top-24 -right-16 w-96 h-96 bg-yellow-400/25 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-secondary-500/25 rounded-full blur-3xl" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
              >
                <div className="max-w-xl">
                  <span className="badge-live mb-4">
                    <span className="live-dot" /> Oferta de bienvenida
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
                    Comienza a ganar con hasta <span className="text-gradient">$500</span> de bono
                  </h2>
                  <p className="text-dark-100 text-lg">
                    Regístrate en segundos y duplica tu primer depósito.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={openRegisterModal}
                    className="btn-neon px-8 py-4 text-lg flex items-center justify-center space-x-2"
                  >
                    <span>Registrarse gratis</span>
                    <FiArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="btn-ghost px-8 py-4 text-lg"
                  >
                    Ver eventos en vivo
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>

        {/* Sidebar derecha - Boleto */}
        <aside className="hidden lg:block w-96 flex-shrink-0 pr-4 pt-6">
          <div className="sticky top-32">
            <BetSlipModern />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomeModern;
