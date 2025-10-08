import { motion } from 'framer-motion';
import { FiCheckCircle, FiTarget, FiDollarSign, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useModalStore } from '@/store/useModalStore';

/**
 * Página dedicada "Cómo Apostar"
 * Explica el proceso completo de apuestas paso a paso
 */
const HowToBet = () => {
  const { openRegisterModal } = useModalStore();
  
  const steps = [
    {
      id: 1,
      icon: FiTarget,
      title: "Selecciona tu Evento",
      description: "Navega por los deportes y encuentra el evento que te interesa. Haz clic en las cuotas que quieres apostar.",
      details: [
        "Explora la lista de deportes en el menú lateral",
        "Filtra por eventos en vivo o próximos",
        "Revisa las cuotas disponibles para cada resultado",
        "Haz clic en la cuota que desees para agregarla a tu boleto"
      ],
      color: "from-yellow-600 to-yellow-700",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    },
    {
      id: 2,
      icon: FiCheckCircle,
      title: "Revisa tu Boleto",
      description: "Tu selección aparecerá en el boleto lateral. Verifica los detalles del evento y las cuotas seleccionadas.",
      details: [
        "El boleto se abrirá automáticamente en el panel derecho",
        "Verifica el evento, equipos y tipo de apuesta",
        "Revisa la cuota seleccionada",
        "Puedes agregar más eventos para una apuesta múltiple"
      ],
      color: "from-gray-700 to-gray-800",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/30"
    },
    {
      id: 3,
      icon: FiDollarSign,
      title: "Ingresa tu Apuesta",
      description: "Escribe el monto que deseas apostar en el campo correspondiente. El boleto calculará automáticamente tus ganancias potenciales.",
      details: [
        "Ingresa el monto en el campo de apuesta",
        "Verifica tu saldo disponible",
        "El sistema calculará tus ganancias potenciales automáticamente",
        "Revisa el monto total y las ganancias estimadas"
      ],
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    },
    {
      id: 4,
      icon: FiTrendingUp,
      title: "¡Confirma tu Apuesta!",
      description: "Da clic en 'Apostar' para confirmar. ¡Listo! Tu apuesta estará registrada y podrás seguirla en 'Mis Apuestas'.",
      details: [
        "Haz clic en el botón 'Apostar' para confirmar",
        "Recibirás una confirmación inmediata",
        "Tu apuesta aparecerá en 'Mis Apuestas'",
        "Podrás seguir el resultado en tiempo real"
      ],
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    }
  ];

  const tips = [
    {
      title: "Apuestas Simples",
      description: "Apuesta en un solo evento. Ideal para principiantes.",
      icon: "🎯",
      example: "Ejemplo: Apostar $10 a que el Real Madrid gana con cuota 2.50 = Ganancia potencial $25"
    },
    {
      title: "Apuestas Múltiples",
      description: "Combina varios eventos en una sola apuesta para multiplicar tus ganancias.",
      icon: "🎲",
      example: "Ejemplo: 3 eventos con cuotas 1.5, 2.0 y 1.8 = Cuota total 5.4"
    },
    {
      title: "Apuestas en Vivo",
      description: "Apuesta mientras el evento está en curso con cuotas que cambian en tiempo real.",
      icon: "⚡",
      example: "Las cuotas se actualizan según el desarrollo del partido"
    },
    {
      title: "Gestión de Saldo",
      description: "Administra tu dinero de forma responsable. Nunca apuestes más de lo que puedes permitirte perder.",
      icon: "💰",
      example: "Recomendamos apostar máximo el 5% de tu saldo total por apuesta"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 to-yellow-700 relative overflow-hidden">
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-black max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              ¿Cómo Apostar en WingoSports?
            </h1>
            <p className="text-xl md:text-2xl text-black/80 mb-8">
              Guía completa paso a paso para realizar tus apuestas deportivas
            </p>
            <button
              onClick={openRegisterModal}
              className="inline-flex items-center space-x-2 bg-black text-yellow-300 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all duration-300 shadow-lg"
            >
              <span>Comenzar a Apostar</span>
              <FiArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pasos principales */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Proceso de <span className="text-gradient">Apuesta</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sigue estos 4 simples pasos para realizar tu primera apuesta
            </p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className={`${step.bgColor} ${step.borderColor} border-2 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
                  {/* Número del paso */}
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center text-black font-bold text-2xl shadow-2xl">
                    {step.id}
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Contenido */}
                    <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-white">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-300 text-lg mb-6">
                        {step.description}
                      </p>
                      <ul className="space-y-3">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start space-x-3">
                            <FiCheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                            <span className="text-gray-400">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ilustración/Icono grande */}
                    <div className={index % 2 === 0 ? 'order-2' : 'order-1'}>
                      <div className={`w-full h-64 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-2xl`}>
                        <step.icon className="w-32 h-32 text-white opacity-80" />
                      </div>
                    </div>
                  </div>

                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tipos de apuestas y consejos */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tipos de <span className="text-gradient">Apuestas</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Conoce las diferentes formas de apostar y maximiza tus ganancias
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 border-2 border-gray-700 rounded-2xl p-8 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4">{tip.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{tip.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{tip.description}</p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-yellow-200 font-mono">{tip.example}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 to-yellow-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-black max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para Empezar?
            </h2>
            <p className="text-xl text-black/80 mb-8">
              Regístrate ahora y obtén tu bono de bienvenida de hasta $500
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center space-x-2 bg-black text-yellow-300 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all duration-300 shadow-lg"
              >
                <span>Ver Eventos en Vivo</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#"
                className="inline-flex items-center justify-center space-x-2 bg-black/20 border-2 border-black text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-black/30 transition-all duration-300"
              >
                <span>Contáctanos</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowToBet;
