'use server';

/**
 * @fileOverview A flow for a conversational chatbot.
 *
 * - chat - A function that generates a response from the chatbot.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('The user\'s message.'),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  message: z.string().describe('The chatbot\'s response.'),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are a helpful and friendly chatbot for the E-Mitra personal safety app. Your name is Mitra.

  Your role is to provide support and answer questions related to user safety.
  If the user seems to be in distress or immediate danger, strongly advise them to use the SOS feature in the app or contact local emergency services immediately.

  Keep your responses concise and to the point.

  Here is the conversation history:
  {{#each history}}
    {{#if (eq role 'user')}}
      User: {{{content}}}
    {{else}}
      Mitra: {{{content}}}
    {{/if}}
  {{/each}}

  New user message:
  {{{message}}}

  Your response:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
