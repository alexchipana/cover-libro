import { useRef, useMemo, useEffect } from 'react';
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

  const spineRadius = spineWidth * 0.25;
  const coverThickness = coverType === 'hard' ? spineWidth * 0.12 : spineWidth * 0.04;
  const pageBlockWidth = width - (spineRadius * 2) - (coverThickness * 2);

  const coverMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      roughness: 0.4,
      metalness: 0.1,
    });
    return material;
  }, []);

  const spineMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: 0x3a3a3a,
      roughness: 0.5,
      metalness: 0.1,
    });
    return material;
  }, []);

  const pageMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(pageEdgeColor),
      roughness: 0.9,
      metalness: 0,
    });
  }, [pageEdgeColor]);

  const spineGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, spineRadius, -Math.PI / 2, Math.PI / 2, false);
    const extrudeSettings = {
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 3,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [spineRadius, height]);

  useEffect(() => {
    if (coverTexture) {
      const loader = new THREE.TextureLoader();
      loader.load(coverTexture, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        coverMaterial.map = texture;
        coverMaterial.needsUpdate = true;
      });
    } else {
      coverMaterial.map = null;
      coverMaterial.needsUpdate = true;
    }
  }, [coverTexture, coverMaterial]);

  useEffect(() => {
    if (spineTexture) {
      const loader = new THREE.TextureLoader();
      loader.load(spineTexture, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        spineMaterial.map = texture;
        spineMaterial.needsUpdate = true;
      });
    } else {
      spineMaterial.map = null;
      spineMaterial.needsUpdate = true;
    }
  }, [spineTexture, spineMaterial]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.PI / 2;
    }
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group position={[0, 0, 0]}>
        <mesh
          geometry={spineGeometry}
          material={spineMaterial}
          position={[-width / 2 - coverThickness, 0, 0]}
        />

        <mesh
          position={[
            width / 2 - coverThickness / 2,
            0,
            0,
          ]}
        >
          <boxGeometry args={[coverThickness, height, spineWidth * 1.02]} />
          <meshStandardMaterial attach="material-0" color={0x4a4a4a} roughness={0.4} metalness={0.1} />
        </mesh>

        <mesh
          position={[
            -width / 2 + coverThickness / 2,
            0,
            0,
          ]}
        >
          <boxGeometry args={[coverThickness, height, spineWidth * 1.02]} />
          <meshStandardMaterial attach="material-0" color={0x4a4a4a} roughness={0.4} metalness={0.1} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[pageBlockWidth, height - 0.02, spineWidth - coverThickness * 2]} />
          <meshStandardMaterial attach="material-0" color={pageEdgeColor} roughness={0.9} metalness={0} />
        </mesh>

        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              -pageBlockWidth / 2 + (i * (pageBlockWidth / 12)) + pageBlockWidth / 24,
              0,
              0,
            ]}
          >
            <boxGeometry args={[0.01, height - 0.04, spineWidth - coverThickness * 2 - 0.02]} />
            <meshStandardMaterial
              color={pageEdgeColor}
              roughness={0.95}
              opacity={0.3}
              transparent
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
