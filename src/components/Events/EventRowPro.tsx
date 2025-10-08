import { SportEvent } from '@/types';
import { useBetSlipStore } from '@/store/useBetSlipStore';
import { useAuthStore } from '@/store/useAuthStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface EventRowProProps {
  event: SportEvent;
}

const EventRowPro = ({ event }: EventRowProProps) => {
  const { addBet, bets } = useBetSlipStore();
  const { user } = useAuthStore();

  const handleAddBet = (betType: 'home' | 'draw' | 'away') => {
    if (!user) {
      toast.error('Debes iniciar sesión para apostar');
      return;
    }

    const odds = betType === 'home' ? event.odds.home : betType === 'draw' ? event.odds.draw : event.odds.away;
    
    if (!odds) return;

    addBet({
      eventId: event.id,
      event,
      betType,
      odds,
      amount: 10,
    });

    toast.success('Agregado al cupón');
  };

  const isInBetSlip = (betType: 'home' | 'draw' | 'away') => {
    return bets.some(bet => bet.eventId === event.id && bet.betType === betType);
  };

  const isDisabled = event.status === 'finished';

  return (
    <div className="event-row">
      <div className="flex items-center justify-between p-3">
        {/* Left - Time & Teams */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            {/* Status Badge */}
            {event.status === 'live' && (
              <span className="badge-live">En Vivo</span>
            )}
            {event.status === 'upcoming' && (
              <div className="flex items-center space-x-1 text-betting-text-muted text-xs">
                <Clock className="w-3 h-3" />
                <span>{typeof event.startTime === 'string' 
                  ? event.startTime 
                  : format(event.startTime, "HH:mm", { locale: es })}</span>
              </div>
            )}
            
            {/* League */}
            <span className="text-betting-text-muted text-xs uppercase font-semibold">
              {event.league}
            </span>
            
            {/* Star Icon */}
            <button className="text-betting-text-muted hover:text-brand-yellow transition-colors">
              <Star className="w-4 h-4" />
            </button>
          </div>
          
          {/* Teams */}
          <div className="space-y-1">
            <div className="text-white font-semibold text-sm truncate">
              {event.homeTeam}
            </div>
            <div className="text-white font-semibold text-sm truncate">
              {event.awayTeam}
            </div>
          </div>
        </div>

        {/* Right - Odds Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Home Odd */}
          <button
            onClick={() => handleAddBet('home')}
            disabled={isDisabled}
            className={`min-w-[70px] ${
              isInBetSlip('home') ? 'odd-button ring-2 ring-brand-green-light' : 'odd-button'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-xs text-white/80 mb-0.5">1</div>
            <div className="text-lg font-bold">{event.odds.home.toFixed(2)}</div>
          </button>

          {/* Draw Odd */}
          {event.odds.draw && (
            <button
              onClick={() => handleAddBet('draw')}
              disabled={isDisabled}
              className={`min-w-[70px] ${
                isInBetSlip('draw') ? 'odd-button ring-2 ring-brand-green-light' : 'odd-button'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-xs text-white/80 mb-0.5">X</div>
              <div className="text-lg font-bold">{event.odds.draw.toFixed(2)}</div>
            </button>
          )}

          {/* Away Odd */}
          <button
            onClick={() => handleAddBet('away')}
            disabled={isDisabled}
            className={`min-w-[70px] ${
              isInBetSlip('away') ? 'odd-button ring-2 ring-brand-green-light' : 'odd-button'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-xs text-white/80 mb-0.5">2</div>
            <div className="text-lg font-bold">{event.odds.away.toFixed(2)}</div>
          </button>

          {/* More Markets */}
          <button className="min-w-[50px] odd-button-secondary text-sm">
            +{Math.floor(Math.random() * 50) + 20}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventRowPro;
