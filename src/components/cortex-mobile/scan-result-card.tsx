"use client";

import type { AnalyzeThreatOutput } from "@/ai/flows/analyze-threat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, ShieldAlert, ShieldQuestion } from "lucide-react";

export function ScanResultCard({ result }: { result: AnalyzeThreatOutput }) {
  const getRiskInfo = (score: number) => {
    if (score > 75) {
      return {
        level: "High Risk",
        color: "text-destructive",
        progressClass: "[&>div]:bg-destructive",
        icon: ShieldAlert,
      };
    }
    if (score > 50) {
      return {
        level: "Medium Risk",
        color: "text-accent",
        progressClass: "[&>div]:bg-accent",
        icon: AlertTriangle,
      };
    }
    if (score > 20) {
      return {
        level: "Low Risk",
        color: "text-primary",
        progressClass: "[&>div]:bg-primary",
        icon: ShieldQuestion,
      };
    }
    return {
      level: "Safe",
      color: "text-green-500",
      progressClass: "[&>div]:bg-green-500",
      icon: CheckCircle,
    };
  };

  const riskInfo = getRiskInfo(result.riskScore);
  const Icon = riskInfo.icon;

  return (
    <Card className="border-primary/50 shadow-lg shadow-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
            <Icon className={cn("w-10 h-10", riskInfo.color)} />
            <div className="flex flex-col">
                <span className="text-3xl font-bold">{riskInfo.level}</span>
                <span className="text-sm text-muted-foreground">Analysis Complete</span>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Risk Score</span>
                <span className={cn("text-2xl font-bold", riskInfo.color)}>{result.riskScore}/100</span>
            </div>
            <Progress value={result.riskScore} className={riskInfo.progressClass} />
        </div>
        <div className="space-y-2">
            <h3 className="font-semibold">AI Explanation:</h3>
            <p className="text-muted-foreground text-sm bg-card p-3 rounded-md border">{result.explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
