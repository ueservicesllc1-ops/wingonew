// Script para agregar datos de ejemplo a Firebase
// Instrucciones: 
// 1. Instala Firebase Admin SDK: npm install firebase-admin
// 2. Descarga tu serviceAccountKey.json desde Firebase Console
// 3. Ejecuta: node scripts/seedData.js

const admin = require('firebase-admin');

// Reemplaza esto con tu archivo de credenciales
// const serviceAccount = require('./serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();

// Datos de ejemplo de eventos deportivos
const sampleEvents = [
  // Fútbol
  {
    sport: 'futbol',
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // En 2 días
    status: 'upcoming',
    odds: { home: 2.10, draw: 3.20, away: 3.50 }
  },
  {
    sport: 'futbol',
    league: 'Premier League',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    odds: { home: 2.50, draw: 3.10, away: 2.80 }
  },
  {
    sport: 'futbol',
    league: 'Serie A',
    homeTeam: 'Juventus',
    awayTeam: 'Inter Milan',
    startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // En 1 hora
    status: 'upcoming',
    odds: { home: 2.20, draw: 3.00, away: 3.20 }
  },
  {
    sport: 'futbol',
    league: 'Bundesliga',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    startTime: new Date().toISOString(),
    status: 'live',
    odds: { home: 1.80, draw: 3.50, away: 4.20 }
  },
  
  // Baloncesto
  {
    sport: 'basketball',
    league: 'NBA',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Golden State Warriors',
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.95, away: 1.85 }
  },
  {
    sport: 'basketball',
    league: 'NBA',
    homeTeam: 'Miami Heat',
    awayTeam: 'Boston Celtics',
    startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    odds: { home: 2.10, away: 1.75 }
  },
  {
    sport: 'basketball',
    league: 'Euroleague',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    startTime: new Date().toISOString(),
    status: 'live',
    odds: { home: 1.70, away: 2.15 }
  },
  
  // Tenis
  {
    sport: 'tennis',
    league: 'ATP Tour',
    homeTeam: 'Novak Djokovic',
    awayTeam: 'Rafael Nadal',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.65, away: 2.25 }
  },
  {
    sport: 'tennis',
    league: 'WTA Tour',
    homeTeam: 'Iga Swiatek',
    awayTeam: 'Aryna Sabalenka',
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.55, away: 2.45 }
  },
  {
    sport: 'tennis',
    league: 'Grand Slam',
    homeTeam: 'Carlos Alcaraz',
    awayTeam: 'Jannik Sinner',
    startTime: new Date().toISOString(),
    status: 'live',
    odds: { home: 1.80, away: 2.00 }
  },
  
  // Más fútbol
  {
    sport: 'futbol',
    league: 'Copa Libertadores',
    homeTeam: 'River Plate',
    awayTeam: 'Boca Juniors',
    startTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    odds: { home: 2.30, draw: 2.90, away: 3.10 }
  },
  {
    sport: 'futbol',
    league: 'Ligue 1',
    homeTeam: 'PSG',
    awayTeam: 'Marseille',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    odds: { home: 1.60, draw: 3.80, away: 5.50 }
  },
];

async function seedData() {
  try {
    console.log('Agregando eventos de ejemplo...');
    
    for (const event of sampleEvents) {
      await db.collection('events').add(event);
      console.log(`✓ Evento agregado: ${event.homeTeam} vs ${event.awayTeam}`);
    }
    
    console.log('\n¡Datos de ejemplo agregados exitosamente!');
    console.log(`Total de eventos: ${sampleEvents.length}`);
    
  } catch (error) {
    console.error('Error agregando datos:', error);
  }
}

// Descomenta esta línea para ejecutar el script
// seedData();

// Para uso manual, exporta los datos
module.exports = { sampleEvents };
