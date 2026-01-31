'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ControlsPanel } from '@/components/ui/ControlsPanel';
import { BookConfig, LightingConfig } from '@/types';

const Scene = dynamic(() => import('@/components/canvas/Scene'), {
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
    shadowBlur: 2,
  });

  const handleConfigChange = useCallback((updates: Partial<BookConfig>) => {
    setBookConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleLightingChange = useCallback((updates: Partial<LightingConfig>) => {
    setLightingConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleExport = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `book-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  }, []);

  return (
    <main className="app-container">
      <div className="canvas-container">
        <Scene
          bookConfig={bookConfig}
          lightingConfig={lightingConfig}
        />
      </div>
      <ControlsPanel
        bookConfig={bookConfig}
        lightingConfig={lightingConfig}
        onBookConfigChange={handleConfigChange}
        onLightingChange={handleLightingChange}
        onExport={handleExport}
      />
    </main>
  );
}
