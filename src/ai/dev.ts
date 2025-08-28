import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-threat.ts';
import '@/ai/flows/provide-security-insights.ts';
import '@/ai/flows/generate-ai-insights.ts';
import '@/ai/flows/analyze-scan-results.ts';