import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME || 'wingonew';
const B2_ENDPOINT = process.env.B2_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com';
const B2_REGION = process.env.B2_REGION || 'us-east-005';
const B2_ACCESS_KEY_ID = process.env.B2_ACCESS_KEY_ID || '005c2b526be0baa0000000041';
const B2_SECRET_ACCESS_KEY = process.env.B2_SECRET_ACCESS_KEY || 'K005AvC5bsGi/c24/xL3QX4EBoHOtNs';

const s3Client = new S3Client({
  endpoint: B2_ENDPOINT,
  region: B2_REGION,
  credentials: {
    accessKeyId: B2_ACCESS_KEY_ID,
    secretAccessKey: B2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const firebaseConfig = {
  apiKey: "AIzaSyDie7Ua9OhTqWsqdR3fhnmbKSz7k5KrgtQ",
  authDomain: "studio-3302383355-1ea39.firebaseapp.com",
  projectId: "studio-3302383355-1ea39",
  storageBucket: "studio-3302383355-1ea39.firebasestorage.app",
  messagingSenderId: "1096593910879",
  appId: "1:1096593910879:web:3112124e5f2a31ec2affea"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const imagesToUpload = [
  {
    id: 'dino',
    localCover: 'C:\\Users\\Freedom Labs\\.gemini\\antigravity-ide\\brain\\e7bce7bf-327d-48e2-b025-d4e7fa37ec2c\\speedrun_cover_1791472637845.jpg',
    localBg: 'C:\\Users\\Freedom Labs\\.gemini\\antigravity-ide\\brain\\e7bce7bf-327d-48e2-b025-d4e7fa37ec2c\\speedrun_bg_1791472650953.jpg',
    coverKey: 'casino/covers/dino_speedrun_cover.jpg',
    bgKey: 'casino/backgrounds/dino_speedrun_bg.jpg'
  },
  {
    id: 'dice',
    localCover: 'C:\\Users\\Freedom Labs\\.gemini\\antigravity-ide\\brain\\e7bce7bf-327d-48e2-b025-d4e7fa37ec2c\\dice_real_cover_1791472664259.jpg',
    coverKey: 'casino/covers/dice_lapinta_cover.jpg'
  },
  {
    id: 'plinko',
    localCover: 'C:\\Users\\Freedom Labs\\.gemini\\antigravity-ide\\brain\\e7bce7bf-327d-48e2-b025-d4e7fa37ec2c\\plinko_real_cover_1791472678968.jpg',
    coverKey: 'casino/covers/plinko_cover.jpg'
  },
  {
    id: 'mines',
    localCover: 'C:\\Users\\Freedom Labs\\.gemini\\antigravity-ide\\brain\\e7bce7bf-327d-48e2-b025-d4e7fa37ec2c\\mines_real_cover_1791472692369.jpg',
    coverKey: 'casino/covers/mines_cover.jpg'
  },
  {
    id: 'highlow',
    localCover: 'C:\\Users\\Freedom Labs\\.gemini\\antigravity-ide\\brain\\e7bce7bf-327d-48e2-b025-d4e7fa37ec2c\\hilo_real_cover_1791472711723.jpg',
    coverKey: 'casino/covers/highlow_cover.jpg'
  },
  {
    id: 'blackjack',
    localCover: 'C:\\Users\\Freedom Labs\\.gemini\\antigravity-ide\\brain\\e7bce7bf-327d-48e2-b025-d4e7fa37ec2c\\blackjack_real_cover_1791472729448.jpg',
    coverKey: 'casino/covers/blackjack_cover.jpg'
  },
  {
    id: 'wheel',
    localCover: 'C:\\Users\\Freedom Labs\\.gemini\\antigravity-ide\\brain\\e7bce7bf-327d-48e2-b025-d4e7fa37ec2c\\wheel_real_cover_1791472747168.jpg',
    coverKey: 'casino/covers/wheel_cover.jpg'
  }
];

async function uploadFileToB2(filePath, s3Key) {
  const fileBuffer = fs.readFileSync(filePath);
  const command = new PutObjectCommand({
    Bucket: B2_BUCKET_NAME,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: 'image/jpeg'
  });
  await s3Client.send(command);
  const publicUrl = `https://f005.backblazeb2.com/file/${B2_BUCKET_NAME}/${s3Key}`;
  console.log(`✓ Subido a B2: ${publicUrl}`);
  return publicUrl;
}

async function run() {
  console.log('🚀 Subiendo imágenes a Backblaze B2 S3...');
  
  const uploadedUrls = {};

  for (const item of imagesToUpload) {
    if (item.localCover && fs.existsSync(item.localCover)) {
      uploadedUrls[`${item.id}_cover`] = await uploadFileToB2(item.localCover, item.coverKey);
    }
    if (item.localBg && fs.existsSync(item.localBg)) {
      uploadedUrls[`${item.id}_bg`] = await uploadFileToB2(item.localBg, item.bgKey);
    }
  }

  console.log('\n📝 Actualizando Firestore settings/casino-games con URLs de B2...');
  const gamesDocRef = doc(db, 'settings', 'casino-games');
  const gamesDoc = await getDoc(gamesDocRef);
  
  let currentGames = [];
  if (gamesDoc.exists()) {
    currentGames = gamesDoc.data().games || [];
  }

  // Actualizar juegos
  const updatedGames = currentGames.map(game => {
    const newCover = uploadedUrls[`${game.id}_cover`];
    const newBg = uploadedUrls[`${game.id}_bg`];
    return {
      ...game,
      coverImage: newCover || game.coverImage || '',
      backgroundImage: newBg !== undefined ? newBg : (game.backgroundImage || '')
    };
  });

  // Si algún juego no está en la lista (como wheel), agregarlo
  const existingIds = updatedGames.map(g => g.id);
  if (!existingIds.includes('wheel') && uploadedUrls['wheel_cover']) {
    updatedGames.push({
      id: 'wheel',
      name: 'Wheel of Fortune',
      icon: '🎡',
      coverImage: uploadedUrls['wheel_cover'],
      active: true,
      logics: []
    });
  }

  await setDoc(gamesDocRef, { games: updatedGames });
  console.log('✅ Firestore actualizado con éxito con las URLs de Backblaze B2!');
}

run().catch(console.error);
