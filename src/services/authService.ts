import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User } from '@/types';

/**
 * Genera el siguiente ID corto para un usuario
 * Formato: W0001, W0002, W0003...
 */
async function generateShortId(): Promise<string> {
  try {
    // Obtener el último usuario creado
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    
    let nextNumber = 1;
    
    if (!snapshot.empty) {
      const lastUser = snapshot.docs[0].data();
      if (lastUser.shortId) {
        // Extraer el número del último ID (W0001 -> 0001)
        const lastNumber = parseInt(lastUser.shortId.substring(1));
        nextNumber = lastNumber + 1;
      }
    }
    
    // Formatear con ceros a la izquierda (W0001, W0002...)
    return `W${nextNumber.toString().padStart(4, '0')}`;
  } catch (error) {
    console.error('Error generando ID corto:', error);
    // Fallback: usar timestamp
    return `W${Date.now().toString().slice(-4)}`;
  }
}

export const authService = {
  async register(email: string, password: string, displayName: string, cedula?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      // Generar ID corto único
      const shortId = await generateShortId();

      const newUser: User = {
        id: userCredential.user.uid,
        email,
        displayName,
        balance: 0,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...newUser,
        shortId,
        cedula: cedula || null,
        name: displayName,
        status: 'active',
        verified: false,
        totalBets: 0,
        createdAt: newUser.createdAt.toISOString(),
      });

      return newUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const userData = userDoc.data();
      return {
        id: userCredential.user.uid,
        email: userData.email,
        displayName: userData.displayName,
        balance: userData.balance || 0,
        createdAt: new Date(userData.createdAt),
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verificar si el usuario ya existe en Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Generar ID corto único
        const shortId = await generateShortId();

        // Crear nuevo usuario en Firestore
        const newUser: User = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Usuario',
          balance: 0,
          createdAt: new Date(),
        };

        await setDoc(doc(db, 'users', user.uid), {
          ...newUser,
          shortId,
          name: user.displayName || 'Usuario',
          status: 'active',
          verified: false,
          totalBets: 0,
          createdAt: newUser.createdAt.toISOString(),
        });

        return newUser;
      } else {
        // Usuario existente
        const userData = userDoc.data();
        return {
          id: user.uid,
          email: userData.email,
          displayName: userData.displayName,
          balance: userData.balance || 0,
          createdAt: new Date(userData.createdAt),
        };
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async getUserData(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return null;

      const userData = userDoc.data();
      return {
        id: userId,
        email: userData.email,
        displayName: userData.displayName,
        balance: userData.balance || 0,
        createdAt: new Date(userData.createdAt),
      };
    } catch (error) {
      console.error('Error obteniendo datos de usuario:', error);
      return null;
    }
  },
};
