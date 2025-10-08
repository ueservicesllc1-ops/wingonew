import { motion } from 'framer-motion';
import HeroSlider from '@/components/Home/HeroSlider';
import LiveSection from '@/components/Home/LiveSection';
import SportsSection from '@/components/Home/SportsSection';
import PromotionsSection from '@/components/Home/PromotionsSection';
import SidebarSports from '@/components/Layout/SidebarSports';
import BetSlipModern from '@/components/BetSlip/BetSlipModern';
import { FiTrendingUp, FiUsers, FiAward, FiShield } from 'react-icons/fi';
import { useModalStore } from '@/store/useModalStore';

/**
 * Página principal moderna con todas las secciones
 * Incluye Hero slider, deportes, eventos en vivo, promociones y estadísticas
 */
const HomeModern = () => {
  const { openRegisterModal } = useModalStore();
  
  const stats = [
    {
      icon: FiUsers,
      value: '500K+',
      label: 'Usuarios Activos',
      color: 'text-yellow-400',
    },
    {
      icon: FiTrendingUp,
      value: '$2M+',
      label: 'Pagos Diarios',
      color: 'text-yellow-500',
    },
    {
      icon: FiAward,
      value: '10K+',
      label: 'Eventos Mensuales',
      color: 'text-yellow-600',
    },
    {
      icon: FiShield,
      value: '100%',
      label: 'Seguro y Confiable',
      color: 'text-yellow-300',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner - FULL WIDTH */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* Layout con 3 columnas: deportes | contenido | boleto */}
      <div className="flex">
        {/* Sidebar izquierda - Deportes */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-32">
            <SidebarSports alwaysShowDesktop={true} />
          </div>
        </aside>

        {/* Contenido central */}
        <div className="flex-1">
        {/* Estadísticas */}
        <section className="py-12 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 bg-black/50 rounded-xl border border-yellow-600/30 hover:border-yellow-500 transition-all"
              >
                <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                <div className={`text-3xl md:text-4xl font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-yellow-200">{stat.label}</div>
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
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Por qué elegir <span className="text-gradient">WingoSports</span>?
            </h2>
            <p className="text-yellow-200 text-lg mb-12">
              Somos la plataforma de apuestas deportivas más confiable y segura del mercado
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-black/50 rounded-xl border border-yellow-600/30"
              >
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-yellow-300 mb-2">100% Seguro</h3>
                <p className="text-yellow-200 text-sm">
                  Tus datos y transacciones están protegidos con encriptación de última generación
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 bg-black/50 rounded-xl border border-yellow-600/30"
              >
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-yellow-300 mb-2">Retiros Rápidos</h3>
                <p className="text-yellow-200 text-sm">
                  Procesa tus ganancias en menos de 24 horas con múltiples métodos de pago
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-6 bg-black/50 rounded-xl border border-yellow-600/30"
              >
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-yellow-300 mb-2">Mejores Cuotas</h3>
                <p className="text-yellow-200 text-sm">
                  Ofrecemos las cuotas más competitivas del mercado en todos los deportes
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 to-yellow-700 relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-black"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¡Comienza a Ganar Hoy!
            </h2>
            <p className="text-xl mb-8 text-black/80 max-w-2xl mx-auto">
              Regístrate ahora y obtén tu bono de bienvenida de hasta $500
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openRegisterModal}
                className="px-8 py-4 bg-black text-yellow-300 rounded-xl font-bold text-lg shadow-2xl hover:shadow-yellow-500/50 transition-all"
              >
                Registrarse Gratis
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black/20 backdrop-blur-md border-2 border-black text-black rounded-xl font-bold text-lg hover:bg-black/30 transition-all"
              >
                Ver Eventos en Vivo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
        </div>

        {/* Sidebar derecha - Boleto */}
        <aside className="hidden lg:block w-96 flex-shrink-0">
          <div className="sticky top-32 p-4">
            <BetSlipModern />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomeModern;
