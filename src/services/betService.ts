import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Bet, BetSlip, SportEvent } from '@/types';

export const betService = {
  async placeBet(userId: string, betSlip: BetSlip): Promise<string> {
    try {
      const betData = {
        userId,
        eventId: betSlip.eventId,
        event: {
          ...betSlip.event,
          startTime: typeof betSlip.event.startTime === 'string' 
            ? betSlip.event.startTime 
            : betSlip.event.startTime.toISOString(),
        },
        betType: betSlip.betType,
        amount: betSlip.amount,
        odds: betSlip.odds,
        potentialWin: betSlip.amount * betSlip.odds,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      const betRef = await addDoc(collection(db, 'bets'), betData);

      // Actualizar balance del usuario
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        balance: increment(-betSlip.amount),
      });

      // Registrar transacción
      await addDoc(collection(db, 'transactions'), {
        userId,
        type: 'bet',
        amount: -betSlip.amount,
        status: 'completed',
        description: `Apuesta en ${betSlip.event.homeTeam} vs ${betSlip.event.awayTeam}`,
        createdAt: serverTimestamp(),
      });

      return betRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async getUserBets(userId: string): Promise<Bet[]> {
    try {
      const q = query(
        collection(db, 'bets'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const bets: Bet[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bets.push({
          id: doc.id,
          userId: data.userId,
          eventId: data.eventId,
          event: {
            ...data.event,
            startTime: new Date(data.event.startTime),
          } as SportEvent,
          betType: data.betType,
          amount: data.amount,
          odds: data.odds,
          potentialWin: data.potentialWin,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });

      return bets;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
