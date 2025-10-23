'use client';

import { useEffect, useRef } from 'react';
import { useCallStore } from '@/stores/call-store';

export function TranscriptPanel() {
  const { transcript } = useCallStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
        <h3 className="font-semibold">Transcrição</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {transcript.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p>A transcrição aparecerá aqui quando a chamada começar...</p>
          </div>
        )}

        {transcript.map((segment) => {
          const isComercial = segment.speaker === 'comercial';
          
          return (
            <div
              key={segment.id}
              className={`flex ${isComercial ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  isComercial
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <div className="text-xs opacity-75 mb-1">
                  {isComercial ? 'Você' : 'Lead'}
                </div>
                <p>{segment.text}</p>
                {segment.objectionDetected && (
                  <div className="mt-2 text-xs bg-red-500/20 text-red-200 px-2 py-1 rounded">
                    ⚠️ Objeção detectada
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

