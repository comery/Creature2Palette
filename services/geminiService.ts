

import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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
    throw new Error("Failed to analyze the image. The AI model may be overloaded or the image could not be processed. Please try again later.");
  }
};