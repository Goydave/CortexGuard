// This file uses server-side code.
'use server';

/**
 * @fileOverview Generates AI-driven insights on emerging phishing attacks and trends for users.
 *
 * @exports generateAiInsights - The main function to trigger the AI insights flow.
 * @exports GenerateAiInsightsInput - The input type for the generateAiInsights function.
 * @exports GenerateAiInsightsOutput - The output type for the generateAiInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiInsightsInputSchema = z.object({
  userProfile: z.string().describe('A JSON string of the user profile, including demographics and tech savviness.'),
  recentThreats: z.string().describe('A JSON string of recent threats detected for the user.'),
  globalThreatLandscape: z.string().describe('A JSON string of the current global threat landscape.'),
});
export type GenerateAiInsightsInput = z.infer<typeof GenerateAiInsightsInputSchema>;

const GenerateAiInsightsOutputSchema = z.object({
  emergingThreats: z.string().describe('AI-generated insights on emerging phishing attacks targeting similar users.'),
  trendAnalysis: z.string().describe('Analysis of current phishing trends and potential impact on the user.'),
  protectiveRecommendations: z.string().describe('Specific recommendations to protect against identified threats.'),
});
export type GenerateAiInsightsOutput = z.infer<typeof GenerateAiInsightsOutputSchema>;

export async function generateAiInsights(input: GenerateAiInsightsInput): Promise<GenerateAiInsightsOutput> {
  return generateAiInsightsFlow(input);
}

const generateAiInsightsPrompt = ai.definePrompt({
  name: 'generateAiInsightsPrompt',
  input: {schema: GenerateAiInsightsInputSchema},
  output: {schema: GenerateAiInsightsOutputSchema},
  prompt: `As an AI-powered cybersecurity analyst, your task is to provide users with insights on emerging phishing attacks and trends.

  Analyze the following information to generate these insights:
  - User Profile: {{{userProfile}}}
  - Recent Threats Detected: {{{recentThreats}}}
  - Global Threat Landscape: {{{globalThreatLandscape}}}

  Based on your analysis, provide the following:
  1. Emerging Threats: Describe emerging phishing attacks that are likely to target users with similar profiles.
  2. Trend Analysis: Analyze current phishing trends and explain how they could potentially impact the user.
  3. Protective Recommendations: Provide specific, actionable recommendations that the user can take to protect themselves from the identified threats.

  Ensure that the output is formatted as a JSON object matching the GenerateAiInsightsOutputSchema. Be specific and provide practical advice.
  `,
});

const generateAiInsightsFlow = ai.defineFlow(
  {
    name: 'generateAiInsightsFlow',
    inputSchema: GenerateAiInsightsInputSchema,
    outputSchema: GenerateAiInsightsOutputSchema,
  },
  async input => {
    try {
      const parsedInput = {
        ...input,
        userProfile: typeof input.userProfile === 'string' ? input.userProfile : JSON.stringify(input.userProfile),
        recentThreats: typeof input.recentThreats === 'string' ? input.recentThreats : JSON.stringify(input.recentThreats),
        globalThreatLandscape: typeof input.globalThreatLandscape === 'string' ? input.globalThreatLandscape : JSON.stringify(input.globalThreatLandscape),
      };
      const {output} = await generateAiInsightsPrompt(parsedInput);
      return output!;
    } catch (error) {
      console.error('Error in generateAiInsightsFlow:', error);
      throw error;
    }
  }
);
