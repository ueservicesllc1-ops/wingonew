import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiArrowLeft, FiX, FiGift, FiPercent, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import toast from 'react-hot-toast';

/**
 * Gestión de Promociones - Panel de Administración
 */
const AdminPromotions = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'welcome',
    value: 0,
    valueType: 'percentage',
    maxAmount: 0,
    minDeposit: 0,
    validUntil: '',
    terms: '',
    featured: false,
    active: true
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const promotionsRef = collection(db, 'promotions');
      const q = query(promotionsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const promotionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPromotions(promotionsData);
    } catch (error) {
      console.error('Error al cargar promociones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convertir términos de string a array
      const termsArray = formData.terms.split('\n').filter(t => t.trim() !== '');
      
      const promoData = {
        ...formData,
        terms: termsArray,
        updatedAt: serverTimestamp()
      };

      if (editingPromo) {
        await updateDoc(doc(db, 'promotions', editingPromo.id), promoData);
        toast.success('Promoción actualizada correctamente');
      } else {
        await addDoc(collection(db, 'promotions'), {
          ...promoData,
          createdAt: serverTimestamp()
        });
        toast.success('Promoción creada correctamente');
      }

      setShowModal(false);
      setEditingPromo(null);
      resetForm();
      loadPromotions();
    } catch (error) {
      console.error('Error al guardar promoción:', error);
      toast.error('Error al guardar la promoción');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'welcome',
      value: 0,
      valueType: 'percentage',
      maxAmount: 0,
      minDeposit: 0,
      validUntil: '',
      terms: '',
      featured: false,
      active: true
    });
  };

  const handleEdit = (promo: any) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description,
      type: promo.type,
      value: promo.value,
      valueType: promo.valueType,
      maxAmount: promo.maxAmount,
      minDeposit: promo.minDeposit,
      validUntil: promo.validUntil,
      terms: Array.isArray(promo.terms) ? promo.terms.join('\n') : '',
      featured: promo.featured || false,
      active: promo.active
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta promoción?')) {
      try {
        await deleteDoc(doc(db, 'promotions', id));
        toast.success('Promoción eliminada');
        loadPromotions();
      } catch (error) {
        console.error('Error al eliminar promoción:', error);
        toast.error('Error al eliminar la promoción');
      }
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'promotions', id), {
        active: !currentStatus
      });
      loadPromotions();
      toast.success(`Promoción ${!currentStatus ? 'activada' : 'desactivada'}`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      toast.error('Error al cambiar el estado');
    }
  };

  const getPromoIcon = (type: string) => {
    switch (type) {
      case 'welcome': return FiGift;
      case 'cashback': return FiPercent;
      case 'free-bet': return FiDollarSign;
      default: return FiGift;
    }
  };

  const getPromoColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'from-yellow-600 to-yellow-700';
      case 'deposit': return 'from-gray-700 to-gray-800';
      case 'cashback': return 'from-yellow-500 to-yellow-600';
      case 'special': return 'from-yellow-700 to-orange-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

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
              Gestión de <span className="text-gradient">Promociones</span>
            </h1>
            <p className="text-gray-400">Crea y administra promociones y bonos</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white rounded-xl font-bold shadow-glow"
          >
            <FiPlus className="w-5 h-5" />
            <span>Nueva Promoción</span>
          </motion.button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Promociones', value: promotions.length, color: 'text-yellow-400' },
            { label: 'Activas', value: promotions.filter(p => p.active).length, color: 'text-yellow-500' },
            { label: 'Inactivas', value: promotions.filter(p => !p.active).length, color: 'text-gray-400' },
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

        {/* Lista de Promociones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo, index) => {
            const PromoIcon = getPromoIcon(promo.type);
            const colorClass = getPromoColor(promo.type);

            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden group"
              >
                {/* Header colorido */}
                <div className={`relative h-32 bg-gradient-to-br ${colorClass} p-6`}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }} />
                  </div>
                  <div className="relative flex items-center justify-between">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <PromoIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      promo.active ? 'bg-white/20 text-white' : 'bg-black/40 text-gray-300'
                    }`}>
                      {promo.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>

                {/* Información */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{promo.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{promo.description}</p>

                  {/* Detalles */}
                  <div className="space-y-2 mb-4 p-3 bg-dark-900/50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Valor:</span>
                      <span className="text-white font-semibold">
                        {promo.valueType === 'percentage' ? `${promo.value}%` : `$${promo.value}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Máximo:</span>
                      <span className="text-secondary-400 font-semibold">${promo.maxAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Válido hasta:</span>
                      <span className="text-white">{promo.validUntil}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => toggleActive(promo.id, promo.active)}
                      className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                      title={promo.active ? 'Desactivar' : 'Activar'}
                    >
                      <FiEye className={`w-4 h-4 ${promo.active ? 'text-green-400' : 'text-gray-400'}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="p-2 bg-dark-700 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal de Crear/Editar Promoción */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowModal(false);
                  setEditingPromo(null);
                  resetForm();
                }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-dark-800 rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-dark-700">
                  <h2 className="text-2xl font-bold text-white">
                    {editingPromo ? 'Editar Promoción' : 'Nueva Promoción'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingPromo(null);
                      resetForm();
                    }}
                    className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center hover:bg-dark-600 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Título */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Título de la Promoción
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Bono de Bienvenida"
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    {/* Descripción */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descripción
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Duplica tu primer depósito hasta $500"
                        rows={3}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    {/* Tipo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tipo de Promoción
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      >
                        <option value="welcome">Bono de Bienvenida</option>
                        <option value="deposit">Bono de Depósito</option>
                        <option value="cashback">Cashback</option>
                        <option value="special">Promoción Especial</option>
                      </select>
                    </div>

                    {/* Tipo de Valor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tipo de Valor
                      </label>
                      <select
                        value={formData.valueType}
                        onChange={(e) => setFormData({ ...formData, valueType: e.target.value })}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      >
                        <option value="percentage">Porcentaje (%)</option>
                        <option value="fixed">Monto Fijo ($)</option>
                      </select>
                    </div>

                    {/* Valor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Valor
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                        placeholder="100"
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    {/* Monto Máximo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Monto Máximo ($)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.maxAmount}
                        onChange={(e) => setFormData({ ...formData, maxAmount: parseFloat(e.target.value) })}
                        placeholder="500"
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    {/* Depósito Mínimo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Depósito Mínimo ($)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.minDeposit}
                        onChange={(e) => setFormData({ ...formData, minDeposit: parseFloat(e.target.value) })}
                        placeholder="20"
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    {/* Fecha de Expiración */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Válido Hasta
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* Términos y Condiciones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Términos y Condiciones (uno por línea)
                    </label>
                    <textarea
                      value={formData.terms}
                      onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                      placeholder="Válido solo para nuevos usuarios&#10;Depósito mínimo de $20&#10;Requisito de apuesta: 5x el monto del bono"
                      rows={5}
                      className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Escribe cada término en una línea nueva</p>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-5 h-5 rounded border-dark-700 bg-dark-900 text-yellow-500 focus:ring-yellow-500"
                      />
                      <label htmlFor="featured" className="text-white font-medium">
                        Promoción destacada (aparece con badge especial)
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="w-5 h-5 rounded border-dark-700 bg-dark-900 text-primary-500 focus:ring-primary-500"
                      />
                      <label htmlFor="active" className="text-white font-medium">
                        Promoción activa
                      </label>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingPromo(null);
                        resetForm();
                      }}
                      className="flex-1 px-6 py-3 bg-dark-700 text-white rounded-xl font-bold hover:bg-dark-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-primary text-white rounded-xl font-bold shadow-glow hover:shadow-glow-orange transition-all"
                    >
                      {editingPromo ? 'Actualizar' : 'Crear'} Promoción
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPromotions;
