import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { transactionService } from '@/services/transactionService';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

const Transactions = () => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return;

      try {
        const userTransactions = await transactionService.getUserTransactions(user.id);
        setTransactions(userTransactions);
      } catch (error) {
        console.error('Error cargando transacciones:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user]);

  const typeIcons = {
    deposit: ArrowDownCircle,
    withdraw: ArrowUpCircle,
    bet: TrendingUp,
    win: DollarSign,
  };

  const typeColors = {
    deposit: 'text-green-500',
    withdraw: 'text-red-500',
    bet: 'text-blue-500',
    win: 'text-green-500',
  };

  const typeLabels = {
    deposit: 'Depósito',
    withdraw: 'Retiro',
    bet: 'Apuesta',
    win: 'Ganancia',
  };

  const statusIcons = {
    pending: Clock,
    completed: CheckCircle,
    failed: XCircle,
  };

  const statusColors = {
    pending: 'text-blue-400',
    completed: 'text-green-400',
    failed: 'text-red-400',
  };

  const statusLabels = {
    pending: 'Pendiente',
    completed: 'Completado',
    failed: 'Fallido',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Transacciones</h1>
        <p className="text-gray-400">Historial completo de movimientos</p>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No tienes transacciones aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const TypeIcon = typeIcons[transaction.type];
            const StatusIcon = statusIcons[transaction.status];
            
            return (
              <div key={transaction.id} className="card hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center ${typeColors[transaction.type]}`}>
                      <TypeIcon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-semibold">
                          {typeLabels[transaction.type]}
                        </p>
                        <StatusIcon className={`w-4 h-4 ${statusColors[transaction.status]}`} />
                      </div>
                      <p className="text-sm text-gray-400">{transaction.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(transaction.createdAt, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className={`text-xs ${statusColors[transaction.status]}`}>
                      {statusLabels[transaction.status]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Transactions;
