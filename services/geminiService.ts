
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, GroundingSource } from "../types";
import { maskPHI } from "./integrationService";

const auditSchema = {
  type: Type.OBJECT,
  properties: {
    hospitalName: { type: Type.STRING },
    totalBill: { type: Type.NUMBER },
    isSummaryBill: { type: Type.BOOLEAN },
    accuracyScore: { type: Type.INTEGER },
    summary: { type: Type.STRING },
    priorityLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
    highlightError: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        code: { type: Type.STRING },
        estimatedSavings: { type: Type.NUMBER },
        explanation: { type: Type.STRING }
      }
    },
    errors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          code: { type: Type.STRING },
          description: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          marketPrice: { type: Type.NUMBER, description: "National Fair Market Price for this service (Medicare + 40%)." },
          reason: { type: Type.STRING },
          plainEnglishExplanation: { type: Type.STRING },
          regulatoryCitation: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
        },
        required: ["code", "amount", "marketPrice", "regulatoryCitation", "description", "reason", "plainEnglishExplanation"]
      },
    },
    aidMatches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          organization: { type: Type.STRING },
          programName: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          probability: { type: Type.STRING },
          url: { type: Type.STRING },
        },
      },
    },
    disputeLetterPreview: { type: Type.STRING }
  },
  required: ["totalBill", "errors", "hospitalName", "isSummaryBill", "accuracyScore", "summary", "priorityLevel", "disputeLetterPreview"],
};

const sanitizeJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
  }
  return cleaned;
};

export const analyzeBillWithGemini = async (input: string | { mimeType: string, data: string }): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // STEP 0: EXTRACTION & MASKING
  let rawText = "";
  if (typeof input === 'string') {
    rawText = input;
  } else {
    const parts: any[] = [{ inlineData: { mimeType: input.mimeType, data: input.data } }];
    const ocrResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [...parts, { text: "Extract all clinical line items, codes, and prices exactly. DO NOT ANALYZE YET." }] },
    });
    rawText = ocrResponse.text || "";
  }
  
  const maskedInputText = maskPHI(rawText);

  // STEP 1: FORENSIC AUDIT WITH PRICE TRANSPARENCY
  try {
    const auditResponse: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a Forensic Medical Audit on this data: ${maskedInputText}.
      
      CRITICAL INSTRUCTIONS:
      1. USE GOOGLE SEARCH to find National Fair Market Prices (FMP) for every detected code.
      2. Set 'priorityLevel' to 'High' if savings > $5,000.
      3. Identify potential Charity Care aid programs for the hospital mentioned.
      4. Ensure the dispute letter is a DRAFT ONLY.
      5. DO NOT output patient names.`,
      config: {
        systemInstruction: "You are a world-class clinical auditor and patient advocate. Bridge the knowledge gap between hospital bills and market reality.",
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: auditSchema,
      },
    });

    const result = JSON.parse(sanitizeJsonResponse(auditResponse.text || "{}"));

    return {
      hospitalName: result.hospitalName || "Facility",
      totalBill: result.totalBill || 0,
      totalErrors: result.errors?.reduce((s: number, e: any) => s + (e.amount - e.marketPrice), 0) || 0,
      totalAid: result.aidMatches?.reduce((s: number, a: any) => s + (a.amount || 0), 0) || 0,
      errors: result.errors || [],
      aidMatches: result.aidMatches || [],
      priorityLevel: result.priorityLevel || "Medium",
      groundingSources: [],
      summary: result.summary,
      highlightError: result.highlightError,
      isSummaryBill: !!result.isSummaryBill,
      accuracyScore: result.accuracyScore,
      disputeLetterPreview: result.disputeLetterPreview,
    };
  } catch (error: any) {
    console.error("Audit Failure:", error);
    throw new Error(`Forensic Audit Interrupted: ${error.message}`);
  }
};
