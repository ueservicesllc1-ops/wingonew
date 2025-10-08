import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiTrash2, FiArrowLeft, FiX, FiUser, FiClock, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  read: boolean;
  createdAt: any;
}

/**
 * Gestión de Mensajes - Panel de Administración
 */
const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toLocaleString() || 'N/A'
      })) as Message[];
      
      setMessages(messagesData);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      toast.error('Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        status: 'read',
        read: true
      });
      
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status: 'read', read: true } : msg
      ));
      
      toast.success('Mensaje marcado como leído');
    } catch (error) {
      console.error('Error al marcar mensaje:', error);
      toast.error('Error al actualizar mensaje');
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;
    
    try {
      await deleteDoc(doc(db, 'messages', messageId));
      setMessages(messages.filter(msg => msg.id !== messageId));
      setSelectedMessage(null);
      toast.success('Mensaje eliminado');
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      toast.error('Error al eliminar mensaje');
    }
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !msg.read;
    if (filter === 'read') return msg.read;
    return true;
  });

  const unreadCount = messages.filter(msg => !msg.read).length;

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
              Mensajes de <span className="text-gradient">Contacto</span>
            </h1>
            <p className="text-gray-400">Gestiona todos los mensajes recibidos</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800 border border-dark-700 rounded-xl p-6"
          >
            <div className="text-3xl font-bold text-blue-400 mb-1">{messages.length}</div>
            <div className="text-sm text-gray-400">Total Mensajes</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-800 border border-yellow-500/30 rounded-xl p-6"
          >
            <div className="text-3xl font-bold text-yellow-400 mb-1">{unreadCount}</div>
            <div className="text-sm text-gray-400">Sin Leer</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-800 border border-dark-700 rounded-xl p-6"
          >
            <div className="text-3xl font-bold text-green-400 mb-1">{messages.length - unreadCount}</div>
            <div className="text-sm text-gray-400">Leídos</div>
          </motion.div>
        </div>

        {/* Filtros */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-yellow-600 text-black'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              Todos ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-yellow-600 text-black'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              Sin Leer ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'read'
                  ? 'bg-yellow-600 text-black'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              Leídos ({messages.length - unreadCount})
            </button>
          </div>
        </div>

        {/* Lista de Mensajes */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-600 border-t-transparent"></div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <FiMail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No hay mensajes para mostrar</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-700">
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openMessage(message)}
                  className={`p-6 hover:bg-dark-700 transition-colors cursor-pointer ${
                    !message.read ? 'bg-yellow-900/10 border-l-4 border-yellow-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !message.read ? 'bg-yellow-500/20' : 'bg-gray-700'
                      }`}>
                        {!message.read ? (
                          <FiMail className="w-6 h-6 text-yellow-400" />
                        ) : (
                          <FiCheckCircle className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`font-bold ${!message.read ? 'text-white' : 'text-gray-300'}`}>
                            {message.name}
                          </h3>
                          {!message.read && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">
                              Nuevo
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-1">{message.email}</p>
                        <p className={`font-medium mb-2 ${!message.read ? 'text-white' : 'text-gray-300'}`}>
                          {message.subject || 'Sin asunto'}
                        </p>
                        <p className="text-gray-400 text-sm line-clamp-2">{message.message}</p>
                        <p className="text-gray-500 text-xs mt-2 flex items-center space-x-1">
                          <FiClock className="w-3 h-3" />
                          <span>{message.createdAt}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(message.id);
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <FiTrash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Mensaje */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="absolute inset-0 bg-black/80"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">Mensaje de Contacto</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FiX className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Contenido */}
              <div className="flex-1 overflow-auto p-6 space-y-6">
                {/* Información del remitente */}
                <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm mb-1">
                        <FiUser className="w-4 h-4" />
                        <span>Nombre</span>
                      </div>
                      <p className="text-white font-semibold">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm mb-1">
                        <FiMail className="w-4 h-4" />
                        <span>Email</span>
                      </div>
                      <a href={`mailto:${selectedMessage.email}`} className="text-yellow-400 hover:text-yellow-300 font-semibold">
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm mb-1">
                        <FiMessageSquare className="w-4 h-4" />
                        <span>Asunto</span>
                      </div>
                      <p className="text-white font-semibold">{selectedMessage.subject || 'Sin asunto'}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm mb-1">
                        <FiClock className="w-4 h-4" />
                        <span>Fecha</span>
                      </div>
                      <p className="text-white font-semibold">{selectedMessage.createdAt}</p>
                    </div>
                  </div>
                </div>

                {/* Mensaje */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Mensaje:</h3>
                  <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-700 flex items-center justify-between">
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Eliminar Mensaje
                </button>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-colors"
                >
                  Responder por Email
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;
