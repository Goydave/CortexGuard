// src/app/api/analyzeThreat/route.ts
import {NextRequest} from 'next/server';
import {getFlow, runFlow} from '@genkit-ai/next/server';

export async function POST(req: NextRequest) {
  const {flowId, input} = await req.json();

  const flow = await getFlow(flowId);

  if (!flow) {
    return new Response('Flow not found', {status: 404});
  }

  const {stream, response} = await runFlow(flow, input);

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked',
    },
  });
}
