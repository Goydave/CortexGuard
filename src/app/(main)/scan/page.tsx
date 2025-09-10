"use client";

import { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { analyzeThreat, AnalyzeThreatOutput } from "@/ai/flows/analyze-threat";
import { ScanForm } from "@/components/cortex-mobile/scan-form";
import { ScanResultCard } from "@/components/cortex-mobile/scan-result-card";
import { Button } from "@/components/ui/button";
import { useScanHistory } from "@/hooks/use-scan-history";
import type { Scan } from "@/lib/types";

const formSchema = z.object({
  content: z
    .string()
    .min(10, "Please enter at least 10 characters to analyze.")
    .max(2000, "Content is too long. Please limit to 2000 characters."),
});

// A simple function to infer the type of scan from the content
function getScanType(content: string): Scan['type'] {
  const trimmedContent = content.trim();
  try {
    const url = new URL(trimmedContent);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return 'URL';
    }
  } catch (_) {
    // Not a valid URL, proceed to other checks
  }
  
  // Basic regex for email addresses
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(trimmedContent)) {
    return 'Email';
  }
  
  // Simple check for file-like paths or names
  if (/[\\/a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(trimmedContent) && trimmedContent.split(' ').length < 5) {
      return 'File';
  }
  
  // Default to SMS for text-based content
  return 'SMS';
}

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<AnalyzeThreatOutput | null>(null);
  const { toast } = useToast();
  const { addScan } = useScanHistory();

  const handleScan = async (values: z.infer<typeof formSchema>) => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const result = await analyzeThreat({ content: values.content });
      setScanResult(result);
      
      const newScan: Scan = {
          id: crypto.randomUUID(),
          content: values.content,
          type: getScanType(values.content),
          date: new Date().toISOString(),
          riskScore: result.riskScore,
          isPhishing: result.isPhishing,
      };
      addScan(newScan);

      if (result.isPhishing) {
        toast({
          variant: "destructive",
          title: "Threat Detected!",
          description: `A risk score of ${result.riskScore} was found.`,
        });
      } else {
        toast({
          title: "Scan Complete",
          description: "No significant threats were found.",
        });
      }
    } catch (error) {
      console.error("Scan failed:", error);
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "An error occurred while scanning. You may be offline.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleNewScan = () => {
    setScanResult(null);
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">Real-Time Scan</h1>
        <p className="text-muted-foreground">Analyze content for phishing and malware.</p>
      </header>
      
      {scanResult ? (
        <div className="space-y-4">
            <ScanResultCard result={scanResult} />
            <Button onClick={handleNewScan} className="w-full">Start New Scan</Button>
        </div>
      ) : (
        <ScanForm handleScan={handleScan} isScanning={isScanning} />
      )}
    </div>
  );
}
