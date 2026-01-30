'use client';

import * as THREE from 'three';
import { BookConfig } from '@/types';

interface Book3DProps {
  config: BookConfig;
}

export function Book3D({ config }: Book3DProps) {
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

  const coverColor = coverTexture ? '#ffffff' : (isHardcover ? '#2a2a2a' : '#3a3a3a');
  const spineColor = spineTexture ? '#ffffff' : '#333333';

  const coverMaterial = new THREE.MeshStandardMaterial({
    color: coverColor,
    map: coverTexture ? new THREE.TextureLoader().load(coverTexture) : null,
    roughness: 0.5,
    metalness: 0.1,
  });

  const spineMaterial = new THREE.MeshStandardMaterial({
    color: spineColor,
    map: spineTexture ? new THREE.TextureLoader().load(spineTexture) : null,
    roughness: 0.5,
    metalness: 0.1,
  });

  const pageMaterial = new THREE.MeshStandardMaterial({
    color: pageEdgeColor,
    roughness: 0.9,
  });

  return (
    <group rotation={[0, -Math.PI / 5, 0]}>
      <group position={[0, height / 2, 0]}>
        <mesh position={[-pageBlockWidth / 2 - coverThickness / 2, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth + 0.01]} />
          <primitive object={coverMaterial} attach="material" />
        </mesh>

        <mesh position={[pageBlockWidth / 2 + coverThickness / 2, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth + 0.01]} />
          <primitive object={coverMaterial} attach="material" />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[pageBlockWidth, height - 0.01, spineWidth - 0.02]} />
          <primitive object={pageMaterial} attach="material" />
        </mesh>

        <mesh position={[0, 0, -spineWidth / 2 - 0.005]}>
          <boxGeometry args={[pageBlockWidth, height - 0.01, 0.01]} />
          <primitive object={spineMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
