import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SportEvent } from '@/types';
import { eventsService } from '@/services/eventsService';
import EventCard from '@/components/EventCard/EventCard';

const Sports = () => {
  const { sport } = useParams<{ sport: string }>();
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      if (!sport) return;
      
      setLoading(true);
      try {
        const sportEvents = await eventsService.getEventsBySport(sport);
        setEvents(sportEvents);
      } catch (error) {
        console.error('Error cargando eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [sport]);

  const sportNames: Record<string, string> = {
    futbol: 'Fútbol',
    basketball: 'Baloncesto',
    tennis: 'Tenis',
    baseball: 'Béisbol',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {sportNames[sport || ''] || 'Deportes'}
        </h1>
        <p className="text-gray-400">
          {events.length} eventos disponibles
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No hay eventos disponibles para este deporte
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sports;
