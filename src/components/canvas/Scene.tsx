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
        const renderer = gl as unknown as THREE.WebGLRenderer;
        const originalSize = new THREE.Vector2();
        renderer.getSize(originalSize);

        const scale = 2;
        renderer.setSize(originalSize.x * scale, originalSize.y * scale, false);

        if (controlsRef.current) {
          controlsRef.current.update();
        }

        renderer.render(scene, camera);

        const dataUrl = renderer.domElement.toDataURL('image/png', 1.0);
        renderer.setSize(originalSize.x, originalSize.y);

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `book-mockup-${Date.now()}.png`;
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
            position={[0, -1, 0]}
            opacity={0.4}
            scale={8}
            blur={2}
            far={3}
          />
        )}

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={10}
          target={[0, 0.5, 0]}
        />
      </>
    );
  }
);

SceneContent.displayName = 'SceneContent';

const Scene = forwardRef<SceneRef, SceneProps>((props, ref) => {
  return (
    <Canvas
      camera={{ position: [3, 2, 4], fov: 45 }}
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
      }}
      style={{ background: '#1a1a1a' }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#1a1a1a']} />
      <SceneContent {...props} ref={ref} />
    </Canvas>
  );
});

Scene.displayName = 'Scene';

export default Scene;
