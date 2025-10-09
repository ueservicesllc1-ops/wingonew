import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiEdit2, FiImage, FiX, FiUpload, FiSave, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import toast from 'react-hot-toast';

interface ProbabilityRule {
  percentage: number;
  minX: number;
  maxX: number;
}

interface LogicConfig {
  name: string;
  minBet: number;
  maxBet: number;
  rules: ProbabilityRule[];
}

interface GameConfig {
  id: string;
  name: string;
  icon: string;
  coverImage: string;
  backgroundImage: string;
  engineSound: string;
  crashSound: string;
  cashOutSound: string;
  probabilityRules: ProbabilityRule[]; // Mantener por compatibilidad
  logics: LogicConfig[]; // Nueva estructura con 3 lógicas
  active: boolean;
}

/**
 * Gestión de Juegos de Casino - Panel de Administración
 */
const AdminGames = () => {
  const [games, setGames] = useState<GameConfig[]>([
    {
      id: 'dino',
      name: 'Speed Run',
      icon: '🦖',
      coverImage: '',
      backgroundImage: '',
      engineSound: '',
      crashSound: '',
      cashOutSound: '',
      probabilityRules: [],
      logics: [
        {
          name: 'Estándar',
          minBet: 0,
          maxBet: 50,
          rules: [
            { percentage: 70, minX: 1.00, maxX: 1.98 },
            { percentage: 20, minX: 1.99, maxX: 2.00 },
            { percentage: 5, minX: 2.01, maxX: 3.00 },
            { percentage: 3, minX: 3.01, maxX: 4.00 },
            { percentage: 2, minX: 4.01, maxX: 5.00 }
          ]
        },
        {
          name: 'Baja',
          minBet: 51,
          maxBet: 200,
          rules: [
            { percentage: 80, minX: 1.00, maxX: 1.50 },
            { percentage: 15, minX: 1.51, maxX: 2.00 },
            { percentage: 4, minX: 2.01, maxX: 3.00 },
            { percentage: 1, minX: 3.01, maxX: 10.00 }
          ]
        },
        {
          name: 'Alta',
          minBet: 201,
          maxBet: 999999,
          rules: [
            { percentage: 90, minX: 1.00, maxX: 1.30 },
            { percentage: 8, minX: 1.31, maxX: 1.80 },
            { percentage: 2, minX: 1.81, maxX: 5.00 }
          ]
        }
      ],
      active: true
    },
    {
      id: 'dice',
      name: 'Dice',
      icon: '🎲',
      coverImage: '',
      backgroundImage: '',
      engineSound: '',
      crashSound: '',
      cashOutSound: '',
      probabilityRules: [],
      logics: [],
      active: false
    },
    {
      id: 'mines',
      name: 'Mines',
      icon: '💣',
      coverImage: '',
      backgroundImage: '',
      engineSound: '',
      crashSound: '',
      cashOutSound: '',
      probabilityRules: [],
      logics: [],
      active: false
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<GameConfig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [backgroundPreview, setBackgroundPreview] = useState<string>('');
  const [engineSoundPreview, setEngineSoundPreview] = useState<string>('');
  const [crashSoundPreview, setCrashSoundPreview] = useState<string>('');
  const [cashOutSoundPreview, setCashOutSoundPreview] = useState<string>('');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    try {
      const gamesDoc = await getDoc(doc(db, 'settings', 'casino-games'));
      if (gamesDoc.exists()) {
        setGames(gamesDoc.data().games || games);
      }
    } catch (error) {
      console.error('Error al cargar juegos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (game: GameConfig) => {
    setEditingGame({
      ...game,
      logics: game.logics && game.logics.length > 0 
        ? game.logics 
        : [
            {
              name: 'Estándar',
              minBet: 0,
              maxBet: 50,
              rules: [
                { percentage: 70, minX: 1.00, maxX: 1.98 },
                { percentage: 20, minX: 1.99, maxX: 2.00 },
                { percentage: 5, minX: 2.01, maxX: 3.00 },
                { percentage: 3, minX: 3.01, maxX: 4.00 },
                { percentage: 2, minX: 4.01, maxX: 5.00 }
              ]
            },
            {
              name: 'Baja',
              minBet: 51,
              maxBet: 200,
              rules: [
                { percentage: 80, minX: 1.00, maxX: 1.50 },
                { percentage: 15, minX: 1.51, maxX: 2.00 },
                { percentage: 4, minX: 2.01, maxX: 3.00 },
                { percentage: 1, minX: 3.01, maxX: 10.00 }
              ]
            },
            {
              name: 'Alta',
              minBet: 201,
              maxBet: 999999,
              rules: [
                { percentage: 90, minX: 1.00, maxX: 1.30 },
                { percentage: 8, minX: 1.31, maxX: 1.80 },
                { percentage: 2, minX: 1.81, maxX: 5.00 }
              ]
            }
          ]
    });
    setCoverPreview(game.coverImage);
    setBackgroundPreview(game.backgroundImage);
    setEngineSoundPreview(game.engineSound || '');
    setCrashSoundPreview(game.crashSound || '');
    setCashOutSoundPreview(game.cashOutSound || '');
    setShowModal(true);
  };

  const addRuleToLogic = (logicIndex: number) => {
    if (!editingGame) return;
    const newLogics = [...editingGame.logics];
    newLogics[logicIndex].rules.push({ percentage: 10, minX: 1.0, maxX: 2.0 });
    setEditingGame({ ...editingGame, logics: newLogics });
  };

  const updateLogicRule = (logicIndex: number, ruleIndex: number, field: keyof ProbabilityRule, value: number) => {
    if (!editingGame) return;
    const newLogics = [...editingGame.logics];
    newLogics[logicIndex].rules[ruleIndex] = { 
      ...newLogics[logicIndex].rules[ruleIndex], 
      [field]: value 
    };
    setEditingGame({ ...editingGame, logics: newLogics });
  };

  const removeRuleFromLogic = (logicIndex: number, ruleIndex: number) => {
    if (!editingGame) return;
    const newLogics = [...editingGame.logics];
    newLogics[logicIndex].rules = newLogics[logicIndex].rules.filter((_, i) => i !== ruleIndex);
    setEditingGame({ ...editingGame, logics: newLogics });
  };

  const updateLogicBetRange = (logicIndex: number, field: 'minBet' | 'maxBet', value: number) => {
    if (!editingGame) return;
    const newLogics = [...editingGame.logics];
    newLogics[logicIndex] = { ...newLogics[logicIndex], [field]: value };
    setEditingGame({ ...editingGame, logics: newLogics });
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar 5MB');
      return;
    }

    setUploading(true);
    try {
      // Subir a Firebase Storage
      const storageRef = ref(storage, `casino/covers/${editingGame?.id}_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      setCoverPreview(url);
      if (editingGame) {
        setEditingGame({ ...editingGame, coverImage: url });
      }
      
      toast.success('Imagen de cover subida');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleBackgroundImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar 5MB');
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `casino/backgrounds/${editingGame?.id}_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      setBackgroundPreview(url);
      if (editingGame) {
        setEditingGame({ ...editingGame, backgroundImage: url });
      }
      
      toast.success('Imagen de fondo subida');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'engine' | 'crash' | 'cashOut') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error('Por favor selecciona un archivo de audio válido');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('El audio no debe superar 10MB');
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `casino/sounds/${editingGame?.id}_${type}_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      if (editingGame) {
        if (type === 'engine') {
          setEngineSoundPreview(url);
          setEditingGame({ ...editingGame, engineSound: url });
        } else if (type === 'crash') {
          setCrashSoundPreview(url);
          setEditingGame({ ...editingGame, crashSound: url });
        } else if (type === 'cashOut') {
          setCashOutSoundPreview(url);
          setEditingGame({ ...editingGame, cashOutSound: url });
        }
      }
      
      toast.success('Audio subido correctamente');
    } catch (error) {
      console.error('Error al subir audio:', error);
      toast.error('Error al subir el audio');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editingGame) return;

    try {
      const updatedGames = games.map(g => 
        g.id === editingGame.id ? editingGame : g
      );

      await setDoc(doc(db, 'settings', 'casino-games'), {
        games: updatedGames
      });

      setGames(updatedGames);
      setShowModal(false);
      setEditingGame(null);
      setCoverPreview('');
      setBackgroundPreview('');
      
      toast.success('Juego actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar los cambios');
    }
  };

  const toggleActive = async (gameId: string) => {
    try {
      const updatedGames = games.map(g => 
        g.id === gameId ? { ...g, active: !g.active } : g
      );

      await setDoc(doc(db, 'settings', 'casino-games'), {
        games: updatedGames
      });

      setGames(updatedGames);
      toast.success('Estado actualizado');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-4">
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Volver al Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Gestión de <span className="text-gradient">Juegos de Casino</span>
          </h1>
          <p className="text-gray-400">Configura las imágenes y ajustes de cada juego</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {game.coverImage ? (
                    <img 
                      src={game.coverImage} 
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl">{game.icon}</div>
                  )}
                  
                  {/* Badge de estado */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                    game.active ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {game.active ? 'Activo' : 'Inactivo'}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cover:</span>
                      <span className={game.coverImage ? 'text-green-400' : 'text-red-400'}>
                        {game.coverImage ? '✓ Configurado' : '✗ Sin imagen'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fondo:</span>
                      <span className={game.backgroundImage ? 'text-green-400' : 'text-red-400'}>
                        {game.backgroundImage ? '✓ Configurado' : '✗ Sin imagen'}
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(game)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => toggleActive(game.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        game.active 
                          ? 'bg-red-600 hover:bg-red-500 text-white' 
                          : 'bg-green-600 hover:bg-green-500 text-white'
                      }`}
                    >
                      {game.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal de Edición */}
        <AnimatePresence>
          {showModal && editingGame && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowModal(false);
                  setEditingGame(null);
                  setCoverPreview('');
                  setBackgroundPreview('');
                }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ pointerEvents: 'none' }}
              >
                <div 
                  className="w-full max-w-3xl bg-dark-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
                  style={{ pointerEvents: 'auto' }}
                  onClick={(e) => e.stopPropagation()}
                >
                <div className="flex items-center justify-between p-6 border-b border-dark-700">
                  <h2 className="text-2xl font-bold text-white">
                    Editar {editingGame.name}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingGame(null);
                      setCoverPreview('');
                      setBackgroundPreview('');
                    }}
                    className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center hover:bg-dark-600 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Imagen de Cover */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <div className="flex items-center space-x-2">
                        <FiImage className="w-5 h-5 text-yellow-400" />
                        <span>Imagen de Cover (Portada del juego)</span>
                      </div>
                    </label>
                    
                    {/* Preview Cover */}
                    {coverPreview && (
                      <div className="mb-4 relative">
                        <img 
                          src={coverPreview} 
                          alt="Cover preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-700"
                        />
                        <button
                          onClick={() => {
                            setCoverPreview('');
                            if (editingGame) {
                              setEditingGame({ ...editingGame, coverImage: '' });
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center space-x-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center space-x-2 px-4 py-3 bg-dark-900 border-2 border-dashed border-gray-700 rounded-lg hover:border-yellow-500 transition-colors">
                          <FiUpload className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-300">
                            {uploading ? 'Subiendo...' : 'Seleccionar Imagen de Cover'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Recomendado: 400x300px, máximo 5MB
                    </p>
                  </div>

                  {/* Imagen de Fondo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <div className="flex items-center space-x-2">
                        <FiImage className="w-5 h-5 text-yellow-400" />
                        <span>Imagen de Fondo (Background del juego)</span>
                      </div>
                    </label>
                    
                    {/* Preview Background */}
                    {backgroundPreview && (
                      <div className="mb-4 relative">
                        <img 
                          src={backgroundPreview} 
                          alt="Background preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-700"
                        />
                        <button
                          onClick={() => {
                            setBackgroundPreview('');
                            if (editingGame) {
                              setEditingGame({ ...editingGame, backgroundImage: '' });
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center space-x-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center space-x-2 px-4 py-3 bg-dark-900 border-2 border-dashed border-gray-700 rounded-lg hover:border-yellow-500 transition-colors">
                          <FiUpload className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-300">
                            {uploading ? 'Subiendo...' : 'Seleccionar Imagen de Fondo'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBackgroundImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Recomendado: 1920x1080px, máximo 5MB
                    </p>
                  </div>

                  {/* Audio del Motor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <div className="flex items-center space-x-2">
                        <FiUpload className="w-5 h-5 text-yellow-400" />
                        <span>Sonido del Motor (F1 Engine Sound)</span>
                      </div>
                    </label>
                    
                    {engineSoundPreview && (
                      <div className="mb-4">
                        <audio controls className="w-full">
                          <source src={engineSoundPreview} />
                        </audio>
                        <button
                          onClick={() => {
                            setEngineSoundPreview('');
                            if (editingGame) {
                              setEditingGame({ ...editingGame, engineSound: '' });
                            }
                          }}
                          className="mt-2 text-red-500 hover:text-red-400 text-sm"
                        >
                          Eliminar audio
                        </button>
                      </div>
                    )}

                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center space-x-2 px-4 py-3 bg-dark-900 border-2 border-dashed border-gray-700 rounded-lg hover:border-yellow-500 transition-colors">
                        <FiUpload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">
                          {uploading ? 'Subiendo...' : 'Seleccionar Audio del Motor'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleAudioUpload(e, 'engine')}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Formatos: MP3, WAV, OGG - Máximo 10MB
                    </p>
                  </div>

                  {/* Audio de Crash */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <div className="flex items-center space-x-2">
                        <FiUpload className="w-5 h-5 text-yellow-400" />
                        <span>Sonido de Crash (Explosión)</span>
                      </div>
                    </label>
                    
                    {crashSoundPreview && (
                      <div className="mb-4">
                        <audio controls className="w-full">
                          <source src={crashSoundPreview} />
                        </audio>
                        <button
                          onClick={() => {
                            setCrashSoundPreview('');
                            if (editingGame) {
                              setEditingGame({ ...editingGame, crashSound: '' });
                            }
                          }}
                          className="mt-2 text-red-500 hover:text-red-400 text-sm"
                        >
                          Eliminar audio
                        </button>
                      </div>
                    )}

                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center space-x-2 px-4 py-3 bg-dark-900 border-2 border-dashed border-gray-700 rounded-lg hover:border-yellow-500 transition-colors">
                        <FiUpload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">
                          {uploading ? 'Subiendo...' : 'Seleccionar Audio de Crash'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleAudioUpload(e, 'crash')}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Formatos: MP3, WAV, OGG - Máximo 10MB
                    </p>
                  </div>

                  {/* Audio de Cash Out */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <div className="flex items-center space-x-2">
                        <FiUpload className="w-5 h-5 text-yellow-400" />
                        <span>Sonido de Cash Out (Ganancia)</span>
                      </div>
                    </label>
                    
                    {cashOutSoundPreview && (
                      <div className="mb-4">
                        <audio controls className="w-full">
                          <source src={cashOutSoundPreview} />
                        </audio>
                        <button
                          onClick={() => {
                            setCashOutSoundPreview('');
                            if (editingGame) {
                              setEditingGame({ ...editingGame, cashOutSound: '' });
                            }
                          }}
                          className="mt-2 text-red-500 hover:text-red-400 text-sm"
                        >
                          Eliminar audio
                        </button>
                      </div>
                    )}

                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center space-x-2 px-4 py-3 bg-dark-900 border-2 border-dashed border-gray-700 rounded-lg hover:border-yellow-500 transition-colors">
                        <FiUpload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">
                          {uploading ? 'Subiendo...' : 'Seleccionar Audio de Cash Out'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleAudioUpload(e, 'cashOut')}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Formatos: MP3, WAV, OGG - Máximo 10MB
                    </p>
                  </div>

                  {/* Lógicas de Probabilidad (3 niveles según apuesta) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <div className="flex items-center space-x-2">
                        <FiSettings className="w-5 h-5 text-yellow-400" />
                        <span>Lógicas de Probabilidad (según monto apostado)</span>
                      </div>
                    </label>

                    <div className="space-y-6">
                      {editingGame.logics.map((logic, logicIndex) => (
                        <div key={logicIndex} className="bg-dark-900 border-2 border-yellow-600/30 rounded-xl p-4">
                          {/* Header de la Lógica */}
                          <div className="mb-3">
                            <h4 className="text-yellow-400 font-bold text-base mb-2">
                              📊 Lógica {logicIndex + 1}: {logic.name}
                            </h4>
                            
                            {/* Rango de Apuesta */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-gray-400 text-xs block mb-1">Min Apuesta ($)</label>
                                <input
                                  type="number"
                                  value={logic.minBet}
                                  onChange={(e) => updateLogicBetRange(logicIndex, 'minBet', parseFloat(e.target.value) || 0)}
                                  className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-white text-sm"
                                  min="0"
                                />
                              </div>
                              <div>
                                <label className="text-gray-400 text-xs block mb-1">Max Apuesta ($)</label>
                                <input
                                  type="number"
                                  value={logic.maxBet}
                                  onChange={(e) => updateLogicBetRange(logicIndex, 'maxBet', parseFloat(e.target.value) || 999999)}
                                  className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-white text-sm"
                                  min="0"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Botón Agregar Regla */}
                          <div className="flex justify-end mb-2">
                            <button
                              onClick={() => addRuleToLogic(logicIndex)}
                              className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-bold"
                            >
                              + Regla
                            </button>
                          </div>

                          {/* Reglas de esta lógica */}
                          <div className="space-y-2">
                            {logic.rules.map((rule, ruleIndex) => (
                              <div key={ruleIndex} className="bg-black/50 border border-gray-700 rounded-lg p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-gray-300 text-xs font-semibold">Regla {ruleIndex + 1}</span>
                                  <button
                                    onClick={() => removeRuleFromLogic(logicIndex, ruleIndex)}
                                    className="text-red-500 hover:text-red-400"
                                  >
                                    <FiX className="w-3 h-3" />
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="text-gray-400 text-[10px] block mb-1">%</label>
                                    <input
                                      type="number"
                                      value={rule.percentage}
                                      onChange={(e) => updateLogicRule(logicIndex, ruleIndex, 'percentage', parseFloat(e.target.value) || 0)}
                                      className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-white text-xs"
                                      min="0"
                                      max="100"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-gray-400 text-[10px] block mb-1">Min X</label>
                                    <input
                                      type="number"
                                      value={rule.minX}
                                      onChange={(e) => updateLogicRule(logicIndex, ruleIndex, 'minX', parseFloat(e.target.value) || 1.0)}
                                      className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-white text-xs"
                                      step="0.01"
                                      min="1.00"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-gray-400 text-[10px] block mb-1">Max X</label>
                                    <input
                                      type="number"
                                      value={rule.maxX}
                                      onChange={(e) => updateLogicRule(logicIndex, ruleIndex, 'maxX', parseFloat(e.target.value) || 2.0)}
                                      className="w-full bg-black border border-gray-600 rounded px-2 py-1 text-white text-xs"
                                      step="0.01"
                                      min="1.00"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Validación del total para esta lógica */}
                          {logic.rules.length > 0 && (
                            <div className="mt-2">
                              {(() => {
                                const total = logic.rules.reduce((sum, r) => sum + r.percentage, 0);
                                return (
                                  <p className={`text-xs text-right ${total === 100 ? 'text-green-400' : 'text-red-400'}`}>
                                    Total: {total}% {total !== 100 && '(debe sumar 100%)'}
                                  </p>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setEditingGame(null);
                        setCoverPreview('');
                        setBackgroundPreview('');
                      }}
                      className="flex-1 px-6 py-3 bg-dark-700 text-white rounded-xl font-bold hover:bg-dark-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={uploading}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-black rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg disabled:opacity-50"
                    >
                      <FiSave className="w-5 h-5" />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminGames;
