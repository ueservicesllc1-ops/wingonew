import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const { Engine, Render, World, Bodies, Runner, Body } = Matter;
import { motion } from 'framer-motion';
import { FiDollarSign, FiClock, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';
import { doc, updateDoc, addDoc, collection, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/config/firebase';
import toast from 'react-hot-toast';

interface HistoryItem {
  multiplier: number;
  amount: number;
  profit: number;
  timestamp: number;
}

/**
 * Juego Plinko con física real usando Matter.js
 * La bola cae y rebota en los pines hasta caer en un multiplicador
 */
const PlinkoGame = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const { user, firebaseUser } = useAuthStore();

  const [betAmount, setBetAmount] = useState(10);
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [isDropping, setIsDropping] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Multiplicadores según el nivel de riesgo
  // Configurados para dar ventaja a la casa (~5-10% house edge)
  // La mayoría de bolas caen en el centro (distribución normal)
  const multipliers = {
    low: [1.2, 1.0, 0.9, 0.8, 0.7, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2],
    medium: [3.0, 1.5, 1.2, 0.8, 0.5, 0.3, 0.5, 0.8, 1.2, 1.5, 3.0],
    high: [10.0, 3.0, 1.5, 0.5, 0.3, 0.2, 0.3, 0.5, 1.5, 3.0, 10.0]
  };

  const currentMultipliers = multipliers[risk];

  useEffect(() => {
    if (!canvasRef.current) return;

    // Configuración del canvas
    const width = 600;
    const height = 650;
    const rows = 10;

    // Crear motor de física con gravedad más fuerte
    const engine = Engine.create({
      gravity: { x: 0, y: 1.5 }
    });

    // Crear render
    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent'
      }
    });

    // Crear runner
    const runner = Runner.create();

    engineRef.current = engine;
    renderRef.current = render;
    runnerRef.current = runner;

    // Crear pines (obstáculos) - centrados
    const pins: Matter.Body[] = [];
    const pinSize = 5;
    const spacing = 45;
    const startY = 100;

    for (let row = 0; row < rows; row++) {
      const pinsInRow = row + 3;
      const rowWidth = (pinsInRow - 1) * spacing;
      const offsetX = (width - rowWidth) / 2; // Centrar horizontalmente

      for (let col = 0; col < pinsInRow; col++) {
        const pin = Bodies.circle(
          offsetX + col * spacing,
          startY + row * spacing,
          pinSize,
          {
            isStatic: true,
            restitution: 0.7,
            friction: 0.01,
            render: {
              fillStyle: '#d97706'
            }
          }
        );
        pins.push(pin);
      }
    }

    // Crear contenedores de multiplicadores en la parte inferior
    const buckets: Matter.Body[] = [];
    const bucketWidth = 48; // Ajustado para 11 buckets
    const bucketHeight = 70;
    const bucketsY = height - 80;
    const totalBuckets = currentMultipliers.length;
    const bucketsStartX = (width - (totalBuckets * bucketWidth)) / 2;

    for (let i = 0; i < totalBuckets; i++) {
      // Paredes de los contenedores
      if (i === 0) {
        buckets.push(
          Bodies.rectangle(
            bucketsStartX - 2,
            bucketsY,
            4,
            bucketHeight,
            { isStatic: true, render: { fillStyle: '#666' } }
          )
        );
      }
      
      buckets.push(
        Bodies.rectangle(
          bucketsStartX + (i + 1) * bucketWidth - 2,
          bucketsY,
          4,
          bucketHeight,
          { isStatic: true, render: { fillStyle: '#666' } }
        )
      );

      // Fondo del contenedor con color según multiplicador
      const mult = currentMultipliers[i];
      let color = '#1f2937';
      if (mult >= 5) color = '#059669';
      else if (mult >= 2) color = '#10b981';
      else if (mult >= 1) color = '#eab308';
      else color = '#dc2626';

      buckets.push(
        Bodies.rectangle(
          bucketsStartX + i * bucketWidth + bucketWidth / 2,
          bucketsY + bucketHeight / 2 - 10,
          bucketWidth - 8,
          bucketHeight - 10,
          {
            isStatic: true,
            render: { fillStyle: color, opacity: 0.3 },
            label: `bucket-${i}`
          }
        )
      );
    }

    // Paredes laterales más anchas para evitar atascamientos
    const leftWall = Bodies.rectangle(bucketsStartX - 30, height / 2, 60, height, {
      isStatic: true,
      restitution: 0.5,
      friction: 0.01,
      render: { fillStyle: '#1a1a1a' }
    });

    const rightWall = Bodies.rectangle(
      bucketsStartX + totalBuckets * bucketWidth + 30,
      height / 2,
      60,
      height,
      { 
        isStatic: true, 
        restitution: 0.5,
        friction: 0.01,
        render: { fillStyle: '#1a1a1a' } 
      }
    );

    // Agregar todos los cuerpos al mundo
    World.add(engine.world, [...pins, ...buckets, leftWall, rightWall]);

    // Iniciar motor con Runner
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Runner.stop(runner);
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [risk]);

  const dropBall = async () => {
    if (!engineRef.current || isDropping) return;

    const userId = firebaseUser?.uid;
    if (!userId) {
      toast.error('Debes iniciar sesión para jugar');
      return;
    }

    if (betAmount <= 0 || betAmount > (user?.balance || 0)) {
      toast.error('Monto inválido o saldo insuficiente');
      return;
    }

    setIsDropping(true);

    try {
      // Descontar apuesta
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        balance: increment(-betAmount)
      });

      await addDoc(collection(db, 'transactions'), {
        userId: userId,
        type: 'bet',
        amount: -betAmount,
        description: 'Apuesta Plinko',
        status: 'completed',
        createdAt: serverTimestamp()
      });

      // Crear la bola con posición X más aleatoria pero dentro de límites seguros
      const width = 600;
      const ballX = width / 2 + (Math.random() - 0.5) * 100; // Variación controlada en X
      
      const ball = Bodies.circle(ballX, 50, 10, {
        restitution: 0.6,
        friction: 0.005,
        density: 0.04,
        frictionAir: 0.005,
        render: {
          fillStyle: '#fbbf24'
        },
        label: 'ball'
      });

      World.add(engineRef.current.world, ball);

      // Aplicar un pequeño impulso aleatorio en X para más variabilidad
      const randomImpulse = (Math.random() - 0.5) * 0.002;
      Body.applyForce(ball, ball.position, { x: randomImpulse, y: 0 });

      // Reproducir beep
      if (!isMuted) playBeep(600, 100);

      // Detectar cuando la bola cae en un contenedor o se atasca
      let checkCount = 0;
      let lastY = ball.position.y;
      
      const checkBallPosition = setInterval(() => {
        checkCount++;
        
        // Detectar si la bola está atascada (no se mueve en Y por varios checks)
        const isStuck = Math.abs(ball.position.y - lastY) < 0.1 && checkCount > 20;
        
        // Verificar si la bola está casi quieta y en la zona de contenedores o está atascada
        if ((ball.position.y > 550 && Math.abs(ball.velocity.y) < 0.5) || isStuck || checkCount > 200) {
          clearInterval(checkBallPosition);
          
          let finalIndex: number;
          const totalBuckets = currentMultipliers.length;
          
          if (isStuck || checkCount > 200) {
            console.log('⚠️ Bola atascada, aplicando solución de emergencia');
            // Forzar a un contenedor central aleatorio si se atascó
            finalIndex = Math.floor(totalBuckets / 2) + (Math.random() > 0.5 ? 1 : -1);
            finalIndex = Math.max(0, Math.min(finalIndex, totalBuckets - 1));
          } else {
            // Determinar en qué contenedor cayó normalmente
            const bucketWidth = 48;
            const bucketsStartX = (width - (totalBuckets * bucketWidth)) / 2;
            const bucketIndex = Math.floor((ball.position.x - bucketsStartX) / bucketWidth);
            finalIndex = Math.max(0, Math.min(bucketIndex, totalBuckets - 1));
          }
          
          const multiplier = currentMultipliers[finalIndex];
          
          // Calcular ganancia
          const payout = betAmount * multiplier;
          const profit = payout - betAmount;
          
          setLastResult(multiplier);
          setHistory(prev => [{
            multiplier,
            amount: betAmount,
            profit,
            timestamp: Date.now()
          }, ...prev.slice(0, 9)]);

          // SIEMPRE devolver el payout (apuesta * multiplicador)
          // Ya se descontó la apuesta al inicio, ahora devolvemos el resultado
          updateDoc(userRef, {
            balance: increment(payout)
          });

          if (profit > 0) {
            // GANÓ dinero
            addDoc(collection(db, 'transactions'), {
              userId: userId,
              type: 'win',
              amount: profit,
              description: `Ganancia Plinko ${multiplier}x`,
              status: 'completed',
              createdAt: serverTimestamp()
            });

            if (!isMuted) playWinSound(multiplier);
            toast.success(`¡${multiplier}x! Ganaste $${profit.toFixed(2)}`);
          } else if (profit === 0) {
            // EMPATÓ
            addDoc(collection(db, 'transactions'), {
              userId: userId,
              type: 'win',
              amount: 0,
              description: `Empate Plinko ${multiplier}x`,
              status: 'completed',
              createdAt: serverTimestamp()
            });

            toast(`${multiplier}x - Empate, recuperaste tu apuesta`);
          } else {
            // PERDIÓ dinero (pero recupera algo)
            addDoc(collection(db, 'transactions'), {
              userId: userId,
              type: 'loss',
              amount: profit,
              description: `Pérdida Plinko ${multiplier}x`,
              status: 'completed',
              createdAt: serverTimestamp()
            });

            if (!isMuted) playLoseSound();
            toast.error(`${multiplier}x - Perdiste $${Math.abs(profit).toFixed(2)}`);
          }

          // Remover la bola después de 1 segundo
          setTimeout(() => {
            if (engineRef.current) {
              World.remove(engineRef.current.world, ball);
            }
            setIsDropping(false);
            setLastResult(null);
          }, 2000);
        }
        
        // Actualizar lastY para el próximo check
        lastY = ball.position.y;
      }, 50);

    } catch (error) {
      console.error('Error al apostar:', error);
      toast.error('Error al procesar la apuesta');
      setIsDropping(false);
    }
  };

  const playBeep = (frequency: number, duration: number) => {
    if (isMuted) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log('Error al reproducir beep:', error);
    }
  };

  const playWinSound = (multiplier: number) => {
    // Sonido más agudo cuanto mayor el multiplicador
    const frequency = 400 + (multiplier * 100);
    playBeep(frequency, 300);
  };

  const playLoseSound = () => {
    playBeep(200, 400);
  };

  const quickBetAmounts = [10, 25, 50, 100, 250];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-4 pb-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-white mb-1">
            🎯 <span className="text-gradient">Plinko</span>
          </h1>
          <p className="text-gray-400 text-sm">Deja caer la bola y multiplica tus ganancias</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Panel Principal del Juego */}
          <div className="lg:col-span-3">
            {/* Canvas del Juego */}
            <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-yellow-500/30 rounded-2xl overflow-hidden relative">
              {/* Botón de Mute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-2 right-2 z-20 bg-black/80 hover:bg-black border border-gray-700 hover:border-yellow-500 rounded-lg p-2 transition-all"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? (
                  <FiVolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <FiVolume2 className="w-4 h-4 text-yellow-400" />
                )}
              </button>

              {/* Resultado de la última caída */}
              {lastResult !== null && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 z-10"
                >
                  <div className={`text-4xl font-black drop-shadow-2xl ${
                    lastResult >= 5 ? 'text-green-400' :
                    lastResult >= 2 ? 'text-yellow-400' :
                    lastResult >= 1 ? 'text-blue-400' :
                    'text-red-400'
                  }`}>
                    {lastResult}x
                  </div>
                </motion.div>
              )}

              {/* Canvas de Matter.js */}
              <div ref={canvasRef} className="w-full flex items-center justify-center" />

              {/* Multiplicadores en la parte inferior - alineados con el canvas */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex">
                {currentMultipliers.map((mult, index) => (
                  <div
                    key={index}
                    style={{ width: '48px' }}
                    className={`h-14 flex items-center justify-center font-bold text-[10px] border-r border-gray-800 first:border-l ${
                      mult >= 5 ? 'bg-green-600 text-white' :
                      mult >= 2 ? 'bg-green-700 text-white' :
                      mult >= 1 ? 'bg-yellow-600 text-black' :
                      'bg-red-600 text-white'
                    }`}
                  >
                    {mult}x
                  </div>
                ))}
              </div>
            </div>

            {/* Historial */}
            <div className="mt-4 bg-black/30 border border-gray-700 rounded-xl p-4">
              <h3 className="text-white font-bold mb-2 flex items-center space-x-2">
                <FiClock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Historial</span>
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-3 text-xs">Sin historial aún</p>
                ) : (
                  history.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/50 rounded-lg p-2 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-semibold text-xs">
                          ${item.amount.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-[10px]">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-base ${
                          item.profit > 0 ? 'text-green-400' :
                          item.profit === 0 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {item.multiplier}x
                        </p>
                        <p className={`text-xs ${
                          item.profit > 0 ? 'text-green-400' :
                          item.profit === 0 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {item.profit > 0 ? '+' : ''}${item.profit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Panel de Control */}
          <div className="space-y-4">
            {/* Panel de Apuesta */}
            <div className="bg-black/30 border border-gray-700 rounded-xl p-4">
              <h3 className="text-white font-bold mb-3 flex items-center space-x-2">
                <FiDollarSign className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Apuesta</span>
              </h3>

              {/* Input de Monto */}
              <div className="mb-3">
                <label className="text-gray-400 text-xs mb-1.5 block">Monto</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                  disabled={isDropping}
                  className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-base font-bold focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                  placeholder="0.00"
                />
              </div>

              {/* Botones Rápidos */}
              <div className="grid grid-cols-5 gap-1.5 mb-3">
                {quickBetAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={isDropping}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Nivel de Riesgo */}
              <div className="mb-3">
                <label className="text-gray-400 text-xs mb-1.5 block">Nivel de Riesgo</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setRisk('low')}
                    disabled={isDropping}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      risk === 'low'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    } disabled:opacity-50`}
                  >
                    Bajo
                  </button>
                  <button
                    onClick={() => setRisk('medium')}
                    disabled={isDropping}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      risk === 'medium'
                        ? 'bg-yellow-600 text-black'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    } disabled:opacity-50`}
                  >
                    Medio
                  </button>
                  <button
                    onClick={() => setRisk('high')}
                    disabled={isDropping}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      risk === 'high'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    } disabled:opacity-50`}
                  >
                    Alto
                  </button>
                </div>
                <p className="text-gray-500 text-[10px] mt-1.5">
                  {risk === 'low' && 'Máx 1.2x - Más seguro'}
                  {risk === 'medium' && 'Máx 3.0x - Riesgo moderado'}
                  {risk === 'high' && 'Máx 10.0x - ¡Grandes premios!'}
                </p>
              </div>

              {/* Botón de Jugar */}
              <button
                onClick={dropBall}
                disabled={isDropping}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold py-3 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isDropping ? '🎯 Cayendo...' : '🎯 Soltar Bola'}
              </button>

              {/* Balance */}
              {user && (
                <div className="mt-3 text-center">
                  <p className="text-gray-400 text-xs">Balance Disponible</p>
                  <p className="text-white font-bold text-lg">${user.balance.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Info del Juego */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <h3 className="text-base font-bold text-white mb-2">ℹ️ Cómo Jugar</h3>
              <div className="space-y-1.5 text-xs">
                <div>
                  <p className="text-yellow-400 font-bold text-[11px]">1. Elige Monto</p>
                  <p className="text-gray-300 text-[10px]">Selecciona cuánto apostar</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-bold text-[11px]">2. Nivel de Riesgo</p>
                  <p className="text-gray-300 text-[10px]">Bajo, Medio o Alto</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-bold text-[11px]">3. Soltar Bola</p>
                  <p className="text-gray-300 text-[10px]">Rebota hasta multiplicador</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlinkoGame;

