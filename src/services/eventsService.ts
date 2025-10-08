import { collection, getDocs, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { SportEvent } from '@/types';

export const eventsService = {
  async getAllEvents(): Promise<SportEvent[]> {
    try {
      const q = query(
        collection(db, 'events'),
        orderBy('startTime', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const events: SportEvent[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        events.push({
          id: doc.id,
          sport: data.sport,
          league: data.league,
          homeTeam: data.homeTeam,
          awayTeam: data.awayTeam,
          startTime: new Date(data.startTime),
          status: data.status,
          odds: data.odds,
        });
      });

      return events;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async getEventsBySport(sport: string): Promise<SportEvent[]> {
    try {
      const q = query(
        collection(db, 'events'),
        where('sport', '==', sport),
        orderBy('startTime', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const events: SportEvent[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        events.push({
          id: doc.id,
          sport: data.sport,
          league: data.league,
          homeTeam: data.homeTeam,
          awayTeam: data.awayTeam,
          startTime: new Date(data.startTime),
          status: data.status,
          odds: data.odds,
        });
      });

      return events;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  subscribeToEvents(callback: (events: SportEvent[]) => void) {
    const q = query(
      collection(db, 'events'),
      orderBy('startTime', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const events: SportEvent[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        events.push({
          id: doc.id,
          sport: data.sport,
          league: data.league,
          homeTeam: data.homeTeam,
          awayTeam: data.awayTeam,
          startTime: new Date(data.startTime),
          status: data.status,
          odds: data.odds,
        });
      });
      callback(events);
    });
  },
};
