import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiUser, FiMessageSquare, FiSend } from 'react-icons/fi';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import toast from 'react-hot-toast';

/**
 * Página de Contacto
 * Formulario para enviar mensajes que se guardan en Firestore
 */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        status: 'unread',
        createdAt: serverTimestamp(),
        read: false
      });

      toast.success('¡Mensaje enviado con éxito! Te responderemos pronto.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.error('Error al enviar el mensaje. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: "Email",
      value: "soporte@wingosports.com",
      link: "mailto:soporte@wingosports.com",
      color: "from-yellow-600 to-yellow-700"
    },
    {
      icon: FiPhone,
      title: "Teléfono",
      value: "+1 (800) 123-4567",
      link: "tel:+18001234567",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: FiMapPin,
      title: "Ubicación",
      value: "Estados Unidos",
      link: null,
      color: "from-gray-700 to-gray-800"
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
            <FiMessageSquare className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Contáctanos
            </h1>
            <p className="text-xl md:text-2xl text-black/80 mb-4">
              Estamos aquí para ayudarte
            </p>
            <p className="text-lg text-black/70">
              Envíanos un mensaje y te responderemos lo antes posible
            </p>
          </motion.div>
        </div>
      </section>

      {/* Información de Contacto */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-black/30 border border-gray-700 rounded-xl p-6 text-center hover:border-yellow-500/30 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-gray-300">{info.value}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-black/30 border border-gray-700 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-2 text-center">
                Envíanos un <span className="text-gradient">Mensaje</span>
              </h2>
              <p className="text-gray-400 text-center mb-8">
                Completa el formulario y nos pondremos en contacto contigo pronto
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-white font-semibold mb-2">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-white font-semibold mb-2">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Asunto */}
                <div>
                  <label htmlFor="subject" className="block text-white font-semibold mb-2">
                    Asunto
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="message" className="block text-white font-semibold mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                {/* Botón de Envío */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </motion.button>

                <p className="text-gray-400 text-sm text-center">
                  * Campos requeridos
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sección de Disponibilidad */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-black/30 border border-yellow-500/30 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Soporte 24/7
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Nuestro equipo está disponible las 24 horas del día, los 7 días de la semana para ayudarte con cualquier consulta o problema.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg px-6 py-3">
                  <p className="text-green-400 font-semibold">Tiempo de respuesta promedio</p>
                  <p className="text-white text-2xl font-bold">2-4 horas</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg px-6 py-3">
                  <p className="text-blue-400 font-semibold">Disponibilidad</p>
                  <p className="text-white text-2xl font-bold">24/7</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
