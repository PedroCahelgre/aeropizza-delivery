'use client';

import React, { useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface KeyboardShortcutsProps {
  onRefresh?: () => void;
  onBatchUpdate?: () => void;
  onSelectAll?: () => void;
  onSearch?: () => void;
}

export default function KeyboardShortcuts({ 
  onRefresh, 
  onBatchUpdate, 
  onSelectAll, 
  onSearch 
}: KeyboardShortcutsProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignorar se o usuário estiver digitando em um input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    // Ctrl/Cmd + R: Atualizar
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault();
      onRefresh?.();
      toast({ title: 'Lista de pedidos atualizada' });
    }

    // Ctrl/Cmd + B: Atualização em lote
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      onBatchUpdate?.();
    }

    // Ctrl/Cmd + A: Selecionar todos
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      onSelectAll?.();
    }

    // Ctrl/Cmd + F: Buscar
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault();
      onSearch?.();
      // Focar no campo de busca
      const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }

    // F5: Atualizar (sem Ctrl)
    if (event.key === 'F5' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      onRefresh?.();
      toast({ title: 'Lista de pedidos atualizada' });
    }

    // Esc: Limpar seleção
    if (event.key === 'Escape') {
      // Limpar seleção de pedidos
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        (checkbox as HTMLInputElement).checked = false;
      });
      toast({ title: 'Seleção limpa' });
    }
  }, [onRefresh, onBatchUpdate, onSelectAll, onSearch]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Componente não renderiza nada visualmente
  return null;
}

// Componente para mostrar os atalhos disponíveis
export function KeyboardShortcutsHelp() {
  return (
    <div className="text-xs text-muted-foreground space-y-1">
      <div className="font-medium mb-2">Atalhos de Teclado:</div>
      <div className="grid grid-cols-2 gap-2">
        <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+R</kbd> Atualizar</div>
        <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+B</kbd> Lote</div>
        <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+A</kbd> Selecionar Tudo</div>
        <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+F</kbd> Buscar</div>
        <div><kbd className="px-2 py-1 bg-muted rounded text-xs">F5</kbd> Atualizar</div>
        <div><kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> Limpar Seleção</div>
      </div>
    </div>
  );
}