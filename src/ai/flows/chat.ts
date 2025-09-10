'use server';
/**
 * @fileoverview A chatbot flow that uses a streaming model to generate responses.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export async function chat(
  history: ChatMessage[],
  message: ChatMessage
): Promise<string> {
  const { response } = await ai.generate({
    history: history.map((m) => ({
      role: m.role,
      content: [{ text: m.content }],
    })),
    prompt: message.content,
  });

  return response.text;
}
