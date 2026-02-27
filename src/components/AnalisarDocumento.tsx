import React, { useState, useEffect } from "react";
import {
  analisarDocumento,
  type HistoryEntry,
} from "../services/DocumentService";
import { UploadArea } from "./UploadArea";
import { ResultPanel } from "./ResultPanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "doc-analyzer-history";

type StoredEntry = Omit<HistoryEntry, "timestamp"> & { timestamp: string };

function loadHistory(): HistoryEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed: StoredEntry[] = JSON.parse(saved);
    return parsed.map((entry) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  } catch {
    return [];
  }
}

function saveHistory(history: HistoryEntry[]) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const toSave = history.map(({ preview, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    console.warn("Não foi possível salvar o histórico");
  }
}

export default function DocAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

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

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      console.log({ filename: file.name, nome, cpf, prompt });
      const result = await analisarDocumento(
        file,
        prompt,
        nome.trim(),
        cpf.trim(),
      );
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        fileName: file.name,
        timestamp: new Date(),
        result,
        prompt: prompt.trim() || undefined,
        nome: nome.trim() || undefined,
        cpf: cpf.trim() || undefined,
        preview,
      };
      setHistory((prev) => [entry, ...prev]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Análise de Documento
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Envie um RG, CNH ou PDF para validação via IA.
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors mt-1"
            >
              Limpar histórico
            </button>
          )}
        </div>

        {/* Campos de nome e CPF */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-gray-200 rounded-xl p-4">
          <div className="space-y-1.5">
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              placeholder="João da Silva"
              value={nome}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNome(e.target.value)
              }
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              disabled={loading}
            />
          </div>
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
