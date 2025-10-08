import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiEdit2, FiTrash2, FiEye, FiArrowLeft, FiX, FiImage, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bannersService, Banner } from '@/services/bannersService';

/**
 * Gestión de Banners del Hero - Panel de Administración
 */
const AdminBanners = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar banners desde Firebase
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const bannersData = await bannersService.getBanners();
      setBanners(bannersData);
    } catch (error) {
      toast.error('Error al cargar banners');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    imageUrl: '',
    linkTo: '/',
    active: true
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  // Lista de páginas disponibles
  const availablePages = [
    { value: '/', label: 'Inicio' },
    { value: '/sports/futbol', label: 'Fútbol' },
    { value: '/sports/baloncesto', label: 'Baloncesto' },
    { value: '/sports/tenis', label: 'Tenis' },
    { value: '/sports/baseball', label: 'Baseball' },
    { value: '/sports/futbol-americano', label: 'Fútbol Americano' },
    { value: '/sports/volleyball', label: 'Volleyball' },
    { value: '/sports/hockey', label: 'Hockey' },
    { value: '/sports/rugby', label: 'Rugby' },
    { value: '/sports/cricket', label: 'Cricket' },
    { value: '/sports/esports', label: 'eSports' },
    { value: '/profile', label: 'Mi Perfil' },
    { value: '/my-bets', label: 'Mis Apuestas' },
    { value: '/transactions', label: 'Transacciones' },
    { value: '/promotions', label: 'Promociones' },
    { value: '/casino', label: 'Casino' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que haya imagen seleccionada o ya exista una
    if (!selectedFile && !formData.imageUrl) {
      toast.error('Por favor selecciona una imagen');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Si hay una nueva imagen, subirla
      if (selectedFile) {
        toast.loading('Subiendo imagen...', { id: 'upload' });
        imageUrl = await bannersService.uploadImage(selectedFile);
        toast.success('Imagen subida correctamente', { id: 'upload' });

        // Si estamos editando y había una imagen anterior, eliminarla
        if (editingBanner && editingBanner.imageUrl) {
          await bannersService.deleteImage(editingBanner.imageUrl);
        }
      }

      if (editingBanner && editingBanner.id) {
        // Editar banner existente
        await bannersService.updateBanner(editingBanner.id, {
          ...formData,
          imageUrl
        });
        toast.success('Banner actualizado correctamente');
      } else {
        // Crear nuevo banner
        const newBanner = {
          ...formData,
          imageUrl,
          order: banners.length + 1
        };
        await bannersService.createBanner(newBanner);
        toast.success('Banner creado correctamente');
      }

      // Recargar banners
      await loadBanners();

      // Resetear formulario
      setShowModal(false);
      setEditingBanner(null);
      setSelectedFile(null);
      setPreviewUrl('');
      setFormData({
        imageUrl: '',
        linkTo: '/',
        active: true
      });
    } catch (error) {
      toast.error('Error al guardar banner');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      imageUrl: banner.imageUrl,
      linkTo: banner.linkTo,
      active: banner.active
    });
    setPreviewUrl(banner.imageUrl);
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (confirm('¿Estás seguro de eliminar este banner?')) {
      try {
        await bannersService.deleteBanner(id, imageUrl);
        toast.success('Banner eliminado');
        await loadBanners();
      } catch (error) {
        toast.error('Error al eliminar banner');
        console.error(error);
      }
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      await bannersService.toggleBannerActive(id, !currentActive);
      await loadBanners();
    } catch (error) {
      toast.error('Error al cambiar estado');
      console.error(error);
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
              Banners del <span className="text-gradient">Hero</span>
            </h1>
            <p className="text-gray-400">Gestiona los banners del slider principal</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white rounded-xl font-bold shadow-glow"
          >
            <FiUpload className="w-5 h-5" />
            <span>Nuevo Banner</span>
          </motion.button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Banners', value: banners.length, color: 'text-blue-400' },
            { label: 'Activos', value: banners.filter(b => b.active).length, color: 'text-green-400' },
            { label: 'Inactivos', value: banners.filter(b => !b.active).length, color: 'text-gray-400' },
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

        {/* Lista de Banners */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No hay banners creados aún</p>
            <p className="text-gray-500 text-sm mt-2">Haz clic en "Nuevo Banner" para crear uno</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden group"
            >
              {/* Preview del banner */}
              <div className="relative h-48 bg-dark-900 overflow-hidden">
                <img 
                  src={banner.imageUrl} 
                  alt="Banner preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1200x450/1F252B/ffffff?text=Imagen+no+disponible';
                  }}
                />
                {!banner.active && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold">INACTIVO</span>
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    banner.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {banner.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-400 break-all">
                    <span className="text-gray-500">URL:</span> {banner.imageUrl.length > 40 ? banner.imageUrl.substring(0, 40) + '...' : banner.imageUrl}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Enlace:</span> <span className="text-primary-400 font-medium">{banner.linkTo}</span>
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => toggleActive(banner.id!, banner.active)}
                    className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                    title={banner.active ? 'Desactivar' : 'Activar'}
                  >
                    {banner.active ? (
                      <FiEye className="w-4 h-4 text-green-400" />
                    ) : (
                      <FiEye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id!, banner.imageUrl)}
                    className="p-2 bg-dark-700 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <FiTrash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}

        {/* Modal de Crear/Editar Banner */}
        <AnimatePresence>
          {showModal && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowModal(false);
                  setEditingBanner(null);
                }}
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
                  className="w-full max-w-2xl bg-dark-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-600"
                  style={{ pointerEvents: 'auto' }}
                  onClick={(e) => e.stopPropagation()}
                >
                {/* Header del Modal */}
                <div className="flex items-center justify-between p-6 border-b border-dark-700">
                  <h2 className="text-2xl font-bold text-white">
                    {editingBanner ? 'Editar Banner' : 'Nuevo Banner'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingBanner(null);
                    }}
                    className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center hover:bg-dark-600 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Subir Imagen */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Imagen del Banner
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="banner-image"
                      />
                      <label htmlFor="banner-image" className="cursor-pointer">
                        <FiUpload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-white mb-1">
                          {selectedFile ? selectedFile.name : 'Click para seleccionar imagen'}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG o WEBP (máx. 5MB) - Recomendado: 1200x450px
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Página de destino */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ¿A dónde lleva el banner al hacer clic?
                    </label>
                    <select
                      value={formData.linkTo}
                      onChange={(e) => setFormData({ ...formData, linkTo: e.target.value })}
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    >
                      {availablePages.map((page) => (
                        <option key={page.value} value={page.value}>
                          {page.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Al hacer clic en el banner, el usuario será redirigido a esta página
                    </p>
                  </div>

                  {/* Preview de la imagen */}
                  {previewUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Vista Previa
                      </label>
                      <div className="w-full h-48 bg-dark-900 rounded-lg overflow-hidden border border-dark-700">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 p-3 bg-dark-900 rounded-lg border border-primary-500/30">
                        <p className="text-xs text-gray-400">
                          <span className="text-primary-400 font-semibold">👆 Al hacer clic:</span> Redirige a <span className="text-white font-medium">{formData.linkTo}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Estado */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-5 h-5 rounded border-dark-700 bg-dark-900 text-primary-500 focus:ring-primary-500"
                    />
                    <label htmlFor="active" className="text-white font-medium">
                      Banner activo
                    </label>
                  </div>

                  {/* Botones */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingBanner(null);
                      }}
                      className="flex-1 px-6 py-3 bg-dark-700 text-white rounded-xl font-bold hover:bg-dark-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 px-6 py-3 bg-gradient-primary text-white rounded-xl font-bold shadow-glow hover:shadow-glow-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? 'Subiendo...' : editingBanner ? 'Actualizar' : 'Crear'} Banner
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

export default AdminBanners;
