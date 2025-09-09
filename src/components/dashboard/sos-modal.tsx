'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AlertTriangle, Loader, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSafetySuggestions } from '@/app/actions';
import type { Position } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface SosModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  position: Position | null;
}

export function SosModal({ isOpen, onOpenChange, position }: SosModalProps) {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    if (!position) {
      setError('Your location is not available. Cannot get suggestions.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    const locationDescription = `User is at latitude ${position.latitude} and longitude ${position.longitude}.`;
    const result = await getSafetySuggestions({ locationDescription });

    if (result.success && result.data) {
      setSuggestions(result.data.suggestions);
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
      fetchSuggestions();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle />
            SOS - Emergency Mode
          </DialogTitle>
          <DialogDescription>
            Stay calm. Help is on the way. Here are some immediate safety suggestions.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 min-h-[150px] rounded-lg border bg-muted p-4">
          {isLoading && (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Loader className="mb-2 h-6 w-6 animate-spin" />
              <p>Generating personalized suggestions...</p>
            </div>
          )}
          {error && (
            <div className="flex h-full flex-col items-center justify-center text-destructive">
              <AlertTriangle className="mb-2 h-6 w-6" />
              <p className="text-center font-semibold">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={fetchSuggestions}>
                Try Again
              </Button>
            </div>
          )}
          {suggestions && (
            <div className="space-y-2 text-sm text-foreground">
              <h3 className="flex items-center gap-2 font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" />
                Safety Suggestions
              </h3>
              <p className="whitespace-pre-wrap">{suggestions}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          If you are in immediate danger, please contact your local emergency services.
        </p>
      </DialogContent>
    </Dialog>
  );
}
