import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGift, FiClock, FiCheckCircle, FiTrendingUp, FiDollarSign, FiStar } from 'react-icons/fi';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useModalStore } from '@/store/useModalStore';

interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  type: 'welcome' | 'deposit' | 'cashback' | 'special';
  value: string;
  validUntil?: string;
  terms: string[];
  active: boolean;
  featured: boolean;
}

/**
 * Página de Promociones
 * Muestra todas las promociones activas disponibles
 */
const Promotions = () => {
  const { openRegisterModal } = useModalStore();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'welcome' | 'deposit' | 'cashback' | 'special'>('all');

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const promotionsRef = collection(db, 'promotions');
      const q = query(
        promotionsRef,
        where('active', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const promotionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Promotion[];
      
      setPromotions(promotionsData);
    } catch (error) {
      console.error('Error al cargar promociones:', error);
      // Datos de ejemplo si no hay en Firestore
      setPromotions([
        {
          id: '1',
          title: '¡Bono de Bienvenida!',
          description: 'Obtén hasta $500 en tu primer depósito. Duplicamos tu primer ingreso para que empieces con el pie derecho.',
          type: 'welcome',
          value: '100% hasta $500',
          validUntil: '31 de Diciembre, 2025',
          terms: [
            'Válido solo para nuevos usuarios',
            'Depósito mínimo de $20',
            'Requisito de apuesta: 5x el monto del bono',
            'Válido por 30 días desde el registro'
          ],
          active: true,
          featured: true
        },
        {
          id: '2',
          title: 'Bono de Recarga',
          description: 'Recarga tu cuenta y recibe un 50% extra en cada depósito. ¡Más saldo, más diversión!',
          type: 'deposit',
          value: '50% hasta $300',
          validUntil: 'Permanente',
          terms: [
            'Disponible para todos los usuarios',
            'Depósito mínimo de $50',
            'Requisito de apuesta: 3x el monto del bono',
            'Máximo un bono por día'
          ],
          active: true,
          featured: false
        },
        {
          id: '3',
          title: 'Cashback Semanal',
          description: 'Recupera el 10% de tus pérdidas cada semana. Porque valoramos tu lealtad.',
          type: 'cashback',
          value: '10% Cashback',
          validUntil: 'Todos los Lunes',
          terms: [
            'Se calcula automáticamente cada lunes',
            'Basado en pérdidas netas de la semana anterior',
            'Mínimo $10 en pérdidas para calificar',
            'Sin requisitos de apuesta'
          ],
          active: true,
          featured: true
        },
        {
          id: '4',
          title: 'Apuesta Gratis',
          description: 'Apuesta sin riesgo en tu evento favorito. Si pierdes, te devolvemos tu apuesta.',
          type: 'special',
          value: 'Hasta $100',
          validUntil: 'Fines de Semana',
          terms: [
            'Válido sábados y domingos',
            'Apuesta mínima de $20',
            'Cuota mínima de 2.0',
            'Reembolso en crédito de apuesta'
          ],
          active: true,
          featured: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPromotions = filter === 'all' 
    ? promotions 
    : promotions.filter(promo => promo.type === filter);

  const typeLabels = {
    welcome: 'Bienvenida',
    deposit: 'Depósito',
    cashback: 'Cashback',
    special: 'Especial'
  };

  const typeColors = {
    welcome: 'from-yellow-600 to-yellow-700',
    deposit: 'from-gray-700 to-gray-800',
    cashback: 'from-yellow-500 to-yellow-600',
    special: 'from-yellow-700 to-orange-600'
  };

  const typeIcons = {
    welcome: FiGift,
    deposit: FiDollarSign,
    cashback: FiTrendingUp,
    special: FiStar
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 to-yellow-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-black max-w-4xl mx-auto"
          >
            <FiGift className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Promociones
            </h1>
            <p className="text-xl md:text-2xl text-black/80 mb-4">
              Las mejores ofertas y bonos para ti
            </p>
            <p className="text-lg text-black/70">
              Aprovecha nuestras promociones exclusivas y maximiza tus ganancias
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-black shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Todas
            </button>
            {Object.entries(typeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filter === key
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-black shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lista de Promociones */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-600 border-t-transparent"></div>
            </div>
          ) : filteredPromotions.length === 0 ? (
            <div className="text-center py-12">
              <FiGift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No hay promociones disponibles en este momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {filteredPromotions.map((promo, index) => {
                const TypeIcon = typeIcons[promo.type];
                return (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative bg-black/30 border-2 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 ${
                      promo.featured ? 'border-yellow-500' : 'border-gray-700'
                    }`}
                  >
                    {promo.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-600 to-yellow-700 text-black px-4 py-2 rounded-full font-bold text-sm z-10 flex items-center space-x-1">
                        <FiStar className="w-4 h-4" />
                        <span>DESTACADA</span>
                      </div>
                    )}

                    {/* Header con gradiente */}
                    <div className={`bg-gradient-to-r ${typeColors[promo.type]} p-8 relative`}>
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }} />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <TypeIcon className="w-6 h-6 text-white" />
                          </div>
                          <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                            {typeLabels[promo.type]}
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">{promo.title}</h3>
                        <p className="text-white/90 text-lg">{promo.description}</p>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-8">
                      {/* Valor del bono */}
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
                        <div className="text-center">
                          <p className="text-gray-400 text-sm mb-2">Valor del Bono</p>
                          <p className="text-4xl font-bold text-yellow-400">{promo.value}</p>
                        </div>
                      </div>

                      {/* Validez */}
                      {promo.validUntil && (
                        <div className="flex items-center space-x-2 text-gray-300 mb-6">
                          <FiClock className="w-5 h-5 text-yellow-400" />
                          <span>Válido hasta: <strong>{promo.validUntil}</strong></span>
                        </div>
                      )}

                      {/* Términos y condiciones */}
                      <div className="mb-6">
                        <h4 className="text-white font-bold mb-3 flex items-center space-x-2">
                          <FiCheckCircle className="w-5 h-5 text-green-400" />
                          <span>Términos y Condiciones:</span>
                        </h4>
                        <ul className="space-y-2">
                          {promo.terms.map((term, i) => (
                            <li key={i} className="flex items-start space-x-2 text-gray-300 text-sm">
                              <span className="text-yellow-400 mt-1">•</span>
                              <span>{term}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Botón de acción */}
                      <button 
                        onClick={openRegisterModal}
                        className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg"
                      >
                        Reclamar Ahora
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-yellow-600 to-yellow-700">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-black max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              ¿Listo para Empezar?
            </h2>
            <p className="text-xl mb-8">
              Regístrate ahora y aprovecha todas nuestras promociones exclusivas
            </p>
            <button 
              onClick={openRegisterModal}
              className="bg-black text-yellow-300 px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all duration-300 shadow-lg text-lg"
            >
              Registrarse Gratis
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Promotions;
