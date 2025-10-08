import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiZap, FiDollarSign, FiStar } from 'react-icons/fi';

/**
 * Página principal del Casino
 * Lista de juegos disponibles
 */
const CasinoHome = () => {
  const games = [
    {
      id: 'dino',
      name: 'Dino Crash',
      description: 'Multiplica tus ganancias antes del crash',
      icon: '🦖',
      path: '/casino/dino',
      color: 'from-green-600 to-green-700',
      popular: true
    },
    {
      id: 'dice',
      name: 'Dice',
      description: 'Apuesta alto o bajo en los dados',
      icon: '🎲',
      path: '/casino/dice',
      color: 'from-blue-600 to-blue-700',
      comingSoon: true
    },
    {
      id: 'mines',
      name: 'Mines',
      description: 'Encuentra diamantes, evita las minas',
      icon: '💣',
      path: '/casino/mines',
      color: 'from-purple-600 to-purple-700',
      comingSoon: true
    },
    {
      id: 'plinko',
      name: 'Plinko',
      description: 'Deja caer la bola y gana',
      icon: '🎰',
      path: '/casino/plinko',
      color: 'from-orange-600 to-orange-700',
      comingSoon: true
    },
    {
      id: 'wheel',
      name: 'Wheel',
      description: 'Gira la ruleta de la fortuna',
      icon: '🎡',
      path: '/casino/wheel',
      color: 'from-pink-600 to-pink-700',
      comingSoon: true
    },
    {
      id: 'hilo',
      name: 'Hi-Lo',
      description: 'Adivina si es mayor o menor',
      icon: '🃏',
      path: '/casino/hilo',
      color: 'from-red-600 to-red-700',
      comingSoon: true
    }
  ];

  const stats = [
    {
      icon: FiTrendingUp,
      value: '$2.5M+',
      label: 'Pagado Hoy',
      color: 'text-green-400'
    },
    {
      icon: FiZap,
      value: '12K+',
      label: 'Jugadores Activos',
      color: 'text-yellow-400'
    },
    {
      icon: FiDollarSign,
      value: '98.5%',
      label: 'RTP Promedio',
      color: 'text-blue-400'
    },
    {
      icon: FiStar,
      value: '24/7',
      label: 'Disponible',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            🎰 Casino <span className="text-gradient">WingoSports</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Juegos de casino justos y verificables. Gana al instante con nuestros juegos originales.
          </p>
        </motion.div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/30 border border-gray-700 rounded-xl p-6 text-center"
            >
              <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Juegos */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Juegos Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                {game.comingSoon ? (
                  <div className="relative bg-black/30 border border-gray-700 rounded-2xl p-8 text-center opacity-60 cursor-not-allowed">
                    <div className="absolute top-4 right-4 bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                      Próximamente
                    </div>
                    <div className="text-6xl mb-4">{game.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                    <p className="text-gray-400">{game.description}</p>
                  </div>
                ) : (
                  <Link to={game.path}>
                    <div className={`relative bg-gradient-to-br ${game.color} rounded-2xl p-8 text-center overflow-hidden group`}>
                      {game.popular && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                          <FiStar className="w-3 h-3" />
                          <span>POPULAR</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                      
                      <div className="relative z-10">
                        <div className="text-6xl mb-4">{game.icon}</div>
                        <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                        <p className="text-white/80 mb-4">{game.description}</p>
                        <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg text-white font-semibold">
                          <span>Jugar Ahora</span>
                          <FiZap className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Información */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-black/30 border border-yellow-500/30 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4">🎲 Juego Justo y Verificable</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            Todos nuestros juegos utilizan el sistema <span className="text-yellow-400 font-bold">Provably Fair</span>, 
            lo que significa que cada resultado puede ser verificado por ti mismo. Garantizamos transparencia total 
            en cada apuesta.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold mb-1">🔐 Seguro</p>
              <p className="text-gray-400 text-sm">Resultados encriptados antes de cada ronda</p>
            </div>
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold mb-1">✅ Verificable</p>
              <p className="text-gray-400 text-sm">Verifica cada resultado con el hash público</p>
            </div>
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold mb-1">⚡ Instantáneo</p>
              <p className="text-gray-400 text-sm">Ganancias acreditadas al instante</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CasinoHome;
