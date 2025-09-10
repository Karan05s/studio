'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Languages, Loader, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getTranslation } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '../ui/alert';

interface TranslationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const languages = [
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Mandarin', label: 'Mandarin' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Bengali', label: 'Bengali' },
];

export function TranslationModal({
  isOpen,
  onOpenChange,
}: TranslationModalProps) {
  const [text, setText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter some text to translate.',
      });
      return;
    }
    setIsLoading(true);
    setTranslatedText('');
    const result = await getTranslation({ text, targetLanguage });
    if (result.success && result.data) {
      setTranslatedText(result.data.translatedText);
    } else {
      toast({
        variant: 'destructive',
        title: 'Translation Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="text-primary" />
            Language Translation
          </DialogTitle>
          <DialogDescription>
            Translate text into a different language using AI.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] items-center">
            <div className="space-y-2">
              <label htmlFor="source-text" className="text-sm font-medium">
                Your Text
              </label>
              <Textarea
                id="source-text"
                placeholder="Enter text to translate..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-center self-end pb-5">
              <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
            </div>
            <div className="space-y-2">
              <label htmlFor="target-lang" className="text-sm font-medium">
                Translate To
              </label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger id="target-lang">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleTranslate}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Translating...
              </>
            ) : (
              'Translate'
            )}
          </Button>

          {translatedText && (
            <Alert>
              <AlertDescription className="text-foreground">
                {translatedText}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
