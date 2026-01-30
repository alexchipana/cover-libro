'use client';

import { useRef, useEffect } from 'react';
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

  const isHardcover = coverType === 'hard';
  const coverThickness = isHardcover ? 0.05 : 0.02;
  const pageBlockWidth = width - coverThickness * 2;

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -Math.PI / 6;
    }
  }, []);

  const coverMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.1 });
  const spineMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.5, metalness: 0.1 });
  const pageMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(pageEdgeColor), roughness: 0.9 });

  useEffect(() => {
    if (coverTexture) {
      new THREE.TextureLoader().load(coverTexture, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        coverMat.map = tex;
        coverMat.needsUpdate = true;
      });
    }
  }, [coverTexture]);

  useEffect(() => {
    if (spineTexture) {
      new THREE.TextureLoader().load(spineTexture, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        spineMat.map = tex;
        spineMat.needsUpdate = true;
      });
    }
  }, [spineTexture]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
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
