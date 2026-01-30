'use client';

import { useRef, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Book3D } from './Book3D';
import { Lights } from './Lights';
import { BookConfig, LightingConfig } from '@/types';

interface SceneProps {
  bookConfig: BookConfig;
  lightingConfig: LightingConfig;
}

interface SceneRef {
  captureScreenshot: () => void;
}

const SceneContent = forwardRef<SceneRef, SceneProps>(
  ({ bookConfig, lightingConfig }, ref) => {
    const { gl, scene, camera } = useThree();
    const controlsRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      captureScreenshot: () => {
        const renderer = gl as THREE.WebGLRenderer;
        
        renderer.render(scene, camera);
        
        const dataUrl = renderer.domElement.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `book-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    }));

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
          ref={controlsRef}
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
);

SceneContent.displayName = 'SceneContent';

const Scene = forwardRef<SceneRef, SceneProps>((props, ref) => {
  return (
    <Canvas
      camera={{ position: [3, 2, 5], fov: 45 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      style={{ background: '#ffffff' }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#ffffff']} />
      <SceneContent {...props} ref={ref} />
    </Canvas>
  );
});

Scene.displayName = 'Scene';

export default Scene;
