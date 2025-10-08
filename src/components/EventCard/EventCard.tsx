import { SportEvent } from '@/types';
import { useBetSlipStore } from '@/store/useBetSlipStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface EventCardProps {
  event: SportEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const { addBet, bets } = useBetSlipStore();

  const handleAddBet = (betType: 'home' | 'draw' | 'away') => {
    const odds = betType === 'home' ? event.odds.home : betType === 'draw' ? event.odds.draw : event.odds.away;
    
    if (!odds) return;

    addBet({
      eventId: event.id,
      event,
      betType,
      odds,
      amount: 10, // Monto predeterminado
    });

    toast.success('Apuesta agregada al carrito');
  };

  const isInBetSlip = (betType: 'home' | 'draw' | 'away') => {
    return bets.some(bet => bet.eventId === event.id && bet.betType === betType);
  };

  const statusColors = {
    upcoming: 'bg-blue-500',
    live: 'bg-red-500 animate-pulse',
    finished: 'bg-gray-500',
  };

  const statusLabels = {
    upcoming: 'Próximo',
    live: 'En Vivo',
    finished: 'Finalizado',
  };

  return (
    <div className="card hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{event.league}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">
              {format(event.startTime, "d 'de' MMMM, HH:mm", { locale: es })}
            </span>
          </div>
        </div>
        <span
          className={`${statusColors[event.status]} text-white text-xs px-3 py-1 rounded-full font-semibold`}
        >
          {statusLabels[event.status]}
        </span>
      </div>

      {/* Teams */}
      <div className="mb-4">
        <div className="text-lg font-bold text-white mb-1">{event.homeTeam}</div>
        <div className="text-sm text-gray-400 mb-1">vs</div>
        <div className="text-lg font-bold text-white">{event.awayTeam}</div>
      </div>

      {/* Odds Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleAddBet('home')}
          disabled={event.status === 'finished'}
          className={`p-3 rounded-lg transition-all ${
            isInBetSlip('home')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="text-xs text-gray-300 mb-1">Local</div>
          <div className="font-bold text-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {event.odds.home.toFixed(2)}
          </div>
        </button>

        {event.odds.draw && (
          <button
            onClick={() => handleAddBet('draw')}
            disabled={event.status === 'finished'}
            className={`p-3 rounded-lg transition-all ${
              isInBetSlip('draw')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-xs text-gray-300 mb-1">Empate</div>
            <div className="font-bold text-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {event.odds.draw.toFixed(2)}
            </div>
          </button>
        )}

        <button
          onClick={() => handleAddBet('away')}
          disabled={event.status === 'finished'}
          className={`p-3 rounded-lg transition-all ${
            isInBetSlip('away')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="text-xs text-gray-300 mb-1">Visitante</div>
          <div className="font-bold text-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {event.odds.away.toFixed(2)}
          </div>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
