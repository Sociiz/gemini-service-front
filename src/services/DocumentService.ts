const API_URL = import.meta.env.VITE_API_URL;

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
  preview: string | null; 
}

export async function analisarDocumento(file: File, prompt?: string): Promise<DocumentAnalysis> {
  const form = new FormData();
  form.append("arquivo", file);
  if (prompt?.trim()) form.append("prompt", prompt.trim());

  const res = await fetch(API_URL, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}