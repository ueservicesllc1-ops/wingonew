import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { bannersService, Banner } from '@/services/bannersService';

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'default-1',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80',
    linkTo: '/sports/futbol',
    active: true,
    order: 1,
    title: 'Fútbol en vivo con las mejores cuotas',
    subtitle: 'Champions, LaLiga, Premier y más. Apuesta mientras ruedan los minutos.',
    cta: 'Apostar ahora',
  },
  {
    id: 'default-2',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80',
    linkTo: '/sports/baloncesto',
    active: true,
    order: 2,
    title: 'NBA y Euroliga: la acción no para',
    subtitle: 'Mercados al instante, cuotas mejoradas y pagos rápidos.',
    cta: 'Ver partidos',
  },
  {
    id: 'default-3',
    imageUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1600&q=80',
    linkTo: '/casino',
    active: true,
    order: 3,
    title: 'Casino: Plinko, Dados y Speed Run',
    subtitle: 'Juegos provably fair con multiplicadores que explotan.',
    cta: 'Jugar ahora',
  },
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80';
const SLIDE_MS = 6000;

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

  // Auto-avance del slider (se reinicia al cambiar de slide)
  useEffect(() => {
    if (banners.length > 1) {
      const timer = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, SLIDE_MS);
      return () => clearTimeout(timer);
    }
  }, [banners.length, currentSlide]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  if (loading) {
    return (
      <div className="relative w-full h-[320px] md:h-[440px] flex items-center justify-center bg-dark-800 md:rounded-3xl border border-white/10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const activeBanners = banners.length > 0 ? banners : DEFAULT_BANNERS;
  const currentBanner = activeBanners[currentSlide] || activeBanners[0];

  return (
    <div className="relative w-full h-[320px] md:h-[440px] overflow-hidden md:rounded-3xl border border-white/10 shadow-card group">
      <AnimatePresence mode="wait">
        <Link
          key={currentSlide}
          to={currentBanner.linkTo || '/'}
          className="block absolute inset-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-dark-900"
          >
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title || 'Banner Promocional'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
            {/* Capas de legibilidad y color */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/45 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-primary-500/30 blur-3xl pointer-events-none" />

            {/* Texto del banner (solo si tiene) */}
            {currentBanner.title && (
              <div className="absolute inset-0 flex items-center">
                <div className="px-6 md:px-14 max-w-2xl">
                  <motion.span
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="badge-live mb-4"
                  >
                    <span className="live-dot" /> En vivo ahora
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="font-display text-3xl md:text-5xl font-extrabold leading-[1.05] text-white mb-3"
                  >
                    {currentBanner.title}
                  </motion.h2>
                  {currentBanner.subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="text-sm md:text-lg text-dark-100 mb-6 max-w-xl"
                    >
                      {currentBanner.subtitle}
                    </motion.p>
                  )}
                  {currentBanner.cta && (
                    <motion.span
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="btn-neon inline-flex items-center space-x-2 px-6 py-3 text-sm md:text-base"
                    >
                      <span>{currentBanner.cta}</span>
                      <FiArrowRight className="w-5 h-5" />
                    </motion.span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </Link>
      </AnimatePresence>

      {/* Flechas */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-yellow-500 hover:text-dark-950 border border-white/10 opacity-0 group-hover:opacity-100"
        aria-label="Anterior"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-yellow-500 hover:text-dark-950 border border-white/10 opacity-0 group-hover:opacity-100"
        aria-label="Siguiente"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores con barra de progreso */}
      <div className="absolute bottom-5 left-6 md:left-14 z-10 flex items-center space-x-2">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="relative h-1.5 rounded-full bg-white/25 overflow-hidden"
            style={{ width: index === currentSlide ? 56 : 20 }}
            aria-label={`Slide ${index + 1}`}
          >
            {index === currentSlide && (
              <motion.span
                key={`p-${currentSlide}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                className="absolute inset-y-0 left-0 bg-gradient-neon rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Contador */}
      <div className="absolute top-5 right-5 z-10 text-white text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        {String(currentSlide + 1).padStart(2, '0')} / {String(activeBanners.length).padStart(2, '0')}
      </div>
    </div>
  );
};

export default HeroSlider;
