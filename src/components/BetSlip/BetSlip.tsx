import { useState } from 'react';
import { X, Trash2, ChevronRight } from 'lucide-react';
import { useBetSlipStore } from '@/store/useBetSlipStore';
import { useAuthStore } from '@/store/useAuthStore';
import { betService } from '@/services/betService';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const BetSlip = () => {
  const { bets, removeBet, updateAmount, clearBets, getTotalOdds, getPotentialWin } = useBetSlipStore();
  const { user, setUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const handlePlaceBets = async () => {
    if (!user) return;

    const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
    
    if (totalAmount > user.balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    if (bets.some(bet => bet.amount <= 0)) {
      toast.error('Ingresa un monto válido para todas las apuestas');
      return;
    }

    setIsPlacingBet(true);

    try {
      // Colocar todas las apuestas
      for (const bet of bets) {
        await betService.placeBet(user.id, bet);
      }

      // Actualizar balance del usuario
      const updatedUser = await authService.getUserData(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }

      toast.success('¡Apuestas realizadas con éxito!');
      clearBets();
      setIsOpen(false);
    } catch (error) {
      toast.error('Error al realizar las apuestas');
      console.error(error);
    } finally {
      setIsPlacingBet(false);
    }
  };

  if (bets.length === 0) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-20 right-4 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center space-x-2 z-40"
      >
        <span className="font-semibold">Apuestas ({bets.length})</span>
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bet Slip Panel */}
      <aside
        className={`fixed lg:static right-0 top-0 bottom-0 w-full sm:w-96 bg-gray-800 border-l border-gray-700 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              Carrito de Apuestas ({bets.length})
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Bets List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {bets.map((bet) => (
              <div key={bet.eventId} className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">{bet.event.league}</p>
                    <p className="text-white font-medium">
                      {bet.event.homeTeam} vs {bet.event.awayTeam}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(bet.event.startTime, "d 'de' MMMM, HH:mm", { locale: es })}
                    </p>
                  </div>
                  <button
                    onClick={() => removeBet(bet.eventId)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-sm text-gray-400">Selección:</span>
                    <p className="text-blue-400 font-semibold">
                      {bet.betType === 'home' && bet.event.homeTeam}
                      {bet.betType === 'draw' && 'Empate'}
                      {bet.betType === 'away' && bet.event.awayTeam}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400">Cuota:</span>
                    <p className="text-green-500 font-bold">{bet.odds.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-sm text-gray-400">Monto:</label>
                  <input
                    type="number"
                    min="1"
                    value={bet.amount || ''}
                    onChange={(e) => updateAmount(bet.eventId, Number(e.target.value))}
                    className="input mt-1"
                    placeholder="0.00"
                  />
                </div>

                <div className="mt-2 text-sm">
                  <span className="text-gray-400">Ganancia potencial: </span>
                  <span className="text-green-500 font-semibold">
                    ${(bet.amount * bet.odds).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary & Actions */}
          <div className="border-t border-gray-700 p-4 space-y-3">
            {bets.length > 1 && (
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cuota combinada:</span>
                  <span className="text-green-500 font-bold">
                    {getTotalOdds().toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ganancia potencial total:</span>
              <span className="text-2xl font-bold text-green-500">
                ${getPotentialWin().toFixed(2)}
              </span>
            </div>

            <button
              onClick={handlePlaceBets}
              disabled={isPlacingBet}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingBet ? 'Procesando...' : 'Realizar Apuestas'}
            </button>

            <button
              onClick={clearBets}
              className="btn-danger w-full"
            >
              Limpiar Todo
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default BetSlip;
