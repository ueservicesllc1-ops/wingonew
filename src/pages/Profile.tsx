import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { transactionService } from '@/services/transactionService';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import { User, Wallet, DollarSign, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!user) return;
    
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }

    setLoading(true);
    try {
      await transactionService.deposit(user.id, depositAmount);
      const updatedUser = await authService.getUserData(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
      toast.success('¡Depósito realizado exitosamente!');
      setShowDepositModal(false);
      setAmount('');
    } catch (error) {
      toast.error('Error al realizar el depósito');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user) return;
    
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }

    if (withdrawAmount > user.balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    setLoading(true);
    try {
      await transactionService.withdraw(user.id, withdrawAmount);
      const updatedUser = await authService.getUserData(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
      toast.success('Solicitud de retiro enviada');
      setShowWithdrawModal(false);
      setAmount('');
    } catch (error) {
      toast.error('Error al solicitar el retiro');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-gray-400">Gestiona tu cuenta y balance</p>
      </div>

      {/* User Info Card */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user.displayName}</h2>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Miembro desde {format(user.createdAt, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="card bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 mb-2">Balance Disponible</p>
            <p className="text-4xl font-bold text-white">${user.balance.toFixed(2)}</p>
          </div>
          <Wallet className="w-16 h-16 text-blue-200 opacity-50" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowDepositModal(true)}
          className="card hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <ArrowDownCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold text-white">Depositar</p>
              <p className="text-sm text-gray-400">Agregar fondos a tu cuenta</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="card hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <ArrowUpCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold text-white">Retirar</p>
              <p className="text-sm text-gray-400">Retirar fondos de tu cuenta</p>
            </div>
          </div>
        </button>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Depositar Fondos</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monto a depositar
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input pl-10"
                    placeholder="0.00"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeposit}
                  disabled={loading}
                  className="btn-success flex-1 disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Depositar'}
                </button>
                <button
                  onClick={() => {
                    setShowDepositModal(false);
                    setAmount('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Retirar Fondos</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monto a retirar
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input pl-10"
                    placeholder="0.00"
                    min="1"
                    max={user.balance}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Balance disponible: ${user.balance.toFixed(2)}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleWithdraw}
                  disabled={loading}
                  className="btn-danger flex-1 disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Retirar'}
                </button>
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setAmount('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
