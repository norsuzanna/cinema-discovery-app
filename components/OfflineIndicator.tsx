'use client';

import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/usePWA';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-lg animate-in slide-in-from-bottom-2">
      <WifiOff className="h-4 w-4" />
      <span>You're offline</span>
    </div>
  );
}