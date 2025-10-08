import { useEffect, useState } from 'react';
import { SportEvent } from '@/types';
import { eventsService } from '@/services/eventsService';
import EventCard from '@/components/EventCard/EventCard';
import { Flame, TrendingUp } from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');

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

    // Suscribirse a actualizaciones en tiempo real
    const unsubscribe = eventsService.subscribeToEvents((updatedEvents) => {
      setEvents(updatedEvents);
    });

    return () => unsubscribe();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const liveEvents = events.filter(e => e.status === 'live');
  const upcomingEvents = events.filter(e => e.status === 'upcoming');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Apuestas Deportivas</h1>
        <p className="text-gray-400">
          Encuentra los mejores eventos y apuesta en tus equipos favoritos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-red-600 to-red-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-sm">En Vivo Ahora</p>
              <p className="text-3xl font-bold text-white mt-1">{liveEvents.length}</p>
            </div>
            <Flame className="w-12 h-12 text-red-200 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Próximos Eventos</p>
              <p className="text-3xl font-bold text-white mt-1">{upcomingEvents.length}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-200 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-600 to-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Total Eventos</p>
              <p className="text-3xl font-bold text-white mt-1">{events.length}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('live')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'live'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          En Vivo
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Próximos
        </button>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No hay eventos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
