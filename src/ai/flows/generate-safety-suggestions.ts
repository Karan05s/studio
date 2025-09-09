'use server';

/**
 * @fileOverview A flow for generating personalized safety suggestions based on the user's location.
 *
 * - generateSafetySuggestions - A function that generates safety suggestions.
 * - GenerateSafetySuggestionsInput - The input type for the generateSafetySuggestions function.
 * - GenerateSafetySuggestionsOutput - The return type for the generateSafetySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSafetySuggestionsInputSchema = z.object({
  locationDescription: z
    .string()
    .describe('A description of the user\'s current location.'),
});

export type GenerateSafetySuggestionsInput = z.infer<
  typeof GenerateSafetySuggestionsInputSchema
>;

const GenerateSafetySuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('A list of safety suggestions based on the user\'s location.'),
});

export type GenerateSafetySuggestionsOutput = z.infer<
  typeof GenerateSafetySuggestionsOutputSchema
>;

export async function generateSafetySuggestions(
  input: GenerateSafetySuggestionsInput
): Promise<GenerateSafetySuggestionsOutput> {
  return generateSafetySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSafetySuggestionsPrompt',
  input: {schema: GenerateSafetySuggestionsInputSchema},
  output: {schema: GenerateSafetySuggestionsOutputSchema},
  prompt: `You are a safety expert. A user is in distress and needs safety suggestions based on their current location.

  Location description: {{{locationDescription}}}

  Provide a list of actionable safety suggestions the user can take to ensure their safety.`,
});

const generateSafetySuggestionsFlow = ai.defineFlow(
  {
    name: 'generateSafetySuggestionsFlow',
    inputSchema: GenerateSafetySuggestionsInputSchema,
    outputSchema: GenerateSafetySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
