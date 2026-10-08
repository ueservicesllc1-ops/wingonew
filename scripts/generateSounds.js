import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Helper para crear un buffer WAV PCM 16-bit 44100Hz stereo/mono
function createWavBuffer(samplesL, samplesR = null, sampleRate = 44100) {
  const numChannels = samplesR ? 2 : 1;
  const numSamples = samplesL.length;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = numSamples * numChannels * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // 16-bit

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Left
    let sL = Math.max(-1, Math.min(1, samplesL[i]));
    let intSL = sL < 0 ? sL * 0x8000 : sL * 0x7FFF;
    buffer.writeInt16LE(Math.floor(intSL), offset);
    offset += 2;

    if (numChannels === 2) {
      let sR = Math.max(-1, Math.min(1, samplesR[i]));
      let intSR = sR < 0 ? sR * 0x8000 : sR * 0x7FFF;
      buffer.writeInt16LE(Math.floor(intSR), offset);
      offset += 2;
    }
  }

  return buffer;
}

// Biquad Bandpass Filter implementation
class BiquadFilter {
  constructor(type, freq, q, sampleRate = 44100) {
    this.type = type;
    this.freq = freq;
    this.q = q;
    this.sampleRate = sampleRate;
    this.x1 = 0; this.x2 = 0;
    this.y1 = 0; this.y2 = 0;
    this.recalculate();
  }

  recalculate() {
    const w0 = 2 * Math.PI * this.freq / this.sampleRate;
    const cosw0 = Math.cos(w0);
    const sinw0 = Math.sin(w0);
    const alpha = sinw0 / (2 * this.q);

    if (this.type === 'bandpass') {
      this.b0 = alpha;
      this.b1 = 0;
      this.b2 = -alpha;
      this.a0 = 1 + alpha;
      this.a1 = -2 * cosw0;
      this.a2 = 1 - alpha;
    } else if (this.type === 'lowpass') {
      this.b0 = (1 - cosw0) / 2;
      this.b1 = 1 - cosw0;
      this.b2 = (1 - cosw0) / 2;
      this.a0 = 1 + alpha;
      this.a1 = -2 * cosw0;
      this.a2 = 1 - alpha;
    } else if (this.type === 'highpass') {
      this.b0 = (1 + cosw0) / 2;
      this.b1 = -(1 + cosw0);
      this.b2 = (1 + cosw0) / 2;
      this.a0 = 1 + alpha;
      this.a1 = -2 * cosw0;
      this.a2 = 1 - alpha;
    }
  }

