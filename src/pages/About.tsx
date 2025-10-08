import { motion } from 'framer-motion';
import { FiShield, FiTrendingUp, FiUsers, FiAward, FiGlobe, FiHeart, FiCheckCircle, FiTarget } from 'react-icons/fi';
import { MdSportsSoccer } from 'react-icons/md';
import { useModalStore } from '@/store/useModalStore';

/**
 * Página Sobre Nosotros
 * Historia, misión, visión y valores de WingoSports
 */
const About = () => {
  const { openRegisterModal } = useModalStore();
  
  const values = [
    {
      icon: FiShield,
      title: "Confianza",
      description: "Operamos con total transparencia y seguridad. Tus datos y fondos están protegidos con la más alta tecnología de encriptación.",
      color: "from-yellow-600 to-yellow-700"
    },
    {
      icon: FiCheckCircle,
      title: "Integridad",
      description: "Cumplimos con todas las regulaciones internacionales y mantenemos los más altos estándares éticos en todas nuestras operaciones.",
      color: "from-gray-700 to-gray-800"
    },
    {
      icon: FiUsers,
      title: "Respaldo",
      description: "Contamos con un equipo de soporte disponible 24/7 para asistirte en cualquier momento. Tu satisfacción es nuestra prioridad.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: FiHeart,
      title: "Responsabilidad",
      description: "Promovemos el juego responsable y ofrecemos herramientas para que mantengas el control de tus apuestas en todo momento.",
      color: "from-gray-600 to-gray-700"
    },
    {
      icon: FiTrendingUp,
      title: "Innovación",
      description: "Utilizamos tecnología de punta para ofrecerte la mejor experiencia de apuestas con datos en tiempo real y cuotas competitivas.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: FiAward,
      title: "Excelencia",
      description: "Nos esforzamos por ofrecer el mejor servicio del mercado con las cuotas más competitivas y la mayor variedad de eventos deportivos.",
      color: "from-yellow-600 to-orange-600"
    }
  ];

  const milestones = [
    {
      year: "2010",
      title: "Fundación",
      description: "WingoSports nace en Estados Unidos como empresa especializada en recopilación y análisis de datos deportivos."
    },
    {
      year: "2010-2022",
      title: "Crecimiento",
      description: "Durante más de una década, nos consolidamos como líderes en análisis deportivo, trabajando con las principales ligas y equipos."
    },
    {
      year: "2023",
      title: "Nueva Era",
      description: "Expandimos nuestros servicios al mundo de las apuestas deportivas, combinando nuestra experiencia en datos con tecnología de última generación."
    },
    {
      year: "2024-2025",
      title: "Expansión Global",
      description: "Alcanzamos más de 500,000 usuarios activos y nos establecemos como una de las plataformas de apuestas más confiables del mercado."
    }
  ];

  const stats = [
    {
      icon: FiUsers,
      value: "500K+",
      label: "Usuarios Activos",
      color: "text-yellow-400"
    },
    {
      icon: FiGlobe,
      value: "50+",
      label: "Países",
      color: "text-yellow-500"
    },
    {
      icon: MdSportsSoccer,
      value: "10K+",
      label: "Eventos Mensuales",
      color: "text-yellow-600"
    },
    {
      icon: FiAward,
      value: "15+",
      label: "Años de Experiencia",
      color: "text-yellow-300"
    }
  ];

  const features = [
    {
      title: "Datos en Tiempo Real",
      description: "Nuestra experiencia de más de 15 años en análisis deportivo nos permite ofrecer datos precisos y actualizados al instante."
    },
    {
      title: "Cuotas Competitivas",
      description: "Gracias a nuestro profundo conocimiento del mercado, ofrecemos las mejores cuotas en todos los deportes."
    },
    {
      title: "Plataforma Segura",
      description: "Utilizamos encriptación SSL de 256 bits y cumplimos con todos los estándares internacionales de seguridad."
    },
    {
      title: "Pagos Rápidos",
      description: "Procesamos retiros en menos de 24 horas con múltiples métodos de pago disponibles."
    },
    {
      title: "Soporte 24/7",
      description: "Nuestro equipo está disponible las 24 horas del día, los 7 días de la semana para ayudarte."
    },
    {
      title: "Juego Responsable",
      description: "Ofrecemos herramientas de autocontrol y promovemos prácticas de juego responsable."
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
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-black/20 rounded-2xl flex items-center justify-center">
                <MdSportsSoccer className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sobre Nosotros
            </h1>
            <p className="text-xl md:text-2xl text-black/80 mb-4">
              Más de 15 años de experiencia en datos deportivos
            </p>
            <p className="text-lg text-black/70">
              Ahora líderes en apuestas deportivas desde 2023
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-black/30 border border-yellow-500/30 rounded-2xl p-8 md:p-12">
              <h2 className="text-4xl font-bold text-white mb-6 text-center">
                Nuestra <span className="text-gradient">Historia</span>
              </h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  <span className="text-yellow-400 font-bold">WingoSports</span> es una empresa con sede en los <span className="text-white font-semibold">Estados Unidos</span>, 
                  fundada con la visión de revolucionar la industria del análisis deportivo. Durante más de <span className="text-white font-semibold">15 años</span>, 
                  nos hemos dedicado a la recopilación, procesamiento y análisis de datos deportivos de las principales ligas y competiciones del mundo.
                </p>
                <p>
                  Nuestra experiencia nos ha permitido desarrollar algoritmos avanzados y sistemas de análisis que proporcionan información precisa 
                  y en tiempo real sobre eventos deportivos. Trabajamos con las principales organizaciones deportivas, equipos profesionales y 
                  medios de comunicación, consolidándonos como referentes en el sector.
                </p>
                <p>
                  En <span className="text-white font-semibold">2023</span>, decidimos dar un paso adelante y expandir nuestros servicios al mundo de las 
                  <span className="text-yellow-400 font-semibold"> apuestas deportivas</span>. Combinando nuestra vasta experiencia en datos con tecnología 
                  de última generación, creamos una plataforma de apuestas que ofrece las cuotas más competitivas del mercado, respaldadas por 
                  análisis profundos y datos verificados.
                </p>
                <p>
                  Hoy, <span className="text-yellow-400 font-bold">WingoSports</span> es mucho más que una casa de apuestas. Somos un equipo de expertos 
                  apasionados por el deporte que trabaja incansablemente para brindarte la mejor experiencia de apuestas, con 
                  <span className="text-white font-semibold"> confianza, seguridad y respaldo</span> en cada transacción.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              WingoSports en <span className="text-gradient">Números</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/50 border border-gray-700 rounded-xl p-6 text-center hover:border-yellow-500/30 transition-all duration-300"
              >
                <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Línea de Tiempo */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Nuestra <span className="text-gradient">Trayectoria</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Un viaje de más de 15 años de innovación y excelencia
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative mb-12 last:mb-0"
              >
                {/* Línea conectora */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-yellow-500 to-transparent" />
                )}

                <div className="flex items-start space-x-6">
                  {/* Año */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg">
                    {milestone.year.length > 4 ? '...' : milestone.year}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 bg-black/30 border border-gray-700 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">{milestone.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Nuestros <span className="text-gradient">Valores</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Los principios que guían cada una de nuestras acciones
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 border border-gray-700 rounded-2xl p-8 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Por Qué Elegirnos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Por Qué Elegir <span className="text-gradient">WingoSports</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Lo que nos hace diferentes de otras plataformas de apuestas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 border border-gray-700 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300"
              >
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black/30 border border-yellow-500/30 rounded-2xl p-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <FiTarget className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Nuestra Misión</h3>
              <p className="text-gray-300 leading-relaxed">
                Proporcionar la mejor experiencia de apuestas deportivas del mercado, combinando tecnología de punta, 
                datos precisos y un servicio al cliente excepcional. Nos comprometemos a operar con integridad, 
                transparencia y responsabilidad, garantizando la seguridad y satisfacción de nuestros usuarios.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black/30 border border-yellow-500/30 rounded-2xl p-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <FiGlobe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Nuestra Visión</h3>
              <p className="text-gray-300 leading-relaxed">
                Ser la plataforma de apuestas deportivas más confiable y preferida a nivel global, reconocida por 
                nuestra innovación tecnológica, cuotas competitivas y compromiso con el juego responsable. 
                Aspiramos a establecer nuevos estándares de excelencia en la industria.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-yellow-600 to-yellow-700">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-black max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Únete a la Familia WingoSports
            </h2>
            <p className="text-xl mb-8">
              Más de 500,000 usuarios confían en nosotros. ¿Qué esperas para ser parte?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={openRegisterModal}
                className="inline-flex items-center justify-center bg-black text-yellow-300 px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300 shadow-lg"
              >
                Comenzar a Apostar
              </button>
              <a
                href="mailto:soporte@wingosports.com"
                className="inline-flex items-center justify-center bg-black/20 border-2 border-black text-black px-8 py-4 rounded-xl font-bold hover:bg-black/30 transition-all duration-300"
              >
                Contáctanos
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
