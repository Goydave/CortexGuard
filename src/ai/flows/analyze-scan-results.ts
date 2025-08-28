// This file uses server-side code.
'use server';

/**
 * @fileOverview Analyzes the results of scans and provides personalized cybersecurity insights.
 *
 * - analyzeScanResults - Analyzes scan results and provides personalized cybersecurity insights.
 * - AnalyzeScanResultsInput - The input type for the analyzeScanResults function.
 * - AnalyzeScanResultsOutput - The return type for the analyzeScanResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScanResultsInputSchema = z.object({
  scanHistory: z
    .string()
    .describe('A JSON string of the user scan history, including timestamps, types of scans, and threat levels.'),
  userProfile: z
    .string()
    .optional()
    .describe('A JSON string of the user profile, including cybersecurity knowledge level and risk tolerance.'),
});

export type AnalyzeScanResultsInput = z.infer<typeof AnalyzeScanResultsInputSchema>;

const AnalyzeScanResultsOutputSchema = z.object({
  insights: z.string().describe('Personalized insights and recommendations on how to improve cybersecurity habits.'),
  riskAssessment: z
    .string()
    .describe('An assessment of the user\u2019s current cybersecurity risk level based on their scan history.'),
  recommendedActions: z
    .string()
    .describe('Specific actions the user can take to mitigate identified risks and improve their security posture.'),
});

export type AnalyzeScanResultsOutput = z.infer<typeof AnalyzeScanResultsOutputSchema>;

export async function analyzeScanResults(input: AnalyzeScanResultsInput): Promise<AnalyzeScanResultsOutput> {
  return analyzeScanResultsFlow(input);
}

const analyzeScanResultsPrompt = ai.definePrompt({
  name: 'analyzeScanResultsPrompt',
  input: {schema: AnalyzeScanResultsInputSchema},
  output: {schema: AnalyzeScanResultsOutputSchema},
  prompt: `You are an AI-powered cybersecurity advisor. Your task is to analyze the user's scan history and profile to provide personalized insights and recommendations on improving their cybersecurity habits.

Analyze the user's scan history ({{{scanHistory}}}) and user profile ({{{userProfile}}}).

Based on your analysis, provide:

- Personalized insights and recommendations on how the user can improve their cybersecurity habits.
- An assessment of the user’s current cybersecurity risk level based on their scan history.
- Specific actions the user can take to mitigate identified risks and improve their security posture.

Ensure that the output is formatted as a JSON object matching the AnalyzeScanResultsOutputSchema.
`,
});

const analyzeScanResultsFlow = ai.defineFlow(
  {
    name: 'analyzeScanResultsFlow',
    inputSchema: AnalyzeScanResultsInputSchema,
    outputSchema: AnalyzeScanResultsOutputSchema,
  },
  async input => {
    try {
      // Parse the scanHistory and userProfile if they are strings
      const parsedInput = {
        ...input,
        scanHistory: typeof input.scanHistory === 'string' ? input.scanHistory : JSON.stringify(input.scanHistory),
        userProfile: input.userProfile ? (typeof input.userProfile === 'string' ? input.userProfile : JSON.stringify(input.userProfile)) : undefined,
      };

      const {output} = await analyzeScanResultsPrompt(parsedInput);
      return output!;
    } catch (error) {
      console.error('Error in analyzeScanResultsFlow:', error);
      throw error;
    }
  }
);
