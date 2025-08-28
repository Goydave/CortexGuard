import { provideSecurityInsights } from "@/ai/flows/provide-security-insights";
import { ThreatTimelineChart } from "@/components/cortex-mobile/threat-timeline-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockScanHistory } from "@/lib/mock-data";
import { Lightbulb, TrendingUp } from "lucide-react";

export const revalidate = 0;

export default async function InsightsPage() {
  const insights = await provideSecurityInsights({
    scanHistory: JSON.stringify(mockScanHistory),
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">AI Insights</h1>
        <p className="text-muted-foreground">Your personalized security report.</p>
      </header>
      
      <div className="space-y-6">
        <ThreatTimelineChart />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-primary neon-icon" />
              <CardTitle>Personalized Guidance</CardTitle>
            </div>
            <CardDescription>AI-powered tips to boost your security posture.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{insights.personalizedGuidance}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-accent neon-accent" />
              <CardTitle>Predictive Trends</CardTitle>
            </div>
            <CardDescription>Emerging phishing attacks and threats to be aware of.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{insights.predictiveTrends}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
