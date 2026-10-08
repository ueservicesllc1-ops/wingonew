import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { bannersService, Banner } from '@/services/bannersService';

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'default-1',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80',
    linkTo: '/sports/futbol',
    active: true,
    order: 1
  },
  {
    id: 'default-2',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80',
    linkTo: '/sports/baloncesto',
    active: true,
    order: 2
  },
  {
    id: 'default-3',
    imageUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1600&q=80',
    linkTo: '/casino',
    active: true,
    order: 3
  }
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80';

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
      if (bannersData && bannersData.length > 0) {
        setBanners(bannersData);
      } else {
        setBanners(DEFAULT_BANNERS);
      }
    } catch (error) {
      console.error('Error al cargar banners:', error);
      setBanners(DEFAULT_BANNERS);
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

  // Mostrar loading mientras se obtiene datos
  if (loading) {
    return (
      <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center bg-dark-800 rounded-none md:rounded-2xl border border-dark-700">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const activeBanners = banners.length > 0 ? banners : DEFAULT_BANNERS;
  const currentBanner = activeBanners[currentSlide] || activeBanners[0];

  return (
    <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden rounded-none md:rounded-2xl border border-dark-700 group shadow-2xl">
      <AnimatePresence mode="wait">
        <Link 
          key={currentSlide} 
          to={currentBanner.linkTo || '/'}
          className="block absolute inset-0"
        >
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-dark-900"
          >
            <img
              src={currentBanner.imageUrl}
              alt="Banner Promocional"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
            {/* Soft overlay gradient for better visual pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
          </motion.div>
        </Link>
      </AnimatePresence>

      {/* Controles */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-10">
        {/* Botón anterior */}
        <button
          onClick={prevSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-primary-500 transition-all border border-white/10 shadow-lg"
          aria-label="Anterior"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>

        {/* Indicadores */}
        <div className="flex space-x-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'w-10 h-3 bg-primary-500'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/70'
              } rounded-full`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={nextSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-primary-500 transition-all border border-white/10 shadow-lg"
          aria-label="Siguiente"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Contador de slides */}
      <div className="absolute top-6 right-6 text-white text-xs font-semibold bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        {currentSlide + 1} / {activeBanners.length}
      </div>
    </div>
  );
};

export default HeroSlider;

