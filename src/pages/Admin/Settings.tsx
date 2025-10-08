import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import { FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import toast from 'react-hot-toast';

/**
 * Configuración General - Panel de Administración
 * Gestión de redes sociales y configuraciones del sitio
 */
const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    telegram: '',
    whatsapp: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'social-links'));
      if (settingsDoc.exists()) {
        setSocialLinks(settingsDoc.data() as any);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await setDoc(doc(db, 'settings', 'social-links'), socialLinks);
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (platform: string, value: string) => {
    setSocialLinks({
      ...socialLinks,
      [platform]: value
    });
  };

  const socialPlatforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FiFacebook,
      color: 'text-blue-500',
      placeholder: 'https://facebook.com/wingosports'
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      icon: FiTwitter,
      color: 'text-sky-400',
      placeholder: 'https://twitter.com/wingosports'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: FiInstagram,
      color: 'text-pink-500',
      placeholder: 'https://instagram.com/wingosports'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: FiYoutube,
      color: 'text-red-500',
      placeholder: 'https://youtube.com/@wingosports'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: FaTelegram,
      color: 'text-blue-400',
      placeholder: 'https://t.me/wingosports'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'text-green-500',
      placeholder: 'https://wa.me/18001234567'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-4">
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Volver al Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Configuración <span className="text-gradient">General</span>
          </h1>
          <p className="text-gray-400">Gestiona las configuraciones del sitio</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="max-w-4xl">
            {/* Redes Sociales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-8 mb-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl flex items-center justify-center">
                  <FiFacebook className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Redes Sociales</h2>
                  <p className="text-gray-400 text-sm">Configura los enlaces de tus redes sociales</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {socialPlatforms.map((platform, index) => (
                  <motion.div
                    key={platform.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <platform.icon className={`w-5 h-5 ${platform.color}`} />
                        <span>{platform.name}</span>
                      </div>
                    </label>
                    <input
                      type="url"
                      value={socialLinks[platform.id as keyof typeof socialLinks]}
                      onChange={(e) => handleChange(platform.id, e.target.value)}
                      placeholder={platform.placeholder}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </motion.div>
                ))}

                {/* Botón de Guardar */}
                <div className="flex justify-end pt-4">
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-black rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="w-5 h-5" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Información */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-2">ℹ️ Información</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Los enlaces deben incluir el protocolo completo (https://)</li>
                <li>• Los cambios se reflejarán inmediatamente en el footer del sitio</li>
                <li>• Deja el campo vacío si no deseas mostrar esa red social</li>
                <li>• Verifica que los enlaces sean correctos antes de guardar</li>
              </ul>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
