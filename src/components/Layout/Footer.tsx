import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { MdSportsSoccer } from 'react-icons/md';
import { FiMail, FiMapPin } from 'react-icons/fi';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Footer profesional con enlaces, información de contacto y redes sociales
 * Incluye secciones organizadas y animaciones suaves
 */
const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: '#',
    twitter: '#',
    instagram: '#',
    youtube: '#',
    telegram: '#',
    whatsapp: '#'
  });

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'social-links'));
      if (settingsDoc.exists()) {
        setSocialLinks(settingsDoc.data() as any);
      }
    } catch (error) {
      console.error('Error al cargar enlaces sociales:', error);
    }
  };

  const ayudaLinks = [
    { name: 'Preguntas Frecuentes', path: '/faq' },
    { name: 'Cómo Apostar', path: '/how-to-bet' },
    { name: 'Términos y Condiciones', path: '/terms' },
    { name: 'Política de Privacidad', path: '/privacy' },
    { name: 'Juego Responsable', path: '/responsible-gaming' },
  ];

  const empresaLinks = [
    { name: 'Sobre Nosotros', path: '/about' },
    { name: 'Contacto', path: '/contact' },
    { name: 'Trabaja con Nosotros', path: '/careers' },
    { name: 'Afiliados', path: '/affiliates' },
    { name: 'Blog', path: '/blog' },
  ];

  const redesSociales = [
    { name: 'Facebook', icon: FaFacebook, url: socialLinks.facebook, color: 'hover:text-yellow-400' },
    { name: 'Twitter', icon: FaTwitter, url: socialLinks.twitter, color: 'hover:text-yellow-400' },
    { name: 'Instagram', icon: FaInstagram, url: socialLinks.instagram, color: 'hover:text-yellow-400' },
    { name: 'YouTube', icon: FaYoutube, url: socialLinks.youtube, color: 'hover:text-yellow-400' },
    { name: 'Telegram', icon: FaTelegram, url: socialLinks.telegram, color: 'hover:text-yellow-400' },
    { name: 'WhatsApp', icon: FaWhatsapp, url: socialLinks.whatsapp, color: 'hover:text-yellow-400' },
  ];

  const metodoPago = ['💳 Visa', '💳 Mastercard', '💰 PayPal', '🏦 Transferencia', '₿ Bitcoin', '💵 Efectivo'];

  return (
    <footer className="bg-gradient-to-b from-dark-900 to-dark-950 border-t border-dark-700 mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Sección principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo y descripción */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <MdSportsSoccer className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient">WingoSports</h2>
                <p className="text-xs text-gray-400">Apuestas en Vivo</p>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed">
              La mejor plataforma de apuestas deportivas en línea. Disfruta de cuotas competitivas, 
              transmisiones en vivo y promociones exclusivas. Apuesta de forma segura y responsable.
            </p>

            {/* Información de contacto */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <FiMail className="w-4 h-4 text-primary-400" />
                <span>soporte@wingosports.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <FiMapPin className="w-4 h-4 text-primary-400" />
                <span>Disponible 24/7</span>
              </div>
            </div>

            {/* Redes sociales */}
            <div>
              <h3 className="text-white font-semibold mb-3">Síguenos</h3>
              <div className="flex space-x-3">
                {redesSociales.map((red) => (
                  <motion.a
                    key={red.name}
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-gray-400 ${red.color} transition-colors`}
                  >
                    <red.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Enlaces de Ayuda */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Ayuda</h3>
            <ul className="space-y-2">
              {ayudaLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces de Empresa */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Empresa</h3>
            <ul className="space-y-2">
              {empresaLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="border-t border-dark-700 pt-8 mb-8">
          <h3 className="text-white font-bold mb-4 text-center">Métodos de Pago</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {metodoPago.map((metodo) => (
              <motion.div
                key={metodo}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-dark-800 rounded-lg border border-dark-700 text-sm"
              >
                {metodo}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certificaciones y juego responsable */}
        <div className="border-t border-dark-700 pt-8 mb-8">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2">🔒</div>
              <p className="text-xs text-gray-400">Sitio Seguro</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-xs text-gray-400">Licencia Oficial</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-xs text-gray-400">+18 años</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🛡️</div>
              <p className="text-xs text-gray-400">Juego Responsable</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-dark-700 pt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">
            © 2025 WingoSports. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-xs mb-2">
            Las apuestas deportivas pueden ser adictivas. Juega con responsabilidad. +18 años.
          </p>
          <div className="flex justify-center items-center space-x-2 text-xs text-gray-500">
            <span>Wingo Sport</span>
            <span>Powered</span>
            <span>&</span>
            <span>Designed by</span>
            <span className="font-bold text-yellow-400">Freedom Labs</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
