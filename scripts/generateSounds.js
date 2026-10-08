import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Helper para crear un buffer WAV PCM 16-bit 44100Hz mono/stereo
function createWavBuffer(samples, sampleRate = 44100, numChannels = 1) {
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // 16 bits per sample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Samples
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? s * 0x8000 : s * 0x7FFF;
    buffer.writeInt16LE(Math.floor(intSample), 44 + i * 2);
  }

  return buffer;
}

// 1. Sonido de motor de carreras / Fórmula 1 (Loop realista de 3 segundos)
function generateEngineSound(duration = 3.0, sampleRate = 44100) {
  const numSamples = Math.floor(duration * sampleRate);
  const samples = new Float32Array(numSamples);
  const baseFreq = 110; // Frecuencia base de revoluciones

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Modulación sutil de RPM para darle vida de motor real
    const rpmMod = Math.sin(2 * Math.PI * 3.5 * t) * 4;
    const f0 = baseFreq + rpmMod;

    // Armónicos del motor de combustión / cilindros
    const h1 = Math.sin(2 * Math.PI * f0 * t) * 0.4;
    const h2 = Math.sin(2 * Math.PI * (f0 * 2) * t) * 0.35;
    const h3 = Math.sin(2 * Math.PI * (f0 * 3) * t) * 0.25;
    const h4 = Math.sin(2 * Math.PI * (f0 * 4) * t) * 0.2;
    const h6 = Math.sin(2 * Math.PI * (f0 * 6) * t) * 0.15;
    const h8 = Math.sin(2 * Math.PI * (f0 * 8) * t) * 0.1;

    // Silbido de turbo (alta frecuencia modulada)
    const turboFreq = 1800 + Math.sin(2 * Math.PI * 7 * t) * 120;
    const turbo = Math.sin(2 * Math.PI * turboFreq * t) * 0.08;

    // Rugido / escape (ruido filtrado)
    const noise = (Math.random() * 2 - 1) * 0.12 * (0.5 + 0.5 * Math.sin(2 * Math.PI * f0 * 2 * t));

    // Mezcla
    let raw = h1 + h2 + h3 + h4 + h6 + h8 + turbo + noise;

    // Saturación tipo distorsión de escape deportivo (warm overdrive)
    raw = Math.tanh(raw * 1.6) * 0.7;

    // Crossfade en bordes para loop perfecto sin clicks
    const fadeLen = sampleRate * 0.05; // 50ms fade
    if (i < fadeLen) {
      raw *= (i / fadeLen);
    } else if (i > numSamples - fadeLen) {
      raw *= ((numSamples - i) / fadeLen);
    }

    samples[i] = raw;
  }

  return createWavBuffer(samples, sampleRate);
}

// 2. Sonido de Crash / Motor fundido / Explosión metálica (1.5 segundos)
function generateCrashSound(duration = 1.6, sampleRate = 44100) {
  const numSamples = Math.floor(duration * sampleRate);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // 1. Golpe sordo grave / Sub-bass punch inicial (impacto)
    const subEnv = Math.exp(-t * 9);
    const subBass = Math.sin(2 * Math.PI * (90 * Math.exp(-t * 12) + 40) * t) * subEnv * 0.7;

    // 2. Explosión / Roto de metal (ruido blanco moldeado con decaimiento)
    const noiseEnv = Math.exp(-t * 5.5);
    const noise = (Math.random() * 2 - 1) * noiseEnv * 0.65;

    // 3. Resonancia metálica chirriante (pedazos de motor / fierro)
    const metalEnv = Math.exp(-t * 3.5);
    const metal1 = Math.sin(2 * Math.PI * 480 * t) * metalEnv * 0.2;
    const metal2 = Math.sin(2 * Math.PI * 860 * t) * metalEnv * 0.15;
    const metal3 = Math.sin(2 * Math.PI * 1420 * t) * Math.exp(-t * 7) * 0.1;

    // 4. Chisporroteo / escape de vapor final (de 0.3s en adelante)
    let sizzle = 0;
    if (t > 0.15) {
      const sizzleEnv = Math.exp(-(t - 0.15) * 4) * 0.2;
      sizzle = (Math.random() * 2 - 1) * sizzleEnv;
    }

    let mix = subBass + noise + metal1 + metal2 + metal3 + sizzle;
    mix = Math.tanh(mix * 1.5) * 0.85;

    samples[i] = mix;
  }

  return createWavBuffer(samples, sampleRate);
}

// 3. Sonido de Cash Out / Ganancia (0.6 segundos)
function generateCashOutSound(duration = 0.7, sampleRate = 44100) {
  const numSamples = Math.floor(duration * sampleRate);
  const samples = new Float32Array(numSamples);

  // Arpegio brillante ganador: C6 (1046.5Hz) -> E6 (1318.5Hz) -> G6 (1567.9Hz) -> C7 (2093.0Hz)
  const notes = [
    { freq: 1046.5, start: 0.00, dur: 0.25 },
    { freq: 1318.5, start: 0.08, dur: 0.25 },
    { freq: 1567.9, start: 0.16, dur: 0.25 },
    { freq: 2093.0, start: 0.24, dur: 0.45 }
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let mix = 0;

    for (const note of notes) {
      if (t >= note.start && t < note.start + note.dur) {
        const localT = t - note.start;
        const env = Math.exp(-localT * 8);
        const tone = Math.sin(2 * Math.PI * note.freq * localT);
        const sparkle = Math.sin(2 * Math.PI * (note.freq * 2) * localT) * 0.3;
        mix += (tone + sparkle) * env * 0.28;
      }
    }

    // Efecto monedas / caja registradora 'ding'
    if (t < 0.15) {
      const click = Math.sin(2 * Math.PI * 3200 * t) * Math.exp(-t * 40) * 0.2;
      mix += click;
    }

    samples[i] = Math.tanh(mix) * 0.8;
  }

  return createWavBuffer(samples, sampleRate);
}

async function main() {
  console.log('🎵 Generando efectos de sonido realistas para Speed Run...');

  const engineWav = generateEngineSound(3.0);
  const crashWav = generateCrashSound(1.6);
  const cashOutWav = generateCashOutSound(0.7);

  // Guardar en public/sounds
  const publicSoundsDir = path.join(process.cwd(), 'public', 'sounds');
  if (!fs.existsSync(publicSoundsDir)) {
    fs.mkdirSync(publicSoundsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicSoundsDir, 'dino_engine.wav'), engineWav);
  fs.writeFileSync(path.join(publicSoundsDir, 'dino_crash.wav'), crashWav);
  fs.writeFileSync(path.join(publicSoundsDir, 'dino_cashout.wav'), cashOutWav);
  console.log('✓ Guardados localmente en public/sounds/');

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
    const publicUrl = `https://f005.backblazeb2.com/file/${bucketName}/${s.key}`;
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
      console.log('✅ Firestore actualizado con éxito con los audios en Backblaze B2!');
    }
  }

  console.log('✨ Proceso de audio completado!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error generando/subiendo audios:', err);
  process.exit(1);
});
