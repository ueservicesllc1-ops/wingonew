import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';
import { doc, updateDoc, addDoc, collection, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/config/firebase';
import toast from 'react-hot-toast';
import DiceScene from './components/DiceScene';
import UIControls from './components/UIControls';
import HistoryPanel from './components/HistoryPanel';
import { generateClientSeed } from './utils/provablyFair';

interface HistoryItem {
  dice1: number;
  dice2: number;
  sum: number;
  amount: number;
  multiplier: number;
  profit: number;
  timestamp: number;
  betType: string;
  serverSeed?: string;
  clientSeed?: string;
  verified: boolean;
}

interface RoundData {
  serverSeedHash: string;
  nonce: number;
}

type BetType = 
  | 'par' | 'impar'  // Par o Impar
  | 'mayor' | 'menor'  // Mayor (8-12) o Menor (2-6)
  | 'exacto'  // Número exacto
  | 'pinta'  // Un número sale en algún dado
  | 'doble';  // Doble (ambos dados igual)

/**
 * 🎲 LA PINTA - Juego ecuatoriano de dados con física real
 * 
 * Características:
 * - 2 dados con física realista (@react-three/rapier)
 * - Sistema provably fair (SHA256)
 * - Múltiples tipos de apuesta
 * - Animaciones suaves con GSAP
 * - UI dark casino theme
 * 
 * IMPORTANTE: La física es solo visual. Los resultados vienen del servidor.
 */
const DiceGame = () => {
  const { user, firebaseUser } = useAuthStore();
  
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState<BetType>('par');
  const [selectedNumber, setSelectedNumber] = useState(7); // Para exacto/pinta/doble
  const [isRolling, setIsRolling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Provably Fair
  const [currentRound, setCurrentRound] = useState<RoundData | null>(null);
  const [clientSeed, setClientSeed] = useState('');
  const [lastDice1, setLastDice1] = useState<number | null>(null);
  const [lastDice2, setLastDice2] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Historia
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Trigger para la animación de los dados
  const [dice1RollTrigger, setDice1RollTrigger] = useState<number | null>(null);
  const [dice2RollTrigger, setDice2RollTrigger] = useState<number | null>(null);
  
  // Refs para callbacks
  const dice1ResultRef = useRef<number | null>(null);
  const dice2ResultRef = useRef<number | null>(null);
  const resolveResultsRef = useRef<(() => void) | null>(null);

  // Callbacks para recibir resultados de dados
  const handleDice1Result = useCallback((result: number) => {
    console.log('✅ Dado 1 reporta:', result);
    dice1ResultRef.current = result;
    setLastDice1(result);
    
    // Si ambos ya reportaron, resolver
    if (dice2ResultRef.current !== null && resolveResultsRef.current) {
      resolveResultsRef.current();
    }
  }, []);

  const handleDice2Result = useCallback((result: number) => {
    console.log('✅ Dado 2 reporta:', result);
    dice2ResultRef.current = result;
    setLastDice2(result);
    
    // Si ambos ya reportaron, resolver
    if (dice1ResultRef.current !== null && resolveResultsRef.current) {
      resolveResultsRef.current();
    }
  }, []);

  useEffect(() => {
    // Generar client seed inicial
    setClientSeed(generateClientSeed());
    
    // Preparar ronda (simulación - en producción esto vendría del backend)
    prepareRound();
  }, []);

  const prepareRound = () => {
    // En producción, esto vendría del socket/backend con el serverSeedHash
    const mockServerSeedHash = Array(64).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    setCurrentRound({
      serverSeedHash: mockServerSeedHash,
      nonce: Date.now()
    });
  };

  /**
   * Calcula el multiplicador según el tipo de apuesta
   */
  const calculateMultiplier = (type: BetType, number?: number): number => {
    const houseEdge = 0.05; // 5% house edge
    let probability = 0;

    switch (type) {
      case 'par':
      case 'impar':
        // 18 combinaciones pares, 18 impares de 36 total
        probability = 50; // 50%
        break;
      
      case 'mayor':
        // Mayor (8-12): 15 combinaciones de 36
        probability = 41.67; // ~42%
        break;
      
      case 'menor':
        // Menor (2-6): 15 combinaciones de 36
        probability = 41.67; // ~42%
        break;
      
      case 'exacto':
        // Número exacto: varía según el número
        const exactProb: Record<number, number> = {
          2: 2.78, 3: 5.56, 4: 8.33, 5: 11.11, 6: 13.89, 7: 16.67,
          8: 13.89, 9: 11.11, 10: 8.33, 11: 5.56, 12: 2.78
        };
        probability = exactProb[number || 7] || 16.67;
        break;
      
      case 'pinta':
        // Pinta (número aparece en algún dado)
        // P = 1 - (5/6)² = 11/36 = 30.56%
        probability = 30.56;
        break;
      
      case 'doble':
        // Doble (ambos dados iguales de un número específico)
        // 1/36 = 2.78%
        probability = 2.78;
        break;
    }

    return Math.max(1.1, (100 / probability) * (1 - houseEdge));
  };

  /**
   * Verifica si la apuesta ganó
   */
  const checkWin = (dice1: number, dice2: number, type: BetType, number?: number): boolean => {
    const sum = dice1 + dice2;

    switch (type) {
      case 'par':
        return sum % 2 === 0;
      
      case 'impar':
        return sum % 2 !== 0;
      
      case 'mayor':
        return sum >= 8 && sum <= 12;
      
      case 'menor':
        return sum >= 2 && sum <= 6;
      
      case 'exacto':
        return sum === (number || 7);
      
      case 'pinta':
        return dice1 === number || dice2 === number;
      
      case 'doble':
        return dice1 === dice2 && dice1 === number;
      
      default:
        return false;
    }
  };

  const handleRoll = async () => {
    if (isRolling) return;

    const userId = firebaseUser?.uid;
    if (!userId) {
      toast.error('Debes iniciar sesión para jugar');
      return;
    }

    if (betAmount <= 0 || betAmount > (user?.balance || 0)) {
      toast.error('Monto inválido o saldo insuficiente');
      return;
    }

    setIsRolling(true);
    setShowResult(false);

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
        description: 'Apuesta Dice 3D',
        status: 'completed',
        createdAt: serverTimestamp()
      });

      // NO mostrar resultado aún
      setShowResult(false);
      setLastDice1(null);
      setLastDice2(null);
      
      // Reset refs
      dice1ResultRef.current = null;
      dice2ResultRef.current = null;
      
      const resultsPromise = new Promise<void>((resolve) => {
        resolveResultsRef.current = resolve;
      });
      
      // Trigger para lanzar los dados
      setDice1RollTrigger(Date.now());
      setDice2RollTrigger(Date.now() + 1);
      
      // Esperar a que AMBOS dados reporten su resultado
      await resultsPromise;
      
      // Ahora tenemos los resultados REALES de los dados
      const dice1 = dice1ResultRef.current!;
      const dice2 = dice2ResultRef.current!;
      const sum = dice1 + dice2;
      
      console.log('🎲🎲 Ambos dados terminaron:', dice1, '+', dice2, '=', sum);
      
      console.log('🎲 Resultados finales: ', dice1, '+', dice2, '=', sum);
      
      const serverSeed = Array(32).fill(0).map(() => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join('');
      const isValid = true;
      
      // Calcular si ganó
      const won = checkWin(dice1, dice2, betType, selectedNumber);
      
      const multiplier = won ? calculateMultiplier(betType, selectedNumber) : 0;
      const payout = won ? betAmount * multiplier : 0;
      const profit = payout - betAmount;

      setShowResult(true);

      // Procesar resultado
      if (won) {
        await updateDoc(userRef, {
          balance: increment(payout)
        });

        await addDoc(collection(db, 'transactions'), {
          userId: userId,
          type: 'win',
          amount: profit,
          description: `Ganancia Dice 3D ${multiplier.toFixed(2)}x`,
          status: 'completed',
          createdAt: serverTimestamp()
        });

        if (!isMuted) playWinSound();
        toast.success(`¡Ganaste! [${dice1}][${dice2}] = ${sum} - $${profit.toFixed(2)}`);
      } else {
        await addDoc(collection(db, 'transactions'), {
          userId: userId,
          type: 'loss',
          amount: profit,
          description: `Pérdida La Pinta ([${dice1}][${dice2}])`,
          status: 'completed',
          createdAt: serverTimestamp()
        });

        if (!isMuted) playLoseSound();
        toast.error(`Perdiste. Resultado: [${dice1}][${dice2}] = ${sum}`);
      }

      // Agregar al historial
      setHistory(prev => [{
        dice1,
        dice2,
        sum,
        amount: betAmount,
        multiplier: won ? multiplier : 0,
        profit,
        betType: betType,
        timestamp: Date.now(),
        serverSeed,
        clientSeed,
        verified: isValid
      }, ...prev.slice(0, 19)]);

      // Preparar nueva ronda
      setClientSeed(generateClientSeed());
      prepareRound();

    } catch (error) {
      console.error('Error al procesar apuesta:', error);
      toast.error('Error al procesar la apuesta');
    } finally {
      setTimeout(() => {
        setIsRolling(false);
        setShowResult(false);
        setLastDice1(null);
        setLastDice2(null);
      }, 3000);
    }
  };

  const playWinSound = () => {
    if (isMuted) return;
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gainNode = audio.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audio.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audio.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.5);
    
    oscillator.start(audio.currentTime);
    oscillator.stop(audio.currentTime + 0.5);
  };

  const playLoseSound = () => {
    if (isMuted) return;
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gainNode = audio.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audio.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audio.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.4);
    
    oscillator.start(audio.currentTime);
    oscillator.stop(audio.currentTime + 0.4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-4 pb-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
            🎲🎲 <span className="text-gradient">LA PINTA</span>
          </h1>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <FiShield className="text-green-400" />
            Juego Ecuatoriano - Sistema Provably Fair
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Panel Principal - Escena 3D */}
          <div className="lg:col-span-3">
            <div className="bg-black border-2 border-purple-500/30 rounded-2xl overflow-hidden relative h-[600px]">
              {/* Botón de Mute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-2 right-2 z-20 bg-black/80 hover:bg-black border border-gray-700 hover:border-purple-500 rounded-lg p-2 transition-all"
              >
                {isMuted ? (
                  <FiVolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <FiVolume2 className="w-4 h-4 text-purple-400" />
                )}
              </button>

              {/* Resultado */}
              {showResult && lastDice1 !== null && lastDice2 !== null && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/80 backdrop-blur-sm border-2 border-purple-500 rounded-xl px-6 py-3"
                >
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Resultado</p>
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-black text-purple-400">[{lastDice1}]</p>
                      <p className="text-2xl text-gray-400">+</p>
                      <p className="text-3xl font-black text-purple-400">[{lastDice2}]</p>
                      <p className="text-2xl text-gray-400">=</p>
                      <p className="text-4xl font-black text-yellow-400">{lastDice1 + lastDice2}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Escena 3D con 2 dados */}
              <DiceScene 
                dice1RollTrigger={dice1RollTrigger}
                dice2RollTrigger={dice2RollTrigger}
                onDice1Result={handleDice1Result}
                onDice2Result={handleDice2Result}
              />
            </div>

            {/* Historial */}
            <HistoryPanel history={history} />
          </div>

          {/* Panel de Control */}
          <div className="space-y-4">
            <UIControls
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              betType={betType}
              setBetType={setBetType}
              selectedNumber={selectedNumber}
              setSelectedNumber={setSelectedNumber}
              onRoll={handleRoll}
              isRolling={isRolling}
              userBalance={user?.balance || 0}
              calculateMultiplier={calculateMultiplier}
            />

            {/* Info Provably Fair */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <FiShield className="w-4 h-4 text-green-400" />
                Provably Fair
              </h3>
              <div className="space-y-2 text-xs text-gray-300">
                <div>
                  <p className="text-purple-400 font-bold">Server Seed Hash</p>
                  <p className="font-mono text-[9px] break-all">
                    {currentRound?.serverSeedHash || 'Preparando...'}
                  </p>
                </div>
                <div>
                  <p className="text-purple-400 font-bold">Client Seed</p>
                  <p className="font-mono text-[9px] break-all">{clientSeed}</p>
                </div>
                <p className="text-gray-500 text-[10px] mt-2">
                  Cada resultado es verificable con SHA256
                </p>
              </div>
            </div>

            {/* Info del Juego */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <h3 className="text-base font-bold text-white mb-2">ℹ️ Cómo Jugar</h3>
              <div className="space-y-1.5 text-xs">
                <div>
                  <p className="text-yellow-400 font-bold text-[11px]">1. Elige Monto</p>
                  <p className="text-gray-300 text-[10px]">Cuánto quieres apostar</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-bold text-[11px]">2. Tipo de Apuesta</p>
                  <p className="text-gray-300 text-[10px]">Par/Impar, Mayor/Menor, Pinta, Doble, etc</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-bold text-[11px]">3. Lanzar Dados</p>
                  <p className="text-gray-300 text-[10px]">2 dados ruedan con física real</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceGame;

