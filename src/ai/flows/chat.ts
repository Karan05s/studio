'use server';
/**
 * @fileOverview A conversational AI flow for the E-Mitra chatbot.
 *
 * - chat - A function that takes conversation history and returns a response.
 * - ChatMessage - The type for a single message in the conversation history.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { MessageData } from 'genkit/generate';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({ text: z.string() })),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export async function chat(history: ChatMessage[]): Promise<string> {
  const messages = history as MessageData[];

  const { output } = await ai.generate({
    prompt: `You are Mitra, a friendly and empathetic personal safety assistant. Your primary goal is to help users feel safe and provide them with relevant information and support.

Keep your responses concise, clear, and easy to understand.
If a user seems to be in distress, provide calming and reassuring language. Prioritize their safety.
If asked about topics outside of safety, politely steer the conversation back to your purpose.`,
    history: messages,
  });

  const text = output?.text;
  if (text === undefined) {
    throw new Error('No text was returned from the AI.');
  }
  return text;
}
