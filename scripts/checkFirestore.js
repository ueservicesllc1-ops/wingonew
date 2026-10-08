import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDie7Ua9OhTqWsqdR3fhnmbKSz7k5KrgtQ",
  authDomain: "studio-3302383355-1ea39.firebaseapp.com",
  projectId: "studio-3302383355-1ea39",
  storageBucket: "studio-3302383355-1ea39.firebasestorage.app",
  messagingSenderId: "1096593910879",
  appId: "1:1096593910879:web:3112124e5f2a31ec2affea"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  console.log('--- Consultando Firestore ---');
  
  // 1. Settings casino-games
  try {
    const gamesDoc = await getDoc(doc(db, 'settings', 'casino-games'));
    if (gamesDoc.exists()) {
      console.log('Casino Games Document:', JSON.stringify(gamesDoc.data(), null, 2));
    } else {
      console.log('Documento settings/casino-games no existe en Firestore');
    }
  } catch (err) {
    console.error('Error al leer casino-games:', err.message);
  }

  // 2. Banners
  try {
    const bannersSnap = await getDocs(collection(db, 'banners'));
    console.log(`Banners encontrados: ${bannersSnap.docs.length}`);
    bannersSnap.docs.forEach(d => {
      console.log('Banner:', d.id, d.data());
    });
  } catch (err) {
    console.error('Error al leer banners:', err.message);
  }
}

check();
