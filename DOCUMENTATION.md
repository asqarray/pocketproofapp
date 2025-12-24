
# PocketProof Technical Documentation

PocketProof is a revolutionary healthcare advocacy platform that leverages Multi-Modal LLMs (Large Language Models) to audit medical billing and match patients with financial aid and expert representation.

## 1. Core Architecture

The application is built as a **Single Page Application (SPA)** using:
- **React 18**: Component-based UI with standard state hooks.
- **Tailwind CSS**: Utility-first styling for high-fidelity, responsive designs.
- **Google Gemini API**: The primary engine for OCR and clinical reasoning.
- **Firebase/Firestore**: Real-time persistence for anonymized bill data and lead management.
- **Zohop/Webhooks**: Direct integration for PHI-compliant advocate lead generation.

## 2. AI Auditing Pipeline

The "Clinical Audit" happens in two distinct phases within `geminiService.ts`:

### Phase 1: High-Fidelity Extraction
The AI is tasked with reading the raw document (Image/PDF/Text). It focuses on:
- Provider Identity (Hospital Name, NPI hints).
- Date of Service.
- Line Items (Description + CPT/HCPCS codes).
- Total Billed vs. Total Expected.

### Phase 2: Regulatory Cross-Referencing
The extracted data is then re-processed by the auditor engine which:
- Checks for **Unbundling**: Multiple codes used where one omnibus code should apply.
- Checks for **Upcoding**: Billing for a higher level of service (e.g., Level 5 ER visit) than documented.
- Matches with **Grounding**: (Optional) Searching real-time for the hospital's specific Charity Care policies.

## 3. Data Privacy & HIPAA Strategy

PocketProof follows a "Hybrid Privacy" model:
1. **PHI Separation**: Full patient details (Name, Phone, Email) are sent directly to a secure advocate webhook (Zoho) and never stored in the main "Bill Analysis" record.
2. **Anonymized Audits**: The bill analysis result is stored with a random ID. While it contains hospital names and amounts, it is stripped of direct patient identifiers in the public-facing Firestore collections.
3. **Local Session**: Patient "Recent Bills" are tracked via a `LocalStorage` pointer to ensure only the patient's device knows which anonymized reports belong to them.

## 4. Business Logic & Funnels

The app uses a **Value-First Conversion Funnel**:
- **The Teaser**: Patients see their "Potential Savings" immediately.
- **The Unlock**: Lead capture (Email/Phone) is required only to see the specific coding errors.
- **The Advocacy Loop**: Patients are then given two paths:
    - **Expert Match (Free)**: Performance-based advocacy where the practitioner takes a % of savings.
    - **DIY Package ($39)**: Self-service dispute package for patients who want to handle it themselves.

## 5. Development Status (Audit: 95%)

- [x] **AI OCR/Audit Logic**: Production-ready.
- [x] **Patient Dashboard**: Fully functional with persistent history.
- [x] **Advocate Portal**: Enhanced with Secure Messaging and Error Verification.
- [x] **Payment Integration**: Stripe redirect logic implemented.
- [ ] **Automated PDF Generation**: Currently handled via `window.print()` using a high-quality CSS print-media style.

## 6. Deployment Instructions

1. Ensure `API_KEY` (Gemini) is set in your environment variables.
2. Configure Firebase project for storage/leads.
3. Set `NEXT_PUBLIC_STRIPE_LINK` for the $39 package.
4. Set `NEXT_PUBLIC_ZOHO_WEBHOOK_URL` to receive practitioner leads.
