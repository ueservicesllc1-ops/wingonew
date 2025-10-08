import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiSearch, FiChevronDown, FiSettings } from 'react-icons/fi';
import { IoFootballOutline, IoBasketballOutline, IoTennisballOutline } from 'react-icons/io5';
import { MdSportsSoccer, MdSportsBaseball, MdSportsVolleyball } from 'react-icons/md';
import { useAuthStore } from '@/store/useAuthStore';
import { useModalStore } from '@/store/useModalStore';
import LoginModal from '@/components/Auth/LoginModal';
import RegisterModal from '@/components/Auth/RegisterModal';
import UserSidebar from '@/components/User/UserSidebar';

/**
 * Header Moderno con animaciones y diseño profesional
 * Incluye: Logo, menú de navegación, menú de deportes, búsqueda y autenticación
 */
const HeaderModern = () => {
  const { showLoginModal, showRegisterModal, openLoginModal, closeLoginModal, openRegisterModal, closeRegisterModal } = useModalStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const { user } = useAuthStore();

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const deportes = [
    { name: 'Fútbol', icon: IoFootballOutline, path: '/sports/futbol' },
    { name: 'Baloncesto', icon: IoBasketballOutline, path: '/sports/baloncesto' },
    { name: 'Tenis', icon: IoTennisballOutline, path: '/sports/tenis' },
    { name: 'Baseball', icon: MdSportsBaseball, path: '/sports/baseball' },
    { name: 'Volleyball', icon: MdSportsVolleyball, path: '/sports/volleyball' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gradient-to-r from-yellow-600 to-yellow-700/95 backdrop-blur-lg shadow-lg shadow-black/20' 
            : 'bg-gradient-to-r from-yellow-600 to-yellow-700'
        }`}
      >
        {/* Barra superior con promociones */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-2 px-4 text-center text-sm font-medium">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🎉 ¡Bono de Bienvenida! Registrate y obtén hasta <span className="text-red-600 font-bold">$500</span> en tu primer depósito
          </motion.div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 bg-black/40 border border-yellow-500/50 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/30 transition-all duration-300">
                  <MdSportsSoccer className="w-7 h-7 text-yellow-300" />
                </div>
              </motion.div>
                <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-yellow-300">WingoSports</h1>
                <p className="text-xs text-yellow-200">Apuestas en Vivo</p>
              </div>
            </Link>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Menú Deportes */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('deportes')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-4 py-2 rounded-lg hover:bg-yellow-500/20 flex items-center space-x-1 group">
                  <span className="text-yellow-100 group-hover:text-yellow-300 transition-colors">Deportes</span>
                  <FiChevronDown className="w-4 h-4 group-hover:text-yellow-300 transition-transform group-hover:rotate-180" />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'deportes' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-black/90 border border-yellow-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg"
                    >
                      {deportes.map((deporte) => (
                        <Link
                          key={deporte.name}
                          to={deporte.path}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-yellow-500/20 transition-colors border-b border-yellow-500/10 last:border-0 text-yellow-100"
                        >
                          <deporte.icon className="w-5 h-5 text-yellow-300" />
                          <span>{deporte.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/" className="px-4 py-2 rounded-lg hover:bg-yellow-500/20 text-yellow-100 hover:text-yellow-300 transition-colors">
                En Vivo
              </Link>
              <Link to="/promotions" className="px-4 py-2 rounded-lg hover:bg-yellow-500/20 text-yellow-100 hover:text-yellow-300 transition-colors">
                Promociones
              </Link>
              <Link to="/casino" className="px-4 py-2 rounded-lg hover:bg-yellow-500/20 text-yellow-100 hover:text-yellow-300 transition-colors">
                Casino
              </Link>
            </nav>

            {/* Búsqueda */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Buscar evento..."
                  className="w-64 bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-2 pl-10 text-sm text-yellow-100 placeholder-yellow-300/60 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-300 group-hover:text-yellow-200 transition-colors" />
              </div>

              {/* Botón de Admin - Siempre visible */}
              <Link
                to="/admin"
                className="w-10 h-10 bg-black/40 border border-yellow-500/50 rounded-full flex items-center justify-center hover:bg-yellow-500/20 hover:border-yellow-400 transition-all group"
                title="Panel de Administración"
              >
                <FiSettings className="w-5 h-5 text-yellow-300 group-hover:text-yellow-200 group-hover:rotate-90 transition-all duration-300" />
              </Link>

              {/* Botones de Auth */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowUserSidebar(true)}
                    className="flex items-center space-x-3 hover:bg-yellow-500/20 rounded-lg p-2 transition-colors"
                  >
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-100">{user.name || user.displayName}</p>
                      <p className="text-xs text-yellow-300 font-bold">${user.balance.toFixed(2)}</p>
                    </div>
                    <div className="w-10 h-10 bg-black/40 border border-yellow-500/50 rounded-full flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-yellow-300" />
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openLoginModal}
                    className="px-4 py-2 rounded-lg border border-yellow-400 text-yellow-300 hover:bg-yellow-500/10 transition-all"
                  >
                    Iniciar Sesión
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openRegisterModal}
                    className="px-4 py-2 rounded-lg bg-black/40 border border-yellow-500 text-yellow-300 hover:bg-yellow-500/20 transition-all font-medium"
                  >
                    Registrarse
                  </motion.button>
                </div>
              )}
            </div>

            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-lg bg-black/30 border border-yellow-500/50 flex items-center justify-center hover:bg-yellow-500/20 transition-colors"
            >
              {isMenuOpen ? <FiX className="w-6 h-6 text-yellow-300" /> : <FiMenu className="w-6 h-6 text-yellow-300" />}
            </button>
          </div>
        </div>

        {/* Menú Móvil */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-yellow-700 border-t border-yellow-600"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                <Link to="/" className="block px-4 py-3 rounded-lg hover:bg-yellow-500/20 transition-colors text-yellow-100">
                  En Vivo
                </Link>
                {deportes.map((deporte) => (
                  <Link
                    key={deporte.name}
                    to={deporte.path}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-yellow-500/20 transition-colors text-yellow-100"
                  >
                    <deporte.icon className="w-5 h-5 text-yellow-300" />
                    <span>{deporte.name}</span>
                  </Link>
                ))}
                <Link to="/promotions" className="block px-4 py-3 rounded-lg hover:bg-yellow-500/20 transition-colors text-yellow-100">
                  Promociones
                </Link>
                
                {!user && (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-yellow-600">
                    <button
                      onClick={openLoginModal}
                      className="px-4 py-3 rounded-lg border border-yellow-400 text-yellow-300 hover:bg-yellow-500/10 transition-all text-center"
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={openRegisterModal}
                      className="px-4 py-3 rounded-lg bg-black/40 border border-yellow-500 text-yellow-300 hover:bg-yellow-500/20 transition-all font-medium text-center"
                    >
                      Registrarse
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Modales y Sidebars */}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
      <RegisterModal isOpen={showRegisterModal} onClose={closeRegisterModal} />
      <UserSidebar isOpen={showUserSidebar} onClose={() => setShowUserSidebar(false)} />
    </>
  );
};

export default HeaderModern;
