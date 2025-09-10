'use server';
/**
 * @fileOverview A conversational AI flow for the E-Mitra chatbot.
 *
 * - chat - A function that takes conversation history and returns a response.
 * - ChatMessage - The type for a single message in the conversation history.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { MessageData, Part } from 'genkit/generate';

// Define the schema for a single message part (currently only text is supported)
const ChatPartSchema = z.object({
  text: z.string(),
});

// Define the schema for a single message in the history
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(ChatPartSchema),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const ChatInputSchema = z.array(ChatMessageSchema);
const ChatOutputSchema = z.string();

export async function chat(history: ChatMessage[]): Promise<string> {
  return chatFlow(history);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are Mitra, a friendly and empathetic personal safety assistant. Your primary goal is to help users feel safe and provide them with relevant information and support.

Keep your responses concise, clear, and easy to understand.
If a user seems to be in distress, provide calming and reassuring language. Prioritize their safety.
If asked about topics outside of safety, politely steer the conversation back to your purpose.

Converse with the user based on the following history:
{{#each input}}
{{role}}: {{#each content}}{{text}}{{/each}}
{{/each}}
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (history) => {
    // The prompt expects a simple array of messages, but the `generate` function
    // requires a `MessageData[]` type. We cast it here.
    const messages = (history as unknown) as MessageData[];

    const { output } = await prompt(messages);
    return output!;
  }
);