  process(sample) {
    const y = (this.b0 / this.a0) * sample +
              (this.b1 / this.a0) * this.x1 +
              (this.b2 / this.a0) * this.x2 -
              (this.a1 / this.a0) * this.y1 -
              (this.a2 / this.a0) * this.y2;

    this.x2 = this.x1;
    this.x1 = sample;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

// 1. Motor V8 / GT Racing realista (Generación física granular por pulsos de pistón y resonancia de escape)
function generateRealisticEngine(duration = 4.0, sampleRate = 44100) {
  const numSamples = Math.floor(duration * sampleRate);
  const outL = new Float32Array(numSamples);
  const outR = new Float32Array(numSamples);

  // Filtros resonantes del cuerpo del motor y escape (Acoustic Cavity Resonators)
  const fExhaust1 = new BiquadFilter('bandpass', 165, 3.5, sampleRate);
  const fExhaust2 = new BiquadFilter('bandpass', 380, 4.0, sampleRate);
  const fThroat = new BiquadFilter('bandpass', 720, 5.0, sampleRate);
  const fManifold = new BiquadFilter('bandpass', 1450, 4.5, sampleRate);
  const fRasp = new BiquadFilter('bandpass', 2900, 3.0, sampleRate);
  const fLowPass = new BiquadFilter('lowpass', 5500, 0.7, sampleRate);

  // Configuración de motor V8 (8 cilindros disparando en orden de encendido)
  const numCylinders = 8;
  const cylinderPhases = [0, 0.25, 0.5, 0.75, 0.125, 0.375, 0.625, 0.875];
  
  // RPM de ralentí deportivo alto (~2400 RPM base = 40 Hz de rotación del cigüeñal = 160 explosiones/seg)
  const baseRPS = 48.0; 

  let enginePhase = 0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Aceleración natural continua y sutil fluctuación mecánica (jitter)
    const revJitter = Math.sin(2 * Math.PI * 4.2 * t) * 1.5 + Math.sin(2 * Math.PI * 9.7 * t) * 0.8;
    const currentRPS = baseRPS + revJitter;
    
    enginePhase += (currentRPS / sampleRate);
    if (enginePhase >= 1.0) enginePhase -= 1.0;

    // Sumar pulsos asimétricos de combustión de cada cilindro
    let rawCylinders = 0;
    for (let c = 0; c < numCylinders; c++) {
      let cylPhase = (enginePhase + cylinderPhases[c]) % 1.0;
      
      // Pulso de onda de choque de explosión: ataque ultra rápido no lineal y compresión
      // Simula la apertura de la válvula de escape bajo presión extrema
      if (cylPhase < 0.35) {
        const p = cylPhase / 0.35;
        // Forma de onda de pulso de escape real: pico agudo seguido de depresión acústica
        const shockWave = Math.sin(Math.PI * p) * Math.exp(-p * 5.0) - Math.sin(2 * Math.PI * p) * 0.3 * Math.exp(-p * 8.0);
        rawCylinders += shockWave;
      }
    }

    // Ruido de flujo turbulento de aire de admisión / escape
    const whiteNoise = (Math.random() * 2 - 1);
    const airTurbulence = whiteNoise * 0.25 * (0.6 + 0.4 * rawCylinders);

    // Silbido agudo de compresor / turbocharger (Twin-turbo spool)
    const turboFreq = 3400 + Math.sin(2 * Math.PI * 6.0 * t) * 180;
    const turboWhine = Math.sin(2 * Math.PI * turboFreq * t) * 0.045;

    // Sub-bajo acústico profundo del bloque de motor (thump de cilindros)
    const subBass = Math.sin(2 * Math.PI * (currentRPS * 2) * t) * 0.35;

    // Paso por las resonancias de escape (Formants)
    const e1 = fExhaust1.process(rawCylinders) * 0.65;
    const e2 = fExhaust2.process(rawCylinders) * 0.55;
    const throat = fThroat.process(rawCylinders) * 0.45;
    const manifold = fManifold.process(rawCylinders + airTurbulence) * 0.35;
    const rasp = fRasp.process(rawCylinders + airTurbulence) * 0.25;

    // Mezcla de todas las capas acústicas
    let mix = (e1 + e2 + throat + manifold + rasp + subBass + turboWhine + airTurbulence * 0.2);

    // Saturación analógica de escape deportivo (Warm asymmetric overdrive)
    // Esto quita completamente cualquier sonido de sintetizador básico y le da la crudeza de motor real
    mix = Math.tanh(mix * 1.8);
    mix = fLowPass.process(mix);

    // Crossfade en bordes para loop impecable
    const fadeLen = Math.floor(sampleRate * 0.08); // 80ms fade
    if (i < fadeLen) {
      mix *= (i / fadeLen);
    } else if (i > numSamples - fadeLen) {
      mix *= ((numSamples - i) / fadeLen);
    }

    // Stereo spread sutil para dar espacialidad al habitáculo/pista
    outL[i] = mix * 0.95;
    outR[i] = mix * 0.98;
  }

  return createWavBuffer(outL, outR, sampleRate);
}

// 2. Sonido de Crash / Motor Fundido (Impacto metálico masivo, ruptura de pistón, explosión y derrape)
function generateRealisticCrash(duration = 2.2, sampleRate = 44100) {
  const numSamples = Math.floor(duration * sampleRate);
  const outL = new Float32Array(numSamples);
  const outR = new Float32Array(numSamples);

  const subFilter = new BiquadFilter('lowpass', 120, 1.2, sampleRate);
  const metalFilter1 = new BiquadFilter('bandpass', 1150, 6.0, sampleRate);
  const metalFilter2 = new BiquadFilter('bandpass', 2400, 8.0, sampleRate);
  const metalFilter3 = new BiquadFilter('bandpass', 4600, 5.0, sampleRate);
  const steamFilter = new BiquadFilter('bandpass', 3200, 2.0, sampleRate);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // 1. Golpe de impacto inicial ultra potente (Metal slam + Sub boom)
    const impactEnv = Math.exp(-t * 14.0);
    const subImpact = Math.sin(2 * Math.PI * (110 * Math.exp(-t * 18.0) + 38) * t) * impactEnv * 1.2;
    const subFiltered = subFilter.process(subImpact);

    // 2. Ruptura violenta de bielas / fierros retorciéndose (Heavy distortion crunch)
    const crunchEnv = Math.exp(-t * 6.5);
    const crunchNoise = (Math.random() * 2 - 1) * crunchEnv * 0.85;

    // 3. Resonancias de carrocería y restos metálicos
    const m1 = metalFilter1.process(crunchNoise) * 0.6;
    const m2 = metalFilter2.process(crunchNoise) * 0.45;
    const m3 = metalFilter3.process(crunchNoise) * 0.35;

    // 4. Chillido de frenos / derrape violento (Tire screeching)
    let tireSkid = 0;
    if (t < 0.7) {
      const skidEnv = Math.sin(Math.PI * (t / 0.7)) * Math.exp(-t * 2.5);
      const skidFreq = 1850 + Math.sin(2 * Math.PI * 35 * t) * 400;
      tireSkid = (Math.sin(2 * Math.PI * skidFreq * t) + (Math.random() * 2 - 1) * 0.3) * skidEnv * 0.4;
    }

    // 5. Escape de vapor a presión del radiador / motor fundido hirviendo
    let steam = 0;
    if (t > 0.25) {
      const steamEnv = Math.exp(-(t - 0.25) * 2.2) * (1 - Math.exp(-(t - 0.25) * 8.0));
      steam = steamFilter.process((Math.random() * 2 - 1)) * steamEnv * 0.5;
    }

    let mixL = subFiltered + crunchNoise * 0.5 + m1 + m2 + m3 + tireSkid * 0.9 + steam;
    let mixR = subFiltered + crunchNoise * 0.5 + m1 * 0.9 + m2 * 1.1 + m3 * 0.8 + tireSkid * 0.7 + steam * 1.1;

    // Master clipping suave
    mixL = Math.tanh(mixL * 1.6) * 0.92;
    mixR = Math.tanh(mixR * 1.6) * 0.92;

    outL[i] = mixL;
    outR[i] = mixR;
  }

