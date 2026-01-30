import { useState, useCallback } from 'react';
import * as THREE from 'three';

export function useBookTexture() {
  const [coverTexture, setCoverTexture] = useState<THREE.Texture | null>(null);
  const [spineTexture, setSpineTexture] = useState<THREE.Texture | null>(null);

  const loadTexture = useCallback((file: File): Promise<THREE.Texture> => {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      const url = URL.createObjectURL(file);

      loader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          resolve(texture);
        },
        undefined,
        (error) => {
          URL.revokeObjectURL(url);
          reject(error);
        }
      );
    });
  }, []);

  const setCover = useCallback(async (file: File | null) => {
    if (!file) {
      setCoverTexture(null);
      return;
    }
    const texture = await loadTexture(file);
    setCoverTexture(texture);
  }, [loadTexture]);

  const setSpine = useCallback(async (file: File | null) => {
    if (!file) {
      setSpineTexture(null);
      return;
    }
    const texture = await loadTexture(file);
    setSpineTexture(texture);
  }, [loadTexture]);

  return {
    coverTexture,
    spineTexture,
    setCover,
    setSpine,
  };
}
