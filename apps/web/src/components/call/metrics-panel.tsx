'use client';

import { useCallStore } from '@/stores/call-store';

export function MetricsPanel() {
  const { metrics, transcript, suggestions } = useCallStore();

  const stats = {
    segments: transcript.length,
    objections: transcript.filter((s) => s.objectionDetected).length,
    suggestions: suggestions.length,
  };

  return (
    <div className="flex gap-6 text-sm">
      <div>
        <span className="text-gray-400">Segmentos:</span>{' '}
        <span className="font-semibold">{stats.segments}</span>
      </div>
      <div>
        <span className="text-gray-400">Objeções:</span>{' '}
        <span className="font-semibold text-yellow-400">{stats.objections}</span>
      </div>
      <div>
        <span className="text-gray-400">Sugestões:</span>{' '}
        <span className="font-semibold text-blue-400">{stats.suggestions}</span>
      </div>
    </div>
  );
}

