# 🎰 WingoSports - Plataforma Moderna de Apuestas Deportivas

Una aplicación web profesional y moderna para apuestas deportivas, construida con React, TypeScript, Tailwind CSS y Framer Motion.

![WingoSports](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.6-38bdf8)

## ✨ Características

### 🎨 Diseño Moderno y Profesional
- **Interfaz elegante** con colores azul oscuro, naranja y blanco
- **Animaciones suaves** con Framer Motion
- **Diseño responsive** adaptable a móvil, tablet y desktop
- **Efectos visuales** como hover, transiciones y gradientes

### 🏆 Funcionalidades
- **Hero Slider** con promociones automáticas
- **Eventos en vivo** con cuotas en tiempo real
- **Múltiples deportes** (Fútbol, Baloncesto, Tenis, etc.)
- **BetSlip inteligente** con apuestas simples y múltiples
- **Sistema de autenticación** con Firebase
- **Gestión de balance** y transacciones
- **Promociones exclusivas** y bonos

### 🎯 Componentes Reutilizables
- Tarjetas de deportes animadas
- Tarjetas de partidos con cuotas interactivas
- Header con menú responsive
- Footer completo con enlaces y redes sociales
- Modales de login/registro
- Sistema de notificaciones (toast)

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o navegar al proyecto**
```bash
cd wingo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
La aplicación se abrirá automáticamente en `http://localhost:5173`

### Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye la aplicación para producción
npm run preview  # Previsualiza la build de producción
npm run lint     # Ejecuta el linter
```

## 📁 Estructura del Proyecto

```
wingo/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── Auth/            # Modales de login/registro
│   │   ├── BetSlip/         # Boleto de apuestas
│   │   ├── Betting/         # Tarjetas de partidos
│   │   ├── Home/            # Secciones de la página principal
│   │   ├── Layout/          # Header, Footer, Layout
│   │   └── Sports/          # Tarjetas de deportes
│   ├── pages/               # Páginas de la aplicación
│   │   ├── HomeModern.tsx   # Página principal
│   │   ├── Profile.tsx      # Perfil de usuario
│   │   ├── MyBets.tsx       # Mis apuestas
│   │   └── ...
│   ├── services/            # Servicios (Firebase, API)
│   ├── store/               # Estado global (Zustand)
│   ├── types/               # Tipos de TypeScript
│   ├── config/              # Configuración (Firebase)
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Punto de entrada
├── public/                  # Archivos estáticos
├── package.json             # Dependencias
├── tailwind.config.js       # Configuración de Tailwind
├── tsconfig.json            # Configuración de TypeScript
└── vite.config.ts          # Configuración de Vite
```

## 🎨 Paleta de Colores

### Colores Principales
- **Primary (Azul)**: `#0066FF` - Botones y elementos principales
- **Secondary (Naranja)**: `#FF8F00` - Acentos y llamadas a la acción
- **Dark**: `#0F1419` - Fondo principal
- **Dark Light**: `#1F252B` - Fondos secundarios

### Gradientes
- `gradient-primary`: Azul oscuro a azul medio
- `gradient-secondary`: Naranja a naranja oscuro
- `gradient-dark`: Degradado oscuro para fondos

## 🔧 Tecnologías Utilizadas

### Core
- **React 18.2** - Framework de JavaScript
- **TypeScript 5.2** - Tipado estático
- **Vite 5.0** - Build tool ultrarrápido

### Estilos
- **Tailwind CSS 3.3** - Framework de CSS utility-first
- **Framer Motion 10** - Animaciones y transiciones

### Backend y Estado
- **Firebase 10.7** - Autenticación y base de datos
- **Zustand 4.4** - Gestión de estado global

### UI y UX
- **React Router DOM 6.20** - Navegación
- **React Hot Toast 2.4** - Notificaciones
- **Lucide React 0.294** - Iconos
- **React Icons 4.12** - Más iconos

## 🎯 Características Destacadas

### 1. Hero Slider
Slider automático con 3 promociones:
- Bono de bienvenida
- Apuestas en vivo
- Torneos especiales

### 2. Sistema de Apuestas
- **Apuestas simples**: Cada selección independiente
- **Apuestas múltiples**: Combinar varias selecciones
- **Cálculo automático** de ganancias potenciales
- **Validación de balance** antes de apostar

### 3. Eventos en Vivo
- Indicador de "EN VIVO" animado
- Cuotas actualizadas
- Múltiples mercados por evento
- Filtros por deporte

### 4. Responsive Design
- **Móvil**: Menú hamburguesa, BetSlip modal
- **Tablet**: Layout optimizado
- **Desktop**: Sidebar fijo para BetSlip

## 🔐 Configuración de Firebase

Para usar las funcionalidades de autenticación, necesitas configurar Firebase:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (Email/Password)
3. Crea una base de datos Firestore
4. Copia tus credenciales en `src/config/firebase.ts`

## 🎮 Uso de la Aplicación

### Para Usuarios
1. **Registro/Login**: Clic en "Registrarse" en el header
2. **Explorar deportes**: Navega por las categorías disponibles
3. **Seleccionar apuestas**: Clic en las cuotas para agregar al boleto
4. **Realizar apuesta**: Ingresa el monto y confirma

### Para Desarrolladores
1. **Agregar nuevos deportes**: Edita `src/components/Home/SportsSection.tsx`
2. **Modificar colores**: Edita `tailwind.config.js`
3. **Agregar animaciones**: Usa componentes de Framer Motion
4. **Crear nuevas páginas**: Agrega en `src/pages/` y actualiza rutas en `App.tsx`

## 📱 Capturas de Pantalla

### Home
- Hero slider con promociones animadas
- Estadísticas de la plataforma
- Eventos en vivo con cuotas
- Sección de deportes disponibles
- Promociones exclusivas

### Características Visuales
- ✅ Animaciones suaves al hacer scroll
- ✅ Efectos hover en tarjetas
- ✅ Transiciones de página fluidas
- ✅ Loading states animados
- ✅ Notificaciones elegantes

## 🚀 Mejoras Futuras

- [ ] Integración con API de cuotas reales
- [ ] Transmisiones en vivo
- [ ] Chat en vivo
- [ ] Estadísticas avanzadas
- [ ] Modo oscuro/claro
- [ ] Múltiples idiomas
- [ ] App móvil nativa

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Soporte

Para soporte y preguntas:
- Email: soporte@wingosports.com
- Disponible 24/7

## 🎉 Créditos

Desarrollado con ❤️ usando las mejores tecnologías web modernas.

---

**⚠️ Aviso Legal**: Este es un proyecto de demostración. Las apuestas deportivas pueden ser adictivas. Juega con responsabilidad. +18 años.