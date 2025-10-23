'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import { useCallStore } from '@/stores/call-store';
import { TranscriptPanel } from './transcript-panel';
import { SuggestionsPanel } from './suggestions-panel';
import { MetricsPanel } from './metrics-panel';

export function CallInterface() {
  const { isActive, leadName, startTime, endCall } = useCallStore();
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime.getTime();
      setDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
    }
    return `${pad(minutes)}:${pad(seconds % 60)}`;
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{leadName}</h2>
            <p className="text-sm text-gray-400">Chamada em andamento</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-mono">{formatDuration(duration)}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Transcript */}
        <div className="flex-1 border-r border-gray-700">
          <TranscriptPanel />
        </div>

        {/* Right Panel - Suggestions */}
        <div className="w-96">
          <SuggestionsPanel />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <MetricsPanel />

          <div className="flex items-center gap-4">
            <Button
              size="lg"
              variant={isMuted ? 'destructive' : 'secondary'}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button size="lg" variant="destructive" onClick={endCall}>
              <PhoneOff className="mr-2 h-5 w-5" />
              Encerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

