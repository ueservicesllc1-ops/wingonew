# ⚡ Inicio Rápido - 5 Minutos

## 1️⃣ Instalar (1 min)

```bash
npm install
```

## 2️⃣ Configurar Firebase (2 min)

### Crear proyecto:
1. Ve a: https://console.firebase.google.com/
2. Click "Agregar proyecto" → Nombre: "wingo-sports" → Crear
3. Habilita **Authentication** → Email/Contraseña
4. Crea **Firestore Database** → Modo prueba → Selecciona ubicación

### Obtener credenciales:
1. Configuración proyecto (⚙️) → Tus aplicaciones → Web (</>)
2. Registra app → Copia credenciales

### Crear `.env`:
```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 3️⃣ Configurar Reglas (1 min)

En Firebase Console → Firestore Database → Reglas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /events/{eventId} {
      allow read: if true;
      allow write: if false;
    }
    match /bets/{betId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
    match /transactions/{transactionId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
```

Click "Publicar"

## 4️⃣ Agregar Eventos (1 min)

En Firestore Database → Iniciar colección:

**Colección:** `events`

**Documento 1 (Fútbol en vivo):**
```
sport: futbol
league: La Liga
homeTeam: Real Madrid
awayTeam: Barcelona
startTime: 2025-10-08T18:00:00.000Z
status: live
odds:
  home: 2.10
  draw: 3.20
  away: 3.50
```

**Documento 2 (Baloncesto próximo):**
```
sport: basketball
league: NBA
homeTeam: LA Lakers
awayTeam: Golden State Warriors
startTime: 2025-10-15T20:00:00.000Z
status: upcoming
odds:
  home: 1.95
  away: 1.85
```

**Documento 3 (Tenis próximo):**
```
sport: tennis
league: ATP Tour
homeTeam: Novak Djokovic
awayTeam: Rafael Nadal
startTime: 2025-10-16T14:00:00.000Z
status: upcoming
odds:
  home: 1.65
  away: 2.25
```

## 5️⃣ Ejecutar

```bash
npm run dev
```

Abre: http://localhost:5173

## ✅ Probar la App

1. **Registra una cuenta** (email + contraseña)
2. **Deposita fondos** → Perfil → Depositar → $100
3. **Haz una apuesta** → Inicio → Click en cuota → Ingresa monto → Realizar Apuestas
4. **Revisa historial** → Mis Apuestas

## 🎯 Estructura de Eventos en Firestore

### Para agregar más eventos:

**Fútbol (con empate):**
```javascript
{
  sport: "futbol",
  league: "Premier League",
  homeTeam: "Manchester United", 
  awayTeam: "Liverpool",
  startTime: "2025-10-20T15:00:00.000Z",
  status: "upcoming",
  odds: { home: 2.50, draw: 3.10, away: 2.80 }
}
```

**Baloncesto (sin empate):**
```javascript
{
  sport: "basketball",
  league: "NBA",
  homeTeam: "Miami Heat",
  awayTeam: "Boston Celtics",
  startTime: "2025-10-21T19:00:00.000Z",
  status: "upcoming",
  odds: { home: 2.10, away: 1.75 }
}
```

**Tenis (sin empate):**
```javascript
{
  sport: "tennis",
  league: "Grand Slam",
  homeTeam: "Carlos Alcaraz",
  awayTeam: "Jannik Sinner",
  startTime: "2025-10-22T12:00:00.000Z",
  status: "upcoming",
  odds: { home: 1.80, away: 2.00 }
}
```

## 📝 Valores Válidos

**sport:**
- `futbol` ⚽
- `basketball` 🏀
- `tennis` 🎾
- `baseball` ⚾

**status:**
- `upcoming` (próximo - aparece en lista de próximos)
- `live` (en vivo - aparece con indicador rojo parpadeante)
- `finished` (finalizado - aparece deshabilitado)

**startTime:**
- Formato ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Ejemplo: `2025-10-15T18:00:00.000Z`
- Para "en vivo": usa fecha/hora actual o pasada

**odds:**
- Valores típicos: 1.20 a 10.00
- Fútbol: incluye `home`, `draw`, `away`
- Baloncesto/Tenis: solo `home`, `away` (sin `draw`)

## 🚨 Errores Comunes

| Error | Solución |
|-------|----------|
| Página en blanco | Verifica `.env` y reinicia servidor |
| No hay eventos | Agrega al menos 1 evento en Firestore |
| No puedo apostar | Deposita fondos en tu perfil primero |
| Error de permisos | Configura las reglas de Firestore |

## 🎉 ¡Todo Listo!

Tu plataforma de apuestas está funcionando. 

**Próximos pasos:**
- Agrega más eventos deportivos
- Personaliza colores en `tailwind.config.js`
- Configura deployment en Firebase Hosting

¿Preguntas? Revisa `README.md` para documentación completa.
