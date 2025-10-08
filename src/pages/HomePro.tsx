import { useEffect, useState } from 'react';
import { SportEvent } from '@/types';
import { eventsService } from '@/services/eventsService';
import EventRowPro from '@/components/Events/EventRowPro';
import { Flame, Calendar, TrendingUp } from 'lucide-react';

const HomePro = () => {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming'>('all');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = await eventsService.getAllEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error('Error cargando eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

    const unsubscribe = eventsService.subscribeToEvents((updatedEvents) => {
      setEvents(updatedEvents);
    });

    return () => unsubscribe();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (activeTab === 'all') return true;
    return event.status === activeTab;
  });

  const liveCount = events.filter(e => e.status === 'live').length;
  const upcomingCount = events.filter(e => e.status === 'upcoming').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:mr-80 pb-20 lg:pb-4">
      {/* Banner Hero */}
      <div className="bg-gradient-to-r from-brand-green to-brand-green-dark p-6 lg:p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Apuestas Deportivas en Vivo
          </h1>
          <p className="text-white/90 text-lg">
            Las mejores cuotas del mercado. ¡Apuesta ahora y gana!
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
              <Flame className="w-5 h-5 text-white" />
              <span className="text-white font-bold">{liveCount} En Vivo</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-white font-bold">{upcomingCount} Próximos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-betting-bg-light border-b border-betting-border sticky top-16 z-20">
        <div className="flex items-center space-x-1 p-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-brand-green text-white'
                : 'text-betting-text-muted hover:bg-betting-bg-lighter hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Todos ({events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center space-x-2 px-4 py-2 rounded font-semibold transition-colors ${
              activeTab === 'live'
                ? 'bg-brand-green text-white'
                : 'text-betting-text-muted hover:bg-betting-bg-lighter hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>En Vivo ({liveCount})</span>
            {liveCount > 0 && (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center space-x-2 px-4 py-2 rounded font-semibold transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-brand-green text-white'
                : 'text-betting-text-muted hover:bg-betting-bg-lighter hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Próximos ({upcomingCount})</span>
          </button>
        </div>
      </div>

      {/* Events List */}
      <div>
        {/* Table Header */}
        <div className="hidden md:flex items-center justify-between bg-betting-bg-lighter px-4 py-3 border-b border-betting-border">
          <div className="flex-1">
            <span className="text-betting-text-muted text-sm font-semibold uppercase">Evento</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-betting-text-muted text-xs font-semibold uppercase w-[70px] text-center">1</span>
            <span className="text-betting-text-muted text-xs font-semibold uppercase w-[70px] text-center">X</span>
            <span className="text-betting-text-muted text-xs font-semibold uppercase w-[70px] text-center">2</span>
            <span className="text-betting-text-muted text-xs font-semibold uppercase w-[50px] text-center">+</span>
          </div>
        </div>

        {/* Events */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-betting-text-muted text-lg">No hay eventos disponibles</p>
          </div>
        ) : (
          <div>
            {filteredEvents.map((event) => (
              <EventRowPro key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Promo Banner Bottom */}
      <div className="m-4 p-6 bg-gradient-to-r from-brand-yellow to-brand-orange rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-black font-bold text-xl mb-1">¡BONO DE BIENVENIDA!</h3>
            <p className="text-black/80 text-sm">Obtén hasta $500 en tu primer depósito</p>
          </div>
          <button className="bg-black hover:bg-gray-900 text-white font-bold px-8 py-3 rounded-lg transition-colors">
            REGISTRARSE AHORA
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePro;
