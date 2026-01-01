
export enum AppView {
  LANDING = 'LANDING',
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  PATIENT_LOGIN = 'PATIENT_LOGIN',
  PATIENT_DASHBOARD = 'PATIENT_DASHBOARD',
  ADVOCATE_LANDING = 'ADVOCATE_LANDING',
  ADVOCATE_LOGIN = 'ADVOCATE_LOGIN',
  ADVOCATE_DASHBOARD = 'ADVOCATE_DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  COMPLIANCE = 'COMPLIANCE',
  SUPPORT = 'SUPPORT',
}

export type LeadSource = 'Platform' | 'Manual';

export interface BillError {
  id: string;
  code: string;
  description: string;
  amount: number;
  marketPrice: number;
  reason: string;
  plainEnglishExplanation: string; 
  regulatoryCitation: string;
  confidence: number;
  isExpertVerified?: boolean;
}

export interface AidMatch {
  id: string;
  organization: string;
  programName: string;
  amount: number;
  probability: string;
  url: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface AnalysisResult {
  billId?: string;
  totalBill: number;
  totalErrors: number;
  totalAid: number;
  errors: BillError[];
  aidMatches: AidMatch[];
  groundingSources: GroundingSource[];
  summary: string;
  hospitalName: string;
  extractedTextSnippet?: string;
  patientState?: string;
  zipCode?: string;
  priorityLevel: 'High' | 'Medium' | 'Low';
  
  isSummaryBill: boolean; 
  accuracyScore: number; 
  
  highlightError?: {
    description: string;
    code: string;
    estimatedSavings: number;
    explanation: string;
  };

  disputeLetterPreview?: string;
  updatedAt?: string;
}

export interface ZohoLead {
  id: string;
  linkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  condition: string;
  billValue: number;
  state: string;
  createdAt: string;
  hasInsurance: boolean;
  incomeLevel?: string;
  hospitalName?: string;
}

export interface AdvocateViewLead extends ZohoLead {
  billAvailable: boolean;
  priorityLevel?: string;
}

export interface PlatformStats {
  totalSavingsFound: number;
  totalBillsScanned: number;
  totalLeadsGenerated: number;
  avgConfidence: number;
  topOffendingHospitals: Array<{ name: string, violations: number, value: number }>;
  conversionRate: number;
}
