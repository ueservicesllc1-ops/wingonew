import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiMail, FiDollarSign, FiCreditCard, FiCalendar, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import MyBetsModal from './MyBetsModal';
import TransactionsModal from './TransactionsModal';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar lateral elegante para el perfil del usuario
 * Diseño minimalista sin tantos colores
 */
const UserSidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showBetsModal, setShowBetsModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Sesión cerrada');
      navigate('/');
      onClose();
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  if (!user) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay solo en el área del sidebar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black/80 z-40"
            />

            {/* Sidebar con borde gris */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-dark-800 border-l-2 border-gray-600 z-50 shadow-2xl"
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-dark-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Mi Perfil</h2>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-lg bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-colors"
                    >
                      <FiX className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto">
                  {/* Avatar y nombre */}
                  <div className="px-4 py-4 text-center border-b border-dark-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{user.displayName || user.name}</h3>
                    {user.shortId && (
                      <p className="text-xs text-gray-400 mb-2">ID: {user.shortId}</p>
                    )}
                    
                    {/* Email debajo del nombre */}
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <FiMail className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    
                    {/* Fecha de registro debajo del email */}
                    <div className="flex items-center justify-center space-x-1">
                      <FiCalendar className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Balance destacado */}
                  <div className="px-4 py-4 bg-dark-900/50 border-b border-dark-700">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Balance Disponible</p>
                      <p className="text-2xl font-bold text-white mb-2">
                        ${user.balance.toFixed(2)}
                      </p>
                      <div className="flex justify-center gap-2 mt-3">
                        <button className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium rounded-lg transition-colors">
                          Depositar
                        </button>
                        <button className="px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-white text-xs font-medium rounded-lg transition-colors">
                          Retirar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional del usuario */}
                  {user.cedula && (
                    <div className="px-4 py-4 space-y-3">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Información Adicional
                      </h4>

                      {/* Cédula */}
                      <div className="flex items-center space-x-2 p-2 bg-dark-900/30 rounded-lg">
                        <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center">
                          <FiCreditCard className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Cédula</p>
                          <p className="text-xs text-white font-medium">{user.cedula}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enlaces rápidos */}
                  <div className="px-4 py-4 border-t border-dark-700">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Acciones
                    </h4>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowBetsModal(true)}
                        className="w-full flex items-center space-x-2 px-3 py-2 bg-dark-900/30 hover:bg-dark-700 rounded-lg transition-colors text-left"
                      >
                        <FiDollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-white">Mis Apuestas</span>
                      </button>

                    <button
                      onClick={() => setShowTransactionsModal(true)}
                      className="w-full flex items-center space-x-2 px-3 py-2 bg-dark-900/30 hover:bg-dark-700 rounded-lg transition-colors text-left"
                    >
                      <FiCreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-white">Transacciones</span>
                    </button>
                    </div>
                  </div>
                </div>

                {/* Footer - Cerrar sesión */}
                <div className="px-4 py-3 border-t border-dark-700">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-dark-700 hover:bg-red-500/20 text-gray-300 hover:text-red-400 rounded-lg transition-all text-sm font-medium"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de Mis Apuestas */}
      <MyBetsModal 
        isOpen={showBetsModal} 
        onClose={() => setShowBetsModal(false)} 
      />

      {/* Modal de Transacciones */}
      <TransactionsModal 
        isOpen={showTransactionsModal} 
        onClose={() => setShowTransactionsModal(false)} 
      />
    </>
  );
};

export default UserSidebar;
