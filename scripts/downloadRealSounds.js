import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

async function downloadFile(url, destPath) {
  const headers = { 'User-Agent': 'WingoSportsApp/1.0 (https://github.com/ueservicesllc1-ops/wingonew)' };
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(destPath, buffer);
  return buffer;
}

async function main() {
  console.log('🏎️ Descargando grabaciones REALES de Fórmula 1 y explosión auténtica...');

  const publicSoundsDir = path.join(process.cwd(), 'public', 'sounds');
  if (!fs.existsSync(publicSoundsDir)) {
    fs.mkdirSync(publicSoundsDir, { recursive: true });
  }

  // 1. Audio REAL de aceleración Fórmula 1 McLaren-Mercedes MP4-23 V8 grabado en pista
  const f1EngineUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/4f/McLaren-Mercedes-MP4-23-2008-Chris-Goodwin.ogg';
  const enginePath = path.join(publicSoundsDir, 'dino_engine.ogg');
  const engineBuffer = await downloadFile(f1EngineUrl, enginePath);
  console.log(`✓ Motor F1 McLaren real descargado (${(engineBuffer.length / 1024).toFixed(1)} KB)`);

  // 2. Audio REAL de explosión potente / reventón
  const crashUrl = 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Explosion-LS100155.ogg';
  const crashPath = path.join(publicSoundsDir, 'dino_crash.ogg');
  const crashBuffer = await downloadFile(crashUrl, crashPath);
  console.log(`✓ Sonido real de explosión descargado (${(crashBuffer.length / 1024).toFixed(1)} KB)`);

  // 3. Subir a Backblaze B2 S3
  const s3Client = new S3Client({
    endpoint: process.env.VITE_B2_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com',
    region: process.env.VITE_B2_REGION || 'us-east-005',
    credentials: {
      accessKeyId: process.env.VITE_B2_KEY_ID || '005c2b526be0baa0000000041',
      secretAccessKey: process.env.VITE_B2_APPLICATION_KEY || 'K005AvC5bsGi/c24/xL3QX4EBoHOtNs',
    },
  });

  const bucketName = process.env.VITE_B2_BUCKET_NAME || 'wingonew';

  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: 'casino/sounds/dino_engine.ogg',
    Body: engineBuffer,
    ContentType: 'audio/ogg',
  }));
  const engineB2Url = `https://f005.backblazeb2.com/file/${bucketName}/casino/sounds/dino_engine.ogg`;
  console.log(`✓ Subido a B2: ${engineB2Url}`);

  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: 'casino/sounds/dino_crash.ogg',
    Body: crashBuffer,
    ContentType: 'audio/ogg',
  }));
  const crashB2Url = `https://f005.backblazeb2.com/file/${bucketName}/casino/sounds/dino_crash.ogg`;
  console.log(`✓ Subido a B2: ${crashB2Url}`);

  // Actualizar Firestore
  console.log('📝 Actualizando Firestore settings/casino-games...');
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
      games[dinoIndex].engineSound = engineB2Url;
      games[dinoIndex].crashSound = crashB2Url;

      await updateDoc(docRef, { games });
      console.log('✅ Firestore actualizado con grabaciones reales en Backblaze B2!');
    }
  }

  console.log('✨ Completado con éxito!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
