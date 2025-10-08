import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiClock, FiCheck, FiX as FiXIcon, FiFilter, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface UserTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method?: string;
  description: string;
  reference?: string;
}

const UserTransactionsModal = ({ isOpen, onClose, userId, userName }: UserTransactionsModalProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus'>('all');

  useEffect(() => {
    if (isOpen && userId) {
      loadUserTransactions();
    }
  }, [isOpen, userId]);

  const loadUserTransactions = async () => {
    setLoading(true);
    try {
      const transactionsRef = collection(db, 'transactions');
      const q = query(
        transactionsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const transactionsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type || 'deposit',
          amount: data.amount || 0,
          status: data.status || 'completed',
          date: data.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
          method: data.method,
          description: data.description || 'Sin descripción',
          reference: data.reference
        };
      });
      
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
      // Datos de ejemplo si no hay en Firestore
      setTransactions([
        {
          id: '1',
          type: 'deposit',
          amount: 100,
          status: 'completed',
          date: '2024-10-05',
          method: 'Tarjeta de Crédito',
          description: 'Depósito con tarjeta',
          reference: 'TXN001'
        },
        {
          id: '2',
          type: 'bet',
          amount: -50,
          status: 'completed',
          date: '2024-10-05',
          description: 'Apuesta: Real Madrid vs Barcelona'
        },
        {
          id: '3',
          type: 'win',
          amount: 125,
          status: 'completed',
          date: '2024-10-05',
          description: 'Ganancia: Real Madrid vs Barcelona'
        },
        {
          id: '4',
          type: 'withdrawal',
          amount: -75,
          status: 'pending',
          date: '2024-10-06',
          method: 'Transferencia Bancaria',
          description: 'Retiro a cuenta bancaria',
          reference: 'TXN002'
        },
        {
          id: '5',
          type: 'bonus',
          amount: 50,
          status: 'completed',
          date: '2024-10-01',
          description: 'Bono de bienvenida'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  const statusColors = {
    completed: 'bg-green-800',
    failed: 'bg-red-800',
    pending: 'bg-gray-600'
  };

  const statusIcons = {
    completed: FiCheck,
    failed: FiXIcon,
    pending: FiClock
  };

  const statusLabels = {
    completed: 'Completada',
    failed: 'Fallida',
    pending: 'Pendiente'
  };

  const typeLabels = {
    deposit: 'Depósito',
    withdrawal: 'Retiro',
    bet: 'Apuesta',
    win: 'Ganancia',
    bonus: 'Bono'
  };

  const typeColors = {
    deposit: 'text-green-400',
    withdrawal: 'text-red-400',
    bet: 'text-orange-400',
    win: 'text-green-400',
    bonus: 'text-purple-400'
  };

  const stats = {
    total: transactions.length,
    deposits: transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
    withdrawals: Math.abs(transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0)),
    bets: Math.abs(transactions.filter(t => t.type === 'bet').reduce((sum, t) => sum + t.amount, 0)),
    wins: transactions.filter(t => t.type === 'win').reduce((sum, t) => sum + t.amount, 0),
    bonuses: transactions.filter(t => t.type === 'bonus').reduce((sum, t) => sum + t.amount, 0)
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
                Transacciones de {userName}
              </h2>
              <p className="text-gray-400 text-sm mt-1">Historial completo de transacciones</p>
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
                <div className="text-xl font-bold text-green-400">${stats.deposits.toFixed(2)}</div>
                <div className="text-xs text-gray-400 mt-1">Depósitos</div>
              </div>
              <div className="bg-red-900/30 rounded-lg p-4 text-center border border-red-700/30">
                <div className="text-xl font-bold text-red-400">${stats.withdrawals.toFixed(2)}</div>
                <div className="text-xs text-gray-400 mt-1">Retiros</div>
              </div>
              <div className="bg-orange-900/30 rounded-lg p-4 text-center border border-orange-700/30">
                <div className="text-xl font-bold text-orange-400">${stats.bets.toFixed(2)}</div>
                <div className="text-xs text-gray-400 mt-1">Apostado</div>
              </div>
              <div className="bg-green-900/30 rounded-lg p-4 text-center border border-green-700/30">
                <div className="text-xl font-bold text-green-400">${stats.wins.toFixed(2)}</div>
                <div className="text-xs text-gray-400 mt-1">Ganancias</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4 text-center border border-purple-700/30">
                <div className="text-xl font-bold text-purple-400">${stats.bonuses.toFixed(2)}</div>
                <div className="text-xs text-gray-400 mt-1">Bonos</div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="p-6 border-b border-gray-700 bg-black/20">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <FiFilter className="w-5 h-5 text-gray-400" />
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Todas ({transactions.length})
              </button>
              <button
                onClick={() => setFilter('deposit')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'deposit'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Depósitos
              </button>
              <button
                onClick={() => setFilter('withdrawal')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'withdrawal'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Retiros
              </button>
              <button
                onClick={() => setFilter('bet')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'bet'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Apuestas
              </button>
              <button
                onClick={() => setFilter('win')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'win'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Ganancias
              </button>
              <button
                onClick={() => setFilter('bonus')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'bonus'
                    ? 'bg-yellow-600 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Bonos
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-600 border-t-transparent"></div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No hay transacciones para mostrar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Descripción</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Monto</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Método</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Referencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx, index) => {
                      const StatusIcon = statusIcons[tx.status];
                      const isPositive = tx.amount > 0;
                      return (
                        <tr
                          key={tx.id}
                          className={index % 2 === 0 ? 'bg-black/30' : 'bg-gray-900/50'}
                        >
                          <td className="px-4 py-4">
                            <span className={`font-semibold ${typeColors[tx.type]}`}>
                              {typeLabels[tx.type]}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-300 text-sm">{tx.description}</td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              {isPositive ? (
                                <FiArrowUp className="w-4 h-4 text-green-400" />
                              ) : (
                                <FiArrowDown className="w-4 h-4 text-red-400" />
                              )}
                              <span className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {isPositive ? '+' : ''}{tx.amount.toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-400 text-sm">{tx.method || '-'}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center">
                              <span className={`${statusColors[tx.status]} px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center space-x-1`}>
                                <StatusIcon className="w-3 h-3" />
                                <span>{statusLabels[tx.status]}</span>
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-400 text-sm">{tx.date}</td>
                          <td className="px-4 py-4 text-gray-400 text-xs font-mono">{tx.reference || '-'}</td>
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

export default UserTransactionsModal;
