'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { BookConfig } from '@/types';

interface Book3DProps {
  config: BookConfig;
}

export function Book3D({ config }: Book3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  const {
    coverTexture,
    spineTexture,
    coverType,
    spineWidth,
    pageEdgeColor,
    width,
    height,
  } = config;

  const coverThickness = coverType === 'hard' ? spineWidth * 0.15 : spineWidth * 0.05;
  const pageBlockWidth = width - coverThickness * 2;

  const coverMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.6,
      metalness: 0.1,
    });
  }, []);

  const spineMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x3a3a3a,
      roughness: 0.5,
      metalness: 0.1,
    });
  }, []);

  const pageMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(pageEdgeColor),
      roughness: 0.8,
      metalness: 0,
    });
  }, [pageEdgeColor]);

  const spineGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, spineWidth / 2, -Math.PI / 2, Math.PI / 2, false);
    return new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 4,
    });
  }, [spineWidth, height]);

  useMemo(() => {
    if (coverTexture && typeof coverTexture === 'string') {
      const loader = new THREE.TextureLoader();
      loader.load(coverTexture, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        coverMaterial.map = texture;
        coverMaterial.needsUpdate = true;
      });
    }
  }, [coverTexture, coverMaterial]);

  useMemo(() => {
    if (spineTexture && typeof spineTexture === 'string') {
      const loader = new THREE.TextureLoader();
      loader.load(spineTexture, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        spineMat.map = texture;
        spineMat.needsUpdate = true;
      });
    }
  }, [spineTexture, spineMat]);

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 6, 0]} position={[0, 0, 0]}>
      <group position={[0, height / 2 - 0.5, 0]}>
        <mesh geometry={spineGeo} material={spineMat} position={[-width / 2, 0, 0]} />

        <mesh position={[width / 2 - coverThickness / 2, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth + 0.05]} />
          <primitive object={coverMaterial} attach="material" />
        </mesh>

        <mesh position={[-width / 2 + coverThickness / 2, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth + 0.05]} />
          <primitive object={coverMaterial} attach="material" />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[pageBlockWidth - 0.02, height - 0.02, spineWidth - 0.02]} />
          <primitive object={pageMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
