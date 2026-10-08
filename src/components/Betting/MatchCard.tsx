import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiClock, FiPlus } from 'react-icons/fi';
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

  const oddsOptions = [
    { key: homeTeam, label: '1', sub: 'Local', odds: homeOdds },
    ...(drawOdds ? [{ key: 'Empate', label: 'X', sub: 'Empate', odds: drawOdds }] : []),
    { key: awayTeam, label: '2', sub: 'Visitante', odds: awayOdds },
  ];

  const Logo = ({ src, name, tone }: { src?: string; name: string; tone: string }) =>
    src ? (
      <img src={src} alt={name} className="w-14 h-14 object-contain" />
    ) : (
      <div className={`w-14 h-14 rounded-2xl ${tone} flex items-center justify-center font-display text-2xl font-extrabold text-white shadow-lg`}>
        {name.charAt(0)}
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="surface-card overflow-hidden hover:border-yellow-500/40 group relative"
    >
      {isLive && <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-secondary-500 via-primary-500 to-yellow-400" />}

      {/* Header del partido */}
      <div className="px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          {isLive && (
            <span className="badge-live">
              <span className="live-dot" /> En vivo
            </span>
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-dark-300 truncate">{league}</span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-dark-200 bg-white/5 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
          <FiClock className="w-3.5 h-3.5 text-yellow-400" />
          <span>{time}</span>
        </div>
      </div>

      {/* Equipos */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <Logo src={homeLogo} name={homeTeam} tone="bg-gradient-primary" />
            <span className="text-white font-semibold text-sm leading-tight">{homeTeam}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-display text-xs font-bold tracking-widest text-dark-400">VS</span>
            <span className="mt-1 w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <Logo src={awayLogo} name={awayTeam} tone="bg-gradient-secondary" />
            <span className="text-white font-semibold text-sm leading-tight">{awayTeam}</span>
          </div>
        </div>
      </div>

      {/* Cuotas */}
      <div className="px-4 pb-4">
        <div className={`grid ${drawOdds ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
          {oddsOptions.map((opt) => (
            <motion.button
              key={opt.key}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBetClick(opt.key, opt.odds)}
              aria-label={`Apostar a ${opt.key} con cuota ${opt.odds.toFixed(2)}`}
              className={`relative rounded-xl border px-3 py-2.5 text-left overflow-hidden ${
                selectedBet === opt.key
                  ? 'border-yellow-400 bg-yellow-500/20'
                  : 'border-white/10 bg-white/[0.04] hover:border-yellow-500/60 hover:bg-yellow-500/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-dark-300">
                  <span className="text-dark-100 font-bold mr-1">{opt.label}</span>
                  {opt.sub}
                </span>
                <FiPlus className="w-3.5 h-3.5 text-dark-400 group-hover:text-yellow-400" />
              </div>
              <div className="font-display text-2xl font-extrabold text-yellow-400 mt-0.5">
                {opt.odds.toFixed(2)}
              </div>
            </motion.button>
          ))}
        </div>

        <button className="w-full mt-3 py-2 text-xs font-semibold text-dark-300 hover:text-yellow-400 border-t border-white/5 pt-3">
          + Ver más mercados
        </button>
      </div>
    </motion.div>
  );
};

export default MatchCard;
