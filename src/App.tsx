import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Layout Moderno
import MainLayoutModern from '@/components/Layout/MainLayoutModern';
import ScrollToTop from '@/components/ScrollToTop';

// Pages
import HomeModern from '@/pages/HomeModern';
import Profile from '@/pages/Profile';
import MyBets from '@/pages/MyBets';
import Transactions from '@/pages/Transactions';
import Sports from '@/pages/Sports';
import FAQ from '@/pages/FAQ';
import HowToBet from '@/pages/HowToBet';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import ResponsibleGaming from '@/pages/ResponsibleGaming';
import About from '@/pages/About';
import Careers from '@/pages/Careers';
import Promotions from '@/pages/Promotions';

// Admin Pages
import AdminDashboard from '@/pages/Admin/Dashboard';
import AdminUsers from '@/pages/Admin/Users';
import AdminBanners from '@/pages/Admin/Banners';
import AdminPromotions from '@/pages/Admin/Promotions';
import AdminWallets from '@/pages/Admin/Wallets';
import AdminMessages from '@/pages/Admin/Messages';
import AdminSettings from '@/pages/Admin/Settings';
import Contact from '@/pages/Contact';

/**
 * Pantalla de carga con animación moderna
 */
const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white text-lg font-semibold"
        >
          Cargando WingoSports...
        </motion.p>
      </motion.div>
    </div>
  );
};

function App() {
  const { setUser, setFirebaseUser, setLoading, loading, updateBalance } = useAuthStore();

  useEffect(() => {
    let unsubscribeBalance: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        const userData = await authService.getUserData(firebaseUser.uid);
        setUser(userData);

        // Escuchar cambios en tiempo real del balance del usuario
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeBalance = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data.balance !== undefined) {
              updateBalance(data.balance);
            }
          }
        });
      } else {
        setUser(null);
        // Limpiar listener si existe
        if (unsubscribeBalance) {
          unsubscribeBalance();
          unsubscribeBalance = null;
        }
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubscribeBalance) {
        unsubscribeBalance();
      }
    };
  }, [setUser, setFirebaseUser, setLoading, updateBalance]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Rutas públicas con layout moderno */}
          <Route path="/" element={<MainLayoutModern />}>
            <Route index element={<HomeModern />} />
            <Route path="sports/:sport" element={<Sports />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-bets" element={<MyBets />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="how-to-bet" element={<HowToBet />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="responsible-gaming" element={<ResponsibleGaming />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="careers" element={<Careers />} />
            <Route path="promotions" element={<Promotions />} />
          </Route>

          {/* Rutas de Administración */}
          <Route path="/admin" element={<MainLayoutModern />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="wallets" element={<AdminWallets />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 - Redirección */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      
      {/* Notificaciones con estilo personalizado */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1F252B',
            color: '#fff',
            border: '1px solid #343D47',
          },
          success: {
            iconTheme: {
              primary: '#00D066',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF6B00',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
