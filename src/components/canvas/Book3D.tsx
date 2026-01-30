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
  const coverThickness = isHardcover ? 0.08 : 0.03;
  const pageBlockWidth = width - coverThickness * 2 - spineWidth;

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -Math.PI / 4;
    }
  }, []);

  const spineMaterial = new THREE.MeshStandardMaterial({
    color: spineTexture ? 0xffffff : 0x333333,
    roughness: 0.5,
    metalness: 0.1,
  });

  const coverMaterial = new THREE.MeshStandardMaterial({
    color: coverTexture ? 0xffffff : 0x222222,
    roughness: 0.6,
    metalness: 0.1,
  });

  const pageMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(pageEdgeColor),
    roughness: 0.8,
    metalness: 0,
  });

  useEffect(() => {
    if (coverTexture) {
      const loader = new THREE.TextureLoader();
      loader.load(coverTexture, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        coverMaterial.map = texture;
        coverMaterial.color = new THREE.Color(0xffffff);
        coverMaterial.needsUpdate = true;
      });
    } else {
      coverMaterial.map = null;
      coverMaterial.color = new THREE.Color(0x222222);
      coverMaterial.needsUpdate = true;
    }
  }, [coverTexture, coverMaterial]);

  useEffect(() => {
    if (spineTexture) {
      const loader = new THREE.TextureLoader();
      loader.load(spineTexture, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        spineMaterial.map = texture;
        spineMaterial.color = new THREE.Color(0xffffff);
        spineMaterial.needsUpdate = true;
      });
    } else {
      spineMaterial.map = null;
      spineMaterial.color = new THREE.Color(0x333333);
      spineMaterial.needsUpdate = true;
    }
  }, [spineTexture, spineMaterial]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group position={[0, height / 2 - 0.5, 0]}>
        <mesh position={[-width / 2 + coverThickness + spineWidth / 2, 0, 0]}>
          <boxGeometry args={[spineWidth, height, coverThickness]} />
          <primitive object={spineMaterial} attach="material" />
        </mesh>

        <mesh position={[width / 2 - coverThickness / 2, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth + 0.01]} />
          <primitive object={coverMaterial} attach="material" />
        </mesh>

        <mesh position={[-width / 2 + coverThickness / 2, 0, 0]}>
          <boxGeometry args={[coverThickness, height, spineWidth + 0.01]} />
          <primitive object={coverMaterial} attach="material" />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[pageBlockWidth - 0.02, height - 0.02, spineWidth - 0.02]} />
          <primitive object={pageMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
