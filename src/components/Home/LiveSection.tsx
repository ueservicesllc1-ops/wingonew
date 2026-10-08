import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import MatchCard from '@/components/Betting/MatchCard';

/**
 * Sección de eventos en vivo con partidos destacados
 */
const LiveSection = () => {
  // Datos de ejemplo para partidos en vivo
  const liveMatches = [
    {
      id: '1',
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      homeOdds: 2.10,
      drawOdds: 3.20,
      awayOdds: 3.50,
      league: 'La Liga',
      time: "45' - 1er Tiempo",
      isLive: true,
    },
    {
      id: '2',
      homeTeam: 'Manchester City',
      awayTeam: 'Liverpool',
      homeOdds: 1.85,
      drawOdds: 3.60,
      awayOdds: 4.20,
      league: 'Premier League',
      time: "23' - 1er Tiempo",
      isLive: true,
    },
    {
      id: '3',
      homeTeam: 'Bayern Munich',
      awayTeam: 'Borussia Dortmund',
      homeOdds: 1.70,
      drawOdds: 3.80,
      awayOdds: 5.00,
      league: 'Bundesliga',
      time: "67' - 2do Tiempo",
      isLive: true,
    },
    {
      id: '4',
      homeTeam: 'PSG',
      awayTeam: 'Marseille',
      homeOdds: 1.60,
      drawOdds: 4.00,
      awayOdds: 5.50,
      league: 'Ligue 1',
      time: "12' - 1er Tiempo",
      isLive: true,
    },
  ];

  return (
    <section className="py-12">
      <div className="px-4">
        {/* Título de la sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-3">
            <span className="badge-live">
              <span className="live-dot" /> Live
            </span>
            <h2 className="section-title text-2xl md:text-3xl text-white">
              Eventos <span className="text-gradient">en vivo</span>
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 4 }}
            className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 flex items-center space-x-1.5"
          >
            <span>Ver todos</span>
            <FiArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Grid de partidos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {liveMatches.map((match, index) => (
            <MatchCard key={match.id} {...match} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveSection;
