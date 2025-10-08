import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiClock, FiUsers } from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';
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
}

/**
 * Juego Dino/Crash con PixiJS
 * Multiplicador que sube hasta que crashea
 */
const DinoGame = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const { user } = useAuthStore();

  const [gameState, setGameState] = useState<GameState>({
    phase: 'waiting',
    multiplier: 1.00,
    crashPoint: null,
    timeLeft: 5
  });

  const [betAmount, setBetAmount] = useState(10);
  const [autoCashOut, setAutoCashOut] = useState<number | null>(null);
  const [hasActiveBet, setHasActiveBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [currentProfit, setCurrentProfit] = useState(0);

  const [history, setHistory] = useState<number[]>([
    1.45, 2.34, 1.02, 5.67, 1.89, 3.21, 1.56, 8.90, 1.23, 2.78
  ]);

  const [livePlayers, setLivePlayers] = useState<PlayerBet[]>([
    { name: 'Player1', amount: 50, cashOutAt: 2.5, profit: 75 },
    { name: 'Player2', amount: 100, cashOutAt: null, profit: 0 },
    { name: 'Player3', amount: 25, cashOutAt: 1.8, profit: 20 }
  ]);

  // Inicializar PixiJS
  useEffect(() => {
    if (!canvasRef.current || appRef.current) return;

    const initPixi = async () => {
      const app = new PIXI.Application();
      
      await app.init({
        width: 1200,
        height: 500,
        backgroundColor: 0x0a0a0a,
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
  }, []);

  const setupGame = (app: PIXI.Application) => {
    // Fondo con estrellas
    const background = new PIXI.Graphics();
    background.beginFill(0x0a0a0a);
    background.drawRect(0, 0, 1200, 500);
    background.endFill();
    app.stage.addChild(background);

    // Estrellas animadas
    for (let i = 0; i < 50; i++) {
      const star = new PIXI.Graphics();
      star.beginFill(0xffffff, Math.random() * 0.5 + 0.3);
      star.drawCircle(0, 0, Math.random() * 2 + 1);
      star.endFill();
      star.x = Math.random() * 1200;
      star.y = Math.random() * 500;
      app.stage.addChild(star);

      // Animación de parpadeo
      gsap.to(star, {
        alpha: Math.random() * 0.5,
        duration: Math.random() * 2 + 1,
        repeat: -1,
        yoyo: true
      });
    }

    // Suelo/piso
    const ground = new PIXI.Graphics();
    ground.beginFill(0xd97706);
    ground.drawRect(0, 450, 1200, 50);
    ground.endFill();
    app.stage.addChild(ground);

    // Línea del suelo
    const groundLine = new PIXI.Graphics();
    groundLine.lineStyle(3, 0xfbbf24);
    groundLine.moveTo(0, 450);
    groundLine.lineTo(1200, 450);
    app.stage.addChild(groundLine);

    // Dino (creado con gráficos)
    const dino = createDino();
    dino.x = 150;
    dino.y = 380;
    app.stage.addChild(dino);

    // Gráfica del multiplicador
    const graphContainer = new PIXI.Container();
    graphContainer.x = 50;
    graphContainer.y = 50;
    app.stage.addChild(graphContainer);

    // Animación del dino corriendo
    gsap.to(dino, {
      y: 370,
      duration: 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // Guardar referencias
    (app as any).dino = dino;
    (app as any).graphContainer = graphContainer;
  };

  const createDino = () => {
    const container = new PIXI.Container();

    // Cuerpo
    const body = new PIXI.Graphics();
    body.beginFill(0x10b981);
    body.drawRoundedRect(0, 0, 80, 60, 10);
    body.endFill();
    container.addChild(body);

    // Cabeza
    const head = new PIXI.Graphics();
    head.beginFill(0x10b981);
    head.drawCircle(70, 20, 25);
    head.endFill();
    container.addChild(head);

    // Ojo
    const eye = new PIXI.Graphics();
    eye.beginFill(0xffffff);
    eye.drawCircle(80, 15, 8);
    eye.endFill();
    container.addChild(eye);

    const pupil = new PIXI.Graphics();
    pupil.beginFill(0x000000);
    pupil.drawCircle(82, 15, 4);
    pupil.endFill();
    container.addChild(pupil);

    // Cola
    const tail = new PIXI.Graphics();
    tail.beginFill(0x10b981);
    tail.drawPolygon([
      0, 30,
      -20, 20,
      -15, 35
    ]);
    tail.endFill();
    container.addChild(tail);

    // Patas
    const leg1 = new PIXI.Graphics();
    leg1.beginFill(0x059669);
    leg1.drawRect(15, 60, 12, 25);
    leg1.endFill();
    container.addChild(leg1);

    const leg2 = new PIXI.Graphics();
    leg2.beginFill(0x059669);
    leg2.drawRect(50, 60, 12, 25);
    leg2.endFill();
    container.addChild(leg2);

    return container;
  };

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
          return { ...prev, multiplier: mult };
        });

        // Auto cash out
        if (hasActiveBet && !hasCashedOut && autoCashOut && mult >= autoCashOut) {
          handleCashOut();
        }
      }, 50);
    } else if (gameState.phase === 'crashed') {
      setTimeout(() => {
        setGameState({ phase: 'waiting', multiplier: 1.00, crashPoint: null, timeLeft: 5 });
        setHasActiveBet(false);
        setHasCashedOut(false);
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [gameState.phase, gameState.timeLeft, hasActiveBet, hasCashedOut, autoCashOut]);

  const generateCrashPoint = () => {
    // Algoritmo simple para generar crash point
    // En producción, esto vendría del servidor con Provably Fair
    const e = Math.random();
    const crashPoint = Math.floor((99 / (1 - e)) * 100) / 100;
    return Math.min(Math.max(crashPoint, 1.01), 50.00);
  };

  const calculateMultiplier = (elapsed: number) => {
    // Fórmula exponencial para el multiplicador
    const k = 0.18;
    return Math.max(1.00, 1 + (Math.exp(k * elapsed) - 1) * 0.5);
  };

  const startRound = (crashPoint: number) => {
    console.log('Round started, crash point:', crashPoint);
    
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
    console.log('Game crashed at:', crashPoint);
    
    // Agregar al historial
    setHistory(prev => [crashPoint, ...prev.slice(0, 9)]);

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
    if (hasActiveBet && !hasCashedOut) {
      toast.error(`Perdiste $${betAmount.toFixed(2)}`);
    }
  };

  const handlePlaceBet = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para apostar');
      return;
    }

    if (betAmount <= 0 || betAmount > user.balance) {
      toast.error('Monto inválido');
      return;
    }

    if (gameState.phase !== 'waiting') {
      toast.error('Espera a la siguiente ronda');
      return;
    }

    setHasActiveBet(true);
    toast.success(`Apuesta de $${betAmount.toFixed(2)} colocada`);
  };

  const handleCashOut = () => {
    if (!hasActiveBet || hasCashedOut || gameState.phase !== 'running') return;

    const profit = betAmount * gameState.multiplier;
    setCurrentProfit(profit - betAmount);
    setHasCashedOut(true);
    
    toast.success(`¡Cash Out! Ganaste $${(profit - betAmount).toFixed(2)}`);
  };

  const quickBetAmounts = [10, 25, 50, 100, 250];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🦖 Dino <span className="text-gradient">Crash</span>
          </h1>
          <p className="text-gray-400">Apuesta y retira antes del crash. ¡Multiplica tus ganancias!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel Principal del Juego */}
          <div className="lg:col-span-3 space-y-6">
            {/* Canvas del Juego */}
            <div className="bg-black/50 border-2 border-yellow-500/30 rounded-2xl overflow-hidden relative">
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

              {/* Estado del Juego */}
              <div className="absolute top-8 right-8 z-10">
                {gameState.phase === 'waiting' && (
                  <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg px-4 py-2">
                    <p className="text-yellow-300 font-bold">
                      Siguiente ronda en {gameState.timeLeft}s
                    </p>
                  </div>
                )}
                {gameState.phase === 'running' && (
                  <div className="bg-green-500/20 border border-green-500 rounded-lg px-4 py-2 animate-pulse">
                    <p className="text-green-300 font-bold">🚀 EN VIVO</p>
                  </div>
                )}
                {gameState.phase === 'crashed' && (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg px-4 py-2">
                    <p className="text-red-300 font-bold">💥 CRASHED!</p>
                  </div>
                )}
              </div>

              {/* Canvas PixiJS */}
              <div ref={canvasRef} className="w-full flex items-center justify-center" />

              {/* Información de Apuesta Activa */}
              {hasActiveBet && (
                <div className="absolute bottom-8 left-8 bg-black/80 border border-yellow-500 rounded-lg px-6 py-4">
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
                  disabled={hasActiveBet}
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
                    disabled={hasActiveBet}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Auto Cash Out */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Auto Cash Out</label>
                <input
                  type="number"
                  value={autoCashOut || ''}
                  onChange={(e) => setAutoCashOut(parseFloat(e.target.value) || null)}
                  disabled={hasActiveBet}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                  placeholder="2.00"
                  step="0.1"
                />
                <p className="text-gray-500 text-xs mt-1">Retiro automático al alcanzar este multiplicador</p>
              </div>

              {/* Botón Principal */}
              {!hasActiveBet ? (
                <button
                  onClick={handlePlaceBet}
                  disabled={gameState.phase === 'running'}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {gameState.phase === 'waiting' ? 'Apostar' : 'Esperando...'}
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
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {livePlayers.map((player, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/50 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-white font-semibold text-sm">{player.name}</p>
                      <p className="text-gray-400 text-xs">${player.amount}</p>
                    </div>
                    {player.cashOutAt ? (
                      <div className="text-right">
                        <p className="text-green-400 font-bold text-sm">{player.cashOutAt.toFixed(2)}x</p>
                        <p className="text-green-400 text-xs">+${player.profit.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p className="text-yellow-400 text-sm">En juego...</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Información del Juego */}
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">ℹ️ Cómo Jugar</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-yellow-400 font-bold mb-2">1. Apuesta</p>
              <p className="text-gray-300">Ingresa tu monto y espera a que comience la ronda</p>
            </div>
            <div>
              <p className="text-yellow-400 font-bold mb-2">2. Observa</p>
              <p className="text-gray-300">El multiplicador sube mientras el dino corre</p>
            </div>
            <div>
              <p className="text-yellow-400 font-bold mb-2">3. Cash Out</p>
              <p className="text-gray-300">Retira antes del crash para ganar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DinoGame;
