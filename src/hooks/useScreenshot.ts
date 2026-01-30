import { useCallback } from 'react';
import * as THREE from 'three';

export function useScreenshot() {
  const captureScreenshot = useCallback((
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    filename: string = 'book-mockup.png'
  ) => {
    const originalSize = new THREE.Vector2();
    renderer.getSize(originalSize);

    const scale = 2;
    const newWidth = originalSize.x * scale;
    const newHeight = originalSize.y * scale;

    renderer.setSize(newWidth, newHeight, false);
    renderer.setPixelRatio(window.devicePixelRatio * scale);
    renderer.render(scene, camera);

    const dataUrl = renderer.domElement.toDataURL('image/png', 1.0);

    renderer.setSize(originalSize.x, originalSize.y);
    renderer.setPixelRatio(window.devicePixelRatio);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(dataUrl);
  }, []);

  return { captureScreenshot };
}
