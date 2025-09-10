// This file uses server-side code.
'use server';

/**
 * @fileOverview Analyzes links, SMS, emails, and attachments for potential phishing attempts using AI.
 *
 * - analyzeThreat - Analyzes input content for phishing threats and returns a risk score.
 * - AnalyzeThreatInput - The input type for the analyzeThreat function.
 * - AnalyzeThreatOutput - The return type for the analyzeThreat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input is now a simple string
export type AnalyzeThreatInput = string;

const AnalyzeThreatOutputSchema = z.object({
  isPhishing: z.boolean().describe('Whether the content is determined to be a phishing attempt.'),
  riskScore: z.number().describe('A risk score from 0 to 100 indicating the likelihood of the content being a threat.'),
  explanation: z.string().describe('An explanation of why the content is considered a threat, including specific indicators.'),
});
export type AnalyzeThreatOutput = z.infer<typeof AnalyzeThreatOutputSchema>;

export async function analyzeThreat(content: AnalyzeThreatInput): Promise<AnalyzeThreatOutput> {
  return analyzeThreatFlow(content);
}

const analyzeThreatPrompt = ai.definePrompt({
  name: 'analyzeThreatPrompt',
  input: {schema: z.string()}, // Schema matches the string input
  output: {schema: AnalyzeThreatOutputSchema},
  prompt: `You are an AI-powered cybersecurity expert. Your task is to analyze the given content and determine if it is a phishing attempt.

  Based on your analysis, provide a risk score between 0 and 100, where 0 indicates no risk and 100 indicates a high risk of being a phishing attempt. Explain your reasoning for the assigned risk score and identify any specific indicators of phishing.

  Content to analyze: {{{input}}}

  Ensure that the output is formatted as a JSON object matching the AnalyzeThreatOutputSchema. Set isPhishing to true if the riskScore is above 50.
`,
});

const analyzeThreatFlow = ai.defineFlow(
  {
    name: 'analyzeThreatFlow',
    inputSchema: z.string(),
    outputSchema: AnalyzeThreatOutputSchema,
  },
  async content => {
    const {output} = await analyzeThreatPrompt(content);
    return output!;
  }
);
