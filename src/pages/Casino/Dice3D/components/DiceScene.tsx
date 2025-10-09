import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Die from './Die';

interface DiceSceneProps {
  dice1RollTrigger: number | null;
  dice2RollTrigger: number | null;
  onDice1Result?: (result: number) => void;
  onDice2Result?: (result: number) => void;
}

/**
 * 🎨 Escena 3D principal de LA PINTA
 * 
 * Usa React Three Fiber + Rapier para física realista con 2 dados
 * Incluye iluminación profesional y postprocessing (bloom)
 */
const DiceScene = ({ dice1RollTrigger, dice2RollTrigger, onDice1Result, onDice2Result }: DiceSceneProps) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 5, 10], fov: 50 }}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        {/* Fondo decorativo */}
        <Background />
        
        {/* Física con Rapier */}
        <Physics gravity={[0, -30, 0]}>
          {/* Iluminación profesional */}
          <Lighting />
          
          {/* Mesa/Piso */}
          <Table />
          
          {/* Dado 1 (izquierda) */}
          <Die 
            rollTrigger={dice1RollTrigger}
            startPosition={[-2, 5, 0]}
            onResult={onDice1Result}
          />
          
          {/* Dado 2 (derecha) */}
          <Die 
            rollTrigger={dice2RollTrigger}
            startPosition={[2, 5, 0]}
            onResult={onDice2Result}
          />
        </Physics>

        {/* Controles de cámara */}
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
        />

        {/* Ambiente */}
        <Environment preset="night" />

        {/* Post-processing */}
        <EffectComposer>
          <Bloom 
            intensity={0.3} 
            luminanceThreshold={0.4} 
            luminanceSmoothing={0.9} 
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};

/**
 * 🌌 Ambiente completo de casino - paredes decorativas
 */
const Background = () => {
  return (
    <>
      {/* Pared TRASERA */}
      <mesh position={[0, 5, -12]} rotation={[0, 0, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial 
          color="#1a0f2e"
          emissive="#2d1b4e"
          emissiveIntensity={0.4}
          roughness={0.8}
        />
      </mesh>

      {/* Pared IZQUIERDA */}
      <mesh position={[-15, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial 
          color="#1a0f2e"
          emissive="#2d1b4e"
          emissiveIntensity={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* Pared DERECHA */}
      <mesh position={[15, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial 
          color="#1a0f2e"
          emissive="#2d1b4e"
          emissiveIntensity={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* Techo decorativo */}
      <mesh position={[0, 12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          color="#0a0514"
          emissive="#1a0f2e"
          emissiveIntensity={0.2}
          roughness={0.9}
        />
      </mesh>

      {/* Luces decorativas en el techo (estrellas) */}
      {[-8, -4, 0, 4, 8].map((x) =>
        [-8, -4, 0, 4, 8].map((z) => (
          <mesh key={`ceiling-star-${x}-${z}`} position={[x, 11.8, z]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 5]} />
            <meshStandardMaterial 
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={1.5}
            />
          </mesh>
        ))
      )}
    </>
  );
};

/**
 * 💡 Sistema de iluminación multi-punto para resaltar el dado
 */
const Lighting = () => {
  return (
    <>
      {/* Luz ambiental suave */}
      <ambientLight intensity={0.4} />
      
      {/* Luz principal con sombras */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Luces de relleno coloridas */}
      <pointLight position={[-5, 5, -5]} intensity={0.6} color="#9333ea" />
      <pointLight position={[5, 5, -5]} intensity={0.6} color="#06b6d4" />
      <pointLight position={[0, 3, -8]} intensity={0.4} color="#fbbf24" />
      
      {/* Luz cenital para el dado */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
        color="#ffffff"
      />
    </>
  );
};

/**
 * 🎲 Mesa de casino con diseño "LA PINTA"
 */
const Table = () => {
  return (
    <>
      {/* Fondo base - Verde casino clásico */}
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial 
          color="#0f5132"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Área de juego central - Más oscura */}
      <mesh receiveShadow position={[0, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial 
          color="#0a3d29"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Marco dorado brillante */}
      <mesh position={[0, -0.48, 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 0.1]} />
        <meshStandardMaterial 
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[0, -0.48, -4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 0.1]} />
        <meshStandardMaterial 
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[5, -0.48, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[8, 0.1]} />
        <meshStandardMaterial 
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[-5, -0.48, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[8, 0.1]} />
        <meshStandardMaterial 
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Texto "LA PINTA" en 3D en el centro */}
      <Text
        position={[0, -0.4, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.2}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        LA PINTA
      </Text>

      {/* Dados decorativos en las esquinas */}
      {[
        [-4, 3], [4, 3], [-4, -3], [4, -3]
      ].map(([x, z], i) => (
        <Text
          key={`dice-icon-${i}`}
          position={[x, -0.45, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.5}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          🎲
        </Text>
      ))}
      
      {/* Piso físico (caja invisible sólida) */}
      <RigidBody type="fixed" position={[0, -0.6, 0]} colliders={false}>
        <CuboidCollider args={[10, 0.1, 10]} />
      </RigidBody>
      
      {/* Paredes invisibles para evitar que el dado se caiga */}
      <RigidBody type="fixed" position={[8, 3, 0]} colliders={false}>
        <CuboidCollider args={[0.5, 5, 8]} />
      </RigidBody>
      <RigidBody type="fixed" position={[-8, 3, 0]} colliders={false}>
        <CuboidCollider args={[0.5, 5, 8]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 3, 8]} colliders={false}>
        <CuboidCollider args={[8, 5, 0.5]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 3, -8]} colliders={false}>
        <CuboidCollider args={[8, 5, 0.5]} />
      </RigidBody>
    </>
  );
};

export default DiceScene;

