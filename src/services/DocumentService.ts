const API_URL = "http://localhost:3000/v1/analisar-upload";

export interface DocumentAnalysis {
  ehValido: boolean;
  tipoDocumento: string;
  confianca: number;
  motivo: string;
  autenticidadeProvavel: boolean;
  scoreSuspeito: number;
  pontosDeAtencao: string[];
}

export interface HistoryEntry {
  id: string;
  fileName: string;
  timestamp: Date;
  result: DocumentAnalysis;
  prompt?: string;
  preview: string | null; // base64 da imagem ou null para PDF
}

export async function analisarDocumento(file: File, prompt?: string): Promise<DocumentAnalysis> {
  const form = new FormData();
  form.append("arquivo", file);
  if (prompt?.trim()) form.append("prompt", prompt.trim());

  const res = await fetch(API_URL, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}