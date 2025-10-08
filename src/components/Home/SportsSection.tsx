import { motion } from 'framer-motion';
import SportsCard from '@/components/Sports/SportsCard';
import { IoFootballOutline, IoBasketballOutline, IoTennisballOutline } from 'react-icons/io5';
import { MdSportsBaseball, MdSportsVolleyball, MdSportsFootball } from 'react-icons/md';

/**
 * Sección de deportes disponibles con tarjetas interactivas
 */
const SportsSection = () => {
  const deportes = [
    {
      name: 'Fútbol',
      icon: IoFootballOutline,
      path: '/sports/futbol',
      liveMatches: 145,
      color: 'from-green-500 to-green-700',
    },
    {
      name: 'Baloncesto',
      icon: IoBasketballOutline,
      path: '/sports/baloncesto',
      liveMatches: 68,
      color: 'from-orange-500 to-orange-700',
    },
    {
      name: 'Tenis',
      icon: IoTennisballOutline,
      path: '/sports/tenis',
      liveMatches: 32,
      color: 'from-yellow-500 to-yellow-700',
    },
    {
      name: 'Baseball',
      icon: MdSportsBaseball,
      path: '/sports/baseball',
      liveMatches: 24,
      color: 'from-blue-500 to-blue-700',
    },
    {
      name: 'Volleyball',
      icon: MdSportsVolleyball,
      path: '/sports/volleyball',
      liveMatches: 18,
      color: 'from-purple-500 to-purple-700',
    },
    {
      name: 'Fútbol Americano',
      icon: MdSportsFootball,
      path: '/sports/futbol-americano',
      liveMatches: 12,
      color: 'from-red-500 to-red-700',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Título de la sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Deportes <span className="text-gradient">Disponibles</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Apuesta en tus deportes favoritos con las mejores cuotas del mercado
          </p>
        </motion.div>

        {/* Grid de deportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deportes.map((deporte, index) => (
            <SportsCard
              key={deporte.name}
              {...deporte}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SportsSection;
