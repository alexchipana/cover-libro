'use client';

import { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { ExportButton } from './ExportButton';
import { BookConfig, LightingConfig } from '@/types';

interface ControlsPanelProps {
  bookConfig: BookConfig;
  lightingConfig: LightingConfig;
  onBookConfigChange: (updates: Partial<BookConfig>) => void;
  onLightingChange: (updates: Partial<LightingConfig>) => void;
  onExport: () => void;
}

export function ControlsPanel({
  bookConfig,
  lightingConfig,
  onBookConfigChange,
  onLightingChange,
  onExport,
}: ControlsPanelProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [spinePreview, setSpinePreview] = useState<string | null>(null);

  const handleCoverSelect = useCallback(
    (file: File | null) => {
      if (file) {
        const url = URL.createObjectURL(file);
        setCoverPreview(url);
        onBookConfigChange({ coverTexture: url });
      } else {
        setCoverPreview(null);
        onBookConfigChange({ coverTexture: null });
      }
    },
    [onBookConfigChange]
  );

  const handleSpineSelect = useCallback(
    (file: File | null) => {
      if (file) {
        const url = URL.createObjectURL(file);
        setSpinePreview(url);
        onBookConfigChange({ spineTexture: url });
      } else {
        setSpinePreview(null);
        onBookConfigChange({ spineTexture: null });
      }
    },
    [onBookConfigChange]
  );

  const handleCoverTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onBookConfigChange({ coverType: e.target.value as 'hard' | 'soft' });
    },
    [onBookConfigChange]
  );

  const handleSpineWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onBookConfigChange({ spineWidth: parseFloat(e.target.value) });
    },
    [onBookConfigChange]
  );

  const handlePageEdgeColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onBookConfigChange({ pageEdgeColor: e.target.value });
    },
    [onBookConfigChange]
  );

  const handleShadowsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onLightingChange({ shadowsEnabled: e.target.checked });
    },
    [onLightingChange]
  );

  const handleLightIntensityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onLightingChange({ lightIntensity: parseFloat(e.target.value) });
    },
    [onLightingChange]
  );

  const handleLightingTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onLightingChange({ lightingType: e.target.value as 'soft' | 'studio' });
    },
    [onLightingChange]
  );

  const handleShadowBlurChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onLightingChange({ shadowBlur: parseFloat(e.target.value) });
    },
    [onLightingChange]
  );

  return (
    <aside className="controls-panel">
      <div className="panel-section">
        <h3>Imágenes</h3>
        <div className="control-group">
          <ImageUploader
            label="Subir tapa frontal"
            onImageSelect={handleCoverSelect}
            preview={coverPreview}
          />
        </div>
        <div className="control-group">
          <ImageUploader
            label="Subir imagen del lomo"
            onImageSelect={handleSpineSelect}
            preview={spinePreview}
          />
        </div>
      </div>

      <div className="panel-section">
        <h3>Tipo de Tapa</h3>
        <div className="control-group">
          <select
            className="select-input"
            value={bookConfig.coverType}
            onChange={handleCoverTypeChange}
          >
            <option value="hard">Tapa Dura</option>
            <option value="soft">Tapa Blanda</option>
          </select>
        </div>
      </div>

      <div className="panel-section">
        <h3>Grosor del Lomo</h3>
        <div className="slider-container">
          <div className="slider-header">
            <label>Ancho: {bookConfig.spineWidth.toFixed(2)}</label>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={bookConfig.spineWidth}
            onChange={handleSpineWidthChange}
          />
        </div>
      </div>

      <div className="panel-section">
        <h3>Color del Canto</h3>
        <div className="control-group">
          <input
            type="color"
            className="color-input"
            value={bookConfig.pageEdgeColor}
            onChange={handlePageEdgeColorChange}
          />
        </div>
      </div>

      <div className="panel-section">
        <h3>Iluminación</h3>
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={lightingConfig.shadowsEnabled}
              onChange={handleShadowsChange}
            />
            Sombras activadas
          </label>
        </div>
        <div className="control-group">
          <label>Difuminado de sombra: {lightingConfig.shadowBlur.toFixed(1)}</label>
          <input
            type="range"
            min="0.5"
            max="4"
            step="0.1"
            value={lightingConfig.shadowBlur}
            onChange={handleShadowBlurChange}
          />
        </div>
        <div className="control-group">
          <label>Intensidad de luz</label>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={lightingConfig.lightIntensity}
            onChange={handleLightIntensityChange}
          />
        </div>
        <div className="control-group">
          <label>Tipo de iluminación</label>
          <select
            className="select-input"
            value={lightingConfig.lightingType}
            onChange={handleLightingTypeChange}
          >
            <option value="soft">Suave</option>
            <option value="studio">Estudio</option>
          </select>
        </div>
      </div>

      <div className="panel-section">
        <ExportButton onExport={onExport} />
      </div>
    </aside>
  );
}
