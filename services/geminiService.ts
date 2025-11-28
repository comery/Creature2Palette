

import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from "../types";
import type { ColorInfo } from "../types";

const API_KEY = process.env.API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const fileToBase64 = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({ base64Data, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeCreatureImage = async (
  base64ImageData: string,
  mimeType: string
): Promise<AnalysisResult> => {
  if (!ai) {
    throw new Error("API_KEY_MISSING");
  }
  // Always request a high number of colors (e.g., 12) so we can filter on the client side
  const FIXED_COLOR_COUNT = 12;

  const schema = {
    type: Type.OBJECT,
    properties: {
      creatureName: {
        type: Type.STRING,
        description: "The common name of the creature/species identified in the image."
      },
      description: {
        type: Type.STRING,
        description: "A comprehensive, encyclopedic summary of the creature's species, including habitat, behavior, and interesting facts. Acts as a web search summary."
      },
      colors: {
        type: Type.ARRAY,
        description: "An array of the most dominant and characteristic colors extracted from the creature, sorted by dominance.",
        items: {
          type: Type.OBJECT,
          properties: {
            hex: { type: Type.STRING, description: "The color in HEX format (e.g., '#AABBCC')." },
            rgb: { type: Type.STRING, description: "The color in RGB format (e.g., 'rgb(170, 187, 204)')." },
            hsl: { type: Type.STRING, description: "The color in HSL format (e.g., 'hsl(210, 20%, 73%)')." }
          },
          required: ["hex", "rgb", "hsl"]
        }
      }
    },
    required: ["creatureName", "description", "colors"]
  };

  const prompt = `Identify the creature in this image. Provide its common name.
  
  Act as a researcher: Provide a detailed, encyclopedic summary of this creature's species as if summarizing search results (habitat, diet, key traits).
  
  Extract the ${FIXED_COLOR_COUNT} most dominant and representative colors from the creature. Sort them by dominance/importance.
  For each color, provide its value in HEX, RGB, and HSL formats.`;

  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: mimeType
    }
  };

  const textPart = { text: prompt };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      }
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);

    // Basic validation
    if (!result.creatureName || !result.description || !Array.isArray(result.colors)) {
        throw new Error("Invalid response structure from AI.");
    }

    return result as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error instanceof Error ? error : new Error("UNKNOWN_AI_ERROR");
  }
};

const toHex = (r: number, g: number, b: number): string => {
  const h = (n: number) => n.toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
};

const toRgbStr = (r: number, g: number, b: number): string => `rgb(${r}, ${g}, ${b})`;

const rgbToHslStr = (r: number, g: number, b: number): string => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  const H = Math.round(h * 360);
  const S = Math.round(s * 100);
  const L = Math.round(l * 100);
  return `hsl(${H}, ${S}%, ${L}%)`;
};

export const extractDominantColorsFromFile = async (file: File, count: number): Promise<ColorInfo[]> => {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

    const targetW = 160;
    const scale = targetW / img.width;
    const targetH = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const data = ctx.getImageData(0, 0, targetW, targetH).data;
    const buckets: Record<string, { r: number; g: number; b: number; c: number }> = {};

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 128) continue;
      const qr = r >> 4, qg = g >> 4, qb = b >> 4; // 16-level quantization
      const key = `${qr}-${qg}-${qb}`;
      const bucket = buckets[key] || { r: 0, g: 0, b: 0, c: 0 };
      bucket.r += r; bucket.g += g; bucket.b += b; bucket.c += 1;
      buckets[key] = bucket;
    }

    const averaged = Object.values(buckets)
      .map(b => {
        const r = Math.round(b.r / b.c);
        const g = Math.round(b.g / b.c);
        const bv = Math.round(b.b / b.c);
        return { r, g, b: bv, c: b.c };
      })
      .sort((a, b) => b.c - a.c)
      .slice(0, Math.max(3, count));

    const colors: ColorInfo[] = averaged.map(({ r, g, b }) => ({
      hex: toHex(r, g, b),
      rgb: toRgbStr(r, g, b),
      hsl: rgbToHslStr(r, g, b),
    }));

    return colors;
  } finally {
    URL.revokeObjectURL(url);
  }
};

type AIErrorCode = 'api_key_missing' | 'unauthorized' | 'rate_limit' | 'overloaded' | 'network' | 'invalid_schema' | 'invalid_image' | 'unknown';

export const classifyAIError = (error: unknown): { code: AIErrorCode; message: string } => {
  const msg = (error instanceof Error ? error.message : String(error || '')) || '';
  const lower = msg.toLowerCase();

  if (msg === 'API_KEY_MISSING') {
    return { code: 'api_key_missing', message: 'API key missing. Set GEMINI API key to enable species recognition.' };
  }
  if (lower.includes('401') || lower.includes('unauthorized')) {
    return { code: 'unauthorized', message: 'Unauthorized. Check API key and permissions.' };
  }
  if (lower.includes('429') || lower.includes('rate') || lower.includes('quota')) {
    return { code: 'rate_limit', message: 'Rate limit reached. Please wait and try again.' };
  }
  if (lower.includes('overload') || lower.includes('busy') || lower.includes('unavailable')) {
    return { code: 'overloaded', message: 'Model overloaded. Temporarily unavailable.' };
  }
  if (lower.includes('network') || lower.includes('failed to fetch') || lower.includes('timeout')) {
    return { code: 'network', message: 'Network error. Check your connection and try again.' };
  }
  if (lower.includes('invalid response') || lower.includes('json') || lower.includes('parse')) {
    return { code: 'invalid_schema', message: 'Model returned invalid data format.' };
  }
  if (lower.includes('mime') || lower.includes('image') && lower.includes('process')) {
    return { code: 'invalid_image', message: 'Image is unsupported or could not be processed.' };
  }
  return { code: 'unknown', message: 'AI analysis failed due to an unknown error.' };
};
