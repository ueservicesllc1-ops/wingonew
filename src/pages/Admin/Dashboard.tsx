import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiImage, 
  FiGift, 
  FiSettings,
  FiBarChart2,
  FiDollarSign,
  FiTrendingUp,
  FiMail
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Dashboard de Administración
 * Panel principal con acceso a todas las funciones administrativas
 */
const AdminDashboard = () => {
  const [stats] = useState({
    totalUsers: 1234,
    activeUsers: 856,
    totalBets: 5678,
    revenue: 45890.50,
    activeBanners: 3,
    activePromotions: 5,
  });

  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    // Escuchar cambios en tiempo real de mensajes no leídos
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('read', '==', false));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadMessages(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  const adminModules = [
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios, permisos y verificaciones',
      icon: FiUsers,
      color: 'from-yellow-600 to-yellow-700',
      path: '/admin/users',
      stats: `${stats.totalUsers} usuarios`
    },
    {
      id: 'messages',
      title: 'Mensajes de Contacto',
      description: 'Ver y responder mensajes de usuarios',
      icon: FiMail,
      color: 'from-yellow-500 to-yellow-700',
      path: '/admin/messages',
      stats: unreadMessages > 0 ? `${unreadMessages} nuevos` : 'Sin nuevos',
      hasNotification: unreadMessages > 0,
      notificationCount: unreadMessages
    },
    {
      id: 'wallets',
      title: 'Billeteras',
      description: 'Buscar usuarios y administrar sus fondos',
      icon: FiDollarSign,
      color: 'from-yellow-500 to-orange-600',
      path: '/admin/wallets',
      stats: 'Gestión de fondos'
    },
    {
      id: 'banners',
      title: 'Banners del Hero',
      description: 'Subir y gestionar banners del slider principal',
      icon: FiImage,
      color: 'from-gray-700 to-gray-800',
      path: '/admin/banners',
      stats: `${stats.activeBanners} activos`
    },
    {
      id: 'promotions',
      title: 'Promociones',
      description: 'Crear y editar promociones y bonos',
      icon: FiGift,
      color: 'from-yellow-600 to-orange-600',
      path: '/admin/promotions',
      stats: `${stats.activePromotions} activas`
    },
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Ajustes generales de la plataforma',
      icon: FiSettings,
      color: 'from-gray-600 to-gray-700',
      path: '/admin/settings',
      stats: 'Sistema'
    }
  ];

  const quickStats = [
    {
      label: 'Usuarios Totales',
      value: stats.totalUsers.toLocaleString(),
      icon: FiUsers,
      color: 'text-yellow-400',
      change: '+12%'
    },
    {
      label: 'Apuestas Hoy',
      value: stats.totalBets.toLocaleString(),
      icon: FiBarChart2,
      color: 'text-yellow-500',
      change: '+8%'
    },
    {
      label: 'Ingresos',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'text-yellow-600',
      change: '+15%'
    },
    {
      label: 'Usuarios Activos',
      value: stats.activeUsers.toLocaleString(),
      icon: FiTrendingUp,
      color: 'text-yellow-300',
      change: '+5%'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Panel de <span className="text-gradient">Administración</span>
          </h1>
          <p className="text-gray-400">Gestiona todos los aspectos de WingoSports</p>
        </motion.div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-primary-500 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-yellow-400 text-sm font-semibold">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Módulos de Administración */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Link to={module.path}>
                <div className={`relative overflow-hidden bg-dark-800 border rounded-2xl transition-all group ${
                  module.hasNotification 
                    ? 'border-yellow-500 animate-pulse' 
                    : 'border-dark-700 hover:border-primary-500'
                }`}>
                  {/* Fondo con gradiente */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  
                  {/* Contenido */}
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg relative`}>
                        <module.icon className="w-8 h-8 text-white" />
                        {/* Contador flotante */}
                        {module.hasNotification && module.notificationCount && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce"
                          >
                            {module.notificationCount}
                          </motion.div>
                        )}
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        module.hasNotification 
                          ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' 
                          : 'bg-dark-700 text-gray-300'
                      }`}>
                        {module.stats}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{module.description}</p>

                    <div className="flex items-center text-primary-400 font-medium">
                      <span>Acceder</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Actividad Reciente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-dark-800 border border-dark-700 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {[
              { action: 'Nuevo usuario registrado', user: 'Juan Pérez', time: 'Hace 5 minutos', type: 'user' },
              { action: 'Banner actualizado', user: 'Admin', time: 'Hace 15 minutos', type: 'banner' },
              { action: 'Promoción creada', user: 'Marketing', time: 'Hace 1 hora', type: 'promotion' },
              { action: 'Usuario verificado', user: 'María González', time: 'Hace 2 horas', type: 'user' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg hover:bg-dark-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-yellow-500/20 text-yellow-400' :
                    activity.type === 'banner' ? 'bg-gray-700/50 text-gray-300' :
                    'bg-yellow-600/20 text-yellow-500'
                  }`}>
                    {activity.type === 'user' && <FiUsers className="w-5 h-5" />}
                    {activity.type === 'banner' && <FiImage className="w-5 h-5" />}
                    {activity.type === 'promotion' && <FiGift className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
