import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrendingUp, FiClock, FiCheck, FiX as FiXIcon } from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';
import { Bet } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Datos de ejemplo
const exampleBets: Bet[] = [
  {
    id: '1',
    userId: 'user1',
    event: {
      id: 'evt1',
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
      league: 'La Liga',
      date: new Date('2024-01-15'),
      status: 'completed'
    },
    betType: 'home',
    odds: 2.45,
    amount: 50.00,
    potentialWin: 122.50,
    status: 'won',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    userId: 'user1',
    event: {
      id: 'evt2',
      homeTeam: 'Manchester City',
      awayTeam: 'Liverpool',
      league: 'Premier League',
      date: new Date('2024-01-16'),
      status: 'live'
    },
    betType: 'draw',
    odds: 3.20,
    amount: 25.00,
    potentialWin: 80.00,
    status: 'pending',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    userId: 'user1',
    event: {
      id: 'evt3',
      homeTeam: 'PSG',
      awayTeam: 'Bayern Munich',
      league: 'Champions League',
      date: new Date('2024-01-12'),
      status: 'completed'
    },
    betType: 'away',
    odds: 1.85,
    amount: 100.00,
    potentialWin: 185.00,
    status: 'lost',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '4',
    userId: 'user1',
    event: {
      id: 'evt4',
      homeTeam: 'Chelsea',
      awayTeam: 'Arsenal',
      league: 'Premier League',
      date: new Date('2024-01-18'),
      status: 'scheduled'
    },
    betType: 'home',
    odds: 2.10,
    amount: 75.00,
    potentialWin: 157.50,
    status: 'pending',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  }
];

interface MyBetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyBetsModal = ({ isOpen, onClose }: MyBetsModalProps) => {
  const { user } = useAuthStore();
  const [bets, setBets] = useState<Bet[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');

  useEffect(() => {
    if (user) {
      setBets(exampleBets);
    }
  }, [user]);

  const filteredBets = bets.filter((bet) => {
    if (filter === 'all') return true;
    return bet.status === filter;
  });

  const statusColors = {
    pending: 'bg-gray-600',
    won: 'bg-green-800',
    lost: 'bg-red-800',
  };

  const statusIcons = {
    pending: FiClock,
    won: FiCheck,
    lost: FiXIcon,
  };

  const statusLabels = {
    pending: 'Pendiente',
    won: 'Ganada',
    lost: 'Perdida',
  };

  const totalBets = bets.length;
  const wonBets = bets.filter(b => b.status === 'won').length;
  const lostBets = bets.filter(b => b.status === 'lost').length;
  const pendingBets = bets.filter(b => b.status === 'pending').length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-black border border-gray-700 rounded-lg w-full max-w-7xl max-h-[98vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FiTrendingUp className="w-5 h-5 mr-2" />
                  Mis Apuestas
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                >
                  <FiX className="w-4 h-4 text-gray-300" />
                </button>
              </div>

              {/* Stats */}
              <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Total</p>
                    <p className="text-lg font-bold text-white">{totalBets}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Pendientes</p>
                    <p className="text-lg font-bold text-white">{pendingBets}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Ganadas</p>
                    <p className="text-lg font-bold text-white">{wonBets}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Perdidas</p>
                    <p className="text-lg font-bold text-white">{lostBets}</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
                <div className="flex space-x-2">
                  {[
                    { key: 'all', label: 'Todas' },
                    { key: 'pending', label: 'Pendientes' },
                    { key: 'won', label: 'Ganadas' },
                    { key: 'lost', label: 'Perdidas' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key as any)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        filter === key
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[700px]">
                {filteredBets.length === 0 ? (
                  <div className="text-center py-8">
                    <FiTrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No tienes apuestas</p>
                  </div>
                ) : (
                  <div className="bg-black">
                    {/* Tabla simple y elegante */}
                    <table className="w-full">
                      <thead className="bg-gray-900 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-white">Evento</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-white">Selección</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-white">Cuota</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-white">Apostado</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-white">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBets.map((bet, index) => {
                          const StatusIcon = statusIcons[bet.status];
                          const isEven = index % 2 === 0;
                          
                          return (
                            <tr 
                              key={bet.id} 
                              className={`${isEven ? 'bg-black' : 'bg-gray-800'}`}
                            >
                              {/* Evento */}
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-xs text-gray-400">{bet.event.league}</p>
                                  <p className="text-sm text-white font-medium">
                                    {bet.event.homeTeam} vs {bet.event.awayTeam}
                                  </p>
                                </div>
                              </td>

                              {/* Selección */}
                              <td className="px-4 py-3">
                                <span className="text-sm text-white">
                                  {bet.betType === 'home' && bet.event.homeTeam}
                                  {bet.betType === 'draw' && 'Empate'}
                                  {bet.betType === 'away' && bet.event.awayTeam}
                                </span>
                              </td>

                              {/* Cuota */}
                              <td className="px-4 py-3">
                                <span className="text-sm text-white font-bold">
                                  {bet.odds.toFixed(2)}
                                </span>
                              </td>

                              {/* Apostado */}
                              <td className="px-4 py-3">
                                <span className="text-sm text-white">
                                  ${bet.amount.toFixed(2)}
                                </span>
                              </td>

                              {/* Estado */}
                              <td className="px-4 py-3">
                                <span className="text-xs text-white bg-gray-600 px-2 py-1 rounded flex items-center w-fit">
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusLabels[bet.status]}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-800 px-6 py-3 border-t border-gray-700">
                <p className="text-xs text-gray-400 text-center">
                  Mostrando {filteredBets.length} de {bets.length} apuestas
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MyBetsModal;
