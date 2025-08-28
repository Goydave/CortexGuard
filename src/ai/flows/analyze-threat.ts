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

const AnalyzeThreatInputSchema = z.object({
  content: z.string().describe('The content to analyze for phishing threats (URL, SMS, email, attachment content).'),
});
export type AnalyzeThreatInput = z.infer<typeof AnalyzeThreatInputSchema>;

const AnalyzeThreatOutputSchema = z.object({
  isPhishing: z.boolean().describe('Whether the content is determined to be a phishing attempt.'),
  riskScore: z.number().describe('A risk score from 0 to 100 indicating the likelihood of the content being a threat.'),
  explanation: z.string().describe('An explanation of why the content is considered a threat, including specific indicators.'),
});
export type AnalyzeThreatOutput = z.infer<typeof AnalyzeThreatOutputSchema>;

export async function analyzeThreat(input: AnalyzeThreatInput): Promise<AnalyzeThreatOutput> {
  return analyzeThreatFlow(input);
}

const analyzeThreatPrompt = ai.definePrompt({
  name: 'analyzeThreatPrompt',
  input: {schema: AnalyzeThreatInputSchema},
  output: {schema: AnalyzeThreatOutputSchema},
  prompt: `You are an AI-powered cybersecurity expert. Your task is to analyze the given content and determine if it is a phishing attempt.

  Based on your analysis, provide a risk score between 0 and 100, where 0 indicates no risk and 100 indicates a high risk of being a phishing attempt. Explain your reasoning for the assigned risk score and identify any specific indicators of phishing.

  Content to analyze: {{{content}}}

  Ensure that the output is formatted as a JSON object matching the AnalyzeThreatOutputSchema. Set isPhishing to true if the riskScore is above 50.
`,
});

const analyzeThreatFlow = ai.defineFlow(
  {
    name: 'analyzeThreatFlow',
    inputSchema: AnalyzeThreatInputSchema,
    outputSchema: AnalyzeThreatOutputSchema,
  },
  async input => {
    const {output} = await analyzeThreatPrompt(input);
    return output!;
  }
);
