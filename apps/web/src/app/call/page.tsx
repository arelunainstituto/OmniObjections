'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import { CallInterface } from '@/components/call/call-interface';
import { useCallStore } from '@/stores/call-store';

export default function CallPage() {
  const { isActive, startCall, endCall } = useCallStore();
  const [isMuted, setIsMuted] = useState(false);

  if (!isActive) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Iniciar Nova Chamada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Lead</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email (opcional)</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="joao@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone (opcional)</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <Button
                size="lg"
                className="w-full text-lg py-6"
                onClick={() => startCall('agent-1', 'Lead Exemplo')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Iniciar Chamada
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Certifique-se de que seu microfone está conectado e funcionando.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen bg-gray-900 text-white">
      <CallInterface />
    </main>
  );
}

