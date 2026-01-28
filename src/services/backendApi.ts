export type DiagnosisType = 'skin' | 'eye' | 'tongue' | 'nail';

export interface AyurvedicRemedy {
  name: string;
  usage: string;
  benefits: string;
  preparation?: string;
}

export interface MedicineScanResponse {
  medicine_name: string | null;
  confidence: number; // 0..1
  category?: string;
  uses?: string;
  extracted_text?: string;
  method?: string;
  ayurvedic_remedies?: AyurvedicRemedy[];
  error?: string;
}

export interface DiagnosisCondition {
  name: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  confidence: number; // 0..1
  description?: string;
}

export interface VisualDiagnosisResponse {
  conditions: DiagnosisCondition[];
  confidence: number; // 0..1
  analysis_type: DiagnosisType;
  method?: string;
  ayurvedic_remedies?: AyurvedicRemedy[];
  recommendations?: string[];
  error?: string;
}

function getBackendUrl(): string {
  // Vite exposes only VITE_* env vars
  return (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:8000';
}

async function parseApiError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (body?.detail) return String(body.detail);
    if (body?.error) return String(body.error);
    return JSON.stringify(body);
  } catch {
    return await res.text();
  }
}

export async function scanMedicine(file: File): Promise<MedicineScanResponse> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${getBackendUrl()}/api/v1/medicine/scan`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  return (await res.json()) as MedicineScanResponse;
}

export async function analyzeDiagnosis(
  file: File,
  diagnosisType: DiagnosisType
): Promise<VisualDiagnosisResponse> {
  const form = new FormData();
  form.append('file', file);
  // Backend reads this as query param, but FastAPI accepts form fields too; safest: query + form
  form.append('diagnosis_type', diagnosisType);

  const url = new URL(`${getBackendUrl()}/api/v1/diagnosis/analyze`);
  url.searchParams.set('diagnosis_type', diagnosisType);

  const res = await fetch(url.toString(), {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  return (await res.json()) as VisualDiagnosisResponse;
}

