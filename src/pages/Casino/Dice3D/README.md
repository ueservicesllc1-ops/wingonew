# 🎲 Dice 3D Pro - Módulo de Casino

Juego de dados 3D profesional con física realista y sistema provably fair integrado.

## 📦 Características

- ✅ **Física realista** con React Three Fiber + Rapier
- ✅ **Animaciones suaves** con GSAP
- ✅ **Sistema Provably Fair** (SHA256)
- ✅ **UI Dark Casino** con Tailwind
- ✅ **Historial en tiempo real**
- ✅ **Integración Firebase** para pagos
- ✅ **Postprocessing** (Bloom effects)

## 🚀 Instalación

Las dependencias ya están instaladas en tu proyecto:

```bash
# Verificar que tengas estas deps en package.json
npm list @react-three/fiber @react-three/drei @react-three/rapier gsap
```

## 📁 Estructura

```
src/pages/Casino/Dice3D/
├── DiceGame.tsx              # Componente principal
├── components/
│   ├── DiceScene.tsx         # Escena 3D con Canvas
│   ├── Die.tsx               # Dado con física Rapier
│   ├── UIControls.tsx        # Controles de apuesta
│   └── HistoryPanel.tsx      # Panel de historial
├── utils/
│   └── provablyFair.ts       # Funciones de verificación
└── README.md                 # Este archivo
```

## 🎮 Cómo Usar

### 1. Agregar la ruta en App.tsx

```tsx
import DiceGame from '@/pages/Casino/Dice3D/DiceGame';

// Dentro de tus routes:
<Route path="casino/dice" element={<DiceGame />} />
```

### 2. Agregar enlace en CasinoHome.tsx

```tsx
<Link to="/casino/dice">
  <div className="casino-game-card">
    🎲 Dice 3D Pro
  </div>
</Link>
```

### 3. Actualizar Admin/Games.tsx

Agregar configuración del juego:

```tsx
{
  id: 'dice',
  name: 'Dice 3D Pro',
  isActive: true,
  minBet: 1,
  maxBet: 1000,
  houseEdge: 2
}
```

## 🔒 Sistema Provably Fair

### Flujo de Verificación

1. **Antes de la apuesta:**
   - Servidor genera `serverSeed` y muestra `sha256(serverSeed)` (hash)
   - Cliente genera `clientSeed` aleatoriamente

2. **Durante la apuesta:**
   - Cliente envía apuesta con `clientSeed`
   - Servidor usa `serverSeed + clientSeed + nonce` para calcular resultado

3. **Después del resultado:**
   - Servidor revela `serverSeed`
   - Cliente verifica:
     - ✓ `sha256(serverSeed) === serverSeedHash` mostrado antes
     - ✓ `generateResult(serverSeed, clientSeed, nonce) === resultado`

### Funciones Disponibles

```typescript
import { 
  generateClientSeed,
  verifyResult,
  verifyServerSeed 
} from './utils/provablyFair';

// Generar seed del cliente
const clientSeed = generateClientSeed();

// Verificar resultado
const isValid = await verifyResult(serverSeed, clientSeed, nonce, result);

// Verificar server seed
const isSeedValid = await verifyServerSeed(serverSeed, serverSeedHash);
```

## 🎨 Personalización

### Cambiar colores del tema

En `DiceScene.tsx` y `Die.tsx`:

```tsx
// Cambiar color del dado
<meshStandardMaterial
  color="#9333ea"  // Purple - cambia aquí
  metalness={0.7}
  roughness={0.3}
/>

// Cambiar color de iluminación
<pointLight color="#9333ea" /> // Cambia el ambiente
```

### Ajustar física

En `DiceScene.tsx`:

```tsx
<Physics gravity={[0, -30, 0]}> // Aumenta para más gravedad
```

En `Die.tsx`:

