import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { FiDollarSign, FiClock, FiUsers, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/config/firebase';
import toast from 'react-hot-toast';

interface GameState {
  phase: 'waiting' | 'running' | 'crashed';
  multiplier: number;
  crashPoint: number | null;
  timeLeft: number;
}

interface PlayerBet {
  name: string;
  amount: number;
  cashOutAt: number | null;
  profit: number;
  targetMultiplier: number;
}

/**
 * Juego Speed Run (Crash) con PixiJS
 * Multiplicador que sube hasta que crashea
 */
const DinoGame = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const { user, firebaseUser } = useAuthStore();

  const [gameState, setGameState] = useState<GameState>({
    phase: 'waiting',
    multiplier: 1.00,
    crashPoint: null,
    timeLeft: 5
  });

  const gameStateRef = useRef(gameState);
  
  // Mantener el ref actualizado
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [engineSound, setEngineSound] = useState<string>('');
  const [crashSound, setCrashSound] = useState<string>('');
  const [cashOutSound, setCashOutSound] = useState<string>('');
  const [logics, setLogics] = useState<any[]>([]);
  
  const engineAudioRef = useRef<HTMLAudioElement | null>(null);
  const crashAudioRef = useRef<HTMLAudioElement | null>(null);
  const cashOutAudioRef = useRef<HTMLAudioElement | null>(null);
  const crashedThisRound = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [betAmount, setBetAmount] = useState(10);
  const [hasActiveBet, setHasActiveBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [currentProfit, setCurrentProfit] = useState(0);
  
  // Apuesta automática
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [autoPlayAmount, setAutoPlayAmount] = useState(10);
  const [autoPlayTarget, setAutoPlayTarget] = useState(2.0);

  const [history, setHistory] = useState<number[]>([
    1.45, 2.34, 1.02, 5.67, 1.89, 3.21, 1.56, 8.90, 1.23, 2.78, 4.12, 1.67, 3.45
  ]);

  const [livePlayers, setLivePlayers] = useState<PlayerBet[]>([]);

  // Base de datos de nombres mezclados (50 jugadores)
  const playerNames = [
    // Nombres reales
    'Carlos Mendez', 'Ana Rodriguez', 'Miguel Santos', 'Sofia Lopez', 'Juan Perez',
    'Maria Garcia', 'Diego Torres', 'Laura Martinez', 'Pedro Ramirez', 'Carmen Flores',
    // Apodos + números
    'ElTigre777', 'LaReina23', 'Speedy99', 'Champion2024', 'Lucky13',
    'TheBoss88', 'AcePlayer', 'ProGamer21', 'Winner365', 'FastCar55',
    // Nombres + números
    'Luis_H92', 'Elena_C', 'Jorge_M18', 'Patricia_R', 'Roberto_D45',
    'Isabel_V', 'Fernando_S7', 'Monica_O', 'Alex_Cruz', 'Gaby_R23',
    // Apodos creativos
    'TurboMax', 'NitroKing', 'SpeedDemon', 'RacerPro', 'MegaWin',
    'UltraFast', 'SuperStar', 'AceRacer', 'KingBet', 'LuckyShot',
    // Nombres reales cortos
    'Javier N', 'Camila H', 'Sergio V', 'Natalia C', 'Oscar P',
    'Andrea M', 'Martin R', 'Lucia G', 'Pablo D', 'Carolina J',
    // Apodos + símbolos
    'Raul_AG', 'Vicky_M', 'Gustavo_R', 'Adriana_S', 'Felipe_C'
  ];

  // Generar nombre aleatorio de la base de datos
  const generatePlayerName = () => {
    return playerNames[Math.floor(Math.random() * playerNames.length)];
  };

  // Generar monto de apuesta aleatorio
  const generateBetAmount = () => {
    const amounts = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200, 250, 500, 1000];
    return amounts[Math.floor(Math.random() * amounts.length)];
  };

  // Simular jugadores apostando en vivo
  useEffect(() => {
    if (gameState.phase === 'waiting') {
      // Limpiar jugadores al inicio
      setLivePlayers([]);
      
      // Generar cantidad aleatoria de jugadores (15-25)
      const playerCount = Math.floor(Math.random() * 11) + 15; // 15 a 25 jugadores
      let addedCount = 0;
      
      // Función para agregar jugadores con intervalos variables
      const addNextPlayer = () => {
        if (addedCount >= playerCount) {
          return;
        }
        
        // Asignar un objetivo de cash out aleatorio a cada jugador
        const targetMultiplier = Math.random() < 0.25 
          ? 1.1 + Math.random() * 0.4  // 25% salen entre 1.1x - 1.5x
          : Math.random() < 0.45
          ? 1.5 + Math.random() * 1.0  // 20% salen entre 1.5x - 2.5x
          : Math.random() < 0.65
          ? 2.5 + Math.random() * 2.5  // 20% salen entre 2.5x - 5.0x
          : Math.random() < 0.85
          ? 5.0 + Math.random() * 10.0  // 20% intentan entre 5.0x - 15.0x (muy arriesgados)
          : 15.0 + Math.random() * 35.0; // 15% intentan más de 15.0x (codiciosos - casi siempre pierden)
        
        const playerName = generatePlayerName();
        const target = parseFloat(targetMultiplier.toFixed(2));
        
        setLivePlayers(prev => [...prev, {
          name: playerName,
          amount: generateBetAmount(),
          cashOutAt: null,
          profit: 0,
          targetMultiplier: target
        }]);
        
        addedCount++;
        
        // A veces agregar múltiples jugadores seguidos (saltos)
        const shouldAddMultiple = Math.random() < 0.3; // 30% de probabilidad
        if (shouldAddMultiple && addedCount < playerCount) {
          const extraPlayers = Math.min(Math.floor(Math.random() * 3) + 1, playerCount - addedCount); // 1-3 jugadores extra
          for (let i = 0; i < extraPlayers; i++) {
            const extraTarget = Math.random() < 0.25 
              ? 1.1 + Math.random() * 0.4
              : Math.random() < 0.45
              ? 1.5 + Math.random() * 1.0
              : Math.random() < 0.65
              ? 2.5 + Math.random() * 2.5
              : Math.random() < 0.85
              ? 5.0 + Math.random() * 10.0
              : 15.0 + Math.random() * 35.0;
            
            const extraName = generatePlayerName();
            const extraTargetParsed = parseFloat(extraTarget.toFixed(2));
            
            setLivePlayers(prev => [...prev, {
              name: extraName,
              amount: generateBetAmount(),
              cashOutAt: null,
              profit: 0,
              targetMultiplier: extraTargetParsed
            }]);
            
            addedCount++;
            if (addedCount >= playerCount) break;
          }
        }
        
        // Intervalo variable para el siguiente jugador (50-150ms)
        // Más rápido para que todos entren en los 5 segundos de espera
        if (addedCount < playerCount) {
          setTimeout(addNextPlayer, Math.random() * 100 + 50);
        }
      };
      
      // Iniciar la cadena
      addNextPlayer();
    }
  }, [gameState.phase]);

  // Efecto separado para manejar cash outs durante la carrera
  useEffect(() => {
    if (gameState.phase !== 'running') return;

    const cashOutInterval = setInterval(() => {
      const currentMultiplier = gameStateRef.current.multiplier;
      
      setLivePlayers(prev => {
        const updated = prev.map(player => {
          // Si ya hizo cash out, no cambiar
          if (player.cashOutAt !== null) return player;
          
          // Si el multiplicador alcanzó o superó el objetivo del jugador, hace cash out
          if (currentMultiplier >= player.targetMultiplier) {
            const finalMultiplier = player.targetMultiplier;
            return {
              ...player,
              cashOutAt: parseFloat(finalMultiplier.toFixed(2)),
              profit: parseFloat((player.amount * finalMultiplier - player.amount).toFixed(2))
            };
          }
          
          return player;
        });
        return updated;
      });
    }, 100);

    return () => clearInterval(cashOutInterval);
  }, [gameState.phase]); // ✅ Solo depende de phase, usa ref para multiplier

  // Efecto para marcar perdedores cuando crashea
  useEffect(() => {
    if (gameState.phase === 'crashed') {
      // Marcar jugadores que no hicieron cash out como perdedores
      setLivePlayers(prev => 
        prev.map(player => {
          if (player.cashOutAt === null) {
            console.log(`${player.name} perdió`);
            return { ...player, profit: -player.amount };
          }
          return player;
        })
      );

    }
  }, [gameState.phase]);

  // Efecto para auto-play: apostar automáticamente
  useEffect(() => {
    if (autoPlayEnabled && gameState.phase === 'waiting' && !hasActiveBet && gameState.timeLeft >= 3) {
      handlePlaceBet();
    }
  }, [autoPlayEnabled, gameState.phase, hasActiveBet, gameState.timeLeft]);

  // Efecto para auto cash-out cuando auto-play está activo
  useEffect(() => {
    if (autoPlayEnabled && hasActiveBet && !hasCashedOut && gameState.phase === 'running') {
      if (gameState.multiplier >= autoPlayTarget) {
        handleCashOut();
      }
    }
  }, [autoPlayEnabled, hasActiveBet, hasCashedOut, gameState.phase, gameState.multiplier]);

  // Cargar configuración del juego desde Firestore
  useEffect(() => {
    const loadGameConfig = async () => {
      try {
        const gamesDoc = await getDoc(doc(db, 'settings', 'casino-games'));
        if (gamesDoc.exists()) {
          const games = gamesDoc.data().games || [];
          const dinoGame = games.find((g: any) => g.id === 'dino');
          if (dinoGame) {
            setBackgroundImage(dinoGame.backgroundImage || '');
            setEngineSound(dinoGame.engineSound || '');
            setCrashSound(dinoGame.crashSound || '');
            setCashOutSound(dinoGame.cashOutSound || '');
            setLogics(dinoGame.logics || []);
          }
        }
      } catch (error) {
        console.error('Error al cargar configuración del juego:', error);
      }
    };

    loadGameConfig();
  }, []);

  // Inicializar audios cuando se cargan las URLs
  useEffect(() => {
    if (engineSound) {
      engineAudioRef.current = new Audio(engineSound);
      engineAudioRef.current.loop = true;
      engineAudioRef.current.volume = 0.4;
    }
    if (crashSound) {
      crashAudioRef.current = new Audio(crashSound);
      crashAudioRef.current.volume = 0.6;
    }
    if (cashOutSound) {
      cashOutAudioRef.current = new Audio(cashOutSound);
      cashOutAudioRef.current.volume = 0.5;
    }
  }, [engineSound, crashSound, cashOutSound]);

  // Manejar mute/unmute
  useEffect(() => {
    if (engineAudioRef.current) engineAudioRef.current.muted = isMuted;
    if (crashAudioRef.current) crashAudioRef.current.muted = isMuted;
    if (cashOutAudioRef.current) cashOutAudioRef.current.muted = isMuted;
  }, [isMuted]);

  // Inicializar PixiJS
  useEffect(() => {
    if (!canvasRef.current || appRef.current) return;

    const initPixi = async () => {
      const app = new PIXI.Application();
      
      await app.init({
        width: 1200,
        height: 500,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
        appRef.current = app;
        setupGame(app);
      }
    };

    initPixi();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [backgroundImage]);

  // Cleanup: Detener todos los audios al desmontar el componente
  useEffect(() => {
    return () => {
      // Detener y limpiar todos los audios
      if (engineAudioRef.current) {
        engineAudioRef.current.pause();
        engineAudioRef.current.currentTime = 0;
        engineAudioRef.current = null;
      }
      if (crashAudioRef.current) {
        crashAudioRef.current.pause();
        crashAudioRef.current.currentTime = 0;
        crashAudioRef.current = null;
      }
      if (cashOutAudioRef.current) {
        cashOutAudioRef.current.pause();
        cashOutAudioRef.current.currentTime = 0;
        cashOutAudioRef.current = null;
      }
    };
  }, []);

  const setupGame = async (_app: PIXI.Application) => {
    // Canvas vacío - la imagen de fondo se muestra como CSS background
    // No agregar ningún elemento al canvas
  };

  // Efecto para reproducir beep del semáforo
  useEffect(() => {
    if (gameState.phase === 'waiting' && gameState.timeLeft > 0 && gameState.timeLeft <= 5) {
      if (gameState.timeLeft === 1) {
        // Último beep más largo y agudo: "piiiiii"
        playBeep(1200, 800);
      } else {
        // Beeps cortos: "pi pi pi pi"
        playBeep(900, 120);
      }
    }
  }, [gameState.timeLeft, gameState.phase]);

  // Simulación del juego (sin backend)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let startTime: number;

    if (gameState.phase === 'waiting') {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            // Generar crash point aleatorio
            const crashPoint = generateCrashPoint();
            startRound(crashPoint);
            return { ...prev, phase: 'running', crashPoint, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else if (gameState.phase === 'running') {
      startTime = Date.now();
      
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const mult = calculateMultiplier(elapsed);
        
        setGameState(prev => {
          if (prev.crashPoint && mult >= prev.crashPoint) {
            crashGame(prev.crashPoint);
            return { ...prev, phase: 'crashed', multiplier: prev.crashPoint };
          }
          // Solo log si el multiplicador baja (no debería pasar)
          if (mult < prev.multiplier) {
            console.error(`⚠️ ALERTA: Multiplicador bajó de ${prev.multiplier.toFixed(2)} a ${mult.toFixed(2)}`);
          }
          return { ...prev, multiplier: mult };
        });

      }, 50);
    } else if (gameState.phase === 'crashed') {
      // Resetear apuestas inmediatamente después del crash
      setHasActiveBet(false);
      setHasCashedOut(false);
      
      // Esperar 3 segundos y luego ir a waiting (con 10 segundos de semáforo)
      setTimeout(() => {
        setGameState({ phase: 'waiting', multiplier: 1.00, crashPoint: null, timeLeft: 10 });
      }, 3000); // 3 segundos mostrando crash
    }

    return () => clearInterval(interval);
  }, [gameState.phase, gameState.timeLeft]);

  const generateCrashPoint = () => {
    // Determinar qué lógica usar según el monto apostado
    const currentBet = autoPlayEnabled ? autoPlayAmount : betAmount;
    let selectedLogic = null;
    
    // Si hay lógicas configuradas, buscar la que corresponda al monto
    if (logics && logics.length > 0) {
      for (const logic of logics) {
        if (currentBet >= logic.minBet && currentBet <= logic.maxBet) {
          selectedLogic = logic;
          console.log(`💡 Usando lógica "${logic.name}" para apuesta de $${currentBet}`);
          break;
        }
      }
    }
    
    // Usar las reglas de la lógica seleccionada
    if (selectedLogic && selectedLogic.rules && selectedLogic.rules.length > 0) {
      const rand = Math.random() * 100; // 0-100
      let accumulated = 0;
      
      for (const rule of selectedLogic.rules) {
        accumulated += rule.percentage;
        if (rand <= accumulated) {
          // Generar valor dentro del rango de esta regla
          const range = rule.maxX - rule.minX;
          const value = rule.minX + (Math.random() * range);
          const rounded = Math.floor(value * 100) / 100;
          return parseFloat(rounded.toFixed(2));
        }
      }
    }
    
    // Fallback: distribución por defecto
    const rand = Math.random();
    
    if (rand < 0.70) {
      return parseFloat((1.00 + Math.random() * 0.98).toFixed(2));
    } else if (rand < 0.90) {
      return parseFloat((1.99 + Math.random() * 0.01).toFixed(2));
    } else if (rand < 0.95) {
      return parseFloat((2.01 + Math.random() * 0.99).toFixed(2));
    } else if (rand < 0.98) {
      return parseFloat((3.01 + Math.random() * 0.99).toFixed(2));
    } else if (rand < 0.99) {
      return parseFloat((4.01 + Math.random() * 0.99).toFixed(2));
    } else {
      return parseFloat((5.01 + Math.random() * 44.99).toFixed(2));
    }
  };

  const calculateMultiplier = (elapsed: number) => {
    // Fórmula exponencial para el multiplicador
    const k = 0.18;
    return Math.max(1.00, 1 + (Math.exp(k * elapsed) - 1) * 0.5);
  };

  const startRound = (crashPoint: number) => {
    crashedThisRound.current = false; // Reset al inicio de cada ronda
    console.log('Round started, crash point:', crashPoint);
    
    // Forzar reproducción del sonido del motor
    if (engineAudioRef.current && !isMuted) {
      engineAudioRef.current.currentTime = 0;
      
      // Intentar reproducir inmediatamente
      const playPromise = engineAudioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Motor sonando');
          })
          .catch(err => {
            console.log('⚠️ Audio bloqueado por el navegador. Haz click en cualquier parte para habilitar.', err);
            // Intentar habilitar con un click simulado
            document.body.click();
            setTimeout(() => {
              if (engineAudioRef.current) {
                engineAudioRef.current.play().catch(e => console.log('Segundo intento fallido:', e));
              }
            }, 100);
          });
      }
    }
    
    // Animar dino
    if (appRef.current) {
      const dino = (appRef.current as any).dino;
      if (dino) {
        gsap.to(dino.scale, {
          x: 0.7,
          y: 0.7,
          duration: 0.2,
          yoyo: true,
          repeat: -1
        });
      }
    }
  };

  const crashGame = (crashPoint: number) => {
    // Prevenir llamadas duplicadas
    if (crashedThisRound.current) {
      console.log('⚠️ Crash ya procesado, ignorando duplicado');
      return;
    }
    crashedThisRound.current = true;
    
    console.log('Game crashed at:', crashPoint);
    
    // Detener sonido del motor
    if (engineAudioRef.current) {
      engineAudioRef.current.pause();
      engineAudioRef.current.currentTime = 0;
    }
    
    // Reproducir sonido de crash
    if (crashAudioRef.current && !isMuted) {
      crashAudioRef.current.currentTime = 0;
      crashAudioRef.current.play().catch(err => console.log('Error al reproducir crash:', err));
    }
    
    // Agregar al historial
    setHistory(prev => [crashPoint, ...prev.slice(0, 12)]);

    // Animar explosión
    if (appRef.current) {
      const dino = (appRef.current as any).dino;
      if (dino) {
        gsap.killTweensOf(dino.scale);
        
        // Crear explosión
        const explosion = new PIXI.Graphics();
        explosion.beginFill(0xff6b00, 0.8);
        explosion.drawCircle(0, 0, 30);
        explosion.endFill();
        explosion.x = dino.x + 40;
        explosion.y = dino.y + 30;
        appRef.current.stage.addChild(explosion);

        gsap.to(explosion, {
          alpha: 0,
          pixi: { scale: 3 },
          duration: 0.5,
          onComplete: () => {
            appRef.current?.stage.removeChild(explosion);
          }
        });

        gsap.to(dino, {
          alpha: 0,
          duration: 0.3,
          onComplete: () => {
            gsap.to(dino, { alpha: 1, duration: 0.3 });
          }
        });
      }
    }

    // Si tenía apuesta activa y no hizo cash out, pierde
    const userId = firebaseUser?.uid;
    if (hasActiveBet && !hasCashedOut && userId) {
      // Registrar transacción de pérdida
      addDoc(collection(db, 'transactions'), {
        userId: userId,
        type: 'loss',
        amount: -betAmount,
        description: `Pérdida Speed Run (crash a ${crashPoint.toFixed(2)}x)`,
        status: 'completed',
        createdAt: serverTimestamp()
      }).catch(err => console.error('Error al registrar pérdida:', err));
      
      toast.error(`Perdiste $${betAmount.toFixed(2)}`);
    }
  };

  const handlePlaceBet = async () => {
    const userId = firebaseUser?.uid;
    
    if (!userId) {
      toast.error('Debes iniciar sesión para apostar');
      return;
    }

    // Usar monto de auto-play si está activo, sino usar monto normal
    const amountToUse = autoPlayEnabled ? autoPlayAmount : betAmount;

    if (amountToUse <= 0 || amountToUse > (user?.balance || 0)) {
      toast.error('Monto inválido o saldo insuficiente');
      return;
    }

    if (gameState.phase !== 'waiting') {
      toast.error('Espera a la siguiente ronda');
      return;
    }

    // Habilitar audio con la interacción del usuario
    if (!audioEnabled) {
      setAudioEnabled(true);
    }

    try {
      // Descontar el monto de la apuesta del balance usando increment negativo
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        balance: increment(-amountToUse)
      });

      // Registrar transacción de apuesta
      await addDoc(collection(db, 'transactions'), {
        userId: userId,
        type: 'bet',
        amount: -amountToUse,
        description: `Apuesta Speed Run${autoPlayEnabled ? ' (Auto)' : ''}`,
        status: 'completed',
        createdAt: serverTimestamp()
      });

      // Guardar el monto usado en betAmount para cálculos posteriores
      setBetAmount(amountToUse);
      setHasActiveBet(true);
      toast.success(`Apuesta de $${amountToUse.toFixed(2)} colocada`);
    } catch (error) {
      console.error('Error al apostar:', error);
      toast.error('Error al procesar la apuesta');
    }
  };

  const handleCashOut = async () => {
    const userId = firebaseUser?.uid;
    
    if (!hasActiveBet || hasCashedOut || gameState.phase !== 'running' || !userId) return;

    const cashOutMultiplier = gameState.multiplier;
    console.log(`💰 Cash out manual a ${cashOutMultiplier.toFixed(2)}x - El juego sigue corriendo`);

    const totalPayout = betAmount * cashOutMultiplier; // Total a recibir
    const profit = totalPayout - betAmount; // Ganancia neta
    setCurrentProfit(profit);
    setHasCashedOut(true);
    
    try {
      // Devolver el total (apuesta original + ganancias)
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        balance: increment(totalPayout) // Devolver todo el payout (apuesta + ganancia)
      });

      // Registrar transacción de ganancia (solo la ganancia neta)
      await addDoc(collection(db, 'transactions'), {
        userId: userId,
        type: 'win',
        amount: profit,
        description: `Ganancia Speed Run ${gameState.multiplier.toFixed(2)}x`,
        status: 'completed',
        createdAt: serverTimestamp()
      });

      // Reproducir sonido de cash out
      if (cashOutAudioRef.current && !isMuted) {
        cashOutAudioRef.current.currentTime = 0;
        cashOutAudioRef.current.play().catch(err => console.log('Error al reproducir cash out:', err));
      }
      
      toast.success(`¡Cash Out! Ganaste $${profit.toFixed(2)}`);
    } catch (error) {
      console.error('Error al hacer cash out:', error);
      toast.error('Error al procesar el cash out');
    }
  };

  // Función para reproducir beep del semáforo
  const playBeep = (frequency: number = 800, duration: number = 150) => {
    if (isMuted) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'square'; // Sonido más "beep"
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (error) {
      console.log('Error al reproducir beep:', error);
    }
  };

  const quickBetAmounts = [10, 25, 50, 100, 250];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-10 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-1">
          <h1 className="text-4xl font-bold text-white mb-2">
            🦖 Speed <span className="text-gradient">Run</span>
          </h1>
          <p className="text-gray-400">Apuesta y retira antes del crash. ¡Multiplica tus ganancias!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel Principal del Juego */}
          <div className="lg:col-span-3 space-y-6">
            {/* Canvas del Juego */}
            <div className="bg-black/50 border-2 border-yellow-500/30 rounded-2xl overflow-hidden relative">
              {/* Imagen de fondo con zoom y movimiento */}
              {backgroundImage && (
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  initial={{ scale: 1, x: 0, y: 0 }}
                  animate={{ 
                    scale: gameState.phase === 'running' ? 1.15 : 
                           gameState.phase === 'waiting' ? [1, 1.05, 1] : 1,
                    x: gameState.phase === 'running' ? [0, -2.1, 1.4, -1.4, 2.1, 0] : 0,
                    y: gameState.phase === 'running' ? [0, 1.4, -0.7, 2.1, -1.4, 0] : 0
                  }}
                  transition={{ 
                    duration: gameState.phase === 'waiting' ? 0.8 : 0.5,
                    repeat: gameState.phase === 'waiting' ? Infinity : 0,
                    ease: gameState.phase === 'running' ? 'easeIn' : 'easeInOut',
                    x: gameState.phase === 'running' ? {
                      duration: 0.3,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut'
                    } : {},
                    y: gameState.phase === 'running' ? {
                      duration: 0.25,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut'
                    } : {}
                  }}
                />
              )}
              {/* Multiplicador Grande */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  animate={{
                    scale: gameState.phase === 'running' ? [1, 1.1, 1] : 1
                  }}
                  transition={{ repeat: gameState.phase === 'running' ? Infinity : 0, duration: 0.5 }}
                  className={`text-6xl md:text-8xl font-bold ${
                    gameState.phase === 'crashed' ? 'text-red-500' : 'text-yellow-400'
                  } drop-shadow-2xl`}
                >
                  {gameState.multiplier.toFixed(2)}x
                </motion.div>
              </div>

              {/* Botón de Audio */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-4 right-4 z-20 bg-black/80 hover:bg-black border-2 border-gray-700 hover:border-yellow-500 rounded-lg p-3 transition-all"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? (
                  <FiVolumeX className="w-6 h-6 text-red-400" />
                ) : (
                  <FiVolume2 className="w-6 h-6 text-yellow-400" />
                )}
              </button>

              {/* Semáforo de F1 */}
              <div className="absolute top-20 right-8 z-10">
                {gameState.phase === 'waiting' && (
                  <motion.div 
                    className="bg-black/90 border-4 border-gray-700 rounded-2xl p-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <div className="flex space-x-3">
                      {/* Luces del semáforo que se encienden progresivamente */}
                      {[1, 2, 3, 4, 5].map((light) => (
                        <motion.div
                          key={light}
                          className="flex flex-col space-y-2"
                          initial={{ opacity: 0.3 }}
                          animate={{ 
                            opacity: gameState.timeLeft <= (6 - light) ? 1 : 0.3 
                          }}
                        >
                          {/* Luz superior */}
                          <div 
                            className={`w-6 h-6 rounded-full border-2 ${
                              gameState.timeLeft <= (6 - light)
                                ? 'bg-red-600 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.8)]'
                                : 'bg-gray-800 border-gray-700'
                            }`}
                          />
                          {/* Luz inferior */}
                          <div 
                            className={`w-6 h-6 rounded-full border-2 ${
                              gameState.timeLeft <= (6 - light)
                                ? 'bg-red-600 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.8)]'
                                : 'bg-gray-800 border-gray-700'
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {gameState.phase === 'running' && (
                  <motion.div 
                    className="bg-black/90 border-4 border-gray-700 rounded-2xl p-4"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex space-x-3">
                      {/* Todas las luces apagadas */}
                      {[1, 2, 3, 4, 5].map((light) => (
                        <div key={light} className="flex flex-col space-y-2">
                          <div className="w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-700" />
                          <div className="w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-700" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {gameState.phase === 'crashed' && (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg px-4 py-2">
                    <p className="text-red-300 font-bold">💥 CRASHED!</p>
                  </div>
                )}
              </div>

              {/* Barra de Revoluciones (RPM) */}
              {(gameState.phase === 'running' || gameState.phase === 'crashed') && (
                <div className="absolute left-8 top-20 z-10">
                  <motion.div 
                    className="relative w-16 h-96 bg-black/80 border-2 border-gray-700 rounded-full overflow-hidden"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Marcas de RPM */}
                    <div className="absolute inset-0 flex flex-col justify-between py-4 px-2">
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((mark) => (
                        <div key={mark} className="flex items-center justify-center">
                          <div className="w-6 h-0.5 bg-gray-600" />
                        </div>
                      ))}
                    </div>

                    {/* Barra de progreso que sube y baja */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 rounded-full"
                      style={{
                        background: gameState.phase === 'crashed'
                          ? 'linear-gradient(to top, #dc2626, #ef4444, #dc2626)' // Rojo total cuando crashea
                          : 'linear-gradient(to top, #3b82f6, #60a5fa, #22c55e, #10b981, #eab308, #f59e0b)', // Gradiente azul->verde->amarillo
                      }}
                      animate={
                        gameState.phase === 'crashed'
                          ? { height: '100%' } // Llena completamente de rojo
                          : { height: ['20%', '40%', '60%', '80%', '60%', '40%', '20%'] } // Sube y baja constantemente
                      }
                      transition={
                        gameState.phase === 'crashed'
                          ? { duration: 0.3 }
                          : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      }
                    />

                    {/* Efecto de brillo en la parte superior */}
                    <motion.div
                      className="absolute left-0 right-0 h-8 blur-xl"
                      style={{
                        background: gameState.phase === 'crashed'
                          ? 'rgba(220, 38, 38, 1)'
                          : 'rgba(234, 179, 8, 0.8)',
                      }}
                      animate={
                        gameState.phase === 'crashed'
                          ? { bottom: '92%', opacity: [0.8, 1, 0.8] }
                          : { bottom: ['12%', '32%', '52%', '72%', '52%', '32%', '12%'] }
                      }
                      transition={
                        gameState.phase === 'crashed'
                          ? { duration: 0.3, opacity: { duration: 0.5, repeat: Infinity } }
                          : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      }
                    />

                    {/* Indicador de zona roja parpadeante cuando crashea */}
                    {gameState.phase === 'crashed' && (
                      <motion.div
                        className="absolute inset-0 bg-red-600/50"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.2, repeat: Infinity }}
                      />
                    )}

                    {/* Texto RPM */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 rotate-0">
                      <p className="text-white text-xs font-bold writing-mode-vertical">RPM</p>
                    </div>
                  </motion.div>

                  {/* Valor del multiplicador al lado */}
                  <motion.div
                    className="absolute -right-20 top-1/2 -translate-y-1/2 bg-black/90 border-2 rounded-lg px-3 py-2"
                    animate={{
                      scale: gameState.phase === 'crashed' ? [1, 1.2, 1] : [1, 1.05, 1],
                      borderColor: gameState.phase === 'crashed' 
                        ? ['#ef4444', '#dc2626', '#ef4444']
                        : ['#3b82f6', '#22c55e', '#eab308', '#22c55e', '#3b82f6']
                    }}
                    transition={{ 
                      duration: gameState.phase === 'crashed' ? 0.3 : 2, 
                      repeat: Infinity 
                    }}
                  >
                    <p className={`text-2xl font-black ${
                      gameState.phase === 'crashed' ? 'text-red-500' : 'text-yellow-400'
                    }`}>
                      {gameState.multiplier.toFixed(2)}x
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Canvas PixiJS */}
              <div ref={canvasRef} className="w-full flex items-center justify-center" />

              {/* Información de Apuesta Activa */}
              {hasActiveBet && (
                <div className="absolute bottom-8 right-8 bg-black/80 border border-yellow-500 rounded-lg px-6 py-4">
                  <p className="text-gray-400 text-sm mb-1">Tu Apuesta</p>
                  <p className="text-white font-bold text-xl">${betAmount.toFixed(2)}</p>
                  {hasCashedOut ? (
                    <p className="text-green-400 font-bold mt-2">
                      ✓ Cash Out: +${currentProfit.toFixed(2)}
                    </p>
                  ) : gameState.phase === 'running' ? (
                    <p className="text-yellow-400 font-bold mt-2">
                      Ganancia: +${((betAmount * gameState.multiplier) - betAmount).toFixed(2)}
                    </p>
                  ) : null}
                </div>
              )}
            </div>

            {/* Historial de Crashes */}
            <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center space-x-2">
                <FiClock className="w-5 h-5 text-yellow-400" />
                <span>Historial de Crashes</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {history.map((crash, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`px-4 py-2 rounded-lg font-bold ${
                      crash >= 2 ? 'bg-green-900/50 text-green-400' :
                      crash >= 1.5 ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-red-900/50 text-red-400'
                    }`}
                  >
                    {crash.toFixed(2)}x
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cómo Jugar */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">ℹ️ Cómo Jugar</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-yellow-400 font-bold mb-1">1. Apuesta</p>
                  <p className="text-gray-300">Ingresa tu monto y espera a que comience la ronda</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-bold mb-1">2. Observa</p>
                  <p className="text-gray-300">El multiplicador sube mientras corre el auto</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-bold mb-1">3. Cash Out</p>
                  <p className="text-gray-300">Retira antes del crash para ganar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Control */}
          <div className="space-y-6">
            {/* Panel de Apuesta */}
            <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center space-x-2">
                <FiDollarSign className="w-5 h-5 text-yellow-400" />
                <span>Apuesta</span>
              </h3>

              {/* Input de Monto */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Monto</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                  disabled={hasActiveBet || autoPlayEnabled}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                  placeholder="0.00"
                />
              </div>

              {/* Botones Rápidos */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {quickBetAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={hasActiveBet || autoPlayEnabled}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Divisor */}
              <div className="border-t border-gray-700 my-4"></div>

              {/* AUTO - Botón ON/OFF */}
              <div className="mb-3">
                <button
                  onClick={() => setAutoPlayEnabled(!autoPlayEnabled)}
                  disabled={gameState.phase === 'running' && hasActiveBet && !hasCashedOut}
                  className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${
                    autoPlayEnabled
                      ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/50'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={
                    gameState.phase === 'running' && hasActiveBet && !hasCashedOut
                      ? 'Espera a hacer cash out o que termine la ronda'
                      : autoPlayEnabled
                      ? 'Click para desactivar AUTO'
                      : 'Click para activar AUTO'
                  }
                >
                  AUTO {autoPlayEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Dos cuadros: Dólares y X */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Dólares</label>
                  <input
                    type="number"
                    value={autoPlayAmount}
                    onChange={(e) => setAutoPlayAmount(parseFloat(e.target.value) || 10)}
                    disabled={hasActiveBet || autoPlayEnabled}
                    className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-bold focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Salir a X</label>
                  <input
                    type="number"
                    value={autoPlayTarget}
                    onChange={(e) => setAutoPlayTarget(parseFloat(e.target.value) || 2.0)}
                    disabled={hasActiveBet || autoPlayEnabled}
                    className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-bold focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                    step="0.1"
                    placeholder="2.0"
                  />
                </div>
              </div>

              {/* Divisor */}
              <div className="border-t border-gray-700 my-4"></div>

              {/* Botón Principal */}
              {!hasActiveBet ? (
                <button
                  onClick={handlePlaceBet}
                  disabled={gameState.phase === 'running' || autoPlayEnabled}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {autoPlayEnabled 
                    ? '🤖 Auto-Play Activo' 
                    : gameState.phase === 'waiting' ? 'Apostar' : 'Esperando...'}
                </button>
              ) : !hasCashedOut && gameState.phase === 'running' ? (
                <button
                  onClick={handleCashOut}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 rounded-xl hover:from-green-500 hover:to-green-600 transition-all shadow-lg animate-pulse"
                >
                  Cash Out ${(betAmount * gameState.multiplier).toFixed(2)}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-700 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed"
                >
                  {hasCashedOut ? '✓ Cash Out Realizado' : 'Esperando...'}
                </button>
              )}

              {/* Balance */}
              {user && (
                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-sm">Balance Disponible</p>
                  <p className="text-white font-bold text-xl">${user.balance.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Jugadores en Vivo */}
            <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center space-x-2">
                <FiUsers className="w-5 h-5 text-yellow-400" />
                <span>Jugadores ({livePlayers.length})</span>
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {livePlayers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Esperando jugadores...</p>
                ) : (
                  livePlayers.map((player, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`rounded-md p-2 border-l-2 ${
                        player.cashOutAt !== null && player.profit > 0
                          ? 'bg-green-900/20 border-green-500'
                          : player.profit < 0
                          ? 'bg-red-900/20 border-red-500'
                          : 'bg-gray-900/50 border-yellow-500'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-xs truncate">{player.name}</p>
                          <p className="text-gray-500 text-[10px]">${player.amount.toFixed(0)}</p>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          {player.cashOutAt !== null ? (
                            // Jugador hizo cash out
                            <div className="flex flex-col items-end">
                              <p className="text-green-400 font-bold text-xs leading-tight">
                                ✓ {player.cashOutAt.toFixed(2)}x
                              </p>
                              <p className="text-green-400 text-[10px] leading-tight">
                                +${player.profit.toFixed(0)}
                              </p>
                            </div>
                          ) : player.profit < 0 ? (
                            // Jugador perdió (crashed)
                            <div className="flex flex-col items-end">
                              <p className="text-red-400 font-bold text-xs leading-tight">
                                ✗ Perdió
                              </p>
                              <p className="text-red-400 text-[10px] leading-tight">
                                -${Math.abs(player.profit).toFixed(0)}
                              </p>
                            </div>
                          ) : gameState.phase === 'running' ? (
                            // Jugador en juego
                            <div className="flex flex-col items-end">
                              <p className="text-yellow-400 font-bold text-xs animate-pulse leading-tight">
                                {gameState.multiplier.toFixed(2)}x
                              </p>
                              <p className="text-yellow-400 text-[10px] leading-tight">
                                +${((player.amount * gameState.multiplier) - player.amount).toFixed(0)}
                              </p>
                            </div>
                          ) : (
                            // Esperando
                            <p className="text-gray-400 text-xs">...</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DinoGame;
