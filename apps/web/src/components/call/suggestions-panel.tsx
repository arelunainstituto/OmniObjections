'use client';

import { useCallStore } from '@/stores/call-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

export function SuggestionsPanel() {
  const { suggestions, activeSuggestion, setActiveSuggestion } = useCallStore();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Mostrar toast de sucesso
  };

  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="px-6 py-3 border-b border-gray-700">
        <h3 className="font-semibold">Sugestões IA</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {suggestions.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Sugestões aparecerão aqui quando objeções forem detectadas</p>
          </div>
        )}

        {activeSuggestion && (
          <Card className="border-blue-500 bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Sugestão Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeSuggestion.objection && (
                <div className="text-sm">
                  <span className="text-gray-400">Objeção:</span>
                  <p className="mt-1 text-red-300">{activeSuggestion.objection}</p>
                </div>
              )}

              <div>
                <p className="text-sm mb-3">{activeSuggestion.suggestion}</p>
              </div>

              {activeSuggestion.sources.length > 0 && (
                <div className="text-xs text-gray-400">
                  <span>Fontes:</span>
                  <ul className="mt-1 space-y-1">
                    {activeSuggestion.sources.map((source, idx) => (
                      <li key={idx}>• {source.title}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleCopy(activeSuggestion.suggestion)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                <Button size="sm" variant="ghost">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {suggestions
          .filter((s) => s.id !== activeSuggestion?.id)
          .reverse()
          .map((suggestion) => (
            <Card
              key={suggestion.id}
              className="cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => setActiveSuggestion(suggestion)}
            >
              <CardContent className="p-4">
                <p className="text-sm line-clamp-3">{suggestion.suggestion}</p>
                <div className="mt-2 text-xs text-gray-400">
                  {new Date(suggestion.timestamp).toLocaleTimeString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

