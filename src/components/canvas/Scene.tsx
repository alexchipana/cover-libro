'use client';

import { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { Book3D } from './Book3D';
import { Lights } from './Lights';
import { BookConfig, LightingConfig } from '@/types';

interface SceneProps {
  bookConfig: BookConfig;
  lightingConfig: LightingConfig;
}

function SceneContent({ bookConfig, lightingConfig }: SceneProps) {
  const { gl, scene, camera } = useThree();

  return (
    <>
      <Lights
        shadowsEnabled={lightingConfig.shadowsEnabled}
        lightIntensity={lightingConfig.lightIntensity}
        lightingType={lightingConfig.lightingType}
      />

      <Book3D config={bookConfig} />

      {lightingConfig.shadowsEnabled && (
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.4}
          scale={10}
          blur={lightingConfig.shadowBlur}
          far={3}
        />
      )}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
        target={[0, 1, 0]}
      />
    </>
  );
}

export default function Scene({ bookConfig, lightingConfig }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [3, 2, 5], fov: 45 }}
      gl={{ 
        preserveDrawingBuffer: true, 
        antialias: true,
        alpha: false,
      }}
      style={{ background: '#ffffff' }}
      dpr={2}
    >
      <color attach="background" args={['#ffffff']} />
      <SceneContent bookConfig={bookConfig} lightingConfig={lightingConfig} />
    </Canvas>
  );
}
