import { motion } from 'framer-motion';
import { FiGift, FiTrendingUp, FiUsers, FiPercent } from 'react-icons/fi';

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
      color: 'from-primary-500 to-primary-700',
      badge: 'NUEVO',
      terms: 'T&C Aplican',
    },
    {
      id: 2,
      title: 'Cashback Semanal',
      description: 'Recupera hasta 10% de tus pérdidas',
      icon: FiPercent,
      color: 'from-green-500 to-green-700',
      badge: 'POPULAR',
      terms: 'Cada semana',
    },
    {
      id: 3,
      title: 'Apuesta sin Riesgo',
      description: 'Tu primera apuesta es gratis hasta $100',
      icon: FiTrendingUp,
      color: 'from-secondary-500 to-secondary-700',
      badge: 'HOT',
      terms: 'Nuevos usuarios',
    },
    {
      id: 4,
      title: 'Refiere y Gana',
      description: 'Obtén $50 por cada amigo referido',
      icon: FiUsers,
      color: 'from-purple-500 to-purple-700',
      badge: 'LIMITADO',
      terms: 'Sin límite',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Título de la sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Promociones <span className="text-gradient">Exclusivas</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Aprovecha nuestras increíbles ofertas y maximiza tus ganancias
          </p>
        </motion.div>

        {/* Grid de promociones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promociones.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-dark-800 border border-dark-700 hover:border-primary-500 transition-all duration-300">
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-secondary-500 text-white text-xs font-bold rounded-full shadow-glow-orange">
                    {promo.badge}
                  </span>
                </div>

                {/* Fondo con gradiente */}
                <div className={`h-32 bg-gradient-to-br ${promo.color} relative overflow-hidden`}>
                  {/* Patrón de fondo */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }} />
                  </div>

                  {/* Icono */}
                  <div className="absolute bottom-4 left-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <promo.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Efectos de luz */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-white">{promo.title}</h3>
                  <p className="text-gray-400 text-sm">{promo.description}</p>
                  
                  <div className="pt-4 border-t border-dark-700">
                    <p className="text-xs text-gray-500 mb-3">{promo.terms}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-2 rounded-lg bg-gradient-to-r ${promo.color} text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all`}
                    >
                      Reclamar Ahora
                    </motion.button>
                  </div>
                </div>

                {/* Efecto de brillo al hacer hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-primary text-white rounded-xl font-bold text-lg shadow-glow hover:shadow-glow-orange transition-all"
          >
            Ver Todas las Promociones
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PromotionsSection;
