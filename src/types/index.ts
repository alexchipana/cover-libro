export interface BookConfig {
  coverTexture: string | null;
  spineTexture: string | null;
  coverType: 'hard' | 'soft';
  spineWidth: number;
  pageEdgeColor: string;
  width: number;
  height: number;
}

export interface LightingConfig {
  shadowsEnabled: boolean;
  lightIntensity: number;
  lightingType: 'soft' | 'studio';
  shadowBlur: number;
}
