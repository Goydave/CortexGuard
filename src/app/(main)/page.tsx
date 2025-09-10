"use client";

import { useEffect, useState } from "react";
import { provideSecurityInsights, ProvideSecurityInsightsOutput } from "@/ai/flows/provide-security-insights";
import { CyberSafetyScore } from "@/components/cortex-mobile/cyber-safety-score";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useScanHistory } from "@/hooks/use-scan-history";
import { ArrowRight, Lightbulb, ShieldCheck, TrendingUp, Info } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
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
          setInsights(null); // No history, no insights
        }
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, [isInitialized, scans]);

  const hasInsights = !isLoading && insights && scans.length > 0;

  return (
    <div className="flex flex-col min-h-full p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to CortexMobile</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
            <Skeleton className="h-[350px] w-full" />
        ) : (
            <CyberSafetyScore score={insights?.cyberSafetyScore ?? 0} />
        )}

        <Link href="/scan" className="w-full">
            <Button size="lg" className="w-full h-16 text-lg font-bold">
                <ShieldCheck className="mr-2 h-6 w-6" />
                Start New Scan
            </Button>
        </Link>
        
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                    <Lightbulb className="w-6 h-6 text-primary neon-icon" />
                </div>
                <div>
                    <CardTitle>Personalized Guidance</CardTitle>
                    <CardDescription>AI-powered tips to boost your security</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : hasInsights ? (
                  <>
                    <p className="text-sm text-muted-foreground">{insights.personalizedGuidance}</p>
                    <Link href="/insights">
                        <Button variant="link" className="px-0 mt-2">
                            View All Insights <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                  </>
                ) : (
                   <Alert variant="default" className="border-primary/20">
                      <Info className="h-4 w-4" />
                      <AlertTitle>No Insights Yet</AlertTitle>
                      <AlertDescription>
                        Perform your first scan to get personalized security guidance from our AI.
                      </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-full bg-accent/10">
                    <TrendingUp className="w-6 h-6 text-accent neon-accent" />
                </div>
                <div>
                    <CardTitle>Predictive Trends</CardTitle>
                    <CardDescription>Emerging threats to watch out for</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                ) : hasInsights ? (
                    <p className="text-sm text-muted-foreground">{insights.predictiveTrends}</p>
                ) : (
                     <Alert variant="default" className="border-accent/20">
                      <Info className="h-4 w-4" />
                      <AlertTitle>No Trends Available</AlertTitle>
                      <AlertDescription>
                        Scan history is needed to predict relevant emerging threats. Start scanning to learn more.
                      </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
