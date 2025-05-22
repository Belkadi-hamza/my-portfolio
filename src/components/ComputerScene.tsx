import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function IcosahedronModel() {
  const modelRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.x += 0.002;
      modelRef.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={modelRef}>
      <icosahedronGeometry args={[2, 1]} />
      <meshStandardMaterial
        color="#4a5a8f"
        wireframe={true}
        emissive="#6366f1"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

export default function ComputerScene() {
  return (
    <div className="w-full h-[500px]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <IcosahedronModel />
      </Canvas>
    </div>
  );
}