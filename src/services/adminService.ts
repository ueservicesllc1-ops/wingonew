import { doc, updateDoc, increment, collection, addDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Servicio para funciones administrativas
 */
export const adminService = {
  /**
   * Agregar fondos al balance de un usuario
   */
  async addFundsToUser(userId: string, amount: number, reason: string = 'Depósito Admin'): Promise<void> {
    try {
      // Actualizar balance del usuario
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        balance: increment(amount)
      });

      // Registrar transacción
      const transactionsRef = collection(db, 'transactions');
      await addDoc(transactionsRef, {
        userId,
        type: 'admin_deposit',
        amount,
        description: reason,
        status: 'completed',
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error al agregar fondos:', error);
      throw error;
    }
  },

  /**
   * Retirar fondos del balance de un usuario
   */
  async removeFundsFromUser(userId: string, amount: number, reason: string = 'Retiro Admin'): Promise<void> {
    try {
      // Verificar balance actual
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const currentBalance = userSnap.data().balance || 0;
      
      if (currentBalance < amount) {
        throw new Error('Balance insuficiente');
      }

      // Actualizar balance del usuario
      await updateDoc(userRef, {
        balance: increment(-amount)
      });

      // Registrar transacción
      const transactionsRef = collection(db, 'transactions');
      await addDoc(transactionsRef, {
        userId,
        type: 'admin_withdrawal',
        amount: -amount,
        description: reason,
        status: 'completed',
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error al retirar fondos:', error);
      throw error;
    }
  },

  /**
   * Establecer balance específico de un usuario
   */
  async setUserBalance(userId: string, newBalance: number, reason: string = 'Ajuste Admin'): Promise<void> {
    try {
      // Obtener balance actual
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const currentBalance = userSnap.data().balance || 0;
      const difference = newBalance - currentBalance;

      // Actualizar balance
      await updateDoc(userRef, {
        balance: newBalance
      });

      // Registrar transacción
      const transactionsRef = collection(db, 'transactions');
      await addDoc(transactionsRef, {
        userId,
        type: 'admin_adjustment',
        amount: difference,
        description: reason,
        status: 'completed',
        createdAt: new Date(),
        previousBalance: currentBalance,
        newBalance: newBalance
      });
    } catch (error) {
      console.error('Error al ajustar balance:', error);
      throw error;
    }
  }
};
