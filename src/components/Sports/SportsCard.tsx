import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -6 }}
      className="relative"
    >
      <Link to={path} className="block" aria-label={`Apostar en ${name}`}>
        <div className="relative overflow-hidden surface-card hover:border-white/25 group h-full">
          {/* Resplandor de color */}
          <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${color} opacity-20 group-hover:opacity-50 blur-2xl transition-opacity duration-500`} />
          {/* Icono gigante de fondo */}
          <Icon className="absolute -bottom-6 -right-4 w-36 h-36 text-white/[0.04] group-hover:text-white/[0.09] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500" />

          <div className="relative p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-8">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              {liveMatches > 0 && (
                <span className="badge-live">
                  <span className="live-dot" /> {liveMatches}
                </span>
              )}
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-1">{name}</h3>
            <p className="text-sm text-dark-300 mb-5">{liveMatches} eventos en vivo</p>

            <div className="mt-auto flex items-center text-sm font-semibold text-yellow-400 group-hover:text-yellow-300">
              <span>Ver apuestas</span>
              <FiArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SportsCard;
