import { GoogleGenAI, Type } from "@google/genai";
import { AiAnalysisResult } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; 
// Note: In a real scenario, we'd handle missing keys gracefully. 
// The UI will disable AI features if this is empty.

const ai = new GoogleGenAI({ apiKey });

export const analyzeImage = async (base64Image: string): Promise<AiAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  // Remove header if present (data:image/jpeg;base64,)
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: `Analyze this design asset. Provide a creative title (in Portuguese), a short engaging description (in Portuguese), and 5 relevant tags. 
            Return the result strictly as JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AiAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback if AI fails
    return {
      title: "Novo Design Criativo",
      description: "Um recurso de design de alta qualidade pronto para uso.",
      tags: ["design", "criativo", "psd"]
    };
  }
};
