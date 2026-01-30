'use client';

import { useEffect } from 'react';
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
  const bookOffset = index * 0.08;

  const coverMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.1 });
  const spineMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.5, metalness: 0.1 });
  const pageMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(pageEdgeColor), roughness: 0.9 });

  useEffect(() => {
    if (coverTexture && typeof coverTexture === 'string') {
      new THREE.TextureLoader().load(coverTexture, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        coverMat.map = tex;
        coverMat.needsUpdate = true;
      });
    } else if (index > 0) {
      coverMat.color = new THREE.Color(isHardcover ? 0x2a2a2a : 0x3a3a3a);
    }
  }, [coverTexture, isHardcover, index]);

  useEffect(() => {
    if (spineTexture && typeof spineTexture === 'string') {
      new THREE.TextureLoader().load(spineTexture, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        spineMat.map = tex;
        spineMat.needsUpdate = true;
      });
    } else if (index > 0) {
      spineMat.color = new THREE.Color(0x3a3a3a);
    }
  }, [spineTexture, index]);

  return (
    <group position={[0, bookOffset, 0]} rotation={[0, -Math.PI / 6 + index * 0.05, 0]}>
      <group position={[0, height / 2, 0]}>
        <mesh position={[-pageBlockWidth / 2 - coverThickness / 2, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth + 0.01]} />
          <primitive object={coverMat} attach="material" />
        </mesh>

        <mesh position={[pageBlockWidth / 2 + coverThickness / 2, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth + 0.01]} />
          <primitive object={coverMat} attach="material" />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[pageBlockWidth, height - 0.01, spineWidth - 0.02]} />
          <primitive object={pageMat} attach="material" />
        </mesh>

        <mesh position={[0, 0, -spineWidth / 2 - 0.005]}>
          <boxGeometry args={[pageBlockWidth, height - 0.01, 0.01]} />
          <primitive object={spineMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
