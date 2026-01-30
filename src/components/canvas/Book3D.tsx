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
  const coverThickness = isHardcover ? 0.06 : 0.02;
  const pageBlockWidth = width - (coverThickness * 2);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -Math.PI / 5;
    }
  }, []);

  const materials = {
    spine: new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.1 }),
    cover: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6, metalness: 0.1 }),
    pages: new THREE.MeshStandardMaterial({ color: new THREE.Color(pageEdgeColor), roughness: 0.9 }),
  };

  useEffect(() => {
    if (coverTexture && typeof coverTexture === 'string') {
      new THREE.TextureLoader().load(coverTexture, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        materials.cover.map = tex;
        materials.cover.color = new THREE.Color(0xffffff);
        materials.cover.needsUpdate = true;
      });
    } else {
      materials.cover.map = null;
      materials.cover.color = new THREE.Color(isHardcover ? 0x1a1a1a : 0x2a2a2a);
      materials.cover.needsUpdate = true;
    }
  }, [coverTexture, isHardcover]);

  useEffect(() => {
    if (spineTexture && typeof spineTexture === 'string') {
      new THREE.TextureLoader().load(spineTexture, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        materials.spine.map = tex;
        materials.spine.color = new THREE.Color(0xffffff);
        materials.spine.needsUpdate = true;
      });
    } else {
      materials.spine.map = null;
      materials.spine.color = new THREE.Color(0x2a2a2a);
      materials.spine.needsUpdate = true;
    }
  }, [spineTexture]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group position={[0, height / 2 - 0.5, 0]}>
        <mesh position={[-pageBlockWidth / 2 - coverThickness, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth]} />
          <primitive object={materials.cover} attach="material" />
        </mesh>

        <mesh position={[pageBlockWidth / 2 + coverThickness, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth]} />
          <primitive object={materials.cover} attach="material" />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[pageBlockWidth, height - 0.02, spineWidth - 0.01]} />
          <primitive object={materials.pages} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
