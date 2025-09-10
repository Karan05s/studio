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

  const anki = ai.definePrompt(
    {
      name: 'chatPrompt',
      input: {
        schema: z.object({
          history: z.array(ChatMessageSchema),
          message: ChatMessageSchema,
        }),
      },
      prompt: `You are an expert AI assistant named Mitra.
      
This is the conversation history:
{{#each history}}
{{#if (eq role 'user')}}
User: {{content}}
{{/if}}
{{#if (eq role 'model')}}
Mitra: {{content}}
{{/if}}
{{/each}}

This is the user's latest message:
User: {{message.content}}

This is your response:
`,
    },
    async (input) => {
      const { response } = await ai.generate({
        prompt: input.prompt,
        history: input.history.map((m) => ({
          role: m.role,
          content: [{ text: m.content }],
        })),
        
      });
      return { response: response.text };
    }
  );

  const ankiResponse = await anki({ history, message });
  return ankiResponse.response;
}
