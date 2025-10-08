export interface User {
  id: string;
  email: string;
  displayName: string;
  balance: number;
  createdAt: Date;
}

export interface SportEvent {
  id: string;
  sport: 'futbol' | 'basketball' | 'tennis' | 'baseball' | 'otros';
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  status: 'upcoming' | 'live' | 'finished';
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
}

export interface Bet {
  id: string;
  userId: string;
  eventId: string;
  event: SportEvent;
  betType: 'home' | 'draw' | 'away';
  amount: number;
  odds: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost';
  createdAt: Date;
}

export interface BetSlip {
  eventId: string;
  event: SportEvent;
  betType: 'home' | 'draw' | 'away';
  odds: number;
  amount: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'bet' | 'win';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  description: string;
}
