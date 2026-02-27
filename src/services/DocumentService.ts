const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

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
  nome?: string;
  cpf?: string;
  preview: string | null;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = (reader.result as string).split(",")[1];
      resolve(result);
    };
    reader.onerror = () => reject(new Error("Falha ao converter arquivo para base64"));
    reader.readAsDataURL(file);
  });
}

export async function analisarDocumento(
  file: File,
  prompt?: string,
  nome?: string,
  cpf?: string,
): Promise<DocumentAnalysis> {
  const imagemBase64 = await fileToBase64(file);


  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      imagemBase64,
      mimeType: file.type,
      ...(prompt?.trim() ? { prompt: prompt.trim() } : {}),
      ...(nome?.trim() ? { nome: nome.trim() } : {}),
      ...(cpf?.trim() ? { cpf: cpf.trim() } : {}),
    }),
  });

  console.log("[API] Response status:", res.status);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}