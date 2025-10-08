import { motion } from 'framer-motion';
import { FiCheckCircle, FiTarget, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

/**
 * Componente que explica cómo apostar paso a paso
 * Diseño elegante con animaciones y colores dorado/negro
 */
const HowToBet = () => {
  const steps = [
    {
      id: 1,
      icon: FiTarget,
      title: "Selecciona tu Evento",
      description: "Navega por los deportes y encuentra el evento que te interesa. Haz clic en las cuotas que quieres apostar.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    },
    {
      id: 2,
      icon: FiCheckCircle,
      title: "Revisa tu Boleto",
      description: "Tu selección aparecerá en el boleto lateral. Verifica los detalles del evento y las cuotas seleccionadas.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30"
    },
    {
      id: 3,
      icon: FiDollarSign,
      title: "Ingresa tu Apuesta",
      description: "Escribe el monto que deseas apostar en el campo correspondiente. El boleto calculará automáticamente tus ganancias potenciales.",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30"
    },
    {
      id: 4,
      icon: FiTrendingUp,
      title: "¡Confirma tu Apuesta!",
      description: "Da clic en 'Apostar' para confirmar. ¡Listo! Tu apuesta estará registrada y podrás seguirla en 'Mis Apuestas'.",
      color: "from-pink-500 to-purple-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/30"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Cómo <span className="text-gradient">Apostar</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Es muy fácil. Sigue estos simples pasos y comienza a ganar con tus deportes favoritos
          </p>
        </motion.div>

        {/* Pasos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Línea conectora (excepto en el último) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-yellow-500/50 to-transparent z-0" />
              )}

              {/* Card del paso */}
              <div className={`relative z-10 ${step.bgColor} ${step.borderColor} border-2 rounded-2xl p-6 h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-yellow-500/20`}>
                {/* Número del paso */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg">
                  {step.id}
                </div>

                {/* Icono */}
                <div className="mb-6 flex justify-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Contenido */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Listo para empezar?
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Regístrate ahora y obtén tu bono de bienvenida para comenzar a apostar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-black px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-yellow-500/30 transition-all duration-300"
              >
                Registrarse Gratis
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black/50 border-2 border-yellow-500 text-yellow-300 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500/10 transition-all duration-300"
              >
                Ver Eventos en Vivo
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tips adicionales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Apuestas Múltiples",
              description: "Combina varios eventos en una sola apuesta para multiplicar tus ganancias",
              icon: "🎯"
            },
            {
              title: "Cuotas en Tiempo Real",
              description: "Las cuotas se actualizan constantemente según el desarrollo del evento",
              icon: "⚡"
            },
            {
              title: "Seguimiento en Vivo",
              description: "Monitorea tus apuestas en tiempo real desde 'Mis Apuestas'",
              icon: "📊"
            }
          ].map((tip, index) => (
            <div
              key={index}
              className="bg-black/30 border border-gray-700 rounded-xl p-6 text-center hover:border-yellow-500/30 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{tip.icon}</div>
              <h4 className="text-lg font-bold text-white mb-2">{tip.title}</h4>
              <p className="text-gray-400 text-sm">{tip.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowToBet;
