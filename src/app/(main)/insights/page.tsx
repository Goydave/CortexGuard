"use client";

import { useEffect, useState } from "react";
import { provideSecurityInsights, ProvideSecurityInsightsOutput } from "@/ai/flows/provide-security-insights";
import { ThreatTimelineChart } from "@/components/cortex-mobile/threat-timeline-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScanHistory } from "@/hooks/use-scan-history";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, TrendingUp } from "lucide-react";


export default function InsightsPage() {
  const [insights, setInsights] = useState<ProvideSecurityInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { scans, isInitialized } = useScanHistory();

  useEffect(() => {
    async function fetchInsights() {
      if (isInitialized) {
        setIsLoading(true);
        try {
          const result = await provideSecurityInsights({
            scanHistory: JSON.stringify(scans),
          });
          setInsights(result);
        } catch (error) {
          console.error("Failed to fetch insights:", error);
          setInsights({
            personalizedGuidance: "Could not load insights. Please try again later.",
            predictiveTrends: "Could not load trends. Please try again later.",
            cyberSafetyScore: 0,
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchInsights();
  }, [isInitialized, scans]);


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
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-sm">{insights?.personalizedGuidance}</p>
            )}
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
             {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <p className="text-sm">{insights?.predictiveTrends}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
