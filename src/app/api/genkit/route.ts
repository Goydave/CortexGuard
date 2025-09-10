// src/app/api/genkit/route.ts
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { runFlow, getFlow } from '@genkit-ai/next/server';
import { NextRequest } from 'next/server';

// Initialize Genkit and the Google AI plugin directly in the API route.
// This ensures it's configured correctly in the Vercel serverless environment.
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

// Import flows so they are registered with the Genkit instance.
import '@/ai/flows/analyze-threat';
import '@/ai/flows/provide-security-insights';
import '@/ai/flows/generate-ai-insights';
import '@/ai/flows/analyze-scan-results';


export async function POST(req: NextRequest) {
  const { flowId, input } = await req.json();

  const flow = await getFlow(flowId);
  if (!flow) {
    return new Response(JSON.stringify({ error: 'Flow not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const output = await runFlow(flow, input);
    return new Response(JSON.stringify(output), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error running flow ${flowId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return new Response(JSON.stringify({ error: `Flow execution failed: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