  return createWavBuffer(outL, outR, sampleRate);
}

// 3. Sonido de Cash Out / Victoria de Casino (Monedas y Chime brillante)
function generateRealisticCashOut(duration = 0.8, sampleRate = 44100) {
  const numSamples = Math.floor(duration * sampleRate);
  const outL = new Float32Array(numSamples);
  const outR = new Float32Array(numSamples);

  // Arpegio de campanas metálicas
  const chimes = [
    { freq: 1174.66, time: 0.00, dur: 0.35 }, // D6
    { freq: 1479.98, time: 0.07, dur: 0.35 }, // F#6
    { freq: 1760.00, time: 0.14, dur: 0.40 }, // A6
    { freq: 2349.32, time: 0.21, dur: 0.55 }, // D7
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let chimeMix = 0;

    for (const c of chimes) {
      if (t >= c.time && t < c.time + c.dur) {
        const localT = t - c.time;
        const env = Math.exp(-localT * 7.0);
        // Campana con armónicos naturales
        const fund = Math.sin(2 * Math.PI * c.freq * localT);
        const harm2 = Math.sin(2 * Math.PI * c.freq * 2.76 * localT) * 0.25;
        const harm3 = Math.sin(2 * Math.PI * c.freq * 5.4 * localT) * 0.12;
        chimeMix += (fund + harm2 + harm3) * env * 0.22;
      }
    }

    // Tintineo metálico de monedas
    let coinClicks = 0;
    if (t < 0.25) {
      const clickEnv = Math.exp(-t * 30.0);
      const click = Math.sin(2 * Math.PI * 4200 * t) * clickEnv * 0.25;
      coinClicks += click;
    }

    let mix = Math.tanh((chimeMix + coinClicks) * 1.3) * 0.85;
    outL[i] = mix;
    outR[i] = mix;
  }

  return createWavBuffer(outL, outR, sampleRate);
}

