import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

interface SportsCardProps {
  name: string;
  icon: IconType;
  path: string;
  liveMatches: number;
  color: string;
  index: number;
}

/**
 * Tarjeta de deporte con animación hover y diseño moderno
 */
const SportsCard = ({ name, icon: Icon, path, liveMatches, color, index }: SportsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative"
    >
      <Link to={path} className="block">
        <div className="relative overflow-hidden rounded-xl bg-dark-800 border border-dark-700 hover:border-primary-500 transition-all duration-300 group">
          {/* Fondo con gradiente */}
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

          <div className="relative p-6 space-y-4">
            {/* Icono */}
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300`}>
              <Icon className="w-8 h-8 text-white" />
            </div>

            {/* Información */}
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
              <p className="text-sm text-gray-400">
                <span className="inline-flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>{liveMatches} en vivo</span>
                </span>
              </p>
            </div>

            {/* Botón */}
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center text-primary-400 font-medium"
            >
              Ver apuestas
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>

          {/* Badge de eventos en vivo */}
          {liveMatches > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-glow"
            >
              LIVE
            </motion.div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default SportsCard;
