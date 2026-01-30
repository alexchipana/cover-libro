import * as THREE from 'three';

interface LightsProps {
  shadowsEnabled: boolean;
  lightIntensity: number;
  lightingType: 'soft' | 'studio';
}

export function Lights({ shadowsEnabled, lightIntensity, lightingType }: LightsProps) {
  const shadowMapSize = shadowsEnabled ? 2048 : 0;

  if (lightingType === 'studio') {
    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={lightIntensity}
          castShadow={shadowsEnabled}
          shadow-mapSize-width={shadowMapSize}
          shadow-mapSize-height={shadowMapSize}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight
          position={[-5, 3, -5]}
          intensity={lightIntensity * 0.3}
        />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[3, 6, 3]}
        intensity={lightIntensity}
        castShadow={shadowsEnabled}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight
        position={[-3, 3, -3]}
        intensity={lightIntensity * 0.3}
      />
    </>
  );
}
