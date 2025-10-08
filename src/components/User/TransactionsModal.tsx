import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCreditCard, FiClock, FiCheck, FiX as FiXIcon, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Datos de ejemplo para transacciones
const exampleTransactions = [
  {
    id: '1',
    userId: 'user1',
    type: 'deposit',
    amount: 100.00,
    status: 'completed',
    description: 'Depósito por transferencia bancaria',
    createdAt: new Date('2024-01-15'),
    reference: 'DEP-001234'
  },
  {
    id: '2',
    userId: 'user1',
    type: 'withdrawal',
    amount: 50.00,
    status: 'pending',
    description: 'Retiro a cuenta bancaria',
    createdAt: new Date('2024-01-16'),
    reference: 'WTH-001235'
  },
  {
    id: '3',
    userId: 'user1',
    type: 'bet_win',
    amount: 122.50,
    status: 'completed',
    description: 'Ganancia de apuesta - Barcelona vs Real Madrid',
    createdAt: new Date('2024-01-14'),
    reference: 'WIN-001233'
  },
  {
    id: '4',
    userId: 'user1',
    type: 'bet_loss',
    amount: -100.00,
    status: 'completed',
    description: 'Apuesta perdida - PSG vs Bayern Munich',
    createdAt: new Date('2024-01-12'),
    reference: 'BET-001232'
  },
  {
    id: '5',
    userId: 'user1',
    type: 'deposit',
    amount: 200.00,
    status: 'completed',
    description: 'Depósito por tarjeta de crédito',
    createdAt: new Date('2024-01-10'),
    reference: 'DEP-001231'
  },
  {
    id: '6',
    userId: 'user1',
    type: 'bonus',
    amount: 25.00,
    status: 'completed',
    description: 'Bono de bienvenida',
    createdAt: new Date('2024-01-08'),
    reference: 'BON-001230'
  },
  {
    id: '7',
    userId: 'user1',
    type: 'withdrawal',
    amount: 75.00,
    status: 'failed',
    description: 'Retiro rechazado - datos incorrectos',
    createdAt: new Date('2024-01-05'),
    reference: 'WTH-001229'
  },
  {
    id: '8',
    userId: 'user1',
    type: 'bet_win',
    amount: 114.00,
    status: 'completed',
    description: 'Ganancia de apuesta - Inter Milan vs Juventus',
    createdAt: new Date('2024-01-09'),
    reference: 'WIN-001228'
  }
];

interface TransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionsModal = ({ isOpen, onClose }: TransactionsModalProps) => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState(exampleTransactions);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    if (user) {
      setTransactions(exampleTransactions);
    }
  }, [user]);

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });


  const statusIcons: Record<string, any> = {
    completed: FiCheck,
    pending: FiClock,
    failed: FiXIcon,
  };

  const statusLabels: Record<string, string> = {
    completed: 'Completada',
    pending: 'Pendiente',
    failed: 'Fallida',
  };

  const typeIcons: Record<string, any> = {
    deposit: FiArrowDown,
    withdrawal: FiArrowUp,
    bet_win: FiCheck,
    bet_loss: FiXIcon,
    bonus: FiCreditCard,
  };

  const typeLabels: Record<string, string> = {
    deposit: 'Depósito',
    withdrawal: 'Retiro',
    bet_win: 'Ganancia',
    bet_loss: 'Apuesta',
    bonus: 'Bono',
  };

  const typeColors: Record<string, string> = {
    deposit: 'text-green-400',
    withdrawal: 'text-blue-400',
    bet_win: 'text-green-400',
    bet_loss: 'text-red-400',
    bonus: 'text-yellow-400',
  };

  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const failedTransactions = transactions.filter(t => t.status === 'failed').length;

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
                  <FiCreditCard className="w-5 h-5 mr-2" />
                  Mis Transacciones
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
                    <p className="text-lg font-bold text-white">{totalTransactions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Completadas</p>
                    <p className="text-lg font-bold text-white">{completedTransactions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Pendientes</p>
                    <p className="text-lg font-bold text-white">{pendingTransactions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Fallidas</p>
                    <p className="text-lg font-bold text-white">{failedTransactions}</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
                <div className="flex space-x-2">
                  {[
                    { key: 'all', label: 'Todas' },
                    { key: 'completed', label: 'Completadas' },
                    { key: 'pending', label: 'Pendientes' },
                    { key: 'failed', label: 'Fallidas' }
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
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <FiCreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No tienes transacciones</p>
                  </div>
                ) : (
                  <div className="bg-black">
                    {/* Tabla simple y elegante */}
                    <table className="w-full">
                      <thead className="bg-gray-900 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-white">Tipo</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-white">Descripción</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-white">Monto</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-white">Estado</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-white">Referencia</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-white">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((transaction, index) => {
                          const StatusIcon = statusIcons[transaction.status];
                          const TypeIcon = typeIcons[transaction.type];
                          const isEven = index % 2 === 0;
                          
                          return (
                            <tr 
                              key={transaction.id} 
                              className={`${isEven ? 'bg-black' : 'bg-gray-800'}`}
                            >
                              {/* Tipo */}
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <TypeIcon className={`w-4 h-4 ${typeColors[transaction.type]}`} />
                                  <span className={`text-sm font-medium ${typeColors[transaction.type]}`}>
                                    {typeLabels[transaction.type]}
                                  </span>
                                </div>
                              </td>

                              {/* Descripción */}
                              <td className="px-4 py-3">
                                <span className="text-sm text-white">
                                  {transaction.description}
                                </span>
                              </td>

                              {/* Monto */}
                              <td className="px-4 py-3">
                                <span className={`text-sm font-bold ${
                                  transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                                </span>
                              </td>

                              {/* Estado */}
                              <td className="px-4 py-3">
                                <span className="text-xs text-white bg-gray-600 px-2 py-1 rounded flex items-center w-fit">
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusLabels[transaction.status]}
                                </span>
                              </td>

                              {/* Referencia */}
                              <td className="px-4 py-3">
                                <span className="text-xs text-gray-400 font-mono">
                                  {transaction.reference}
                                </span>
                              </td>

                              {/* Fecha */}
                              <td className="px-4 py-3">
                                <span className="text-xs text-gray-400">
                                  {format(transaction.createdAt, "d/MM/yy HH:mm", { locale: es })}
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
                  Mostrando {filteredTransactions.length} de {transactions.length} transacciones
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionsModal;
