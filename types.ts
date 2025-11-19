
export interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
}

export interface AnalysisResult {
  creatureName: string;
  description: string;
  colors: ColorInfo[];
}