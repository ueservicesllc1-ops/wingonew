import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBetSlipStore } from '@/store/useBetSlipStore';
import { useAuthStore } from '@/store/useAuthStore';
import { FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

/**
 * BetSlip moderno con animaciones y diseño profesional
 * Muestra las apuestas seleccionadas y permite gestionarlas
 */
const BetSlipModern = () => {
  const { bets, removeBet, updateBetStake, clearBets } = useBetSlipStore();
  const { user } = useAuthStore();
  const [betType, setBetType] = useState<'single' | 'multiple'>('single');

  // Calcular el total de las apuestas
  const totalStake = bets.reduce((sum, bet) => sum + (bet.stake || 0), 0);
  const totalOdds = bets.reduce((product, bet) => product * bet.odds, 1);
  const potentialWin = betType === 'multiple' ? totalStake * totalOdds : bets.reduce((sum, bet) => sum + (bet.stake || 0) * bet.odds, 0);

  const handlePlaceBet = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para apostar');
      return;
    }

    if (totalStake === 0) {
      toast.error('Debes ingresar un monto');
      return;
    }

    if (totalStake > user.balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    // Aquí iría la lógica para colocar la apuesta
    toast.success('¡Apuesta realizada con éxito!');
    clearBets();
  };

  if (bets.length === 0) {
    return (
      <div className="h-full bg-dark-800 rounded-xl border border-dark-700 p-8 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center mb-4"
        >
          <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">Boleto Vacío</h3>
        <p className="text-gray-400 text-sm">
          Selecciona una cuota para empezar a apostar
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-dark-800 rounded-xl border border-dark-700 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gradient-primary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Mi Boleto</h3>
          <button
            onClick={clearBets}
            className="text-white/80 hover:text-white text-sm flex items-center space-x-1"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        </div>

        {/* Selector de tipo de apuesta */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setBetType('single')}
            className={`py-2 rounded-lg font-medium transition-all ${
              betType === 'single'
                ? 'bg-white text-primary-700'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => setBetType('multiple')}
            className={`py-2 rounded-lg font-medium transition-all ${
              betType === 'multiple'
                ? 'bg-white text-primary-700'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Múltiple
          </button>
        </div>
      </div>

      {/* Lista de apuestas */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        <AnimatePresence>
          {bets.map((bet) => (
            <motion.div
              key={bet.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-dark-900 rounded-lg border border-dark-700 p-4"
            >
              {/* Info de la apuesta */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Evento</p>
                  <p className="text-white font-medium text-sm">{bet.eventName}</p>
                  <p className="text-primary-400 font-bold mt-1">
                    {bet.selection}
                  </p>
                </div>
                <button
                  onClick={() => removeBet(bet.id || bet.eventId)}
                  className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Cuota */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-dark-700">
                <span className="text-sm text-gray-400">Cuota</span>
                <span className="text-lg font-bold text-secondary-400">{bet.odds.toFixed(2)}</span>
              </div>

              {/* Input de monto */}
              {betType === 'single' && (
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Monto</label>
                  <input
                    type="number"
                    value={bet.stake || ''}
                    onChange={(e) => updateBetStake(bet.id || bet.eventId, parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                  {(bet.stake || 0) > 0 && (
                    <div className="mt-2 text-xs text-gray-400">
                      Ganancia potencial: <span className="text-green-400 font-bold">${((bet.stake || 0) * bet.odds).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer con totales */}
      <div className="p-4 bg-dark-900 border-t border-dark-700 space-y-4">
        {/* Monto para apuesta múltiple */}
        {betType === 'multiple' && (
          <div>
            <label className="text-xs text-gray-400 block mb-1">Monto Total</label>
            <input
              type="number"
              value={bets[0]?.stake || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                bets.forEach(bet => updateBetStake(bet.id || bet.eventId, value));
              }}
              placeholder="0.00"
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
        )}

        {/* Resumen */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Apuestas:</span>
            <span className="text-white font-medium">{bets.length}</span>
          </div>
          {betType === 'multiple' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Cuota total:</span>
              <span className="text-secondary-400 font-bold">{totalOdds.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total apostado:</span>
            <span className="text-white font-bold">${totalStake.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-dark-700">
            <span className="text-gray-400">Ganancia potencial:</span>
            <span className="text-green-400 font-bold text-lg">${potentialWin.toFixed(2)}</span>
          </div>
        </div>

        {/* Botón de apostar */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePlaceBet}
          disabled={totalStake === 0}
          className="w-full py-3 bg-gradient-primary text-white rounded-lg font-bold text-lg shadow-glow hover:shadow-glow-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Realizar Apuesta
        </motion.button>

        {/* Balance del usuario */}
        {user && (
          <div className="text-center text-sm text-gray-400">
            Balance disponible: <span className="text-white font-bold">${user.balance.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetSlipModern;
