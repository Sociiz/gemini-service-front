import { useState } from "react";
import {
  analisarDocumento,
  type DocumentAnalysis,
  type HistoryEntry,
} from "../services/DocumentService";
import { UploadArea } from "./UploadArea";
import { ResultPanel } from "./ResultPanel";

export default function DocAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (f: File) => {
    setFile(f);
    setError(null);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result: DocumentAnalysis = await analisarDocumento(file, prompt);
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        fileName: file.name,
        timestamp: new Date(),
        result,
        prompt: prompt.trim() || undefined,
        preview,
      };
      setHistory((prev) => [entry, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Análise de Documento
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Envie um RG, CNH ou PDF para validação via IA.
          </p>
        </div>

        <UploadArea
          file={file}
          preview={preview}
          prompt={prompt}
          loading={loading}
          onFileChange={handleFileChange}
          onPromptChange={setPrompt}
          onAnalyze={handleAnalyze}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <ResultPanel history={history} />
      </div>
    </div>
  );
}
