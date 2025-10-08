import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn, UserPlus, LogOut, Wallet, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal';

const HeaderPro = () => {
  const { user } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Sesión cerrada exitosamente');
      setShowUserMenu(false);
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <>
      <header className="bg-betting-bg-light border-b border-betting-border sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-green to-brand-green-dark rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold text-white">WINGO</span>
                <span className="text-xs text-brand-green font-semibold ml-2">SPORTS</span>
              </div>
            </Link>

            {/* Centro - Navegación rápida */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className="px-4 py-2 text-betting-text-muted hover:text-white hover:bg-betting-bg-lighter rounded transition-colors font-medium"
              >
                Deportes
              </Link>
              <Link
                to="/sports/futbol"
                className="px-4 py-2 text-betting-text-muted hover:text-white hover:bg-betting-bg-lighter rounded transition-colors font-medium"
              >
                En Vivo
              </Link>
              <Link
                to="/my-bets"
                className="px-4 py-2 text-betting-text-muted hover:text-white hover:bg-betting-bg-lighter rounded transition-colors font-medium"
              >
                Mis Apuestas
              </Link>
            </nav>

            {/* Derecha - Auth / Usuario */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {/* Balance */}
                  <div className="hidden sm:flex items-center bg-betting-bg-lighter border border-betting-border rounded px-4 py-2">
                    <Wallet className="w-4 h-4 text-brand-green mr-2" />
                    <span className="font-bold text-white text-lg">
                      ${user.balance.toFixed(2)}
                    </span>
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 bg-betting-bg-lighter border border-betting-border hover:border-brand-green px-4 py-2 rounded transition-colors"
                    >
                      <User className="w-5 h-5 text-brand-green" />
                      <span className="hidden sm:block text-white font-medium">
                        {user.displayName}
                      </span>
                      <ChevronDown className="w-4 h-4 text-betting-text-muted" />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-betting-bg-light rounded-lg shadow-2xl border border-betting-border py-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-betting-bg-lighter text-white transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 text-brand-green" />
                          <span>Mi Perfil</span>
                        </Link>
                        <Link
                          to="/my-bets"
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-betting-bg-lighter text-white transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Wallet className="w-4 h-4 text-brand-green" />
                          <span>Mis Apuestas</span>
                        </Link>
                        <hr className="my-2 border-betting-border" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-betting-bg-lighter text-red-400 w-full text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center space-x-2 bg-betting-bg-lighter border border-betting-border hover:border-brand-green px-4 py-2 rounded transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-brand-green" />
                    <span className="text-white font-medium">Ingresar</span>
                  </button>
                  
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="flex items-center space-x-2 bg-brand-green hover:bg-brand-green-dark px-4 py-2 rounded transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-white" />
                    <span className="text-white font-bold">Registrarse</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modales */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};

export default HeaderPro;
