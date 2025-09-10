
// src/app/api/genkit/route.ts
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { NextRequest, NextResponse } from 'next/server';

// Import flows so they can be called.
import { analyzeThreat } from '@/ai/flows/analyze-threat';
import { provideSecurityInsights } from '@/ai/flows/provide-security-insights';
import { generateAiInsights } from '@/ai/flows/generate-ai-insights';
import { analyzeScanResults } from '@/ai/flows/analyze-scan-results';

// Initialize Genkit and the Google AI plugin directly in the API route.
// This ensures it's configured correctly in the Vercel serverless environment.
genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});


export async function POST(req: NextRequest) {
  const { flowId, input } = await req.json();

  try {
    let output;
    switch (flowId) {
      case 'analyzeThreatFlow':
        output = await analyzeThreat(input);
        break;
      case 'provideSecurityInsightsFlow':
        output = await provideSecurityInsights(input);
        break;
      case 'generateAiInsightsFlow':
        output = await generateAiInsights(input);
        break;
      case 'analyzeScanResultsFlow':
          output = await analyzeScanResults(input);
          break;
      default:
        return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
    }
    return NextResponse.json(output, { status: 200 });
  } catch (error) {
    console.error(`Error running flow ${flowId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: `Flow execution failed: ${errorMessage}` }, { status: 500 });
  }
}
