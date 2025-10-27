'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface BatchProgressProps {
  total: number;
  completed: number;
  failed: number;
  isProcessing: boolean;
}

export default function BatchProgress({ total, completed, failed, isProcessing }: BatchProgressProps) {
  const successCount = completed - failed;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  if (!isProcessing && completed === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Atualização em Lote</h3>
            {isProcessing && (
              <Badge variant="secondary" className="animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                Processando...
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            {successCount > 0 && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>{successCount}</span>
              </div>
            )}
            {failed > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <XCircle className="w-4 h-4" />
                <span>{failed}</span>
              </div>
            )}
            <span className="text-muted-foreground">
              {completed}/{total}
            </span>
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="mt-2 text-sm text-muted-foreground">
          {isProcessing ? (
            `Processando ${completed} de ${total} pedidos...`
          ) : (
            completed === total ? (
              failed === 0 ? 
                'Todos os pedidos foram atualizados com sucesso!' :
                `${successCount} pedidos atualizados, ${failed} falharam`
            ) : 'Processamento interrompido'
          )}
        </div>
      </CardContent>
    </Card>
  );
}