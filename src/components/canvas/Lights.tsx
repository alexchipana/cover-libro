import * as THREE from 'three';

interface LightsProps {
  shadowsEnabled: boolean;
  lightIntensity: number;
  lightingType: 'soft' | 'studio';
}

export function Lights({ shadowsEnabled, lightIntensity, lightingType }: LightsProps) {
  const shadowMapSize = shadowsEnabled ? 1024 : 0;

  if (lightingType === 'studio') {
    return (
      <>
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={lightIntensity}
          castShadow={shadowsEnabled}
          shadow-mapSize-width={shadowMapSize}
          shadow-mapSize-height={shadowMapSize}
        />
        <directionalLight
          position={[-5, 3, -5]}
          intensity={lightIntensity * 0.4}
        />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[3, 6, 3]}
        intensity={lightIntensity}
        castShadow={shadowsEnabled}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
      />
      <directionalLight
        position={[-3, 4, -3]}
        intensity={lightIntensity * 0.3}
      />
    </>
  );
}
