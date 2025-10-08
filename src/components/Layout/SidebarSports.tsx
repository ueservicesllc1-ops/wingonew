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
  MdSportsGolf,
  MdSportsTennis,
  MdSportsKabaddi
} from 'react-icons/md';
import { GiBoxingGlove, GiCycling, GiDart, GiPingPongBat } from 'react-icons/gi';
import { FiChevronDown, FiChevronRight, FiX } from 'react-icons/fi';

/**
 * Sidebar izquierda con listado completo de deportes
 * Simula datos que vendrían de una API
 */

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
  alwaysShowDesktop?: boolean; // Nueva prop para mostrar siempre en desktop
}

const SidebarSports = ({ isOpen = false, onClose, alwaysShowDesktop = false }: SidebarSportsProps) => {
  const [expandedSport, setExpandedSport] = useState<string | null>(null);
  const location = useLocation();

  // Simulación de datos de deportes (como si vinieran de una API)
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

  return (
    <>
      {/* Sidebar Desktop - Siempre visible si alwaysShowDesktop es true */}
      {(alwaysShowDesktop || isOpen) && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="hidden lg:flex flex-col h-full bg-dark-800 border-r border-dark-700"
        >
        {/* Header de la sidebar */}
        <div className="p-4 border-b border-dark-700 bg-dark-900">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Deportes</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {deportes.reduce((sum, d) => sum + d.liveEvents, 0)} eventos en vivo
          </p>
        </div>

        {/* Lista de deportes scrolleable */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {deportes.map((deporte, index) => (
            <motion.div
              key={deporte.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              {/* Deporte principal */}
              <div
                className={`group rounded-lg overflow-hidden ${
                  location.pathname.includes(deporte.id) ? 'bg-primary-500/10 border-primary-500' : ''
                }`}
              >
                <Link
                  to={`/sports/${deporte.id}`}
                  className="flex items-center justify-between p-3 hover:bg-dark-700 transition-all"
                  onClick={(e) => {
                    if (deporte.leagues && deporte.leagues.length > 0) {
                      e.preventDefault();
                      toggleSport(deporte.id);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <deporte.icon className={`w-5 h-5 ${
                      deporte.liveEvents > 0 ? 'text-green-400' : 'text-gray-400'
                    } group-hover:text-primary-400 transition-colors`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">
                        {deporte.name}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {deporte.liveEvents > 0 && (
                          <span className="text-green-400 font-semibold">
                            {deporte.liveEvents} en vivo
                          </span>
                        )}
                        <span>• {deporte.totalEvents} total</span>
                      </div>
                    </div>
                  </div>

                  {deporte.leagues && deporte.leagues.length > 0 && (
                    <motion.div
                      animate={{ rotate: expandedSport === deporte.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  )}
                </Link>

                {/* Ligas expandibles */}
                <AnimatePresence>
                  {expandedSport === deporte.id && deporte.leagues && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-dark-900/50"
                    >
                      {deporte.leagues.map((league) => (
                        <Link
                          key={league.name}
                          to={`/sports/${deporte.id}/${league.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex items-center justify-between px-3 py-2 pl-12 hover:bg-dark-700 transition-colors text-sm"
                        >
                          <span className="text-gray-300 hover:text-white transition-colors">
                            {league.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {league.events}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer de la sidebar */}
        <div className="p-4 border-t border-dark-700 bg-dark-900">
          <div className="text-xs text-gray-500 text-center">
            <p>Total de eventos disponibles</p>
            <p className="text-2xl font-bold text-primary-400 mt-1">
              {deportes.reduce((sum, d) => sum + d.totalEvents, 0).toLocaleString()}
            </p>
          </div>
        </div>
        </motion.aside>
      )}

      {/* Sidebar Móvil (Modal) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Sidebar Modal */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-dark-800 z-50 flex flex-col"
            >
              {/* Header del modal */}
              <div className="p-4 border-b border-dark-700 bg-dark-900 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Deportes</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {deportes.reduce((sum, d) => sum + d.liveEvents, 0)} eventos en vivo
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center hover:bg-dark-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Lista de deportes */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {deportes.map((deporte, index) => (
                  <motion.div
                    key={deporte.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <div className="group rounded-lg overflow-hidden">
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
                        className="flex items-center justify-between p-3 hover:bg-dark-700 transition-all"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <deporte.icon className={`w-5 h-5 ${
                            deporte.liveEvents > 0 ? 'text-green-400' : 'text-gray-400'
                          } group-hover:text-primary-400 transition-colors`} />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">
                              {deporte.name}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              {deporte.liveEvents > 0 && (
                                <span className="text-green-400 font-semibold">
                                  {deporte.liveEvents} en vivo
                                </span>
                              )}
                              <span>• {deporte.totalEvents}</span>
                            </div>
                          </div>
                        </div>

                        {deporte.leagues && deporte.leagues.length > 0 && (
                          <motion.div
                            animate={{ rotate: expandedSport === deporte.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiChevronDown className="w-4 h-4 text-gray-400" />
                          </motion.div>
                        )}
                      </Link>

                      {/* Ligas */}
                      <AnimatePresence>
                        {expandedSport === deporte.id && deporte.leagues && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-dark-900/50"
                          >
                            {deporte.leagues.map((league) => (
                              <Link
                                key={league.name}
                                to={`/sports/${deporte.id}/${league.name.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={onClose}
                                className="flex items-center justify-between px-3 py-2 pl-12 hover:bg-dark-700 transition-colors text-sm"
                              >
                                <span className="text-gray-300">{league.name}</span>
                                <span className="text-xs text-gray-500">{league.events}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
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
