'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Languages } from 'lucide-react';

interface TranslationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function TranslationModal({ isOpen, onOpenChange }: TranslationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="text-primary" />
            Language Translation
          </DialogTitle>
          <DialogDescription>
            Use your browser's built-in translation feature to view this app in another language.
          </DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm dark:prose-invert">
          <p>
            Most modern web browsers have a built-in translation feature. Here's how to use it:
          </p>
          <ul>
            <li>
              <strong>Google Chrome:</strong> Right-click anywhere on the page and select "Translate to [Your Language]".
            </li>
            <li>
              <strong>Safari:</strong> Look for the translate icon in the address bar and select your preferred language.
            </li>
            <li>
              <strong>Microsoft Edge:</strong> Right-click on the page and choose "Translate".
            </li>
             <li>
              <strong>Firefox:</strong> You may need to install the "To Google Translate" extension from the Firefox Add-ons store.
            </li>
          </ul>
          <p>
            This allows you to experience E-Mitra in the language you're most comfortable with.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
