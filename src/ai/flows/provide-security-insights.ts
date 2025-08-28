'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized security insights to the user.
 *
 * The flow analyzes the user's scan history and provides tailored recommendations to improve their cybersecurity habits.
 * It also predicts emerging phishing attacks and presents a cyber safety score to encourage safe behavior.
 *
 * @exports provideSecurityInsights - The main function to trigger the security insights flow.
 * @exports ProvideSecurityInsightsInput - The input type for the provideSecurityInsights function.
 * @exports ProvideSecurityInsightsOutput - The output type for the provideSecurityInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideSecurityInsightsInputSchema = z.object({
  scanHistory: z.string().describe('A JSON string of the user scan history.'),
  globalThreatMap: z
    .string()
    .optional()
    .describe('A JSON string of the global threat map data, if available.'),
});
export type ProvideSecurityInsightsInput = z.infer<typeof ProvideSecurityInsightsInputSchema>;

const ProvideSecurityInsightsOutputSchema = z.object({
  personalizedGuidance: z.string().describe('Personalized guidance on improving cybersecurity habits.'),
  predictiveTrends: z.string().describe('Predictive trends showing emerging phishing attacks.'),
  cyberSafetyScore: z.number().describe('A gamified cyber safety score to encourage safe habits (0-100).'),
});
export type ProvideSecurityInsightsOutput = z.infer<typeof ProvideSecurityInsightsOutputSchema>;

export async function provideSecurityInsights(input: ProvideSecurityInsightsInput): Promise<ProvideSecurityInsightsOutput> {
  return provideSecurityInsightsFlow(input);
}

const provideSecurityInsightsPrompt = ai.definePrompt({
  name: 'provideSecurityInsightsPrompt',
  input: {schema: ProvideSecurityInsightsInputSchema},
  output: {schema: ProvideSecurityInsightsOutputSchema},
  prompt: `You are a cybersecurity expert providing personalized insights to users based on their scan history and global threat data.

Analyze the user's scan history ({{{scanHistory}}}) and the global threat map data ({{{globalThreatMap}}}).

Provide personalized guidance on how the user can improve their cybersecurity habits.
Predict emerging phishing attacks that the user should be aware of.
Calculate a cyber safety score for the user based on their scan history and provide it as a number between 0 and 100. This score should reflect how well the user is protecting themselves from cyber threats.  A higher score indicates better security practices.

Output the personalized guidance, predictive trends, and cyber safety score in the format specified by the schema. Focus on actionable advice and relevant threat information.
`,
});

const provideSecurityInsightsFlow = ai.defineFlow(
  {
    name: 'provideSecurityInsightsFlow',
    inputSchema: ProvideSecurityInsightsInputSchema,
    outputSchema: ProvideSecurityInsightsOutputSchema,
  },
  async input => {
    try {
      // Parse the scanHistory and globalThreatMap if they are strings
      const parsedInput = {
        ...input,
        scanHistory: typeof input.scanHistory === 'string' ? input.scanHistory : JSON.stringify(input.scanHistory),
        globalThreatMap: input.globalThreatMap ? (typeof input.globalThreatMap === 'string' ? input.globalThreatMap : JSON.stringify(input.globalThreatMap)) : undefined,
      };

      const {output} = await provideSecurityInsightsPrompt(parsedInput);
      return output!;
    } catch (error) {
      console.error('Error in provideSecurityInsightsFlow:', error);
      throw error;
    }
  }
);
