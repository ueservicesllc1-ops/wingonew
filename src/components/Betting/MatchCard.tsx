import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiClock } from 'react-icons/fi';
import { useBetSlipStore } from '@/store/useBetSlipStore';
import toast from 'react-hot-toast';

interface MatchCardProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  drawOdds?: number;
  awayOdds: number;
  league: string;
  time: string;
  isLive?: boolean;
  homeLogo?: string;
  awayLogo?: string;
  index: number;
}

/**
 * Tarjeta de partido con cuotas y animaciones
 * Permite agregar apuestas al slip
 */
const MatchCard = ({
  id,
  homeTeam,
  awayTeam,
  homeOdds,
  drawOdds,
  awayOdds,
  league,
  time,
  isLive = false,
  homeLogo,
  awayLogo,
  index
}: MatchCardProps) => {
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const { addBet } = useBetSlipStore();

  const handleBetClick = (team: string, odds: number) => {
    setSelectedBet(team);
    
    addBet({
      id: `${id}-${team}`,
      eventId: id,
      eventName: `${homeTeam} vs ${awayTeam}`,
      selection: team,
      event: {} as any,
      betType: 'home' as any,
      odds: odds,
      amount: 0,
      stake: 0,
    });

    toast.success(`${team} agregado al boleto`);
    
    setTimeout(() => setSelectedBet(null), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden hover:border-primary-500 transition-all duration-300 group"
    >
      {/* Header del partido */}
      <div className="px-4 py-3 border-b border-dark-700 flex items-center justify-between bg-dark-900/50">
        <div className="flex items-center space-x-3">
          {isLive && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center space-x-1 text-green-500 text-xs font-bold"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span>EN VIVO</span>
            </motion.div>
          )}
          <span className="text-sm text-gray-400">{league}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <FiClock className="w-4 h-4" />
          <span>{time}</span>
        </div>
      </div>

      {/* Equipos y logos */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 items-center gap-4">
          {/* Equipo Local */}
          <div className="text-center">
            <div className="flex flex-col items-center space-y-2">
              {homeLogo ? (
                <img src={homeLogo} alt={homeTeam} className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-xl font-bold">
                  {homeTeam.charAt(0)}
                </div>
              )}
              <span className="text-white font-medium text-sm">{homeTeam}</span>
            </div>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">VS</div>
          </div>

          {/* Equipo Visitante */}
          <div className="text-center">
            <div className="flex flex-col items-center space-y-2">
              {awayLogo ? (
                <img src={awayLogo} alt={awayTeam} className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center text-xl font-bold">
                  {awayTeam.charAt(0)}
                </div>
              )}
              <span className="text-white font-medium text-sm">{awayTeam}</span>
            </div>
          </div>
        </div>

        {/* Cuotas */}
        <div className={`grid ${drawOdds ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
          {/* Cuota Local */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBetClick(homeTeam, homeOdds)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedBet === homeTeam
                ? 'border-primary-500 bg-primary-500/20'
                : 'border-dark-600 bg-dark-900/50 hover:border-primary-500 hover:bg-primary-500/10'
            }`}
          >
            <div className="text-xs text-gray-400 mb-1">Local</div>
            <div className="text-2xl font-bold text-primary-400">{homeOdds.toFixed(2)}</div>
          </motion.button>

          {/* Cuota Empate */}
          {drawOdds && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBetClick('Empate', drawOdds)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedBet === 'Empate'
                  ? 'border-secondary-500 bg-secondary-500/20'
                  : 'border-dark-600 bg-dark-900/50 hover:border-secondary-500 hover:bg-secondary-500/10'
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">Empate</div>
              <div className="text-2xl font-bold text-secondary-400">{drawOdds.toFixed(2)}</div>
            </motion.button>
          )}

          {/* Cuota Visitante */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBetClick(awayTeam, awayOdds)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedBet === awayTeam
                ? 'border-primary-500 bg-primary-500/20'
                : 'border-dark-600 bg-dark-900/50 hover:border-primary-500 hover:bg-primary-500/10'
            }`}
          >
            <div className="text-xs text-gray-400 mb-1">Visitante</div>
            <div className="text-2xl font-bold text-primary-400">{awayOdds.toFixed(2)}</div>
          </motion.button>
        </div>

        {/* Más mercados */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full py-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          + Ver más mercados
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MatchCard;
