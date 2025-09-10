'use server';

import {
  generateSafetySuggestions,
  type GenerateSafetySuggestionsInput,
} from '@/ai/flows/generate-safety-suggestions';
import {
  generateSafetyTips,
  type SafetyTipsInput,
} from '@/ai/flows/context-aware-safety-tips';
import {
  translateText,
  type TranslateTextInput,
} from '@/ai/flows/translate-text';

export async function getSafetySuggestions(
  input: GenerateSafetySuggestionsInput
) {
  try {
    const result = await generateSafetySuggestions(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getSafetySuggestions:', error);
    return {
      success: false,
      error: 'Failed to generate personalized safety suggestions.',
    };
  }
}

export async function getContextualSafetyTips(input: SafetyTipsInput) {
  try {
    const result = await generateSafetyTips(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getContextualSafetyTips:', error);
    return { success: false, error: 'Failed to generate contextual safety tips.' };
  }
}

export async function getTranslation(input: TranslateTextInput) {
  try {
    const result = await translateText(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getTranslation:', error);
    return { success: false, error: 'Failed to translate text.' };
  }
}
