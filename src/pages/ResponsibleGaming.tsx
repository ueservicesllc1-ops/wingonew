import { motion } from 'framer-motion';
import { FiShield, FiHeart, FiAlertTriangle, FiClock, FiDollarSign, FiLock, FiPhone, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

/**
 * Página de Juego Responsable
 * Información sobre juego seguro, señales de advertencia y recursos de ayuda
 */
const ResponsibleGaming = () => {
  const principles = [
    {
      icon: FiHeart,
      title: "El Juego es Entretenimiento",
      description: "Las apuestas deben ser una forma de entretenimiento, no una manera de ganar dinero o resolver problemas financieros.",
      color: "from-gray-700 to-gray-800"
    },
    {
      icon: FiDollarSign,
      title: "Apuesta Solo lo que Puedas Perder",
      description: "Nunca apuestes dinero que necesites para gastos esenciales como renta, comida o facturas.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: FiClock,
      title: "Establece Límites de Tiempo",
      description: "Define cuánto tiempo dedicarás a las apuestas y respeta ese límite. No dejes que interfiera con tu vida diaria.",
      color: "from-yellow-600 to-yellow-700"
    },
    {
      icon: FiLock,
      title: "Usa Nuestras Herramientas",
      description: "Aprovecha los límites de depósito, pérdida y tiempo de sesión que ofrecemos para mantener el control.",
      color: "from-gray-600 to-gray-700"
    }
  ];

  const warningSign = [
    "Apuestas con dinero que no puedes permitirte perder",
    "Mentir a familiares o amigos sobre tus apuestas",
    "Perseguir pérdidas intentando recuperar dinero perdido",
    "Descuidar responsabilidades laborales o familiares",
    "Pedir prestado dinero para apostar",
    "Sentir ansiedad o irritabilidad cuando no puedes apostar",
    "Apostar para escapar de problemas o emociones negativas",
    "Pasar cada vez más tiempo apostando",
    "Intentar sin éxito reducir o detener las apuestas",
    "Problemas financieros debido a las apuestas"
  ];

  const selfAssessment = [
    {
      question: "¿Has intentado ganar de vuelta el dinero que perdiste?",
      description: "Perseguir pérdidas es una señal de advertencia común"
    },
    {
      question: "¿Has mentido sobre cuánto apuestas o has ocultado tus apuestas?",
      description: "El secretismo puede indicar un problema"
    },
    {
      question: "¿Las apuestas han causado problemas en tu vida personal o laboral?",
      description: "El impacto negativo es una señal clara"
    },
    {
      question: "¿Has pedido prestado dinero para apostar?",
      description: "Apostar con dinero prestado es muy riesgoso"
    },
    {
      question: "¿Sientes que no puedes controlar tus apuestas?",
      description: "La pérdida de control requiere atención inmediata"
    }
  ];

  const tools = [
    {
      icon: FiDollarSign,
      title: "Límites de Depósito",
      description: "Establece un límite diario, semanal o mensual de cuánto puedes depositar.",
      action: "Configurar Límite"
    },
    {
      icon: FiDollarSign,
      title: "Límites de Pérdida",
      description: "Define cuánto estás dispuesto a perder en un período determinado.",
      action: "Configurar Límite"
    },
    {
      icon: FiClock,
      title: "Límites de Tiempo",
      description: "Establece cuánto tiempo puedes pasar apostando por sesión.",
      action: "Configurar Límite"
    },
    {
      icon: FiClock,
      title: "Tiempo de Descanso",
      description: "Toma un descanso de 24 horas, 7 días o 30 días de las apuestas.",
      action: "Tomar Descanso"
    },
    {
      icon: FiLock,
      title: "Autoexclusión",
      description: "Bloquea tu cuenta por 6 meses, 1 año o permanentemente.",
      action: "Autoexcluirse"
    }
  ];

  const helpResources = [
    {
      name: "Jugadores Anónimos",
      description: "Grupo de apoyo para personas con problemas de juego",
      phone: "1-800-522-4700",
      website: "www.jugadoresanonimos.org"
    },
    {
      name: "Línea Nacional de Ayuda",
      description: "Consejería confidencial 24/7",
      phone: "1-800-522-4700",
      website: "www.ncpgambling.org"
    },
    {
      name: "BeGambleAware",
      description: "Información y apoyo sobre juego responsable",
      phone: "0808-8020-133",
      website: "www.begambleaware.org"
    },
    {
      name: "GamCare",
      description: "Apoyo gratuito, confidencial y profesional",
      phone: "0808-8020-133",
      website: "www.gamcare.org.uk"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <FiHeart className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Juego Responsable
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              Tu bienestar es nuestra prioridad
            </p>
            <p className="text-lg text-white/80">
              Apostamos por un juego seguro, controlado y consciente
            </p>
          </motion.div>
        </div>
      </section>

      {/* Aviso Importante */}
      <section className="py-8 bg-red-500/10 border-y border-red-500/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-start space-x-4 bg-black/30 border border-red-500/30 rounded-xl p-6">
              <FiAlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">⚠️ Advertencia Importante</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  El juego puede ser adictivo. Si sientes que estás perdiendo el control, busca ayuda inmediatamente. 
                  No apuestes más de lo que puedes permitirte perder. El juego debe ser entretenimiento, no una fuente de ingresos.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-red-400 font-bold">🔞 Solo mayores de 18 años</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-yellow-400 font-bold">📞 Línea de ayuda: 1-800-522-4700</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Principios del Juego Responsable */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Principios del <span className="text-gradient">Juego Responsable</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sigue estas pautas para mantener el juego como una actividad segura y divertida
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {principles.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 border border-gray-700 rounded-2xl p-8 hover:border-green-500/30 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${principle.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <principle.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{principle.title}</h3>
                <p className="text-gray-300 leading-relaxed">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Señales de Advertencia */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Señales de <span className="text-red-400">Advertencia</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Reconoce estas señales que pueden indicar un problema con el juego
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warningSign.map((sign, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 bg-red-900/10 border border-red-700/30 rounded-lg p-4"
                >
                  <FiAlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-300">{sign}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Autoevaluación */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Autoevaluación
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Responde honestamente estas preguntas. Si respondes "Sí" a alguna, considera buscar ayuda
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {selfAssessment.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 border border-gray-700 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-2">{item.question}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-yellow-300 font-semibold mb-4">
                Si respondiste "Sí" a 2 o más preguntas, te recomendamos buscar ayuda profesional.
              </p>
              <a
                href="tel:1-800-522-4700"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-500 hover:to-teal-500 transition-all duration-300"
              >
                <FiPhone className="w-5 h-5" />
                <span>Llamar Línea de Ayuda</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Herramientas de Control */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Herramientas de <span className="text-gradient">Control</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Usa estas herramientas para mantener el control de tus apuestas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 border border-gray-700 rounded-xl p-6 hover:border-green-500/30 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{tool.title}</h3>
                <p className="text-gray-300 mb-4 text-sm">{tool.description}</p>
                <Link
                  to="/profile"
                  className="inline-block bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  {tool.action}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos de Ayuda */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Recursos de <span className="text-green-400">Ayuda</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Organizaciones profesionales que pueden ayudarte
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {helpResources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 border border-gray-700 rounded-xl p-6 hover:border-green-500/30 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-2">{resource.name}</h3>
                <p className="text-gray-300 mb-4">{resource.description}</p>
                <div className="space-y-2">
                  <a
                    href={`tel:${resource.phone}`}
                    className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <FiPhone className="w-5 h-5" />
                    <span className="font-semibold">{resource.phone}</span>
                  </a>
                  <a
                    href={`https://${resource.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <FiMail className="w-5 h-5" />
                    <span>{resource.website}</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-teal-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <FiShield className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">
              Estamos Aquí para Ayudarte
            </h2>
            <p className="text-xl mb-8">
              Si necesitas ayuda o tienes preguntas sobre juego responsable, no dudes en contactarnos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:soporte@wingosports.com"
                className="inline-flex items-center justify-center space-x-2 bg-white text-green-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300"
              >
                <FiMail className="w-5 h-5" />
                <span>Contactar Soporte</span>
              </a>
              <a
                href="tel:1-800-522-4700"
                className="inline-flex items-center justify-center space-x-2 bg-black/20 border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-black/30 transition-all duration-300"
              >
                <FiPhone className="w-5 h-5" />
                <span>Línea de Ayuda 24/7</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ResponsibleGaming;
