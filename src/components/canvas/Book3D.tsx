'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { BookConfig } from '@/types';

interface Book3DProps {
  config: BookConfig;
  index?: number;
}

export function Book3D({ config, index = 0 }: Book3DProps) {
  const {
    coverTexture,
    spineTexture,
    coverType,
    spineWidth,
    pageEdgeColor,
    width,
    height,
  } = config;

  const isHardcover = coverType === 'hard';
  const coverThickness = isHardcover ? 0.05 : 0.02;
  const pageBlockWidth = width - coverThickness * 2;
  const bookOffset = index * 0.05;

  const coverMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
  }, []);

  const spineMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
  }, []);

  const pageMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(pageEdgeColor),
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
  }, [pageEdgeColor]);

  useEffect(() => {
    if (!coverTexture) return;
    
    const loader = new THREE.TextureLoader();
    loader.load(coverTexture, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.repeat.set(1, 1);
      tex.center.set(0.5, 0.5);
      coverMat.map = tex;
      coverMat.color = new THREE.Color(0xffffff);
      coverMat.needsUpdate = true;
    });
  }, [coverTexture, coverMat]);

  useEffect(() => {
    if (!spineTexture) return;
    
    const loader = new THREE.TextureLoader();
    loader.load(spineTexture, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.repeat.set(1, 1);
      tex.center.set(0.5, 0.5);
      spineMat.map = tex;
      spineMat.color = new THREE.Color(0xffffff);
      spineMat.needsUpdate = true;
    });
  }, [spineTexture, spineMat]);

  return (
    <group position={[0, bookOffset, 0]} rotation={[0, -Math.PI / 6 + index * 0.03, 0]}>
      <group position={[0, height / 2, 0]}>
        <mesh position={[-pageBlockWidth / 2 - coverThickness / 2, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth + 0.01]} />
          <meshStandardMaterial attach="material" {...coverMat} />
        </mesh>

        <mesh position={[pageBlockWidth / 2 + coverThickness / 2, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth + 0.01]} />
          <meshStandardMaterial attach="material" {...coverMat} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[pageBlockWidth, height - 0.01, spineWidth - 0.02]} />
          <meshStandardMaterial attach="material" {...pageMat} />
        </mesh>

        <mesh position={[0, 0, -spineWidth / 2 - 0.005]}>
          <boxGeometry args={[pageBlockWidth, height - 0.01, 0.01]} />
          <meshStandardMaterial attach="material" {...spineMat} />
        </mesh>
      </group>
    </group>
  );
}
