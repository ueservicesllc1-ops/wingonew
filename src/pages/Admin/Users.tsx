import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiArrowLeft, FiDollarSign, FiList } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { adminService } from '@/services/adminService';
import toast from 'react-hot-toast';
import UserBetsModal from '@/components/Admin/UserBetsModal';
import UserTransactionsModal from '@/components/Admin/UserTransactionsModal';

/**
 * Gestión de Usuarios - Panel de Administración
 */
const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [showBetsModal, setShowBetsModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);

  // Cargar usuarios desde Firestore
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      balance: 1250.50,
      status: 'active',
      verified: true,
      joinDate: '2024-01-15',
      totalBets: 45
    },
    {
      id: 2,
      name: 'María González',
      email: 'maria@example.com',
      balance: 850.00,
      status: 'active',
      verified: true,
      joinDate: '2024-02-20',
      totalBets: 32
    },
    {
      id: 3,
      name: 'Carlos Ramírez',
      email: 'carlos@example.com',
      balance: 0.00,
      status: 'suspended',
      verified: false,
      joinDate: '2024-03-10',
      totalBets: 5
    },
    {
      id: 4,
      name: 'Ana López',
      email: 'ana@example.com',
      balance: 2100.75,
      status: 'active',
      verified: true,
      joinDate: '2024-01-05',
      totalBets: 78
    },
  ]);

  // Cargar usuarios desde Firebase
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        status: doc.data().status || 'active',
        verified: doc.data().verified || false,
        totalBets: doc.data().totalBets || 0
      }));
      
      if (usersData.length > 0) {
        setUsers(usersData as any);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-dark-900 pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-4">
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Volver al Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">
              Gestión de <span className="text-gradient">Usuarios</span>
            </h1>
            <p className="text-gray-400">Administra todos los usuarios de la plataforma</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Usuarios', value: users.length, color: 'text-blue-400' },
            { label: 'Activos', value: users.filter(u => u.status === 'active').length, color: 'text-green-400' },
            { label: 'Suspendidos', value: users.filter(u => u.status === 'suspended').length, color: 'text-red-400' },
            { label: 'Verificados', value: users.filter(u => u.verified).length, color: 'text-purple-400' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-800 border border-dark-700 rounded-xl p-6"
            >
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Filtro por estado */}
            <div className="flex items-center space-x-2">
              <FiFilter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="suspended">Suspendidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Usuario</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Balance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Apuestas</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Fecha Registro</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-dark-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">{user.name}</span>
                          {user.verified && (
                            <FiCheckCircle className="w-4 h-4 text-green-400" title="Verificado" />
                          )}
                        </div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-secondary-400">
                        ${user.balance.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.totalBets}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status === 'active' ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.joinDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedUser({ id: user.id.toString(), name: user.name || 'Usuario' });
                            setShowBetsModal(true);
                          }}
                          className="p-2 hover:bg-dark-600 rounded-lg transition-colors" 
                          title="Ver Apuestas"
                        >
                          <FiList className="w-4 h-4 text-yellow-400" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser({ id: user.id.toString(), name: user.name || 'Usuario' });
                            setShowTransactionsModal(true);
                          }}
                          className="p-2 hover:bg-dark-600 rounded-lg transition-colors" 
                          title="Ver Transacciones"
                        >
                          <FiDollarSign className="w-4 h-4 text-green-400" />
                        </button>
                        <button className="p-2 hover:bg-dark-600 rounded-lg transition-colors" title="Editar">
                          <FiEdit2 className="w-4 h-4 text-primary-400" />
                        </button>
                        <button className="p-2 hover:bg-dark-600 rounded-lg transition-colors" title="Eliminar">
                          <FiTrash2 className="w-4 h-4 text-red-400" />
                        </button>
                        {user.status === 'active' ? (
                          <button className="p-2 hover:bg-dark-600 rounded-lg transition-colors" title="Suspender">
                            <FiXCircle className="w-4 h-4 text-red-400" />
                          </button>
                        ) : (
                          <button className="p-2 hover:bg-dark-600 rounded-lg transition-colors" title="Activar">
                            <FiCheckCircle className="w-4 h-4 text-green-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modales */}
        {selectedUser && (
          <>
            <UserBetsModal
              isOpen={showBetsModal}
              onClose={() => {
                setShowBetsModal(false);
                setSelectedUser(null);
              }}
              userId={selectedUser.id}
              userName={selectedUser.name}
            />
            <UserTransactionsModal
              isOpen={showTransactionsModal}
              onClose={() => {
                setShowTransactionsModal(false);
                setSelectedUser(null);
              }}
              userId={selectedUser.id}
              userName={selectedUser.name}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