```tsx
<RigidBody
  restitution={0.3}  // Rebote (0-1)
  friction={0.6}     // Fricción (0-1)
>
```

### Modificar multiplicadores

En `DiceGame.tsx`:

```tsx
const calculateMultiplier = (target: number, isOver: boolean): number => {
  const chance = isOver ? (100 - target) : target;
  const houseEdge = 0.02; // 2% - ajusta aquí
  return (100 / chance) * (1 - houseEdge);
};
```

## 🔧 Integración con Backend (Futuro)

Para conectar con un backend real:

### 1. Instalar Socket.IO

```bash
npm install socket.io-client
```

### 2. Crear hook de socket

```typescript
// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (url: string) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io(url);
    setSocket(socketIo);

    socketIo.on('round_prepared', (data) => {
      // Recibir serverSeedHash
    });

    socketIo.on('roll_result', (data) => {
      // Recibir resultado + serverSeed
    });

    return () => socketIo.close();
  }, [url]);

  return socket;
};
```

### 3. Usar en DiceGame.tsx

```typescript
const socket = useSocket('http://tu-backend:3000');

const handleRoll = () => {
  socket.emit('place_bet', {
    amount: betAmount,
    clientSeed,
    prediction,
    targetNumber
  });
};
```

## ⚠️ Notas Importantes de Seguridad

### 1. NO confiar en física local

```typescript
// ❌ MAL - resultado basado en física local
const result = calculatePhysicsResult(diceRotation);

// ✅ BIEN - resultado viene del servidor
const result = await rollDiceOnServer(betAmount, clientSeed);
```

### 2. Validar siempre en el backend

```typescript
// Backend debe:
// - Verificar balance del usuario
// - Generar resultado de forma segura
// - Actualizar balance
// - Guardar transacción
```

### 3. Rate limiting

```typescript
// Agregar rate limiting para prevenir spam
const [lastRoll, setLastRoll] = useState(0);

const handleRoll = () => {
  const now = Date.now();
  if (now - lastRoll < 1000) {
    toast.error('Espera un momento');
    return;
  }
  setLastRoll(now);
  // ... lógica de apuesta
};
```

## 🐛 Troubleshooting

### Error: "Cannot read properties of undefined"

Asegúrate de que el usuario esté autenticado:

```tsx
if (!firebaseUser?.uid) {
  toast.error('Debes iniciar sesión');
  return;
}
```

### Error: "Physics not working"

Verifica que Rapier esté importado correctamente:

```tsx
import { Physics, RigidBody } from '@react-three/rapier';
```

### Dado no muestra números

Los números del dado son simplificados. Para dados más detallados, usa:
- Texturas personalizadas
- Modelos 3D importados (.glb)
- Mapas de normales

## 📊 Performance

### Optimizaciones incluidas:

- ✅ Suspense para carga progresiva
- ✅ OrbitControls limitados
- ✅ Shadow maps en 2048x2048
- ✅ Bloom moderado (intensity: 0.3)

### Mejoras adicionales:

```tsx
// Reducir calidad en móviles
const isMobile = window.innerWidth < 768;

<Canvas dpr={isMobile ? [1, 1.5] : [1, 2]}>
```

## 📝 TODO

- [ ] Agregar más skins de dados
- [ ] Implementar auto-bet
- [ ] Sonidos personalizados
- [ ] Estadísticas detalladas
- [ ] Sistema de chat
- [ ] Apuestas múltiples

## 📄 Licencia

Este módulo es parte del proyecto WingoSports.

## 🤝 Contribuir

Para agregar features:
1. Crea una rama: `git checkout -b feature/nueva-feature`
2. Commit: `git commit -m 'Add nueva feature'`
3. Push: `git push origin feature/nueva-feature`
4. Abre un Pull Request

## 📞 Soporte

Si tienes problemas:
1. Verifica la consola del navegador
2. Revisa los logs de Firebase
3. Asegúrate de que las deps estén actualizadas

