import { useState } from 'react';
import { X, Trash2, Receipt } from 'lucide-react';
import { useBetSlipStore } from '@/store/useBetSlipStore';
import { useAuthStore } from '@/store/useAuthStore';
import { betService } from '@/services/betService';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

const BetSlipPro = () => {
  const { bets, removeBet, updateAmount, clearBets, getPotentialWin } = useBetSlipStore();
  const { user, setUser } = useAuthStore();
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const handlePlaceBets = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para apostar');
      return;
    }

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
      for (const bet of bets) {
        await betService.placeBet(user.id, bet);
      }

      const updatedUser = await authService.getUserData(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }

      toast.success('¡Apuestas realizadas con éxito!');
      clearBets();
    } catch (error) {
      toast.error('Error al realizar las apuestas');
      console.error(error);
    } finally {
      setIsPlacingBet(false);
    }
  };

  return (
    <aside className="hidden xl:block fixed right-0 top-16 bottom-0 w-80 bg-betting-bg-light border-l border-betting-border overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-betting-bg-light border-b border-betting-border p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-brand-green" />
            <h2 className="text-lg font-bold text-white">
              Cupón de Apuestas
            </h2>
          </div>
          {bets.length > 0 && (
            <span className="bg-brand-green text-white text-xs font-bold px-2 py-1 rounded">
              {bets.length}
            </span>
          )}
        </div>
      </div>

      {/* Bets List */}
      {bets.length === 0 ? (
        <div className="p-6 text-center">
          <Receipt className="w-16 h-16 text-betting-text-muted mx-auto mb-4 opacity-50" />
          <p className="text-betting-text-muted text-sm">
            Tu cupón está vacío
          </p>
          <p className="text-betting-text-muted text-xs mt-2">
            Haz clic en las cuotas para agregar apuestas
          </p>
        </div>
      ) : (
        <>
          <div className="p-3 space-y-2">
            {bets.map((bet) => (
              <div key={bet.eventId} className="bg-betting-bg rounded-lg p-3 border border-betting-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-betting-text-muted mb-1">
                      {bet.event.league}
                    </div>
                    <div className="text-white text-sm font-semibold truncate">
                      {bet.event.homeTeam} vs {bet.event.awayTeam}
                    </div>
                  </div>
                  <button
                    onClick={() => removeBet(bet.eventId)}
                    className="text-betting-text-muted hover:text-red-500 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3 p-2 bg-betting-bg-lighter rounded">
                  <span className="text-white text-sm">
                    {bet.betType === 'home' && bet.event.homeTeam}
                    {bet.betType === 'draw' && 'Empate'}
                    {bet.betType === 'away' && bet.event.awayTeam}
                  </span>
                  <span className="text-brand-green font-bold text-lg">
                    {bet.odds.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-betting-text-muted text-xs flex-shrink-0">Apuesta:</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-betting-text-muted">$</span>
                      <input
                        type="number"
                        min="1"
                        value={bet.amount || ''}
                        onChange={(e) => updateAmount(bet.eventId, Number(e.target.value))}
                        className="w-full bg-betting-bg-lighter border border-betting-border rounded px-4 pl-6 py-2 text-white text-right focus:outline-none focus:border-brand-green"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-betting-text-muted">Ganancia:</span>
                    <span className="text-brand-green font-bold">
                      ${(bet.amount * bet.odds).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="sticky bottom-0 bg-betting-bg-light border-t border-betting-border p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-betting-text-muted">Total a Pagar:</span>
                <span className="text-white font-bold text-lg">
                  ${bets.reduce((sum, bet) => sum + bet.amount, 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-brand-green/10 rounded">
                <span className="text-white font-semibold">Ganancia Potencial:</span>
                <span className="text-brand-green font-bold text-xl">
                  ${getPotentialWin().toFixed(2)}
                </span>
              </div>

              <button
                onClick={handlePlaceBets}
                disabled={isPlacingBet || !user}
                className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!user ? 'Inicia Sesión para Apostar' : isPlacingBet ? 'Procesando...' : 'Realizar Apuestas'}
              </button>

              <button
                onClick={clearBets}
                className="btn-secondary w-full py-2"
              >
                <div className="flex items-center justify-center space-x-2">
                  <X className="w-4 h-4" />
                  <span>Limpiar Cupón</span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default BetSlipPro;
