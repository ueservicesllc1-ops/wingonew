import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle, FiCreditCard, FiShield, FiClock, FiDollarSign, FiUser, FiSettings } from 'react-icons/fi';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: any;
}

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqData: FAQItem[] = [
    // Preguntas Generales
    {
      id: '1',
      question: '¿Qué es WingoSports?',
      answer: 'WingoSports es una plataforma de apuestas deportivas en línea que te permite apostar en una gran variedad de deportes con las mejores cuotas del mercado. Ofrecemos eventos en vivo, promociones exclusivas y un sistema seguro de depósitos y retiros.',
      category: 'general',
      icon: FiHelpCircle
    },
    {
      id: '2',
      question: '¿Cómo me registro en WingoSports?',
      answer: 'Para registrarte, haz clic en el botón "Registrarse" en la esquina superior derecha. Completa el formulario con tu información personal, verifica tu email y ya podrás comenzar a apostar. Es un proceso rápido y seguro.',
      category: 'general',
      icon: FiUser
    },
    {
      id: '3',
      question: '¿Es seguro apostar en WingoSports?',
      answer: 'Sí, WingoSports utiliza tecnología de encriptación de última generación para proteger tus datos y transacciones. Estamos licenciados y regulados, y seguimos todas las medidas de seguridad internacionales.',
      category: 'general',
      icon: FiShield
    },

    // Preguntas sobre Apuestas
    {
      id: '4',
      question: '¿En qué deportes puedo apostar?',
      answer: 'Puedes apostar en fútbol, baloncesto, tenis, béisbol, voleibol y muchos más deportes. Ofrecemos eventos de ligas nacionales e internacionales, incluyendo partidos en vivo con cuotas actualizadas en tiempo real.',
      category: 'apuestas',
      icon: FiHelpCircle
    },
    {
      id: '5',
      question: '¿Cómo funcionan las cuotas?',
      answer: 'Las cuotas representan la probabilidad de que ocurra un evento. Una cuota de 2.00 significa que si apuestas $10 y ganas, recibirás $20 (tu apuesta original más $10 de ganancia). Las cuotas cambian según la demanda y la información disponible.',
      category: 'apuestas',
      icon: FiDollarSign
    },
    {
      id: '6',
      question: '¿Puedo apostar en vivo?',
      answer: 'Sí, ofrecemos apuestas en vivo para muchos eventos deportivos. Las cuotas se actualizan en tiempo real según el desarrollo del partido. Puedes apostar mientras ves el evento en vivo.',
      category: 'apuestas',
      icon: FiClock
    },
    {
      id: '7',
      question: '¿Hay límites de apuesta?',
      answer: 'Sí, tenemos límites de apuesta mínimos y máximos para cada mercado. Los límites pueden variar según el deporte, el evento y el tipo de apuesta. Puedes ver estos límites antes de realizar tu apuesta.',
      category: 'apuestas',
      icon: FiDollarSign
    },

    // Preguntas sobre Depósitos y Retiros
    {
      id: '8',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito (Visa, Mastercard), transferencias bancarias, PayPal, Bitcoin y otros métodos de pago electrónicos. Todos los métodos son seguros y procesados de forma instantánea.',
      category: 'pagos',
      icon: FiCreditCard
    },
    {
      id: '9',
      question: '¿Cuánto tiempo tardan los depósitos?',
      answer: 'Los depósitos con tarjeta de crédito son instantáneos. Las transferencias bancarias pueden tardar entre 1-3 días hábiles. Los depósitos con criptomonedas suelen procesarse en 10-30 minutos.',
      category: 'pagos',
      icon: FiClock
    },
    {
      id: '10',
      question: '¿Cómo solicito un retiro?',
      answer: 'Ve a la sección "Mi Cuenta" > "Retiros", selecciona el método de pago y la cantidad que deseas retirar. Los retiros se procesan dentro de 24 horas para la mayoría de métodos de pago.',
      category: 'pagos',
      icon: FiCreditCard
    },
    {
      id: '11',
      question: '¿Hay comisiones por retiro?',
      answer: 'No cobramos comisiones por retiros para la mayoría de métodos de pago. Sin embargo, algunos métodos de pago pueden tener sus propias comisiones que se aplicarán automáticamente.',
      category: 'pagos',
      icon: FiDollarSign
    },

    // Preguntas sobre Promociones
    {
      id: '12',
      question: '¿Qué promociones ofrecen?',
      answer: 'Ofrecemos bonos de bienvenida, cashback semanal, apuestas gratis, y promociones especiales para eventos deportivos importantes. Revisa regularmente nuestra sección de promociones para no perderte ninguna oferta.',
      category: 'promociones',
      icon: FiHelpCircle
    },
    {
      id: '13',
      question: '¿Cómo reclamo mi bono de bienvenida?',
      answer: 'El bono de bienvenida se activa automáticamente cuando realizas tu primer depósito. Asegúrate de leer los términos y condiciones del bono antes de depositar.',
      category: 'promociones',
      icon: FiDollarSign
    },

    // Preguntas sobre Cuenta
    {
      id: '14',
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a "Mi Cuenta" > "Configuración" > "Cambiar Contraseña". Ingresa tu contraseña actual y la nueva contraseña. Te recomendamos usar una contraseña segura con al menos 8 caracteres.',
      category: 'cuenta',
      icon: FiSettings
    },
    {
      id: '15',
      question: '¿Puedo tener múltiples cuentas?',
      answer: 'No, cada usuario solo puede tener una cuenta. Crear múltiples cuentas está prohibido y puede resultar en la suspensión de todas las cuentas.',
      category: 'cuenta',
      icon: FiUser
    },
    {
      id: '16',
      question: '¿Cómo verifico mi cuenta?',
      answer: 'Para verificar tu cuenta, necesitas enviar una copia de tu documento de identidad y un comprobante de domicilio. Esto es necesario para cumplir con las regulaciones y proteger tu cuenta.',
      category: 'cuenta',
      icon: FiShield
    }
  ];

  const categories = [
    { id: 'general', name: 'General', icon: FiHelpCircle },
    { id: 'apuestas', name: 'Apuestas', icon: FiDollarSign },
    { id: 'pagos', name: 'Pagos', icon: FiCreditCard },
    { id: 'promociones', name: 'Promociones', icon: FiHelpCircle },
    { id: 'cuenta', name: 'Mi Cuenta', icon: FiUser }
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-yellow-200 text-lg max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre WingoSports
          </p>
        </motion.div>

        {/* Categorías */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeCategory === category.id
                  ? 'bg-yellow-600 text-black'
                  : 'bg-black/50 border border-yellow-600/30 text-yellow-300 hover:bg-yellow-600/20'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/50 border border-yellow-600/30 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-yellow-600/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <faq.icon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-yellow-100 font-medium">{faq.question}</span>
                  </div>
                  <FiChevronDown 
                    className={`w-5 h-5 text-yellow-400 transition-transform ${
                      openItems.includes(faq.id) ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                <AnimatePresence>
                  {openItems.includes(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 border-t border-yellow-600/20">
                        <p className="text-yellow-200 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA de contacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-black/50 border border-yellow-600/30 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">
              ¿No encuentras tu respuesta?
            </h3>
            <p className="text-yellow-200 mb-6">
              Nuestro equipo de soporte está disponible 24/7 para ayudarte
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:soporte@wingosports.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-yellow-600 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
              >
                Contactar Soporte
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-black/50 border border-yellow-600 text-yellow-300 rounded-lg font-medium hover:bg-yellow-600/20 transition-colors"
              >
                Ver Más Ayuda
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
