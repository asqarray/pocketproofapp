
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, BillError, AidMatch } from "../types";
import { maskPHI } from "./integrationService";

const auditSchema = {
  type: Type.OBJECT,
  properties: {
    hospitalName: { type: Type.STRING },
    totalBill: { type: Type.NUMBER },
    isSummaryBill: { type: Type.BOOLEAN },
    accuracyScore: { type: Type.INTEGER },
    summary: { 
      type: Type.STRING, 
      description: "A neutral forensic summary of the audit. Cite specific billing patterns like 'unbundling' or 'upcoding'. Max 2 sentences." 
    },
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
          marketPrice: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          plainEnglishExplanation: { 
            type: Type.STRING, 
            description: "Explain the clinical discrepancy in simple terms for the patient." 
          },
          regulatoryCitation: { type: Type.STRING, description: "Specific CMS or Federal Law citation." },
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
    disputeLetterPreview: { type: Type.STRING, description: "A legally robust dispute letter intended for the hospital's billing director." }
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

export const analyzeBillWithGemini = async (input: string | { mimeType: string, data: string }, zipCode?: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let rawText = "";
  if (typeof input === 'string') {
    rawText = input;
  } else {
    // Stage 1: High Fidelity OCR with Flash
    const ocrResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [
          { inlineData: { mimeType: input.mimeType, data: input.data } }, 
          { text: "Perform high-fidelity OCR. Extract every line item, medical code (CPT/HCPCS/ICD-10), and decimal amount with absolute precision. Preserve the structure of the billing statement." }
        ] 
      },
    });
    rawText = ocrResponse.text || "";
  }
  
  // Stage 2: Forensic Analysis with Pro
  const maskedInputText = maskPHI(rawText);

  try {
    const auditResponse: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a Forensic Clinical Audit on this clinical data: ${maskedInputText}. 
      Location Context (ZIP): ${zipCode || "General US"}.
      
      CORE PROTOCOL:
      1. Validate CPT/HCPCS codes against CMS Fair Market Rates.
      2. Identify violations: Unbundling (fragmented billing), Upcoding (inflated service levels), or Duplicate Charges.
      3. Charity Matching: Check for 501(r) Financial Assistance eligibility if the provider is non-profit.
      4. Neutral Reporting: If the bill is accurate, confirm it. If errors exist, cite the specific CMS or NCCI regulatory guideline.`,
      config: {
        systemInstruction: "You are the PocketProof Forensic Compliance Engine. You are a neutral third-party auditor. You interpret medical billing laws and coding standards with mathematical precision. You provide clinical facts, not opinions. You must always cite relevant CMS guidelines or Federal laws like the No Surprises Act.",
        responseMimeType: "application/json",
        responseSchema: auditSchema,
        thinkingConfig: { thinkingBudget: 24000 }
      },
    });

    const result = JSON.parse(sanitizeJsonResponse(auditResponse.text || "{}"));

    return {
      billId: `bill_${Date.now()}`,
      hospitalName: result.hospitalName || "Identified Provider",
      totalBill: result.totalBill || 0,
      totalErrors: result.errors?.reduce((s: number, e: any) => s + (Math.max(0, e.amount - e.marketPrice)), 0) || 0,
      totalAid: result.aidMatches?.reduce((s: number, a: any) => s + (a.amount || 0), 0) || 0,
      errors: (result.errors || []).map((e: any, i: number) => ({ ...e, id: `err_${i}` })),
      aidMatches: (result.aidMatches || []).map((a: any, i: number) => ({ ...a, id: `aid_${i}` })),
      priorityLevel: result.priorityLevel || "Medium",
      groundingSources: [],
      summary: result.summary,
      highlightError: result.highlightError,
      isSummaryBill: !!result.isSummaryBill,
      accuracyScore: result.accuracyScore,
      disputeLetterPreview: result.disputeLetterPreview,
      zipCode: zipCode,
      updatedAt: new Date().toISOString()
    };
  } catch (error: any) {
    console.error("Forensic node failure:", error);
    throw new Error(`Forensic node is currently re-syncing. Please try again in 30 seconds.`);
  }
};
