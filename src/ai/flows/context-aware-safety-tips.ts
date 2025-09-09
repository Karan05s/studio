// context-aware-safety-tips.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating context-aware safety tips based on the user's location.
 *
 * - `generateSafetyTips`:  A function that takes a location description and returns safety advice.
 * - `SafetyTipsInput`: The input type for the `generateSafetyTips` function.
 * - `SafetyTipsOutput`: The output type for the `generateSafetyTips` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SafetyTipsInputSchema = z.object({
  locationDescription: z
    .string()
    .describe('A description of the user\'s current location.'),
});
export type SafetyTipsInput = z.infer<typeof SafetyTipsInputSchema>;

// Define the output schema
const SafetyTipsOutputSchema = z.object({
  safetyTips: z
    .string()
    .describe('Context-aware safety tips based on the location description.'),
});
export type SafetyTipsOutput = z.infer<typeof SafetyTipsOutputSchema>;

// Exported function to generate safety tips
export async function generateSafetyTips(input: SafetyTipsInput): Promise<SafetyTipsOutput> {
  return contextAwareSafetyTipsFlow(input);
}

// Define the prompt
const safetyTipsPrompt = ai.definePrompt({
  name: 'safetyTipsPrompt',
  input: {schema: SafetyTipsInputSchema},
  output: {schema: SafetyTipsOutputSchema},
  prompt: `You are a safety expert providing context-aware safety tips.

  Based on the user\'s current location:
  Location Description: {{{locationDescription}}}

  Provide a few concise and practical safety tips relevant to this location.
  Make sure the suggestions are applicable to the location provided and are easy to follow.
  Focus on general safety and awareness rather than specific threats.`,
});

// Define the flow
const contextAwareSafetyTipsFlow = ai.defineFlow(
  {
    name: 'contextAwareSafetyTipsFlow',
    inputSchema: SafetyTipsInputSchema,
    outputSchema: SafetyTipsOutputSchema,
  },
  async input => {
    const {output} = await safetyTipsPrompt(input);
    return output!;
  }
);
