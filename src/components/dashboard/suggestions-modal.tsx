'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Lightbulb, Loader, AlertTriangle } from 'lucide-react';
import { getContextualSafetyTips } from '@/app/actions';
import type { Position } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';

interface SuggestionsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  position: Position | null;
}

export function SuggestionsModal({
  isOpen,
  onOpenChange,
  position,
}: SuggestionsModalProps) {
  const [tips, setTips] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTips = async () => {
    if (!position) {
      setError('Your location is not available. Cannot get tips.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTips(null);
    
    const locationDescription = `User is at latitude ${position.latitude} and longitude ${position.longitude}.`;
    const result = await getContextualSafetyTips({ locationDescription });

    if (result.success && result.data) {
      setTips(result.data.safetyTips);
    } else {
      setError(result.error || 'An unexpected error occurred.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchTips();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="text-primary" />
            Context-Aware Safety Tips
          </DialogTitle>
          <DialogDescription>
            Here are some safety tips based on your current location.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 min-h-[150px] rounded-lg border bg-muted p-4">
          {isLoading && (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Loader className="mb-2 h-6 w-6 animate-spin" />
              <p>Generating relevant tips...</p>
            </div>
          )}
          {error && (
            <div className="flex h-full flex-col items-center justify-center text-destructive">
              <AlertTriangle className="mb-2 h-6 w-6" />
              <p className="text-center font-semibold">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={fetchTips}>
                Try Again
              </Button>
            </div>
          )}
          {tips && (
             <p className="whitespace-pre-wrap text-sm">{tips}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
