'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erro capturado:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-red-600">Ops! Algo deu errado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Encontramos um problema ao carregar esta página. Não se preocupe, vamos tentar
            resolver.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm font-mono text-red-800 dark:text-red-200">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={reset} className="flex-1">
              Tentar Novamente
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

