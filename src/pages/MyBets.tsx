import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Bet } from '@/types';
import { TrendingUp } from 'lucide-react';

// Datos de ejemplo para mostrar
const exampleBets: Bet[] = [
  {
    id: '1',
    userId: 'user1',
    eventId: 'evt1',
    event: {
      id: 'evt1',
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
      league: 'La Liga',
      date: '2024-01-15',
      startTime: '2024-01-15',
      sport: 'futbol' as const,
      odds: { home: 2.45, away: 1.8 },
      status: 'completed'
    },
    betType: 'home',
    odds: 2.45,
    amount: 50.00,
    potentialWin: 122.50,
    status: 'won',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '2',
    userId: 'user1',
    eventId: 'evt2',
    event: {
      id: 'evt2',
      homeTeam: 'Manchester City',
      awayTeam: 'Liverpool',
      league: 'Premier League',
      date: '2024-01-16',
      startTime: '2024-01-16',
      sport: 'futbol' as const,
      odds: { home: 1.9, draw: 3.2, away: 2.1 },
      status: 'live'
    },
    betType: 'draw',
    odds: 3.20,
    amount: 25.00,
    potentialWin: 80.00,
    status: 'pending',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    userId: 'user1',
    eventId: 'evt3',
    event: {
      id: 'evt3',
      homeTeam: 'PSG',
      awayTeam: 'Bayern Munich',
      league: 'Champions League',
      date: '2024-01-12',
      startTime: '2024-01-12',
      sport: 'futbol' as const,
      odds: { home: 2.1, away: 1.85 },
      status: 'completed'
    },
    betType: 'away',
    odds: 1.85,
    amount: 100.00,
    potentialWin: 185.00,
    status: 'lost',
    createdAt: new Date('2024-01-11'),
  },
  {
    id: '4',
    userId: 'user1',
    eventId: 'evt4',
    event: {
      id: 'evt4',
      homeTeam: 'Chelsea',
      awayTeam: 'Arsenal',
      league: 'Premier League',
      date: '2024-01-18',
      startTime: '2024-01-18',
      sport: 'futbol' as const,
      odds: { home: 2.1, away: 1.9 },
      status: 'scheduled'
    },
    betType: 'home',
    odds: 2.10,
    amount: 75.00,
    potentialWin: 157.50,
    status: 'pending',
    createdAt: new Date('2024-01-16'),
  },
  {
    id: '5',
    userId: 'user1',
    eventId: 'evt5',
    event: {
      id: 'evt5',
      homeTeam: 'Inter Milan',
      awayTeam: 'Juventus',
      league: 'Serie A',
      date: '2024-01-10',
      startTime: '2024-01-10',
      sport: 'futbol' as const,
      odds: { home: 1.9, draw: 2.85, away: 2.2 },
      status: 'completed'
    },
    betType: 'draw',
    odds: 2.85,
    amount: 40.00,
    potentialWin: 114.00,
    status: 'won',
    createdAt: new Date('2024-01-09'),
  },
  {
    id: '6',
    userId: 'user1',
    eventId: 'evt6',
    event: {
      id: 'evt6',
      homeTeam: 'Atletico Madrid',
      awayTeam: 'Valencia',
      league: 'La Liga',
      date: '2024-01-20',
      startTime: '2024-01-20',
      sport: 'futbol' as const,
      odds: { home: 1.6, away: 4.5 },
      status: 'scheduled'
    },
    betType: 'away',
    odds: 4.50,
    amount: 20.00,
    potentialWin: 90.00,
    status: 'pending',
    createdAt: new Date('2024-01-17'),
  }
];

const MyBets = () => {
  const { user } = useAuthStore();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');

  useEffect(() => {
    const loadBets = async () => {
      if (!user) return;

      try {
        // Usar datos de ejemplo por ahora
        setBets(exampleBets);
        // const userBets = await betService.getUserBets(user.id);
        // setBets(userBets);
      } catch (error) {
        console.error('Error cargando apuestas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBets();
  }, [user]);

  const filteredBets = bets.filter((bet) => {
    if (filter === 'all') return true;
    return bet.status === filter;
  });

  const totalBets = bets.length;
  const wonBets = bets.filter(b => b.status === 'won').length;
  const lostBets = bets.filter(b => b.status === 'lost').length;
  const pendingBets = bets.filter(b => b.status === 'pending').length;



  const statusLabels = {
    pending: 'Pendiente',
    won: 'Ganada',
    lost: 'Perdida',
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
        <h1 className="text-3xl font-bold text-white mb-2">Mis Apuestas</h1>
        <p className="text-gray-400">Historial completo de tus apuestas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-white">{totalBets}</p>
        </div>
        <div className="card">
          <p className="text-blue-400 text-sm mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-white">{pendingBets}</p>
        </div>
        <div className="card">
          <p className="text-green-400 text-sm mb-1">Ganadas</p>
          <p className="text-2xl font-bold text-white">{wonBets}</p>
        </div>
        <div className="card">
          <p className="text-red-400 text-sm mb-1">Perdidas</p>
          <p className="text-2xl font-bold text-white">{lostBets}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFilter('won')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'won'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Ganadas
        </button>
        <button
          onClick={() => setFilter('lost')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            filter === 'lost'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Perdidas
        </button>
      </div>

      {/* Tabla Simple de Apuestas */}
      {filteredBets.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No tienes apuestas aún</p>
          <p className="text-gray-500 text-sm mt-2">
            Comienza a apostar en tus eventos favoritos
          </p>
        </div>
      ) : (
        <div className="bg-black rounded-lg overflow-hidden">
          {/* Encabezado simple */}
          <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
            <h2 className="text-lg font-bold text-white">Mis Apuestas</h2>
          </div>

          {/* Tabla simple */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Evento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Selección
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Cuota
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Apostado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Ganancia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBets.map((bet, index) => {
                  const isEven = index % 2 === 0;
                  
                  return (
                    <tr 
                      key={bet.id} 
                      className={`${isEven ? 'bg-black' : 'bg-gray-800'}`}
                    >
                      {/* Evento */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs text-gray-400">{bet.event.league}</p>
                          <p className="text-sm font-medium text-white">
                            {bet.event.homeTeam} vs {bet.event.awayTeam}
                          </p>
                        </div>
                      </td>

                      {/* Selección */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-white">
                          {bet.betType === 'home' && bet.event.homeTeam}
                          {bet.betType === 'draw' && 'Empate'}
                          {bet.betType === 'away' && bet.event.awayTeam}
                        </span>
                      </td>

                      {/* Cuota */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-white font-bold">
                          {bet.odds.toFixed(2)}
                        </span>
                      </td>

                      {/* Apostado */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-white">
                          ${bet.amount.toFixed(2)}
                        </span>
                      </td>

                      {/* Ganancia */}
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-white">
                          ${bet.potentialWin.toFixed(2)}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-white bg-gray-700 px-2 py-1 rounded">
                          {statusLabels[bet.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBets;
