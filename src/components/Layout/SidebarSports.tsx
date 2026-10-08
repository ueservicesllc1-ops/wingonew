import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  IoFootballOutline, 
  IoBasketballOutline, 
  IoTennisballOutline,
  IoAmericanFootballOutline 
} from 'react-icons/io5';
import { 
  MdSportsBaseball, 
  MdSportsVolleyball, 
  MdSportsCricket,
  MdSportsHandball,
  MdSportsHockey,
  MdSportsMma,
  MdSportsRugby,
  MdSportsMotorsports,
  MdSportsEsports,
  MdSportsGolf
} from 'react-icons/md';
import { GiBoxingGlove, GiCycling, GiDart, GiPingPongBat } from 'react-icons/gi';
import { FiChevronDown, FiX } from 'react-icons/fi';

interface Sport {
  id: string;
  name: string;
  icon: any;
  liveEvents: number;
  totalEvents: number;
  leagues?: {
    name: string;
    events: number;
  }[];
}

interface SidebarSportsProps {
  isOpen?: boolean;
  onClose?: () => void;
  alwaysShowDesktop?: boolean;
}

const SidebarSports = ({ isOpen = false, onClose, alwaysShowDesktop = false }: SidebarSportsProps) => {
  const [expandedSport, setExpandedSport] = useState<string | null>(null);
  const location = useLocation();

  const deportes: Sport[] = [
    {
      id: 'futbol',
      name: 'Fútbol',
      icon: IoFootballOutline,
      liveEvents: 145,
      totalEvents: 892,
      leagues: [
        { name: 'La Liga', events: 45 },
        { name: 'Premier League', events: 52 },
        { name: 'Serie A', events: 38 },
        { name: 'Bundesliga', events: 41 },
        { name: 'Ligue 1', events: 35 },
        { name: 'Champions League', events: 16 },
      ]
    },
    {
      id: 'baloncesto',
      name: 'Baloncesto',
      icon: IoBasketballOutline,
      liveEvents: 68,
      totalEvents: 324,
      leagues: [
        { name: 'NBA', events: 82 },
        { name: 'EuroLeague', events: 45 },
        { name: 'ACB', events: 28 },
        { name: 'NCAA', events: 169 },
      ]
    },
    {
      id: 'tenis',
      name: 'Tenis',
      icon: IoTennisballOutline,
      liveEvents: 32,
      totalEvents: 156,
      leagues: [
        { name: 'ATP Tour', events: 67 },
        { name: 'WTA Tour', events: 54 },
        { name: 'Grand Slam', events: 35 },
      ]
    },
    {
      id: 'baseball',
      name: 'Baseball',
      icon: MdSportsBaseball,
      liveEvents: 24,
      totalEvents: 187,
      leagues: [
        { name: 'MLB', events: 162 },
        { name: 'NPB', events: 25 },
      ]
    },
    {
      id: 'futbol-americano',
      name: 'Fútbol Americano',
      icon: IoAmericanFootballOutline,
      liveEvents: 12,
      totalEvents: 89,
      leagues: [
        { name: 'NFL', events: 65 },
        { name: 'NCAA Football', events: 24 },
      ]
    },
    {
      id: 'volleyball',
      name: 'Volleyball',
      icon: MdSportsVolleyball,
      liveEvents: 18,
      totalEvents: 94,
    },
    {
      id: 'hockey',
      name: 'Hockey',
      icon: MdSportsHockey,
      liveEvents: 15,
      totalEvents: 78,
      leagues: [
        { name: 'NHL', events: 56 },
        { name: 'KHL', events: 22 },
      ]
    },
    {
      id: 'rugby',
      name: 'Rugby',
      icon: MdSportsRugby,
      liveEvents: 8,
      totalEvents: 45,
    },
    {
      id: 'cricket',
      name: 'Cricket',
      icon: MdSportsCricket,
      liveEvents: 22,
      totalEvents: 67,
    },
    {
      id: 'boxeo',
      name: 'Boxeo',
      icon: GiBoxingGlove,
      liveEvents: 5,
      totalEvents: 34,
    },
    {
      id: 'mma',
      name: 'MMA/UFC',
      icon: MdSportsMma,
      liveEvents: 3,
      totalEvents: 28,
    },
    {
      id: 'handball',
      name: 'Handball',
      icon: MdSportsHandball,
      liveEvents: 11,
      totalEvents: 52,
    },
    {
      id: 'motorsports',
      name: 'Motorsports',
      icon: MdSportsMotorsports,
      liveEvents: 2,
      totalEvents: 19,
    },
    {
      id: 'esports',
      name: 'eSports',
      icon: MdSportsEsports,
      liveEvents: 87,
      totalEvents: 234,
      leagues: [
        { name: 'League of Legends', events: 45 },
        { name: 'Dota 2', events: 38 },
        { name: 'CS:GO', events: 67 },
        { name: 'Valorant', events: 34 },
      ]
    },
    {
      id: 'ciclismo',
      name: 'Ciclismo',
      icon: GiCycling,
      liveEvents: 4,
      totalEvents: 23,
    },
    {
      id: 'golf',
      name: 'Golf',
      icon: MdSportsGolf,
      liveEvents: 6,
      totalEvents: 42,
    },
    {
      id: 'ping-pong',
      name: 'Tenis de Mesa',
      icon: GiPingPongBat,
      liveEvents: 19,
      totalEvents: 76,
    },
    {
      id: 'dardos',
      name: 'Dardos',
      icon: GiDart,
      liveEvents: 7,
      totalEvents: 31,
    },
  ];

  const toggleSport = (sportId: string) => {
    setExpandedSport(expandedSport === sportId ? null : sportId);
  };

  const totalLive = deportes.reduce((sum, d) => sum + d.liveEvents, 0);
  const totalAll = deportes.reduce((sum, d) => sum + d.totalEvents, 0);

  return (
    <>
      {/* Sidebar Desktop */}
      {(alwaysShowDesktop || isOpen) && (
        <div className="flex flex-col h-full bg-dark-900/90 backdrop-blur-md">
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-white flex items-center space-x-2">
                <span className="live-dot" />
                <span>Deportes</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 text-xs font-bold">
                {totalLive} en vivo
              </span>
            </div>
          </div>

          {/* Lista de deportes */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
            {deportes.map((deporte) => {
              const isSelected = location.pathname.includes(deporte.id);
              const isExpanded = expandedSport === deporte.id;

              return (
                <div key={deporte.id} className="rounded-xl overflow-hidden transition-all">
                  <Link
                    to={`/sports/${deporte.id}`}
                    onClick={(e) => {
                      if (deporte.leagues && deporte.leagues.length > 0) {
                        e.preventDefault();
                        toggleSport(deporte.id);
                      }
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-yellow-500/15 text-yellow-400 font-semibold shadow-sm'
                        : 'text-dark-100 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        deporte.liveEvents > 0 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-white/5 text-dark-300'
                      }`}>
                        <deporte.icon className="w-4 h-4" />
                      </span>
                      <div className="truncate">
                        <div className="text-sm leading-tight">{deporte.name}</div>
                        <div className="text-[11px] text-dark-400">
                          {deporte.liveEvents > 0 ? (
                            <span className="text-yellow-400 font-semibold">{deporte.liveEvents} en vivo</span>
                          ) : (
                            `${deporte.totalEvents} eventos`
                          )}
                        </div>
                      </div>
                    </div>

                    {deporte.leagues && deporte.leagues.length > 0 && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-dark-400"
                      >
                        <FiChevronDown className="w-4 h-4" />
                      </motion.div>
                    )}
                  </Link>

                  {/* Ligas expandibles */}
                  <AnimatePresence>
                    {isExpanded && deporte.leagues && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-black/20 rounded-lg my-1 space-y-0.5 p-1"
                      >
                        {deporte.leagues.map((league) => (
                          <Link
                            key={league.name}
                            to={`/sports/${deporte.id}/${league.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-dark-200 hover:text-white"
                          >
                            <span>{league.name}</span>
                            <span className="text-[10px] text-dark-400 font-mono">{league.events}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/5 bg-white/[0.02] text-center">
            <span className="text-[11px] text-dark-400">
              Total disponible: <strong className="text-white font-mono">{totalAll.toLocaleString()}</strong> eventos
            </span>
          </div>
        </div>
      )}

      {/* Sidebar Móvil */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-dark-950 border-r border-white/10 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="live-dot" />
                  <h2 className="font-display font-bold text-white text-lg">Deportes</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 text-white"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {deportes.map((deporte) => (
                  <div key={deporte.id}>
                    <Link
                      to={`/sports/${deporte.id}`}
                      onClick={(e) => {
                        if (deporte.leagues && deporte.leagues.length > 0) {
                          e.preventDefault();
                          toggleSport(deporte.id);
                        } else {
                          onClose?.();
                        }
                      }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-dark-100 hover:text-white"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-yellow-400">
                          <deporte.icon className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="text-sm font-medium text-white">{deporte.name}</div>
                          <div className="text-xs text-dark-400">{deporte.liveEvents} en vivo</div>
                        </div>
                      </div>
                      {deporte.leagues && deporte.leagues.length > 0 && (
                        <FiChevronDown className="w-4 h-4 text-dark-400" />
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarSports;
