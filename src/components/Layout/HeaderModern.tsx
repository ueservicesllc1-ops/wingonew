import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSearch, FiChevronDown, FiSettings, FiZap, FiGift, FiPlus } from 'react-icons/fi';
import { IoFootballOutline, IoBasketballOutline, IoTennisballOutline } from 'react-icons/io5';
import { MdSportsBaseball, MdSportsVolleyball } from 'react-icons/md';
import { useAuthStore } from '@/store/useAuthStore';
import { useModalStore } from '@/store/useModalStore';
import LoginModal from '@/components/Auth/LoginModal';
import RegisterModal from '@/components/Auth/RegisterModal';
import UserSidebar from '@/components/User/UserSidebar';

const TICKER_ITEMS = [
  'Bono de bienvenida hasta $500 en tu primer depósito',
  'Cashback semanal del 10%',
  'Apuesta sin riesgo en tu primera jugada',
  'Retiros procesados en menos de 24 horas',
];

/**
 * Header moderno: ticker de promociones, logo, navegación, búsqueda y autenticación.
 * Altura total ≈ 116px (el layout usa pt-32).
 */
const HeaderModern = () => {
  const { showLoginModal, showRegisterModal, openLoginModal, closeLoginModal, openRegisterModal, closeRegisterModal } = useModalStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
      isActive ? 'text-white bg-white/10' : 'text-dark-200 hover:text-white hover:bg-white/5'
    }`;

  const initial = (user?.name || user?.displayName || 'U').charAt(0).toUpperCase();

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark-950/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-dark-950/60 backdrop-blur-md'
        } border-b border-white/5`}
      >
        {/* Ticker de promociones */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-700/40 via-primary-600/30 to-secondary-600/30 border-b border-white/5">
          <div className="marquee-track py-2 text-xs font-semibold text-white/90">
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="flex items-center mx-8 whitespace-nowrap">
                <FiZap className="w-3.5 h-3.5 mr-2 text-yellow-400" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group" aria-label="Wingo Sports inicio">
              <motion.div
                whileHover={{ rotate: -6, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-11 h-11 rounded-2xl bg-gradient-neon flex items-center justify-center shadow-neon"
              >
                <span className="font-display font-extrabold text-2xl text-dark-950 leading-none">W</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-secondary-500 ring-2 ring-dark-950" />
              </motion.div>
              <div className="hidden md:block leading-tight">
                <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">
                  Wingo<span className="text-gradient">Sports</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-dark-300">Apuestas en vivo</p>
              </div>
            </Link>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Principal">
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('deportes')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-4 py-2 rounded-xl text-sm font-semibold text-dark-200 hover:text-white hover:bg-white/5 flex items-center space-x-1.5">
                  <span>Deportes</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'deportes' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'deportes' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      className="absolute top-full left-0 pt-2 w-64"
                    >
                      <div className="glass-effect rounded-2xl shadow-2xl p-2">
                        {deportes.map((deporte) => (
                          <Link
                            key={deporte.name}
                            to={deporte.path}
                            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-dark-100 hover:text-white group"
                          >
                            <span className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-yellow-500/15 flex items-center justify-center">
                              <deporte.icon className="w-5 h-5 text-yellow-400" />
                            </span>
                            <span className="text-sm font-medium">{deporte.name}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/" end className={navLinkClass}>
                <span className="flex items-center space-x-2">
                  <span className="live-dot" />
                  <span>En Vivo</span>
                </span>
              </NavLink>
              <NavLink to="/promotions" className={navLinkClass}>Promociones</NavLink>
              <NavLink to="/casino" className={navLinkClass}>Casino</NavLink>
            </nav>

            {/* Búsqueda + cuenta */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="relative group">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar evento..."
                  aria-label="Buscar evento"
                  className="w-52 xl:w-64 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 pl-10 text-sm text-white placeholder-dark-300 focus:outline-none focus:border-yellow-500/60 focus:bg-white/10 focus:ring-4 focus:ring-yellow-500/10 transition-all"
                />
              </div>

              <Link
                to="/admin"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/25 group"
                title="Panel de Administración"
                aria-label="Panel de Administración"
              >
                <FiSettings className="w-[18px] h-[18px] text-dark-200 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </Link>

              {user ? (
                <button
                  onClick={() => setShowUserSidebar(true)}
                  className="flex items-center space-x-3 pl-1.5 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-yellow-500/50 hover:bg-white/10"
                >
                  <span className="w-9 h-9 rounded-full bg-gradient-neon flex items-center justify-center font-display font-bold text-dark-950">
                    {initial}
                  </span>
                  <span className="text-left leading-tight">
                    <span className="block text-xs text-dark-300 max-w-[110px] truncate">{user.name || user.displayName}</span>
                    <span className="block text-sm font-bold text-yellow-400">${user.balance.toFixed(2)}</span>
                  </span>
                  <FiPlus className="w-4 h-4 text-yellow-400" />
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button onClick={openLoginModal} className="btn-ghost px-5 py-2.5 text-sm">
                    Iniciar Sesión
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={openRegisterModal}
                    className="btn-neon px-5 py-2.5 text-sm flex items-center space-x-2"
                  >
                    <FiGift className="w-4 h-4" />
                    <span>Registrarse</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden md:ml-3 w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <FiX className="w-6 h-6 text-white" /> : <FiMenu className="w-6 h-6 text-white" />}
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
              className="lg:hidden bg-dark-950/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-1">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white font-semibold">
                  <span className="live-dot" />
                  <span>En Vivo</span>
                </Link>
                {deportes.map((deporte) => (
                  <Link
                    key={deporte.name}
                    to={deporte.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 text-dark-100"
                  >
                    <deporte.icon className="w-5 h-5 text-yellow-400" />
                    <span>{deporte.name}</span>
                  </Link>
                ))}
                <Link to="/promotions" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/5 text-dark-100">
                  Promociones
                </Link>
                <Link to="/casino" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/5 text-dark-100">
                  Casino
                </Link>

                {user ? (
                  <button
                    onClick={() => { setShowUserSidebar(true); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 mt-3"
                  >
                    <span className="text-white font-semibold">{user.name || user.displayName}</span>
                    <span className="text-yellow-400 font-bold">${user.balance.toFixed(2)}</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-4 mt-2 border-t border-white/5">
                    <button onClick={openLoginModal} className="btn-ghost py-3 text-sm">
                      Iniciar Sesión
                    </button>
                    <button onClick={openRegisterModal} className="btn-neon py-3 text-sm">
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
