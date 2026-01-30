'use client';

import { useRef, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
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
    const groupRef = useRef<THREE.Group>(null);

    useImperativeHandle(ref, () => ({
      captureScreenshot: () => {
        const renderer = gl as unknown as THREE.WebGLRenderer;
        const originalSize = new THREE.Vector2();
        renderer.getSize(originalSize);

        const scale = 2;
        const newWidth = originalSize.x * scale;
        const newHeight = originalSize.y * scale;

        renderer.setSize(newWidth, newHeight, false);
        renderer.setPixelRatio(window.devicePixelRatio * scale);

        if (controlsRef.current) {
          controlsRef.current.update();
        }

        renderer.render(scene, camera);

        const dataUrl = renderer.domElement.toDataURL('image/png', 1.0);

        renderer.setSize(originalSize.x, originalSize.y);
        renderer.setPixelRatio(window.devicePixelRatio);

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `book-mockup-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(dataUrl);
      },
    }));

    useFrame((state, delta) => {
      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.05;
      }
    });

    return (
      <>
        <Lights
          shadowsEnabled={lightingConfig.shadowsEnabled}
          lightIntensity={lightingConfig.lightIntensity}
          lightingType={lightingConfig.lightingType}
        />

        <group ref={groupRef} position={[0, 0, 0]}>
          <Book3D config={bookConfig} />
        </group>

        {lightingConfig.shadowsEnabled && (
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
            resolution={256}
            color="#000000"
          />
        )}

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
          target={[0, 0, 0]}
        />
      </>
    );
  }
);

SceneContent.displayName = 'SceneContent';

const Scene = forwardRef<SceneRef, SceneProps>((props, ref) => {
  return (
    <Canvas
      camera={{ position: [4, 3, 4], fov: 45 }}
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ background: 'transparent' }}
      shadows={props.lightingConfig.shadowsEnabled}
      dpr={[1, 2]}
    >
      <SceneContent {...props} ref={ref} />
    </Canvas>
  );
});

Scene.displayName = 'Scene';

export default Scene;
