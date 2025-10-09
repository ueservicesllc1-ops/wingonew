import { motion } from 'framer-motion';
import { FiClock, FiCheck } from 'react-icons/fi';

interface HistoryItem {
  dice1: number;
  dice2: number;
  sum: number;
  amount: number;
  multiplier: number;
  profit: number;
  timestamp: number;
  betType: string;
  verified: boolean;
}

interface HistoryPanelProps {
  history: HistoryItem[];
}

const HistoryPanel = ({ history }: HistoryPanelProps) => {
  return (
    <div className="mt-4 bg-black/30 border border-gray-700 rounded-xl p-4">
      <h3 className="text-white font-bold mb-2 flex items-center space-x-2">
        <FiClock className="w-4 h-4 text-purple-400" />
        <span className="text-sm">Historial de Lanzamientos</span>
      </h3>
      
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-3 text-xs">Sin historial aún</p>
        ) : (
          history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/50 rounded-lg p-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {/* Dados */}
                <div className="flex gap-1">
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                    item.profit > 0 
                      ? 'bg-green-900/30 text-green-400 border border-green-500' 
                      : 'bg-red-900/30 text-red-400 border border-red-500'
                  }`}>
                    {item.dice1}
                  </div>
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                    item.profit > 0 
                      ? 'bg-green-900/30 text-green-400 border border-green-500' 
                      : 'bg-red-900/30 text-red-400 border border-red-500'
                  }`}>
                    {item.dice2}
                  </div>
                </div>
                
                {/* Info */}
                <div>
                  <p className="text-white font-semibold text-xs">
                    {item.betType.toUpperCase()} | ${item.amount.toFixed(0)}
                  </p>
                  <p className="text-gray-400 text-[10px]">
                    Suma: {item.sum}
                  </p>
                </div>
              </div>
              
              {/* Ganancia/Pérdida */}
              <div className="text-right flex items-center gap-1">
                {item.verified && (
                  <FiCheck className="w-3 h-3 text-green-400" title="Verificado" />
                )}
                <div>
                  <p className={`font-bold text-sm ${
                    item.profit > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.multiplier > 0 ? `${item.multiplier.toFixed(1)}x` : '-'}
                  </p>
                  <p className={`text-[10px] ${
                    item.profit > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.profit > 0 ? '+' : ''}${item.profit.toFixed(0)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;

