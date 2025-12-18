import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates tags for a given icon image using Gemini 2.5 Flash.
 * Includes retry logic for 429 Rate Limit errors.
 * @param base64Image The base64 encoded image string.
 * @param mimeType The mime type.
 */
export const generateIconTags = async (base64Image: string, mimeType: string): Promise<string[]> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const promptText = `Analyze this icon image. Act as a professional UI/UX asset manager.

            Provide a list of exactly 10 most relevant tags, keywords, or synonyms.
            Sort them by relevance (most important first).

            Focus on:
            1. The Base Object (e.g., 'plus', 'magnifying glass', 'envelope').
            2. Functional meanings (e.g., 'add', 'search', 'email', 'message').
            3. Common UI terminology and synonyms.
            
            Return the result as a raw JSON array of lowercase strings.`;

  let retries = 0;
  const maxRetries = 3;

  while (true) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
            {
              text: promptText
            },
          ],
        },
        config: {
          systemInstruction: "You are a helpful assistant that tags icons for a search engine.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING
            }
          }
        }
      });

      const text = response.text;
      if (!text) return [];
      
      return JSON.parse(text) as string[];

    } catch (error: any) {
      const isRateLimit = 
        error?.status === 429 || 
        error?.code === 429 || 
        (error?.message && error.message.includes('429')) ||
        (error?.message && error.message.includes('RESOURCE_EXHAUSTED'));

      if (isRateLimit && retries < maxRetries) {
        retries++;
        const waitTime = Math.pow(2, retries) * 1000 + Math.random() * 1000;
        console.warn(`Rate limit hit. Retrying in ${Math.round(waitTime)}ms... (Attempt ${retries}/${maxRetries})`);
        await delay(waitTime);
        continue;
      }
      
      console.error("Gemini API Error:", error);
      throw new Error(isRateLimit ? "Rate limit exceeded. Please try again later." : "Failed to analyze the icon.");
    }
  }
};