async function main() {
  console.log('🏎️ Generando motor V8 granular hiperrealista y crash de impacto para Speed Run...');

  const engineWav = generateRealisticEngine(4.0);
  const crashWav = generateRealisticCrash(2.2);
  const cashOutWav = generateRealisticCashOut(0.8);

  const publicSoundsDir = path.join(process.cwd(), 'public', 'sounds');
  if (!fs.existsSync(publicSoundsDir)) {
    fs.mkdirSync(publicSoundsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicSoundsDir, 'dino_engine.wav'), engineWav);
  fs.writeFileSync(path.join(publicSoundsDir, 'dino_crash.wav'), crashWav);
  fs.writeFileSync(path.join(publicSoundsDir, 'dino_cashout.wav'), cashOutWav);
  console.log('✓ Guardados localmente en public/sounds/ (WAV Stereo 44.1kHz)');

  // Subir a Backblaze B2 S3
  const s3Client = new S3Client({
    endpoint: process.env.VITE_B2_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com',
    region: process.env.VITE_B2_REGION || 'us-east-005',
    credentials: {
      accessKeyId: process.env.VITE_B2_KEY_ID || '005c2b526be0baa0000000041',
      secretAccessKey: process.env.VITE_B2_APPLICATION_KEY || 'K005AvC5bsGi/c24/xL3QX4EBoHOtNs',
    },
  });

  const bucketName = process.env.VITE_B2_BUCKET_NAME || 'wingonew';
  const sounds = [
    { key: 'casino/sounds/dino_engine.wav', buffer: engineWav },
    { key: 'casino/sounds/dino_crash.wav', buffer: crashWav },
    { key: 'casino/sounds/dino_cashout.wav', buffer: cashOutWav },
  ];

  const uploadedUrls = {};
  for (const s of sounds) {
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: s.key,
      Body: s.buffer,
      ContentType: 'audio/wav',
    }));
    const publicUrl = `https://f005.backblazeb2.com/file/${bucketName}/${s.key}?t=${Date.now()}`;
    uploadedUrls[s.key] = publicUrl;
    console.log(`✓ Subido a B2: ${publicUrl}`);
  }

  // Actualizar Firestore
  console.log('📝 Actualizando Firestore settings/casino-games con los nuevos audios...');
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const docRef = doc(db, 'settings', 'casino-games');
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const data = snap.data();
    const games = data.games || [];
    const dinoIndex = games.findIndex(g => g.id === 'dino');
    if (dinoIndex !== -1) {
      games[dinoIndex].engineSound = uploadedUrls['casino/sounds/dino_engine.wav'];
      games[dinoIndex].crashSound = uploadedUrls['casino/sounds/dino_crash.wav'];
      games[dinoIndex].cashOutSound = uploadedUrls['casino/sounds/dino_cashout.wav'];

      await updateDoc(docRef, { games });
      console.log('✅ Firestore actualizado con éxito con los audios hiperrealistas en Backblaze B2!');
    }
  }

  console.log('✨ Proceso de audio completado!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error generando/subiendo audios:', err);
  process.exit(1);
});
