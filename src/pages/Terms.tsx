import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiShield, FiFileText } from 'react-icons/fi';

/**
 * Página de Términos y Condiciones
 * Contenido legal completo para la plataforma de apuestas
 */
const Terms = () => {
  const sections = [
    {
      id: 1,
      title: "1. Aceptación de los Términos",
      icon: FiCheckCircle,
      content: [
        "Al acceder y utilizar WingoSports, usted acepta estar sujeto a estos Términos y Condiciones, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de todas las leyes locales aplicables.",
        "Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.",
        "El uso continuado de la plataforma constituye la aceptación de cualquier modificación a estos términos."
      ]
    },
    {
      id: 2,
      title: "2. Requisitos de Elegibilidad",
      icon: FiShield,
      content: [
        "Debe tener al menos 18 años de edad o la mayoría de edad legal en su jurisdicción para utilizar nuestros servicios.",
        "Es su responsabilidad asegurarse de que las apuestas en línea sean legales en su jurisdicción.",
        "Los empleados de WingoSports y sus familiares directos no pueden participar en apuestas en la plataforma.",
        "Nos reservamos el derecho de solicitar verificación de edad e identidad en cualquier momento."
      ]
    },
    {
      id: 3,
      title: "3. Registro de Cuenta",
      icon: FiFileText,
      content: [
        "Solo se permite una cuenta por persona, hogar, dirección IP o dispositivo.",
        "Debe proporcionar información precisa, actual y completa durante el proceso de registro.",
        "Es su responsabilidad mantener la confidencialidad de su contraseña y cuenta.",
        "Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.",
        "Nos reservamos el derecho de suspender o cerrar cuentas que violen estos términos."
      ]
    },
    {
      id: 4,
      title: "4. Depósitos y Retiros",
      icon: FiFileText,
      content: [
        "Todos los depósitos deben realizarse en la moneda especificada en su cuenta.",
        "El monto mínimo de depósito es de $10 USD o equivalente.",
        "Los retiros están sujetos a verificación de identidad y pueden tardar hasta 24-72 horas en procesarse.",
        "El monto mínimo de retiro es de $20 USD o equivalente.",
        "Nos reservamos el derecho de solicitar documentación adicional antes de procesar retiros.",
        "Las tarifas de procesamiento pueden aplicarse según el método de pago utilizado."
      ]
    },
    {
      id: 5,
      title: "5. Reglas de Apuestas",
      icon: FiFileText,
      content: [
        "Todas las apuestas son definitivas una vez confirmadas y no pueden ser canceladas o modificadas.",
        "Las cuotas pueden cambiar en cualquier momento antes de que se confirme la apuesta.",
        "Las apuestas en eventos en vivo están sujetas a un ligero retraso para prevenir el fraude.",
        "El resultado oficial de un evento será determinado por la fuente oficial designada.",
        "En caso de empate técnico o evento cancelado, las apuestas serán anuladas y los fondos devueltos.",
        "El límite máximo de apuesta varía según el evento y puede ser modificado sin previo aviso.",
        "Las apuestas realizadas con fondos de bonificación están sujetas a requisitos de apuesta específicos."
      ]
    },
    {
      id: 6,
      title: "6. Bonificaciones y Promociones",
      icon: FiFileText,
      content: [
        "Todas las bonificaciones están sujetas a términos y condiciones específicos.",
        "Los requisitos de apuesta deben cumplirse antes de poder retirar fondos de bonificación.",
        "Las bonificaciones no pueden ser transferidas, vendidas o intercambiadas.",
        "Nos reservamos el derecho de modificar o cancelar promociones en cualquier momento.",
        "El abuso de bonificaciones resultará en la confiscación de fondos y cierre de cuenta.",
        "Solo se permite una bonificación de bienvenida por usuario, hogar o dirección IP."
      ]
    },
    {
      id: 7,
      title: "7. Actividades Prohibidas",
      icon: FiAlertTriangle,
      content: [
        "Está prohibido el uso de software automatizado, bots o cualquier sistema de apuestas.",
        "No se permite la colusión, manipulación de resultados o cualquier forma de fraude.",
        "Está prohibido el lavado de dinero o cualquier actividad ilegal.",
        "No se permite compartir cuentas o apostar en nombre de terceros.",
        "El uso de VPN o proxy para ocultar su ubicación está prohibido.",
        "Cualquier intento de manipular el sistema resultará en cierre inmediato de cuenta y confiscación de fondos."
      ]
    },
    {
      id: 8,
      title: "8. Juego Responsable",
      icon: FiShield,
      content: [
        "Promovemos el juego responsable y ofrecemos herramientas de autoexclusión.",
        "Puede establecer límites de depósito, pérdida y tiempo de sesión.",
        "Si cree que tiene un problema con el juego, busque ayuda profesional.",
        "Ofrecemos períodos de enfriamiento y opciones de autoexclusión temporal o permanente.",
        "No alentamos el juego como una forma de resolver problemas financieros."
      ]
    },
    {
      id: 9,
      title: "9. Privacidad y Protección de Datos",
      icon: FiShield,
      content: [
        "Su información personal será tratada de acuerdo con nuestra Política de Privacidad.",
        "Utilizamos encriptación SSL de 256 bits para proteger sus datos.",
        "No compartiremos su información con terceros sin su consentimiento, excepto cuando sea requerido por ley.",
        "Tiene derecho a acceder, corregir o eliminar su información personal.",
        "Conservamos sus datos solo durante el tiempo necesario para cumplir con nuestras obligaciones legales."
      ]
    },
    {
      id: 10,
      title: "10. Limitación de Responsabilidad",
      icon: FiAlertTriangle,
      content: [
        "WingoSports no será responsable por pérdidas indirectas, incidentales o consecuentes.",
        "No garantizamos que el servicio será ininterrumpido o libre de errores.",
        "No somos responsables por problemas técnicos, fallas de internet o interrupciones del servicio.",
        "Su uso de la plataforma es bajo su propio riesgo.",
        "En caso de disputas, nuestra decisión será final y vinculante."
      ]
    },
    {
      id: 11,
      title: "11. Modificaciones de los Términos",
      icon: FiFileText,
      content: [
        "Nos reservamos el derecho de modificar estos términos en cualquier momento.",
        "Las modificaciones entrarán en vigor inmediatamente después de su publicación.",
        "Es su responsabilidad revisar periódicamente estos términos.",
        "El uso continuado del servicio después de las modificaciones constituye su aceptación."
      ]
    },
    {
      id: 12,
      title: "12. Cierre de Cuenta",
      icon: FiAlertTriangle,
      content: [
        "Puede cerrar su cuenta en cualquier momento contactando a soporte.",
        "Nos reservamos el derecho de cerrar cuentas que violen estos términos.",
        "Al cerrar su cuenta, debe retirar todos los fondos disponibles.",
        "Las cuentas inactivas por más de 12 meses pueden estar sujetas a tarifas de mantenimiento.",
        "Los fondos de cuentas cerradas por violación de términos pueden ser confiscados."
      ]
    },
    {
      id: 13,
      title: "13. Resolución de Disputas",
      icon: FiFileText,
      content: [
        "Cualquier disputa debe ser notificada a nuestro equipo de soporte dentro de 14 días.",
        "Intentaremos resolver todas las disputas de manera justa y oportuna.",
        "En caso de no llegar a un acuerdo, la disputa será sometida a arbitraje vinculante.",
        "La ley aplicable será la del país donde WingoSports está registrado.",
        "Nuestra decisión en asuntos de apuestas es final y vinculante."
      ]
    },
    {
      id: 14,
      title: "14. Propiedad Intelectual",
      icon: FiShield,
      content: [
        "Todo el contenido de WingoSports está protegido por derechos de autor.",
        "No puede reproducir, distribuir o modificar nuestro contenido sin permiso.",
        "Las marcas comerciales y logos son propiedad de WingoSports.",
        "El uso no autorizado de nuestra propiedad intelectual está prohibido."
      ]
    },
    {
      id: 15,
      title: "15. Contacto",
      icon: FiFileText,
      content: [
        "Para preguntas sobre estos términos, contáctenos en: soporte@wingosports.com",
        "Nuestro equipo de soporte está disponible 24/7.",
        "Responderemos a todas las consultas dentro de 24-48 horas."
      ]
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
            <FiFileText className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Términos y Condiciones
            </h1>
            <p className="text-xl md:text-2xl text-black/80 mb-4">
              WingoSports - Plataforma de Apuestas Deportivas
            </p>
            <p className="text-lg text-black/70">
              Última actualización: Octubre 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Aviso Importante */}
      <section className="py-8 bg-yellow-500/10 border-y border-yellow-500/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-start space-x-4 bg-black/30 border border-yellow-500/30 rounded-xl p-6">
              <FiAlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Aviso Importante</h3>
                <p className="text-gray-300 leading-relaxed">
                  Por favor, lea estos términos y condiciones cuidadosamente antes de utilizar nuestros servicios. 
                  Al registrarse y utilizar WingoSports, usted acepta estar legalmente vinculado por estos términos. 
                  Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contenido de Términos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-black/30 border border-gray-700 rounded-2xl p-8 hover:border-yellow-500/30 transition-all duration-300"
              >
                {/* Header de la sección */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold text-white pt-2">
                    {section.title}
                  </h2>
                </div>

                {/* Contenido */}
                <div className="space-y-4 ml-16">
                  {section.content.map((paragraph, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <FiCheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                      <p className="text-gray-300 leading-relaxed">
                        {paragraph}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Edad Legal */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🔞</div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Advertencia de Edad Legal
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Debe tener al menos 18 años de edad para utilizar este sitio. 
                Las apuestas pueden ser adictivas. Juegue de manera responsable.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <span>🔒 Juego Seguro</span>
                <span>•</span>
                <span>🛡️ Protección de Menores</span>
                <span>•</span>
                <span>💚 Juego Responsable</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer de la página */}
      <section className="py-12 bg-black/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-gray-400 mb-6">
              Estos términos y condiciones fueron actualizados por última vez el 8 de octubre de 2025.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:soporte@wingosports.com"
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-black px-6 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
              >
                <span>Contactar Soporte</span>
              </a>
              <a
                href="/privacy"
                className="inline-flex items-center justify-center space-x-2 bg-black/50 border-2 border-yellow-500 text-yellow-300 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500/10 transition-all duration-300"
              >
                <span>Política de Privacidad</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
