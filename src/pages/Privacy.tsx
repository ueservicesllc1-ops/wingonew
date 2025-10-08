import { motion } from 'framer-motion';
import { FiShield, FiLock, FiEye, FiDatabase, FiUserCheck, FiAlertCircle, FiGlobe, FiMail } from 'react-icons/fi';

/**
 * Página de Política de Privacidad
 * Información completa sobre protección de datos y privacidad
 */
const Privacy = () => {
  const sections = [
    {
      id: 1,
      title: "1. Introducción",
      icon: FiShield,
      content: [
        "En WingoSports, nos comprometemos a proteger su privacidad y sus datos personales. Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos su información personal.",
        "Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política.",
        "Esta política cumple con el Reglamento General de Protección de Datos (GDPR) y otras leyes aplicables de protección de datos.",
        "Nos reservamos el derecho de actualizar esta política en cualquier momento. Le notificaremos sobre cambios significativos."
      ]
    },
    {
      id: 2,
      title: "2. Información que Recopilamos",
      icon: FiDatabase,
      content: [
        "Información de registro: nombre completo, fecha de nacimiento, dirección de correo electrónico, número de teléfono, dirección postal, número de identificación (cédula/DNI).",
        "Información financiera: detalles de métodos de pago, historial de transacciones, depósitos y retiros.",
        "Información de la cuenta: nombre de usuario, contraseña (encriptada), preferencias de apuestas, historial de apuestas.",
        "Información técnica: dirección IP, tipo de navegador, sistema operativo, datos de cookies, registros de actividad.",
        "Información de verificación: documentos de identidad, comprobantes de domicilio, fotografías para verificación KYC (Conozca a su Cliente).",
        "Comunicaciones: correos electrónicos, chats de soporte, llamadas telefónicas (pueden ser grabadas)."
      ]
    },
    {
      id: 3,
      title: "3. Cómo Usamos su Información",
      icon: FiUserCheck,
      content: [
        "Procesar su registro y mantener su cuenta activa.",
        "Verificar su identidad y cumplir con requisitos legales de KYC y AML (Anti-Lavado de Dinero).",
        "Procesar depósitos, retiros y transacciones financieras.",
        "Proporcionar nuestros servicios de apuestas deportivas.",
        "Enviar notificaciones importantes sobre su cuenta y transacciones.",
        "Mejorar nuestros servicios y experiencia de usuario.",
        "Detectar y prevenir fraude, lavado de dinero y otras actividades ilegales.",
        "Cumplir con obligaciones legales y regulatorias.",
        "Enviar promociones y ofertas (solo si ha dado su consentimiento).",
        "Realizar análisis estadísticos y de comportamiento de usuarios."
      ]
    },
    {
      id: 4,
      title: "4. Base Legal para el Procesamiento",
      icon: FiLock,
      content: [
        "Ejecución de contrato: necesitamos su información para proporcionar nuestros servicios.",
        "Obligación legal: debemos cumplir con regulaciones de juego, KYC, AML y otras leyes.",
        "Interés legítimo: para prevenir fraude, mejorar servicios y mantener la seguridad.",
        "Consentimiento: para enviar comunicaciones de marketing (puede retirarlo en cualquier momento)."
      ]
    },
    {
      id: 5,
      title: "5. Compartir Información con Terceros",
      icon: FiGlobe,
      content: [
        "Proveedores de servicios: procesadores de pago, proveedores de verificación de identidad, servicios de hosting.",
        "Autoridades regulatorias: cuando sea requerido por ley o para cumplir con licencias de juego.",
        "Organismos de aplicación de la ley: cuando sea legalmente obligatorio o para prevenir actividades ilegales.",
        "Proveedores de análisis: para mejorar nuestros servicios (datos anonimizados).",
        "Socios comerciales: solo con su consentimiento explícito.",
        "NO vendemos su información personal a terceros con fines de marketing.",
        "Todos los terceros están obligados contractualmente a proteger su información."
      ]
    },
    {
      id: 6,
      title: "6. Seguridad de Datos",
      icon: FiShield,
      content: [
        "Utilizamos encriptación SSL/TLS de 256 bits para todas las transmisiones de datos.",
        "Las contraseñas se almacenan con hash y salt utilizando algoritmos seguros.",
        "Acceso restringido a datos personales solo para personal autorizado.",
        "Monitoreo continuo de seguridad y auditorías regulares.",
        "Firewalls y sistemas de detección de intrusiones.",
        "Copias de seguridad regulares y planes de recuperación ante desastres.",
        "Cumplimiento con estándares PCI DSS para datos de tarjetas de pago.",
        "Capacitación regular del personal en seguridad y privacidad de datos."
      ]
    },
    {
      id: 7,
      title: "7. Retención de Datos",
      icon: FiDatabase,
      content: [
        "Conservamos su información personal mientras su cuenta esté activa.",
        "Después del cierre de cuenta, conservamos datos durante el período requerido por ley (generalmente 5-7 años).",
        "Datos financieros y de transacciones: mínimo 5 años para cumplir con regulaciones fiscales y de juego.",
        "Datos de verificación KYC: según lo requieran las autoridades regulatorias.",
        "Registros de comunicaciones: hasta 7 años para resolución de disputas.",
        "Después del período de retención, los datos se eliminan o anonimizan de forma segura."
      ]
    },
    {
      id: 8,
      title: "8. Sus Derechos",
      icon: FiUserCheck,
      content: [
        "Derecho de acceso: puede solicitar una copia de sus datos personales.",
        "Derecho de rectificación: puede corregir información inexacta o incompleta.",
        "Derecho de eliminación: puede solicitar la eliminación de sus datos (sujeto a obligaciones legales).",
        "Derecho de restricción: puede limitar cómo usamos sus datos.",
        "Derecho de portabilidad: puede recibir sus datos en formato estructurado.",
        "Derecho de oposición: puede oponerse al procesamiento de sus datos para ciertos fines.",
        "Derecho a retirar consentimiento: puede retirar su consentimiento para marketing en cualquier momento.",
        "Derecho a presentar queja: puede presentar una queja ante la autoridad de protección de datos.",
        "Para ejercer estos derechos, contáctenos en: privacy@wingosports.com"
      ]
    },
    {
      id: 9,
      title: "9. Cookies y Tecnologías Similares",
      icon: FiEye,
      content: [
        "Utilizamos cookies para mejorar su experiencia y proporcionar funcionalidades.",
        "Cookies esenciales: necesarias para el funcionamiento del sitio (no se pueden desactivar).",
        "Cookies de rendimiento: nos ayudan a entender cómo se usa el sitio.",
        "Cookies funcionales: recuerdan sus preferencias y configuraciones.",
        "Cookies de publicidad: se usan para mostrar anuncios relevantes (con su consentimiento).",
        "Puede gestionar las cookies a través de la configuración de su navegador.",
        "Deshabilitar cookies puede afectar la funcionalidad del sitio.",
        "También usamos píxeles de seguimiento, web beacons y tecnologías similares."
      ]
    },
    {
      id: 10,
      title: "10. Transferencias Internacionales",
      icon: FiGlobe,
      content: [
        "Sus datos pueden ser transferidos y procesados en países fuera de su jurisdicción.",
        "Aseguramos que todas las transferencias cumplan con las leyes de protección de datos aplicables.",
        "Utilizamos cláusulas contractuales estándar aprobadas por la UE cuando sea necesario.",
        "Los servidores están ubicados en centros de datos seguros con certificaciones internacionales.",
        "Todos los proveedores de servicios en el extranjero cumplen con estándares equivalentes de protección."
      ]
    },
    {
      id: 11,
      title: "11. Protección de Menores",
      icon: FiAlertCircle,
      content: [
        "Nuestros servicios están estrictamente prohibidos para menores de 18 años.",
        "No recopilamos intencionalmente información de menores de edad.",
        "Implementamos verificación de edad durante el registro.",
        "Si descubrimos que un menor ha proporcionado información, eliminaremos inmediatamente su cuenta y datos.",
        "Los padres o tutores pueden contactarnos si sospechan que un menor ha usado nuestros servicios.",
        "Cooperamos con organizaciones de protección infantil y autoridades."
      ]
    },
    {
      id: 12,
      title: "12. Marketing y Comunicaciones",
      icon: FiMail,
      content: [
        "Podemos enviarle correos electrónicos promocionales, SMS o notificaciones push si ha dado su consentimiento.",
        "Puede darse de baja de comunicaciones de marketing en cualquier momento.",
        "Cada correo electrónico incluye un enlace de cancelación de suscripción.",
        "También puede gestionar sus preferencias de comunicación en la configuración de su cuenta.",
        "Seguiremos enviando comunicaciones transaccionales importantes incluso si se da de baja del marketing.",
        "No compartimos su información de contacto con terceros para marketing sin su consentimiento."
      ]
    },
    {
      id: 13,
      title: "13. Redes Sociales",
      icon: FiGlobe,
      content: [
        "Puede conectar su cuenta con redes sociales (Facebook, Google, etc.).",
        "Al hacerlo, podemos recibir información básica de su perfil según los permisos que otorgue.",
        "No publicamos en sus redes sociales sin su permiso explícito.",
        "Puede desconectar sus cuentas de redes sociales en cualquier momento.",
        "Las redes sociales tienen sus propias políticas de privacidad que debe revisar."
      ]
    },
    {
      id: 14,
      title: "14. Cambios en la Política",
      icon: FiAlertCircle,
      content: [
        "Nos reservamos el derecho de actualizar esta política en cualquier momento.",
        "Los cambios significativos serán notificados por correo electrónico o mediante aviso en el sitio.",
        "La versión actualizada incluirá la fecha de 'Última actualización'.",
        "Le recomendamos revisar esta política periódicamente.",
        "El uso continuado de nuestros servicios después de cambios constituye su aceptación."
      ]
    },
    {
      id: 15,
      title: "15. Contacto",
      icon: FiMail,
      content: [
        "Para preguntas sobre esta política o sus datos personales, contáctenos:",
        "Email: privacy@wingosports.com",
        "Email de soporte: soporte@wingosports.com",
        "Oficial de Protección de Datos: dpo@wingosports.com",
        "Responderemos a todas las consultas dentro de 30 días.",
        "Para solicitudes urgentes relacionadas con seguridad, contáctenos inmediatamente."
      ]
    }
  ];

  const principles = [
    {
      icon: FiLock,
      title: "Seguridad",
      description: "Encriptación de nivel bancario para proteger sus datos"
    },
    {
      icon: FiShield,
      title: "Transparencia",
      description: "Comunicación clara sobre cómo usamos su información"
    },
    {
      icon: FiUserCheck,
      title: "Control",
      description: "Usted tiene control total sobre sus datos personales"
    },
    {
      icon: FiEye,
      title: "Cumplimiento",
      description: "Cumplimos con GDPR y todas las leyes de privacidad"
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
            <FiShield className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Política de Privacidad
            </h1>
            <p className="text-xl md:text-2xl text-black/80 mb-4">
              Su privacidad es nuestra prioridad
            </p>
            <p className="text-lg text-black/70">
              Última actualización: Octubre 8, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Principios de Privacidad */}
      <section className="py-16 bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Nuestros Principios de <span className="text-gradient">Privacidad</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {principles.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-black/50 border border-yellow-500/30 rounded-2xl p-6 text-center hover:border-yellow-500 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <principle.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{principle.title}</h3>
                  <p className="text-gray-400 text-sm">{principle.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Aviso Importante */}
      <section className="py-8 bg-yellow-500/10 border-y border-yellow-500/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-start space-x-4 bg-black/30 border border-yellow-500/30 rounded-xl p-6">
              <FiAlertCircle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Aviso Importante sobre GDPR</h3>
                <p className="text-gray-300 leading-relaxed">
                  Esta política cumple con el Reglamento General de Protección de Datos (GDPR) de la Unión Europea 
                  y otras leyes internacionales de protección de datos. Usted tiene derechos específicos sobre sus 
                  datos personales que respetamos y protegemos.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contenido de la Política */}
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
                      <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0 mt-2" />
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

      {/* Sección de Certificaciones */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-black/50 border-2 border-yellow-500/30 rounded-2xl p-8 text-center">
              <FiShield className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-4">
                Certificaciones y Cumplimiento
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                WingoSports cumple con los más altos estándares de seguridad y privacidad de datos
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <span className="bg-black/50 border border-gray-700 px-4 py-2 rounded-lg">🔒 SSL/TLS 256-bit</span>
                <span className="bg-black/50 border border-gray-700 px-4 py-2 rounded-lg">🛡️ GDPR Compliant</span>
                <span className="bg-black/50 border border-gray-700 px-4 py-2 rounded-lg">💳 PCI DSS</span>
                <span className="bg-black/50 border border-gray-700 px-4 py-2 rounded-lg">✅ ISO 27001</span>
                <span className="bg-black/50 border border-gray-700 px-4 py-2 rounded-lg">🔐 KYC/AML</span>
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
              Esta política de privacidad fue actualizada por última vez el 8 de octubre de 2025.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@wingosports.com"
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-black px-6 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
              >
                <FiMail className="w-5 h-5" />
                <span>Contactar sobre Privacidad</span>
              </a>
              <a
                href="/terms"
                className="inline-flex items-center justify-center space-x-2 bg-black/50 border-2 border-yellow-500 text-yellow-300 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500/10 transition-all duration-300"
              >
                <span>Ver Términos y Condiciones</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
