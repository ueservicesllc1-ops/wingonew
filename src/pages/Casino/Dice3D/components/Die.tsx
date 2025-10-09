import { useRef, useEffect } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface DieProps {
  rollTrigger: number | null;
  startPosition?: [number, number, number];
  onResult?: (result: number) => void;
}

/**
 * 🎲 Componente del dado 3D con física REAL
 * 
 * El dado cae con física aleatoria y luego leemos qué cara quedó arriba.
 * NO se fuerza el resultado - es completamente natural.
 */
const Die = ({ rollTrigger, startPosition = [0, 3, 0], onResult }: DieProps) => {
  const rigidBodyRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const checkingResult = useRef(false);

  useEffect(() => {
    if (rollTrigger !== null && rigidBodyRef.current) {
      checkingResult.current = false;
      // Lanzar el dado con física ALEATORIA
      rollDice();
    }
  }, [rollTrigger]);

  const rollDice = () => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    // Reset posición con rotación completamente aleatoria
    rb.setTranslation({ x: startPosition[0], y: 6, z: startPosition[2] }, true);
    rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rb.setAngvel({ x: 0, y: 0, z: 0 }, true);

    // Aplicar impulso aleatorio fuerte
    const randomX = (Math.random() - 0.5) * 4;
    const randomZ = (Math.random() - 0.5) * 4;
    const randomRotX = (Math.random() - 0.5) * 25;
    const randomRotY = (Math.random() - 0.5) * 25;
    const randomRotZ = (Math.random() - 0.5) * 25;

    setTimeout(() => {
      rb.applyImpulse({ x: randomX, y: 1, z: randomZ }, true);
      rb.applyTorqueImpulse({ 
        x: randomRotX, 
        y: randomRotY, 
        z: randomRotZ 
      }, true);
    }, 50);

    // Después de 3 segundos, leer qué cara quedó arriba
    setTimeout(() => {
      readFinalResult();
    }, 3000);
  };

  const readFinalResult = () => {
    const rb = rigidBodyRef.current;
    
    if (!rb || checkingResult.current) return;
    checkingResult.current = true;

    // Detener el dado completamente
    rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rb.setAngvel({ x: 0, y: 0, z: 0 }, true);

    // LEER la rotación del rigidbody (quaternion de Rapier)
    const rotation = rb.rotation();
    
    console.log('🎲 Rotación rigidbody:', rotation);
    
    // Determinar qué cara está mirando hacia arriba
    const faceUp = getFaceFromQuaternion(rotation);
    
    console.log('🎲🎲 RESULTADO FINAL:', faceUp);
    
    // Notificar el resultado
    if (onResult) {
      onResult(faceUp);
    }
  };

  /**
   * Lee el quaternion del rigidbody y determina qué cara está arriba
   */
  const getFaceFromQuaternion = (quat: any): number => {
    // Convertir el quaternion de Rapier a THREE.Quaternion
    const threeQuat = new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w);
    
    // Vectores normales de cada cara en el espacio local del dado
    const faces = [
      { face: 1, normal: new THREE.Vector3(0, 1, 0) },    // Cara 1: +Y
      { face: 6, normal: new THREE.Vector3(0, -1, 0) },   // Cara 6: -Y
      { face: 2, normal: new THREE.Vector3(1, 0, 0) },    // Cara 2: +X
      { face: 5, normal: new THREE.Vector3(-1, 0, 0) },   // Cara 5: -X
      { face: 3, normal: new THREE.Vector3(0, 0, 1) },    // Cara 3: +Z
      { face: 4, normal: new THREE.Vector3(0, 0, -1) }    // Cara 4: -Z
    ];

    // Dirección "arriba" en el mundo
    const worldUp = new THREE.Vector3(0, 1, 0);

    // Ver qué normal del dado apunta más hacia arriba
    let maxDot = -1;
    let resultFace = 1;

    faces.forEach(({ face, normal }) => {
      // Rotar el vector normal al espacio mundial
      const worldNormal = normal.clone().applyQuaternion(threeQuat);
      
      // Producto punto con "arriba"
      const dot = worldNormal.dot(worldUp);
      
      console.log(`Cara ${face}: dot = ${dot.toFixed(3)}`);
      
      if (dot > maxDot) {
        maxDot = dot;
        resultFace = face;
      }
    });

    console.log(`🎯 Cara superior: ${resultFace} (dot: ${maxDot.toFixed(3)})`);
    return resultFace;
  };

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={startPosition}
      colliders={false}
      restitution={0.3}
      friction={0.9}
      mass={1}
      gravityScale={1}
    >
      <RoundedBox 
        ref={meshRef} 
        args={[1, 1, 1]} 
        radius={0.08}
        smoothness={4}
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial
          color="#dc2626"
          metalness={0.5}
          roughness={0.3}
          emissive="#991b1b"
          emissiveIntensity={0.3}
          transparent={true}
          opacity={0.8}
        />
      </RoundedBox>
      <CuboidCollider args={[0.5, 0.5, 0.5]} restitution={0.3} friction={0.9} />
      
      {/* Números en cada cara */}
      <DiceDots />
    </RigidBody>
  );
};

/**
 * 🔢 Puntos en las caras del dado (estándar 1-6)
 */
const DiceDots = () => {
  const dotRadius = 0.1;
  const offset = 0.51;
  const spacing = 0.22;

  return (
    <>
      {/* CARA 1 - 1 punto */}
      <mesh position={[0, offset, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* CARA 6 - 6 puntos */}
      <mesh position={[-spacing, -offset, -spacing]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-spacing, -offset, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-spacing, -offset, spacing]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[spacing, -offset, -spacing]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[spacing, -offset, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[spacing, -offset, spacing]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* CARA 2 - 2 puntos */}
      <mesh position={[offset, spacing, -spacing]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[offset, -spacing, spacing]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* CARA 5 - 5 puntos */}
      <mesh position={[-offset, spacing, -spacing]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-offset, spacing, spacing]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-offset, -spacing, -spacing]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-offset, -spacing, spacing]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-offset, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* CARA 3 - 3 puntos */}
      <mesh position={[-spacing, spacing, offset]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, offset]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[spacing, -spacing, offset]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* CARA 4 - 4 puntos */}
      <mesh position={[-spacing, spacing, -offset]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[spacing, spacing, -offset]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-spacing, -spacing, -offset]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[spacing, -spacing, -offset]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[dotRadius, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </>
  );
};

export default Die;
