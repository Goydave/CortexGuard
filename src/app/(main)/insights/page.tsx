"use client";

import { useEffect, useState } from "react";
import { provideSecurityInsights, ProvideSecurityInsightsOutput } from "@/ai/flows/provide-security-insights";
import { ThreatTimelineChart } from "@/components/cortex-mobile/threat-timeline-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScanHistory } from "@/hooks/use-scan-history";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, TrendingUp, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function InsightsPage() {
  const [insights, setInsights] = useState<ProvideSecurityInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { scans, isInitialized } = useScanHistory();

  useEffect(() => {
    async function fetchInsights() {
      if (isInitialized) {
        setIsLoading(true);
        if (scans.length > 0) {
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
          }
        } else {
          setInsights(null); // No scans, so no insights
        }
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, [isInitialized, scans]);

  const hasInsights = !isLoading && insights && scans.length > 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">AI Insights</h1>
        <p className="text-muted-foreground">Your personalized security report.</p>
      </header>
      
      <div className="space-y-6">
        <ThreatTimelineChart scans={scans} />

        {isLoading && !isInitialized && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Initializing</AlertTitle>
            <AlertDescription>
              Loading your scan history...
            </AlertDescription>
          </Alert>
        )}
        
        {!isLoading && scans.length === 0 && isInitialized && (
           <Alert variant="default" className="border-primary/20">
              <Info className="h-4 w-4" />
              <AlertTitle>Your Report is Waiting</AlertTitle>
              <AlertDescription>
                Perform a few scans to generate your first personalized AI security report. The more you scan, the smarter your insights become.
              </AlertDescription>
            </Alert>
        )}

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
            ) : hasInsights ? (
              <p className="text-sm">{insights.personalizedGuidance}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No guidance available. Perform scans to get personalized tips.</p>
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
            ) : hasInsights ? (
              <p className="text-sm">{insights.predictiveTrends}</p>
            ) : (
                <p className="text-sm text-muted-foreground">No trends to show. Scan history is needed to predict relevant threats.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
