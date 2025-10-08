import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { bannersService, Banner } from '@/services/bannersService';

/**
 * Slider principal con promociones y banners animados
 * Incluye navegación automática y manual
 */
const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar banners desde Firebase
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const bannersData = await bannersService.getActiveBanners();
      if (bannersData.length > 0) {
        setBanners(bannersData);
      }
    } catch (error) {
      console.error('Error al cargar banners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-avance del slider
  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Mostrar loading o mensaje si no hay banners
  if (loading) {
    return (
      <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center bg-dark-800 rounded-none md:rounded-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-900 rounded-none md:rounded-2xl">
        <div className="text-center text-white p-8">
          <h2 className="text-4xl font-bold mb-4">Bienvenido a WingoSports</h2>
          <p className="text-xl">Las mejores apuestas deportivas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden rounded-none md:rounded-2xl">
      <AnimatePresence mode="wait">
        <Link 
          key={currentSlide} 
          to={banners[currentSlide].linkTo}
          className="block absolute inset-0"
        >
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-dark-900"
          >
            <img
              src={banners[currentSlide].imageUrl}
              alt="Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/1200x450/1F252B/ffffff?text=Banner';
              }}
            />
          </motion.div>
        </Link>
      </AnimatePresence>

      {/* Controles */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-10">
        {/* Botón anterior */}
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>

        {/* Indicadores */}
        <div className="flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-12 h-3 bg-white'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              } rounded-full`}
            />
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Contador de slides */}
      <div className="absolute top-8 right-8 text-white/80 font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
        {currentSlide + 1} / {banners.length}
      </div>
    </div>
  );
};

export default HeroSlider;
