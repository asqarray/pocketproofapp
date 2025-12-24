
import { AnalysisResult, ZohoLead, AdvocateViewLead, PlatformStats } from "../types";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, query, orderBy, limit, getDoc, updateDoc } from "firebase/firestore";

const getEnv = (key: string): string => {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) return import.meta.env[key];
    try {
        if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
    } catch (e) {}
    return '';
};

/**
 * Robust PHI Masking Utility
 * Scrubs direct identifiers before they hit the AI logic.
 */
export const maskPHI = (text: string): string => {
  return text
    // Redact SSN
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN REDACTED]")
    // Redact Potential Phone Numbers
    .replace(/\b(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, "[PHONE REDACTED]")
    // Redact Potential Names (approximation: Capitalized pairs)
    .replace(/\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g, (match, p1, p2) => {
        const skip = ["Hospital", "Clinic", "Center", "Medical", "Saint", "City", "Health", "Surgery", "Emergency"];
        if (skip.includes(p1) || skip.includes(p2)) return match;
        return "[NAME REDACTED]";
    })
    // Redact Member IDs
    .replace(/\b\d{8,15}\b/g, "[ID REDACTED]");
};

const WEBHOOK_URL = getEnv('NEXT_PUBLIC_ZOHO_WEBHOOK_URL'); 
const FIREBASE_API_KEY = getEnv('NEXT_PUBLIC_FIREBASE_API_KEY');

let db: any = null;
if (FIREBASE_API_KEY) {
    try {
        const firebaseConfig = {
            apiKey: FIREBASE_API_KEY,
            authDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
            projectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
            storageBucket: getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
            messagingSenderId: getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
            appId: getEnv('NEXT_PUBLIC_FIREBASE_APP_ID')
        };
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    } catch (e) {}
}

const DB_KEYS = {
    LEADS: 'pocketproof_db_leads_v1',
    BILLS: 'pocketproof_db_bills_v1',
    PATIENT_SESSION: 'pocketproof_my_bills'
};

const safeJsonParse = (key: string, fallback: any) => {
    if (typeof window === 'undefined') return fallback;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        return fallback;
    }
};

export const saveBillToPatientSession = (billId: string) => {
    if (typeof window === 'undefined') return;
    const current = safeJsonParse(DB_KEYS.PATIENT_SESSION, []);
    if (!current.includes(billId)) {
        localStorage.setItem(DB_KEYS.PATIENT_SESSION, JSON.stringify([billId, ...current]));
    }
};

export const getPatientBills = async (): Promise<AnalysisResult[]> => {
    const billIds = safeJsonParse(DB_KEYS.PATIENT_SESSION, []);
    const bills: AnalysisResult[] = [];
    for (const id of billIds) {
        const details = await getBillDetails(id);
        if (details) bills.push({ ...details, billId: id });
    }
    return bills;
};

export const sendPhiToZoho = async (data: any): Promise<string> => {
    const leadId = `lead_${Date.now()}`;
    const newLead: AdvocateViewLead = {
        id: leadId,
        linkId: data.billId,
        source: 'Platform',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        billValue: data.totalValue,
        condition: data.condition || 'Forensic Audit',
        state: 'US', 
        status: 'New',
        createdAt: new Date().toISOString(),
        billAvailable: true,
        hasInsurance: !!data.hasInsurance,
        incomeLevel: data.incomeLevel,
        priorityLevel: data.priorityLevel
    };

    if (db) {
        try { await setDoc(doc(db, "leads", leadId), newLead); } catch(e) {}
    } else {
        const current = safeJsonParse(DB_KEYS.LEADS, []);
        localStorage.setItem(DB_KEYS.LEADS, JSON.stringify([newLead, ...current]));
    }
    
    if (WEBHOOK_URL) {
        fetch(WEBHOOK_URL, { method: 'POST', body: JSON.stringify(newLead), mode: 'no-cors' }).catch(() => {});
    }

    return leadId;
};

export const saveAnonymizedBill = async (billId: string, result: AnalysisResult): Promise<void> => {
    const sanitizedResult = {
        ...result,
        summary: maskPHI(result.summary),
        disputeLetterPreview: maskPHI(result.disputeLetterPreview || ""),
        updatedAt: new Date().toISOString(),
        isPaid: false
    };

    if (db) {
        try { await setDoc(doc(db, "bills", billId), sanitizedResult); } catch(e) {}
    } else {
        const current = safeJsonParse(DB_KEYS.BILLS, {});
        current[billId] = sanitizedResult;
        localStorage.setItem(DB_KEYS.BILLS, JSON.stringify(current));
    }
};

export const getAdvocateLeads = async (): Promise<AdvocateViewLead[]> => {
    if (db) {
        try {
            const snapshot = await getDocs(query(collection(db, "leads"), orderBy("createdAt", "desc"), limit(50)));
            return snapshot.docs.map(d => d.data() as AdvocateViewLead);
        } catch(e) {}
    }
    return safeJsonParse(DB_KEYS.LEADS, []);
};

export const getBillDetails = async (billId: string): Promise<AnalysisResult | null> => {
    if (db) {
        try {
             const docSnap = await getDoc(doc(db, "bills", billId));
             if (docSnap.exists()) return docSnap.data() as AnalysisResult;
        } catch(e) {}
    }
    const bills = safeJsonParse(DB_KEYS.BILLS, {});
    return bills[billId] || null;
}

export const getGlobalPlatformStats = async (): Promise<PlatformStats> => {
    let allBills: AnalysisResult[] = [];
    let allLeads: AdvocateViewLead[] = [];

    if (db) {
        try {
            const billSnap = await getDocs(collection(db, "bills"));
            allBills = billSnap.docs.map(d => d.data() as AnalysisResult);
            const leadSnap = await getDocs(collection(db, "leads"));
            allLeads = leadSnap.docs.map(d => d.data() as AdvocateViewLead);
        } catch(e) {}
    } else {
        const billMap = safeJsonParse(DB_KEYS.BILLS, {});
        allBills = Object.values(billMap);
        allLeads = safeJsonParse(DB_KEYS.LEADS, []);
    }

    const totalSavings = allBills.reduce((s, b) => s + (b.totalErrors || 0) + (b.totalAid || 0), 0);
    const avgConfidence = allBills.length ? allBills.reduce((s, b) => s + (b.accuracyScore || 0), 0) / allBills.length : 0;
    
    const hospitalAgg: Record<string, { count: number, value: number }> = {};
    allBills.forEach(b => {
        if (!hospitalAgg[b.hospitalName]) hospitalAgg[b.hospitalName] = { count: 0, value: 0 };
        hospitalAgg[b.hospitalName].count++;
        hospitalAgg[b.hospitalName].value += (b.totalErrors || 0);
    });

    const topOffenders = Object.entries(hospitalAgg)
        .map(([name, data]) => ({ name, violations: data.count, value: data.value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    return {
        totalSavingsFound: totalSavings,
        totalBillsScanned: allBills.length,
        totalLeadsGenerated: allLeads.length,
        avgConfidence: Math.round(avgConfidence),
        topOffendingHospitals: topOffenders,
        conversionRate: allBills.length ? (allLeads.length / allBills.length) * 100 : 0
    };
};

export const bookAdvocateMeeting = async (userId: string): Promise<boolean> => {
    const link = "https://calendly.com/"; 
    if(typeof window !== 'undefined') window.open(link, '_blank');
    return true;
};

export const updateCaseStatus = async (leadId: string, status: string): Promise<void> => {
    if (db) {
        try { await updateDoc(doc(db, "leads", leadId), { status }); } catch(e) {}
    }
};
