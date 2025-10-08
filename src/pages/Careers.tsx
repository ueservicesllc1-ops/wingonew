import { motion } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiDollarSign, FiAward, FiShield, FiGlobe, FiMail, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

/**
 * Página Trabaja con Nosotros / Franquicias
 * Información sobre oportunidades de franquicia y beneficios
 */
const Careers = () => {
  const benefits = [
    {
      icon: FiTrendingUp,
      title: "Modelo de Negocio Probado",
      description: "Más de 15 años de experiencia en la industria con un modelo de negocio exitoso y rentable.",
      color: "from-yellow-600 to-yellow-700"
    },
    {
      icon: FiDollarSign,
      title: "Alta Rentabilidad",
      description: "ROI promedio del 35-45% anual con recuperación de inversión en 18-24 meses.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: FiShield,
      title: "Marca Reconocida",
      description: "Únete a una marca consolidada con más de 500,000 usuarios activos en todo el mundo.",
      color: "from-gray-700 to-gray-800"
    },
    {
      icon: FiUsers,
      title: "Soporte Continuo",
      description: "Capacitación inicial y soporte técnico, operativo y de marketing permanente.",
      color: "from-yellow-700 to-orange-600"
    },
    {
      icon: FiGlobe,
      title: "Tecnología de Punta",
      description: "Plataforma completa con sistema de gestión, análisis de datos y herramientas administrativas.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: FiAward,
      title: "Exclusividad Territorial",
      description: "Protección de zona geográfica exclusiva para maximizar tu potencial de mercado.",
      color: "from-gray-600 to-gray-700"
    }
  ];

  const investmentDetails = [
    {
      category: "Inversión Inicial",
      items: [
        { label: "Tarifa de Franquicia", value: "$10,000 - $40,000 USD" },
        { label: "Capital de Trabajo", value: "$5,000 - $15,000 USD" },
        { label: "Marketing Inicial", value: "$2,000 - $7,000 USD" },
        { label: "Equipamiento", value: "$1,000 - $3,000 USD" }
      ],
      total: "$15,000 - $65,000 USD"
    },
    {
      category: "Costos Operativos Mensuales",
      items: [
        { label: "Regalías", value: "5% de ingresos brutos" },
        { label: "Fondo de Marketing", value: "2% de ingresos brutos" },
        { label: "Soporte Técnico", value: "$500 - $1,000 USD" },
        { label: "Licencias y Software", value: "Incluido" }
      ],
      total: "7% + $500-$1,000 USD"
    }
  ];

  const requirements = [
    "Capital de inversión disponible según el paquete seleccionado",
    "Experiencia en gestión de negocios o emprendimiento",
    "Conocimiento del mercado local y regulaciones de apuestas",
    "Compromiso de tiempo completo para la operación del negocio",
    "Capacidad para contratar y gestionar un equipo de trabajo",
    "Instalaciones comerciales adecuadas (opcional según modelo)",
    "Cumplimiento de requisitos legales y regulatorios locales",
    "Pasión por el servicio al cliente y la industria deportiva"
  ];

  const support = [
    {
      title: "Capacitación Inicial",
      description: "Programa intensivo de 2 semanas cubriendo operaciones, tecnología, marketing y atención al cliente.",
      duration: "2 semanas"
    },
    {
      title: "Soporte Técnico 24/7",
      description: "Equipo dedicado para resolver cualquier problema técnico o de plataforma en tiempo real.",
      duration: "Permanente"
    },
    {
      title: "Marketing y Publicidad",
      description: "Materiales de marketing, campañas digitales y estrategias promocionales probadas.",
      duration: "Continuo"
    },
    {
      title: "Actualizaciones de Sistema",
      description: "Mejoras constantes de plataforma, nuevas funcionalidades y actualizaciones de seguridad.",
      duration: "Automático"
    }
  ];

  const packages = [
    {
      name: "Paquete Básico",
      price: "$15,000 - $25,000",
      description: "Ideal para emprendedores que inician",
      features: [
        "Licencia de franquicia por 2 años",
        "Plataforma web completa",
        "Capacitación inicial básica",
        "Soporte técnico estándar",
        "Material de marketing básico",
        "Panel administrativo",
        "Hasta 5,000 usuarios activos"
      ],
      color: "from-gray-700 to-gray-800"
    },
    {
      name: "Paquete Premium",
      price: "$30,000 - $45,000",
      description: "Para operadores con experiencia",
      features: [
        "Licencia de franquicia por 5 años",
        "Plataforma web y móvil",
        "Capacitación avanzada",
        "Soporte técnico prioritario 24/7",
        "Campaña de marketing inicial",
        "Panel administrativo avanzado",
        "Hasta 20,000 usuarios activos",
        "Exclusividad territorial ampliada"
      ],
      color: "from-yellow-600 to-yellow-700",
      popular: true
    },
    {
      name: "Paquete Master",
      price: "$50,000 - $65,000",
      description: "Máximo potencial de negocio",
      features: [
        "Licencia de franquicia por 10 años",
        "Plataforma completa multi-canal",
        "Capacitación VIP personalizada",
        "Gerente de cuenta dedicado",
        "Campaña de marketing agresiva",
        "Personalización de marca",
        "Usuarios ilimitados",
        "Exclusividad territorial máxima",
        "Derecho a sub-franquiciar"
      ],
      color: "from-yellow-500 to-orange-600"
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
            <FiUsers className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Únete a Nuestra Red
            </h1>
            <p className="text-xl md:text-2xl text-black/80 mb-4">
              Oportunidades de Franquicia WingoSports
            </p>
            <p className="text-lg text-black/70 mb-8">
              Sé parte del éxito con una marca líder en apuestas deportivas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center space-x-2 bg-black text-yellow-300 px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300 shadow-lg"
              >
                <FiMail className="w-5 h-5" />
                <span>Solicitar Información</span>
              </Link>
              <a
                href="#packages"
                className="inline-flex items-center justify-center space-x-2 bg-black/20 border-2 border-black text-black px-8 py-4 rounded-xl font-bold hover:bg-black/30 transition-all duration-300"
              >
                <FiDownload className="w-5 h-5" />
                <span>Ver Paquetes</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Por Qué Elegir Nuestra <span className="text-gradient">Franquicia</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Beneficios exclusivos que garantizan el éxito de tu inversión
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 border border-gray-700 rounded-2xl p-8 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Paquetes de Franquicia */}
      <section id="packages" className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Paquetes de <span className="text-gradient">Franquicia</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Elige el paquete que mejor se adapte a tus objetivos de negocio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-black/30 border-2 rounded-2xl p-8 hover:scale-105 transition-all duration-300 ${
                  pkg.popular ? 'border-yellow-500' : 'border-gray-700 hover:border-yellow-500/30'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-black px-6 py-2 rounded-full font-bold text-sm">
                    MÁS POPULAR
                  </div>
                )}
                
                <div className={`w-16 h-16 bg-gradient-to-r ${pkg.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                  <FiAward className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white text-center mb-2">{pkg.name}</h3>
                <p className="text-gray-400 text-center mb-4">{pkg.description}</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-yellow-400">{pkg.price}</span>
                  <span className="text-gray-400 text-sm block mt-1">USD</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <FiCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/contact"
                  className={`block w-full text-center py-3 rounded-xl font-bold transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-black hover:from-yellow-500 hover:to-yellow-600'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  Solicitar Información
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inversión y Costos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Inversión y <span className="text-gradient">Costos</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transparencia total en la estructura de inversión
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {investmentDetails.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-black/30 border border-gray-700 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6">{detail.category}</h3>
                <div className="space-y-4 mb-6">
                  {detail.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-gray-700">
                      <span className="text-gray-300">{item.label}</span>
                      <span className="text-yellow-400 font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total Estimado:</span>
                    <span className="text-yellow-400 font-bold text-xl">{detail.total}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-8 text-center">
              Requisitos para <span className="text-gradient">Franquiciados</span>
            </h2>
            <div className="bg-black/30 border border-gray-700 rounded-2xl p-8">
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3"
                  >
                    <FiCheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-300 text-lg">{req}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Soporte y Capacitación */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Soporte y <span className="text-gradient">Capacitación</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Te acompañamos en cada paso del camino
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {support.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 border border-gray-700 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">
                    {item.duration}
                  </span>
                </div>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
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
              ¿Listo para Emprender con Nosotros?
            </h2>
            <p className="text-xl mb-8">
              Contáctanos hoy y recibe información detallada sobre nuestras oportunidades de franquicia
            </p>
            <div className="bg-black/20 border-2 border-black rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <FiMail className="w-6 h-6" />
                <span className="text-2xl font-bold">info@wingobet.shop</span>
              </div>
              <p className="text-lg">
                Envíanos un correo con tu información y nos pondremos en contacto contigo en menos de 24 horas
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center space-x-2 bg-black text-yellow-300 px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300 shadow-lg text-lg"
            >
              <FiMail className="w-6 h-6" />
              <span>Enviar Solicitud Ahora</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
