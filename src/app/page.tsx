'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ControlsPanel } from '@/components/ui/ControlsPanel';
import { useScreenshot } from '@/hooks/useScreenshot';
import { BookConfig, LightingConfig } from '@/types';

const Scene = dynamic(() => import('@/components/canvas/Scene').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  ),
});

export default function Home() {
  const [bookConfig, setBookConfig] = useState<BookConfig>({
    coverTexture: null,
    spineTexture: null,
    coverType: 'hard',
    spineWidth: 0.5,
    pageEdgeColor: '#f5f5dc',
    width: 2,
    height: 3,
  });

  const [lightingConfig, setLightingConfig] = useState<LightingConfig>({
    shadowsEnabled: true,
    lightIntensity: 1,
    lightingType: 'studio',
  });

  const sceneRef = useRef<{ captureScreenshot: () => void }>(null);

  const handleScreenshot = useCallback(() => {
    if (sceneRef.current) {
      sceneRef.current.captureScreenshot();
    }
  }, []);

  const handleConfigChange = useCallback((updates: Partial<BookConfig>) => {
    setBookConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleLightingChange = useCallback((updates: Partial<LightingConfig>) => {
    setLightingConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <main className="app-container">
      <div className="canvas-container">
        <Scene
          ref={sceneRef}
          bookConfig={bookConfig}
          lightingConfig={lightingConfig}
        />
      </div>
      <ControlsPanel
        bookConfig={bookConfig}
        lightingConfig={lightingConfig}
        onBookConfigChange={handleConfigChange}
        onLightingChange={handleLightingChange}
        onExport={handleScreenshot}
      />
    </main>
  );
}
