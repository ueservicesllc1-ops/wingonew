import { motion } from 'framer-motion';
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
    <section className="py-16 bg-gradient-to-b from-dark-900 to-dark-950">
      <div className="container mx-auto px-4">
        {/* Título de la sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Eventos <span className="text-gradient">en Vivo</span>
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-primary-400 hover:text-primary-300 font-medium flex items-center space-x-2"
          >
            <span>Ver todos</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Grid de partidos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {liveMatches.map((match, index) => (
            <MatchCard key={match.id} {...match} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveSection;
