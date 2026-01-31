'use client';

import { useRef, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react';
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
    const renderCount = useRef(0);

    useEffect(() => {
      renderCount.current += 1;
    }, [bookConfig, lightingConfig]);

    const captureScreenshot = useCallback(() => {
      requestAnimationFrame(() => {
        gl.render(scene, camera);
        
        setTimeout(() => {
          try {
            const dataUrl = gl.domElement.toDataURL('image/png', 1.0);
            
            const link = document.createElement('a');
            link.download = `book-mockup-${Date.now()}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (err) {
            console.error('Export error:', err);
          }
        }, 100);
      });
    }, [gl, scene, camera]);

    useImperativeHandle(ref, () => ({
      captureScreenshot,
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
      gl={{ 
        preserveDrawingBuffer: true, 
        antialias: true,
        alpha: false,
      }}
      style={{ background: '#ffffff' }}
      dpr={2}
      onCreated={({ gl }) => {
        gl.setClearColor('#ffffff', 1);
      }}
    >
      <color attach="background" args={['#ffffff']} />
      <SceneContent {...props} ref={ref} />
    </Canvas>
  );
});

Scene.displayName = 'Scene';

export default Scene;
