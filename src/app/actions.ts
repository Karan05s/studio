'use server';

import {
  generateSafetySuggestions,
  type GenerateSafetySuggestionsInput,
} from '@/ai/flows/generate-safety-suggestions';
import {
  generateSafetyTips,
  type SafetyTipsInput,
} from '@/ai/flows/context-aware-safety-tips';
import { chat, type ChatMessage } from '@/ai/flows/chat';

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

export async function getChatResponse(
  history: ChatMessage[],
  message: ChatMessage
) {
  try {
    const result = await chat(history, message);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getChatResponse:', error);
    return { success: false, error: 'Failed to get a response from the chatbot.' };
  }
}
