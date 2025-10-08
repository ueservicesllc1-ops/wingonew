import { Outlet, useLocation } from 'react-router-dom';
import HeaderModern from './HeaderModern';
import Footer from './Footer';
import SidebarSports from './SidebarSports';
import BetSlipModern from '@/components/BetSlip/BetSlipModern';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiShoppingCart, FiMenu } from 'react-icons/fi';
import { useBetSlipStore } from '@/store/useBetSlipStore';

/**
 * Layout principal con sidebar de deportes izquierda, contenido central y BetSlip derecha
 * Incluye animaciones de página y diseño responsive
 */
const MainLayoutModern = () => {
  const [showBetSlip, setShowBetSlip] = useState(false);
  const [showSportsSidebar, setShowSportsSidebar] = useState(false);
  const { bets } = useBetSlipStore();
  const location = useLocation();
  
  // Solo mostrar sidebar de deportes en la página principal
  const shouldShowSportsSidebar = location.pathname === '/';

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header fijo en la parte superior */}
      <HeaderModern />

      {/* Contenido - TODO HACE SCROLL */}
      <div className="pt-32">
        <Outlet />
        
        {/* Footer al final */}
        <Footer />
      </div>

      {/* Botón flotante para abrir sidebar de deportes (móvil) - Solo en página principal */}
      {shouldShowSportsSidebar && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSportsSidebar(true)}
          className="lg:hidden fixed bottom-24 left-6 z-40 w-14 h-14 bg-gradient-primary rounded-full shadow-glow flex items-center justify-center"
        >
          <FiMenu className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Botón flotante del BetSlip (móvil) */}
      {bets.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowBetSlip(!showBetSlip)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-secondary rounded-full shadow-glow-orange flex items-center justify-center"
        >
          <FiShoppingCart className="w-6 h-6 text-white" />
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
            {bets.length}
          </span>
        </motion.button>
      )}

      {/* Sidebar de deportes móvil - Solo en páginas específicas */}
      <SidebarSports isOpen={shouldShowSportsSidebar && showSportsSidebar} onClose={() => setShowSportsSidebar(false)} />

      {/* BetSlip Móvil (Modal) */}
      <AnimatePresence>
        {showBetSlip && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBetSlip(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* BetSlip Modal */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-full max-w-md bg-dark-900 z-50 overflow-hidden"
            >
              <div className="h-full flex flex-col">
                {/* Header del modal */}
                <div className="p-4 border-b border-dark-700 flex items-center justify-between bg-dark-800">
                  <h3 className="text-xl font-bold text-white">Mi Boleto</h3>
                  <button
                    onClick={() => setShowBetSlip(false)}
                    className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center hover:bg-dark-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Contenido del BetSlip */}
                <div className="flex-1 overflow-auto">
                  <BetSlipModern />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayoutModern;
