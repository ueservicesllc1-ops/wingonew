# 🚀 Guía Rápida de Instalación

## Paso 1: Instalar Dependencias

```bash
npm install
```

## Paso 2: Configurar Firebase

### 2.1 Crear Proyecto Firebase

1. Ve a https://console.firebase.google.com/
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto (ejemplo: "wingo-sports")
4. Sigue los pasos del asistente

### 2.2 Habilitar Authentication

1. En el menú lateral, ve a **Authentication**
2. Haz clic en "Comenzar"
3. En la pestaña "Sign-in method", habilita **Correo electrónico/Contraseña**

### 2.3 Crear Firestore Database

1. En el menú lateral, ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (o "Modo de producción" y copia las reglas de `firestore.rules`)
4. Elige una ubicación cercana

### 2.4 Obtener Credenciales

1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. En la sección "Tus aplicaciones", haz clic en el ícono **</>** (Web)
3. Registra tu aplicación (nombre: "Wingo Sports Web")
4. Copia las credenciales que aparecen

## Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Paso 4: Configurar Reglas de Firestore

1. En Firebase Console, ve a **Firestore Database** → **Reglas**
2. Copia y pega el contenido de `firestore.rules`
3. Haz clic en "Publicar"

## Paso 5: Agregar Eventos de Ejemplo

### Opción A: Manual (Recomendado para empezar)

1. En Firebase Console, ve a **Firestore Database**
2. Haz clic en "Iniciar colección"
3. Nombre de la colección: `events`
4. Agrega documentos con esta estructura:

```javascript
{
  sport: "futbol",
  league: "La Liga",
  homeTeam: "Real Madrid",
  awayTeam: "Barcelona",
  startTime: "2025-10-15T18:00:00.000Z",
  status: "upcoming",
  odds: {
    home: 2.10,
    draw: 3.20,
    away: 3.50
  }
}
```

**Tipos de sport válidos:**
- `futbol`
- `basketball`
- `tennis`
- `baseball`

**Tipos de status válidos:**
- `upcoming` (próximo)
- `live` (en vivo)
- `finished` (finalizado)

**Ejemplos rápidos:**

**Evento de Fútbol:**
```
sport: futbol
league: Premier League
homeTeam: Manchester United
awayTeam: Liverpool
startTime: 2025-10-10T15:00:00.000Z
status: upcoming
odds: { home: 2.50, draw: 3.10, away: 2.80 }
```

**Evento de Baloncesto:**
```
sport: basketball
league: NBA
homeTeam: LA Lakers
awayTeam: Golden State Warriors
startTime: 2025-10-11T20:00:00.000Z
status: upcoming
odds: { home: 1.95, away: 1.85 }
```

**Evento de Tenis:**
```
sport: tennis
league: ATP Tour
homeTeam: Novak Djokovic
awayTeam: Rafael Nadal
startTime: 2025-10-12T14:00:00.000Z
status: upcoming
odds: { home: 1.65, away: 2.25 }
```

### Opción B: Script Automático (Avanzado)

Si quieres usar el script automático:

```bash
npm install firebase-admin
node scripts/seedData.js
```

(Requiere configurar Firebase Admin SDK - ver documentación en el script)

## Paso 6: Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación se abrirá en: http://localhost:5173

## 🎉 ¡Listo!

### Primeros pasos:

1. **Registra una cuenta** en la página de registro
2. **Deposita fondos** desde tu perfil (simulado, solo para pruebas)
3. **Explora eventos** en la página principal
4. **Realiza apuestas** agregándolas al carrito
5. **Revisa tu historial** en "Mis Apuestas"

## 🐛 Solución de Problemas

### Error: "Firebase: Error (auth/configuration-not-found)"
- ❌ Las variables de entorno no están configuradas correctamente
- ✅ Verifica que el archivo `.env` existe y tiene las credenciales correctas
- ✅ Reinicia el servidor de desarrollo después de crear `.env`

### Error: "Missing or insufficient permissions"
- ❌ Las reglas de Firestore no están configuradas
- ✅ Copia las reglas de `firestore.rules` en Firebase Console

### No aparecen eventos
- ❌ No has agregado eventos a Firestore
- ✅ Agrega al menos un evento siguiendo el Paso 5

### La página está en blanco
- ❌ Problema con el build o las dependencias
- ✅ Ejecuta `npm install` de nuevo
- ✅ Limpia caché: `rm -rf node_modules/.vite`
- ✅ Revisa la consola del navegador (F12) para ver errores

## 📚 Documentación Adicional

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de React](https://react.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [Documentación de Vite](https://vitejs.dev/)

## 💡 Consejos

- **Balance inicial**: Los usuarios empiezan con $0. Usa la función "Depositar" para agregar fondos
- **Formato de fecha**: Usa formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) para `startTime`
- **Eventos en vivo**: Para simular eventos en vivo, usa la fecha/hora actual
- **Cuotas**: Valores típicos van de 1.20 a 10.00

¡Disfruta construyendo tu plataforma de apuestas! 🎮
