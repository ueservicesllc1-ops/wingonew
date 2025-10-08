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
import { Transaction } from '@/types';

export const transactionService = {
  async deposit(userId: string, amount: number): Promise<string> {
    try {
      // Registrar transacción
      const transactionRef = await addDoc(collection(db, 'transactions'), {
        userId,
        type: 'deposit',
        amount,
        status: 'completed',
        description: 'Depósito a cuenta',
        createdAt: serverTimestamp(),
      });

      // Actualizar balance del usuario
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        balance: increment(amount),
      });

      return transactionRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async withdraw(userId: string, amount: number): Promise<string> {
    try {
      // Registrar transacción
      const transactionRef = await addDoc(collection(db, 'transactions'), {
        userId,
        type: 'withdraw',
        amount: -amount,
        status: 'pending',
        description: 'Retiro de cuenta',
        createdAt: serverTimestamp(),
      });

      // Actualizar balance del usuario
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        balance: increment(-amount),
      });

      return transactionRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          id: doc.id,
          userId: data.userId,
          type: data.type,
          amount: data.amount,
          status: data.status,
          description: data.description,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });

      return transactions;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
