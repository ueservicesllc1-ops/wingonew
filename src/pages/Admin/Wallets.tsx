import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiUser, FiMail, FiCreditCard, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { adminService } from '@/services/adminService';
import toast from 'react-hot-toast';

/**
 * Gestión de Billeteras - Panel de Administración
 * Buscar usuarios y administrar sus fondos
 */
const AdminWallets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'email' | 'cedula'>('id');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [fundsAmount, setFundsAmount] = useState('');
  const [fundsReason, setFundsReason] = useState('');
  const [fundsType, setFundsType] = useState<'add' | 'remove' | 'set'>('add');
  const [processing, setProcessing] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error('Ingresa un término de búsqueda');
      return;
    }

    setSearching(true);
    setSearchResults([]);

    try {
      const usersRef = collection(db, 'users');
      let q;

      // Construir query según el tipo de búsqueda
      if (searchType === 'id') {
        q = query(usersRef, where('shortId', '==', searchTerm.toUpperCase()));
      } else if (searchType === 'email') {
        q = query(usersRef, where('email', '==', searchTerm.toLowerCase()));
      } else {
        q = query(usersRef, where('cedula', '==', searchTerm));
      }

      const snapshot = await getDocs(q);
      
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (results.length === 0) {
        toast.error('No se encontró ningún usuario');
      } else {
        toast.success(`${results.length} usuario(s) encontrado(s)`);
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      toast.error('Error al buscar usuario');
    } finally {
      setSearching(false);
    }
  };

  const openFundsModal = (user: any, type: 'add' | 'remove' | 'set') => {
    setSelectedUser(user);
    setFundsType(type);
    setFundsAmount('');
    setFundsReason(
      type === 'add' ? 'Depósito administrativo' : 
      type === 'remove' ? 'Retiro administrativo' : 
      'Ajuste de balance'
    );
    setShowFundsModal(true);
  };

  const handleFundsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(fundsAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }

    setProcessing(true);

    try {
      if (fundsType === 'add') {
        await adminService.addFundsToUser(selectedUser.id, amount, fundsReason);
        toast.success(`$${amount.toFixed(2)} agregados exitosamente`);
      } else if (fundsType === 'remove') {
        await adminService.removeFundsFromUser(selectedUser.id, amount, fundsReason);
        toast.success(`$${amount.toFixed(2)} retirados exitosamente`);
      } else {
        await adminService.setUserBalance(selectedUser.id, amount, fundsReason);
        toast.success('Balance actualizado exitosamente');
      }

      // Actualizar balance en los resultados
      setSearchResults(searchResults.map(u => 
        u.id === selectedUser.id 
          ? { 
              ...u, 
              balance: fundsType === 'set' ? amount : 
                      fundsType === 'add' ? u.balance + amount : 
                      u.balance - amount 
            }
          : u
      ));
      
      setShowFundsModal(false);
      setSelectedUser(null);
      setFundsAmount('');
      setFundsReason('');
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar la operación');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-4">
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Volver al Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Gestión de <span className="text-gradient">Billeteras</span>
          </h1>
          <p className="text-gray-400">Busca usuarios y administra sus fondos</p>
        </div>

        {/* Buscador */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 border border-dark-700 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Buscar Usuario</h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Tipo de búsqueda */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSearchType('id')}
                className={`flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all ${
                  searchType === 'id'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                }`}
              >
                <FiUser className="w-4 h-4" />
                <span>ID Usuario</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchType('email')}
                className={`flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all ${
                  searchType === 'email'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                }`}
              >
                <FiMail className="w-4 h-4" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchType('cedula')}
                className={`flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all ${
                  searchType === 'cedula'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                }`}
              >
                <FiCreditCard className="w-4 h-4" />
                <span>Cédula</span>
              </button>
            </div>

            {/* Input de búsqueda */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={
                  searchType === 'id' ? 'Ej: W0001' :
                  searchType === 'email' ? 'Ej: usuario@ejemplo.com' :
                  'Ej: 1234567890'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-12 pr-4 py-4 text-gray-900 text-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Botón de búsqueda */}
            <button
              type="submit"
              disabled={searching}
              className="w-full py-4 bg-gradient-primary text-white rounded-xl font-bold text-lg shadow-glow hover:shadow-glow-orange transition-all disabled:opacity-50"
            >
              {searching ? 'Buscando...' : 'Buscar Usuario'}
            </button>
          </form>
        </motion.div>

        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Resultados</h2>
            
            {searchResults.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden hover:border-primary-500 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {/* Info del usuario */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                        <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-bold">
                          {user.shortId || 'ID no asignado'}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-400">
                          <FiMail className="inline w-4 h-4 mr-2" />
                          {user.email}
                        </p>
                        {user.cedula && (
                          <p className="text-gray-400">
                            <FiCreditCard className="inline w-4 h-4 mr-2" />
                            Cédula: {user.cedula}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-1">Balance Actual</p>
                      <p className="text-4xl font-bold text-secondary-400">
                        ${(user.balance || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-dark-700">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openFundsModal(user, 'add')}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg font-bold shadow-lg hover:bg-green-600 transition-all"
                    >
                      <span>+</span>
                      <span>Agregar</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openFundsModal(user, 'remove')}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg font-bold shadow-lg hover:bg-red-600 transition-all"
                    >
                      <span>-</span>
                      <span>Retirar</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openFundsModal(user, 'set')}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary-500 text-white rounded-lg font-bold shadow-lg hover:bg-primary-600 transition-all"
                    >
                      <span>⚖️</span>
                      <span>Ajustar</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Mensaje cuando no hay resultados */}
        {!searching && searchResults.length === 0 && (
          <div className="text-center py-20">
            <FiSearch className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Busca un usuario</h3>
            <p className="text-gray-500">
              Utiliza el ID corto (W0001), email o cédula para encontrar al usuario
            </p>
          </div>
        )}

        {/* Modal de Gestión de Fondos */}
        <AnimatePresence>
          {showFundsModal && selectedUser && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFundsModal(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                style={{ pointerEvents: 'none' }}
              >
                <div 
                  className="w-full max-w-md bg-dark-800 rounded-2xl shadow-2xl border border-gray-600"
                  style={{ pointerEvents: 'auto' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-dark-700">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {fundsType === 'add' ? '💰 Agregar Fondos' : 
                         fundsType === 'remove' ? '💸 Retirar Fondos' : 
                         '⚖️ Ajustar Balance'}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        <span className="text-primary-400 font-bold">{selectedUser.shortId}</span> - {selectedUser.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowFundsModal(false)}
                      className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center hover:bg-dark-600 transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Formulario */}
                  <form onSubmit={handleFundsSubmit} className="p-6 space-y-6">
                    {/* Balance Actual */}
                    <div className="p-4 bg-dark-900 rounded-lg border border-dark-700">
                      <p className="text-sm text-gray-400 mb-1">Balance Actual</p>
                      <p className="text-4xl font-bold text-white">
                        ${(selectedUser.balance || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Tipo de Operación */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tipo de Operación
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setFundsType('add')}
                          className={`py-2 rounded-lg font-medium transition-all ${
                            fundsType === 'add'
                              ? 'bg-green-500 text-white'
                              : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                          }`}
                        >
                          + Agregar
                        </button>
                        <button
                          type="button"
                          onClick={() => setFundsType('remove')}
                          className={`py-2 rounded-lg font-medium transition-all ${
                            fundsType === 'remove'
                              ? 'bg-red-500 text-white'
                              : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                          }`}
                        >
                          - Retirar
                        </button>
                        <button
                          type="button"
                          onClick={() => setFundsType('set')}
                          className={`py-2 rounded-lg font-medium transition-all ${
                            fundsType === 'set'
                              ? 'bg-primary-500 text-white'
                              : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                          }`}
                        >
                          ⚖️ Ajustar
                        </button>
                      </div>
                    </div>

                    {/* Monto */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {fundsType === 'set' ? 'Nuevo Balance' : 'Monto'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold text-xl">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={fundsAmount}
                          onChange={(e) => setFundsAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-12 pr-4 py-4 text-gray-900 text-2xl font-bold focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                      {fundsAmount && fundsType !== 'set' && (
                        <div className="mt-3 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                          <p className="text-sm text-gray-300">
                            Nuevo balance será: <span className="text-xl font-bold text-white">
                              ${fundsType === 'add' 
                                ? ((selectedUser.balance || 0) + parseFloat(fundsAmount)).toFixed(2)
                                : ((selectedUser.balance || 0) - parseFloat(fundsAmount)).toFixed(2)
                              }
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Razón */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Razón / Comentario
                      </label>
                      <textarea
                        value={fundsReason}
                        onChange={(e) => setFundsReason(e.target.value)}
                        placeholder="Ej: Bono de bienvenida, Corrección de error, Retiro solicitado..."
                        rows={3}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    {/* Botones */}
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowFundsModal(false)}
                        disabled={processing}
                        className="flex-1 px-6 py-3 bg-dark-700 text-white rounded-xl font-bold hover:bg-dark-600 transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={processing}
                        className={`flex-1 px-6 py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          fundsType === 'add' ? 'bg-green-500 hover:bg-green-600' :
                          fundsType === 'remove' ? 'bg-red-500 hover:bg-red-600' :
                          'bg-primary-500 hover:bg-primary-600'
                        } text-white`}
                      >
                        {processing ? 'Procesando...' : 
                         fundsType === 'add' ? 'Agregar Fondos' : 
                         fundsType === 'remove' ? 'Retirar Fondos' : 
                         'Ajustar Balance'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminWallets;
