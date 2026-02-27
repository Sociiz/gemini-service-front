interface UploadAreaProps {
  file: File | null;
  preview: string | null;
  prompt: string;
  loading: boolean;
  onFileChange: (file: File) => void;
  onPromptChange: (value: string) => void;
  onAnalyze: () => void;
}

export function UploadArea({
  file,
  preview,
  prompt,
  loading,
  onFileChange,
  onPromptChange,
  onAnalyze,
}: UploadAreaProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-4">
      {(preview || (file && !preview)) && (
        <div className="flex gap-4">
          <div className="w-1/2 flex-shrink-0">
            {preview ? (
              <div
                className="rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center h-full"
                style={{ minHeight: 180 }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-56 w-full object-contain"
                />
              </div>
            ) : (
              <div
                className="rounded-lg border border-gray-100 bg-gray-50 p-4 flex items-center gap-3 h-full"
                style={{ minHeight: 80 }}
              >
                <span className="text-3xl">📄</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {file?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {file ? (file.size / 1024).toFixed(1) + " KB" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
              Prompt personalizado{" "}
              <span className="normal-case text-gray-300">(opcional)</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Ex: Analise este documento e foque em verificar se a foto foi colada digitalmente..."
              className="flex-1 w-full text-sm text-gray-700 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-300"
              style={{ minHeight: 120 }}
            />
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileChange(f);
        }}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 file:cursor-pointer hover:file:bg-gray-200"
      />

      {!file && (
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
            Prompt personalizado{" "}
            <span className="normal-case text-gray-300">
              (opcional — deixe vazio para usar o padrão)
            </span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Ex: Analise este documento e foque em verificar se a foto foi colada digitalmente..."
            rows={3}
            className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-300"
          />
        </div>
      )}

      <button
        onClick={onAnalyze}
        disabled={!file || loading}
        className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Analisando..." : "Analisar"}
      </button>
    </div>
  );
}
