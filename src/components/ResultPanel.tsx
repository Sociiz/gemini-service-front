import { type HistoryEntry } from "../services/DocumentService";

interface ResultPanelProps {
  history: HistoryEntry[];
}

export function ResultPanel({ history }: ResultPanelProps) {
  if (!history?.length) return null;

  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        Histórico — {history.length}{" "}
        {history.length === 1 ? "análise" : "análises"}
      </p>

      {history.map((entry) => (
        <div
          key={entry.id}
          className="border border-gray-200 rounded-xl bg-white overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${entry.result.ehValido ? "bg-green-400" : "bg-red-400"}`}
              />
              <span className="text-sm font-medium text-gray-700">
                {entry.fileName}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {entry.timestamp.toLocaleTimeString("pt-BR")}
            </span>
          </div>

          <div
            className="grid grid-cols-3 divide-x divide-gray-100"
            style={{ height: 340 }}
          >
            {/* Coluna 1: Foto / arquivo */}
            <div className="flex flex-col bg-gray-50 overflow-hidden">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide px-4 pt-3 pb-2 flex-shrink-0">
                Documento
              </p>
              {entry.preview ? (
                <img
                  src={entry.preview}
                  alt={entry.fileName}
                  className="w-full object-contain px-3 pb-3 flex-1 min-h-0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 p-4 gap-2 min-h-0">
                  <span className="text-4xl">📄</span>
                  <span className="text-xs text-gray-400 text-center break-all">
                    {entry.fileName}
                  </span>
                </div>
              )}
            </div>

            {/* Coluna 2: Prompt utilizado */}
            <div className="flex flex-col bg-indigo-50 overflow-hidden">
              <p className="text-xs font-medium text-indigo-400 uppercase tracking-wide px-4 pt-3 pb-2 flex-shrink-0">
                Prompt utilizado
              </p>
              <div className="flex-1 px-4 pb-4 overflow-y-auto min-h-0">
                {entry.prompt ? (
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    {entry.prompt}
                  </p>
                ) : (
                  <p className="text-xs text-indigo-300 italic">
                    Prompt padrão (nenhum personalizado)
                  </p>
                )}
              </div>
            </div>

            {/* Coluna 3: Resposta da API */}
            <div className="flex flex-col bg-white overflow-hidden">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide px-4 pt-3 pb-2 flex-shrink-0">
                Resposta da API
              </p>
              <div className="flex-1 px-4 pb-4 overflow-y-auto min-h-0">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                  {JSON.stringify(entry.result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
