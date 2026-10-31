'use client';

import { useState, useEffect, useCallback } from 'react';
import { ToastMessage, ToastType } from '@/types';

// Simple event-based bus for toast notifications without heavyweight dependencies
type ToastListener = (toast: ToastMessage) => void;
const listeners = new Set<ToastListener>();

export function triggerToast(type: ToastType, title: string, description?: string) {
  const newToast: ToastMessage = {
    id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type,
    title,
    description,
  };
  listeners.forEach((listener) => listener(newToast));
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleNewToast: ToastListener = (toast) => {
      setToasts((prev) => [...prev, toast]);
    };
    listeners.add(handleNewToast);
    return () => {
      listeners.delete(handleNewToast);
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, description?: string) => {
    triggerToast(type, title, description);
  }, []);

  return {
    toasts,
    removeToast,
    showToast,
  };
}
