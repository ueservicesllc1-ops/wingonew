import { FiDollarSign } from 'react-icons/fi';

type BetType = 
  | 'par' | 'impar'
  | 'mayor' | 'menor'
  | 'exacto'
  | 'pinta'
  | 'doble';

interface UIControlsProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  betType: BetType;
  setBetType: (type: BetType) => void;
  selectedNumber: number;
  setSelectedNumber: (num: number) => void;
  onRoll: () => void;
  isRolling: boolean;
  userBalance: number;
  calculateMultiplier: (type: BetType, number?: number) => number;
}

const UIControls = ({
  betAmount,
  setBetAmount,
  betType,
  setBetType,
  selectedNumber,
  setSelectedNumber,
  onRoll,
  isRolling,
  userBalance,
  calculateMultiplier
}: UIControlsProps) => {
  
  const quickBetAmounts = [10, 25, 50, 100, 250];
  
  const multiplier = calculateMultiplier(betType, selectedNumber);
  
  // Calcular probabilidad según tipo de apuesta
  const getProbability = (): string => {
    switch (betType) {
      case 'par':
      case 'impar':
        return '50%';
      case 'mayor':
      case 'menor':
        return '41.7%';
      case 'exacto':
        const probs: Record<number, string> = {
          2: '2.8%', 3: '5.6%', 4: '8.3%', 5: '11.1%', 6: '13.9%', 7: '16.7%',
          8: '13.9%', 9: '11.1%', 10: '8.3%', 11: '5.6%', 12: '2.8%'
        };
        return probs[selectedNumber] || '16.7%';
      case 'pinta':
        return '30.6%';
      case 'doble':
        return '2.8%';
      default:
        return '50%';
    }
  };

  return (
    <div className="bg-black/30 border border-gray-700 rounded-xl p-4">
      <h3 className="text-white font-bold mb-3 flex items-center space-x-2">
        <FiDollarSign className="w-4 h-4 text-purple-400" />
        <span className="text-sm">Apuesta</span>
      </h3>

      {/* Monto de apuesta */}
      <div className="mb-3">
        <label className="text-gray-400 text-xs mb-1.5 block">Monto</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
          disabled={isRolling}
          className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-base font-bold focus:outline-none focus:border-purple-500 disabled:opacity-50"
          placeholder="0.00"
        />
      </div>

      {/* Botones rápidos */}
      <div className="grid grid-cols-5 gap-1.5 mb-3">
        {quickBetAmounts.map(amount => (
          <button
            key={amount}
            onClick={() => setBetAmount(amount)}
            disabled={isRolling}
            className="bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            ${amount}
          </button>
        ))}
      </div>

      {/* Tipo de Apuesta */}
      <div className="mb-3">
        <label className="text-gray-400 text-xs mb-1.5 block">Tipo de Apuesta</label>
        
        {/* Par / Impar */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => setBetType('par')}
            disabled={isRolling}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              betType === 'par'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            PAR
          </button>
          <button
            onClick={() => setBetType('impar')}
            disabled={isRolling}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              betType === 'impar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            IMPAR
          </button>
        </div>

        {/* Mayor / Menor */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => setBetType('mayor')}
            disabled={isRolling}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              betType === 'mayor'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            MAYOR (8-12)
          </button>
          <button
            onClick={() => setBetType('menor')}
            disabled={isRolling}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              betType === 'menor'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            MENOR (2-6)
          </button>
        </div>

        {/* Otras apuestas */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setBetType('exacto')}
            disabled={isRolling}
            className={`py-2 rounded-lg text-[10px] font-bold transition-all ${
              betType === 'exacto'
                ? 'bg-yellow-600 text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            EXACTO
          </button>
          <button
            onClick={() => setBetType('pinta')}
            disabled={isRolling}
            className={`py-2 rounded-lg text-[10px] font-bold transition-all ${
              betType === 'pinta'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            PINTA
          </button>
          <button
            onClick={() => setBetType('doble')}
            disabled={isRolling}
            className={`py-2 rounded-lg text-[10px] font-bold transition-all ${
              betType === 'doble'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            DOBLE
          </button>
        </div>
      </div>

      {/* Selector de número (para Exacto, Pinta, Doble) */}
      {(betType === 'exacto' || betType === 'pinta' || betType === 'doble') && (
        <div className="mb-3">
          <label className="text-gray-400 text-xs mb-1.5 block">
            {betType === 'exacto' && 'Suma Exacta (2-12)'}
            {betType === 'pinta' && 'Número que debe salir (1-6)'}
            {betType === 'doble' && 'Doble de qué número (1-6)'}
          </label>
          <div className="grid grid-cols-6 gap-1">
            {(betType === 'exacto' 
              ? [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
              : [1, 2, 3, 4, 5, 6]
            ).map((num) => (
              <button
                key={num}
                onClick={() => setSelectedNumber(num)}
                disabled={isRolling}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedNumber === num
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                } disabled:opacity-50 ${betType === 'exacto' && num > 6 ? 'col-span-1' : ''}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info de probabilidad */}
      <div className="bg-gray-800/50 rounded-lg p-3 mb-3 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Probabilidad:</span>
          <span className="text-white font-bold">{getProbability()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Multiplicador:</span>
          <span className="text-purple-400 font-bold">{multiplier.toFixed(2)}x</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Ganancia potencial:</span>
          <span className="text-green-400 font-bold">
            ${(betAmount * multiplier - betAmount).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Botón de lanzar */}
      <button
        onClick={onRoll}
        disabled={isRolling}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {isRolling ? '🎲 Lanzando...' : '🎲 Lanzar Dados'}
      </button>

      {/* Balance */}
      <div className="mt-3 text-center">
        <p className="text-gray-400 text-xs">Balance Disponible</p>
        <p className="text-white font-bold text-lg">${userBalance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default UIControls;
