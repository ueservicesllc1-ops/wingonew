import { create } from 'zustand';
import { BetSlip } from '@/types';

interface BetSlipState {
  bets: BetSlip[];
  addBet: (bet: BetSlip) => void;
  removeBet: (eventId: string) => void;
  updateAmount: (eventId: string, amount: number) => void;
  updateBetStake: (eventId: string, stake: number) => void;
  clearBets: () => void;
  getTotalOdds: () => number;
  getTotalAmount: () => number;
  getPotentialWin: () => number;
}

export const useBetSlipStore = create<BetSlipState>((set, get) => ({
  bets: [],
  
  addBet: (bet) => set((state) => {
    const exists = state.bets.find(b => b.eventId === bet.eventId);
    if (exists) {
      return {
        bets: state.bets.map(b => 
          b.eventId === bet.eventId ? bet : b
        )
      };
    }
    return { bets: [...state.bets, bet] };
  }),
  
  removeBet: (eventId) => set((state) => ({
    bets: state.bets.filter(b => b.eventId !== eventId)
  })),
  
  updateAmount: (eventId, amount) => set((state) => ({
    bets: state.bets.map(b => 
      b.eventId === eventId ? { ...b, amount } : b
    )
  })),

  updateBetStake: (eventId, stake) => set((state) => ({
    bets: state.bets.map(b => 
      b.eventId === eventId ? { ...b, stake, amount: stake } : b
    )
  })),
  
  clearBets: () => set({ bets: [] }),
  
  getTotalOdds: () => {
    const bets = get().bets;
    return bets.reduce((acc, bet) => acc * bet.odds, 1);
  },
  
  getTotalAmount: () => {
    const bets = get().bets;
    return bets.reduce((acc, bet) => acc + bet.amount, 0);
  },
  
  getPotentialWin: () => {
    const bets = get().bets;
    if (bets.length === 0) return 0;
    if (bets.length === 1) {
      return bets[0].amount * bets[0].odds;
    }
    // Apuesta combinada
    const totalOdds = get().getTotalOdds();
    const totalAmount = get().getTotalAmount();
    return totalAmount * totalOdds;
  },
}));
