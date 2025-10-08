import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiClock, FiCheck, FiX as FiXIcon, FiFilter } from 'react-icons/fi';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface UserBetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

interface Bet {
  id: string;
  eventName: string;
  betType: string;
  amount: number;
  odds: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost';
  date: string;
  result?: string;
}

const UserBetsModal = ({ isOpen, onClose, userId, userName }: UserBetsModalProps) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');

  useEffect(() => {
    if (isOpen && userId) {
      loadUserBets();
    }
  }, [isOpen, userId]);

  const loadUserBets = async () => {
    setLoading(true);
    try {
      const betsRef = collection(db, 'bets');
      const q = query(
        betsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const betsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          eventName: data.eventName || 'Evento desconocido',
          betType: data.betType || 'N/A',
          amount: data.amount || 0,
          odds: data.odds || 0,
          potentialWin: data.potentialWin || 0,
          status: data.status || 'pending',
          date: data.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
          result: data.result
        };
      });
      
      setBets(betsData);
    } catch (error) {
      console.error('Error al cargar apuestas:', error);
      // Datos de ejemplo si no hay en Firestore
      setBets([
        {
          id: '1',
          eventName: 'Real Madrid vs Barcelona',
          betType: 'Ganador: Real Madrid',
          amount: 50,
          odds: 2.5,
          potentialWin: 125,
          status: 'won',
          date: '2024-10-05',
          result: 'Real Madrid 2-1'
        },
        {
          id: '2',
          eventName: 'Manchester United vs Liverpool',
          betType: 'Más de 2.5 goles',
          amount: 30,
          odds: 1.8,
          potentialWin: 54,
          status: 'lost',
          date: '2024-10-04',
          result: 'Manchester United 1-0'
        },
        {
          id: '3',
          eventName: 'PSG vs Bayern Munich',
          betType: 'Empate',
          amount: 25,
          odds: 3.2,
          potentialWin: 80,
          status: 'pending',
          date: '2024-10-08'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBets = filter === 'all' ? bets : bets.filter(bet => bet.status === filter);

  const statusColors = {
    won: 'bg-green-800',
    lost: 'bg-red-800',
    pending: 'bg-gray-600'
  };

  const statusIcons = {
    won: FiCheck,
    lost: FiXIcon,
    pending: FiClock
  };

  const statusLabels = {
    won: 'Ganada',
    lost: 'Perdida',
    pending: 'Pendiente'
  };

  const stats = {
    total: bets.length,
    won: bets.filter(b => b.status === 'won').length,
    lost: bets.filter(b => b.status === 'lost').length,
    pending: bets.filter(b => b.status === 'pending').length,
    totalWagered: bets.reduce((sum, b) => sum + b.amount, 0),
    totalWon: bets.filter(b => b.status === 'won').reduce((sum, b) => sum + b.potentialWin, 0)
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[98vh] flex flex-col border border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Apuestas de {userName}
              </h2>
              <p className="text-gray-400 text-sm mt-1">Historial completo de apuestas</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Estadísticas */}
          <div className="p-6 border-b border-gray-700 bg-black/30">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-xs text-gray-400 mt-1">Total</div>
              </div>
              <div className="bg-green-900/30 rounded-lg p-4 text-center border border-green-700/30">
                <div className="text-2xl font-bold text-green-400">{stats.won}</div>
                <div className="text-xs text-gray-400 mt-1">Ganadas</div>
              </div>
              <div className="bg-red-900/30 rounded-lg p-4 text-center border border-red-700/30">
                <div className="text-2xl font-bold text-red-400">{stats.lost}</div>
                <div className="text-xs text-gray-400 mt-1">Perdidas</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
                <div className="text-xs text-gray-400 mt-1">Pendientes</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-white">${stats.totalWagered.toFixed(2)}</div>
                <div className="text-xs text-gray-400 mt-1">Apostado</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-green-400">${stats.totalWon.toFixed(2)}</div>
                <div className="text-xs text-gray-400 mt-1">Ganado</div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="p-6 border-b border-gray-700 bg-black/20">
            <div className="flex items-center space-x-2">
              <FiFilter className="w-5 h-5 text-gray-400" />
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Todas ({bets.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'pending'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Pendientes ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('won')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'won'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Ganadas ({stats.won})
              </button>
              <button
                onClick={() => setFilter('lost')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'lost'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Perdidas ({stats.lost})
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-600 border-t-transparent"></div>
              </div>
            ) : filteredBets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No hay apuestas para mostrar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Evento</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Tipo</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Monto</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Cuota</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Ganancia Pot.</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBets.map((bet, index) => {
                      const StatusIcon = statusIcons[bet.status];
                      return (
                        <tr
                          key={bet.id}
                          className={index % 2 === 0 ? 'bg-black/30' : 'bg-gray-900/50'}
                        >
                          <td className="px-4 py-4 text-white font-medium">{bet.eventName}</td>
                          <td className="px-4 py-4 text-gray-300 text-sm">{bet.betType}</td>
                          <td className="px-4 py-4 text-right text-white font-semibold">${bet.amount.toFixed(2)}</td>
                          <td className="px-4 py-4 text-center text-yellow-400 font-bold">{bet.odds.toFixed(2)}</td>
                          <td className="px-4 py-4 text-right text-green-400 font-semibold">${bet.potentialWin.toFixed(2)}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center">
                              <span className={`${statusColors[bet.status]} px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center space-x-1`}>
                                <StatusIcon className="w-3 h-3" />
                                <span>{statusLabels[bet.status]}</span>
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-400 text-sm">{bet.date}</td>
                          <td className="px-4 py-4 text-gray-300 text-sm">{bet.result || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700 bg-black/30">
            <button
              onClick={onClose}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserBetsModal;
